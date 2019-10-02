define([], function () {
    let dataController = function ($scope, $http) {
        let data_file = "app/data/priest.json";
        let request = {
            method: 'GET',
            url: data_file
        };

        $scope.current_talents = {};
        $scope.playerStat = {
            spirit: 0
        };

        /* TRIGGERING QUERY */

        $http(request).then(function(response){

            let output = {
                "spells": [],
                "iconLocation": response.data['iconLocation']
            };

            for (let spellIt in response.data['spells']){

                let currentSpell = response.data['spells'][spellIt];

                if (response.data['spells'].hasOwnProperty(spellIt)){
                    let spell = response.data['spells'][spellIt];

                    for (let rankIt in spell['ranks']){
                        let rank = spell['ranks'][rankIt];

                        if (!rank.hasOwnProperty('flat')){
                            rank['flat'] = (rank['min'] + rank['max']) / 2
                        }

                        // Rank Penalty
                        if (rank['level'] <= 20){
                            rank['rankPenalty'] = (1 - (20 - rank['level']) * 0.0375);
                        }
                        else {
                            rank['rankPenalty'] = 1;
                        }

                        // Spell Coefficient due to cast time
                        if (spell['castTime'] === 0) {
                            spell['effectiveCastTime'] = 1.5;
                            if (spell.name === 'Renew'){
                                spell['effectiveCastTime'] = 15;
                            }
                        }
                        else{
                            spell['effectiveCastTime'] = spell['castTime'] ;
                        }
                        rank['castCoefficient'] = spell['effectiveCastTime'] / 3.5;

                        if (spell.name === 'Renew'){
                            rank['castCoefficient'] = 1;
                        }

                        // TODO: CRITICAL CHANCE

                        rank['effectiveCoefficient'] = rank['castCoefficient'] * rank['rankPenalty'];

                        rank['HPM'] = rank['flat'] / rank['cost']
                    }

                    output['spells'].push(spell);
                }
            }

            $scope.data = output;

            $scope.talents = response.data['talents'];
            for (let talentName in response.data['talents']){
                $scope.current_talents[talentName] = 0
            }
        });

        $scope.computeHPM = function(spellPower, spell, rank){
            let rankValue = spell['ranks'][rank];
            let healDone = computeHeal(
                rankValue['flat'],
                rankValue['effectiveCoefficient'],
                spellPower,
                spell.name
            );
            let computedCost = computeCost(rankValue['cost'], spell.name);
            let rawHPM = healDone / computedCost;
            return Math.round(rawHPM * 1000)/1000
        };

        $scope.computeHPSM = function(spellPower, spell, rank){
            let rankValue = spell['ranks'][rank];
            let healDone = computeHeal(
                rankValue['flat'],
                rankValue['effectiveCoefficient'],
                spellPower,
                spell.name
            );
            let computedCost = computeCost(rankValue['cost'], spell.name);
            let computedCast = computeCast(spell['effectiveCastTime'], spell.name);

            return Math.round((
                (healDone / computedCast) / computedCost)*1000)
                / 1000
        };

        $scope.computeHPS = function(spellPower, spell, rank){
            let rankValue = spell['ranks'][rank];
            let healDone = computeHeal(
                rankValue['flat'],
                rankValue['effectiveCoefficient'],
                spellPower,
                spell.name
            );
            let computedCast = computeCast(spell['effectiveCastTime'], spell.name);
            return Math.round((healDone/computedCast)*1000)/1000
        };

        $scope.compute_all = function(spellPower, spell, rank){
            let rankValue = spell['ranks'][rank];
            let healDone = computeHeal(
                rankValue['flat'],
                rankValue['effectiveCoefficient'],
                spellPower,
                spell.name
            );
            let computedCost = computeCost(rankValue['cost'], spell.name);
            let computedCast = computeCast(spell['effectiveCastTime'], spell.name);

            let HPS = Math.round((healDone/computedCast)*1000)/1000;
            let HPM = Math.round((healDone/computedCost)*1000)/1000;
            let HPS_M = Math.round(((healDone / computedCast) / computedCost)*1000)/ 1000;
            let HES = Math.round(Math.log(Math.sqrt(HPM*HPS))*1000)/1000;

            return [HPS, HPM, HPS_M, HES];
        };

        $scope.computeSpecial = function(spellPower, spell, rank) {
            let HPM = $scope.computeHPM(spellPower, spell, rank);
            let HPS = $scope.computeHPS(spellPower, spell, rank);

            return Math.round(Math.sqrt(HPM*HPS)*1000)/1000;

           //return Math.pow(HPM, coefficient[0]) * Math.pow(Math.log(HPS), coefficient[1]);
        };

        let computeHeal = function(flat, coefficient, spellPower, spellName){
            /*if ($scope.current_talents['Spiritual Guidance'] > 0){
                spellPower += ($scope.playerStat.spirit*$scope.current_talents['Spiritual Guidance']*5)/100;
            }*/

            let computedValue = flat + (coefficient * spellPower);
            let talentFactor = 0;

            for (let talentName in $scope.talents){
                let talent = $scope.talents[talentName];
                if (talent.apply === "heal" && talent.target.indexOf(spellName) > -1){
                    if ($scope.current_talents[talentName] > 0 ){
                        talentFactor += talent.value * $scope.current_talents[talentName];
                    }
                }
            }
            return computedValue + (computedValue*talentFactor/100);
        };

        let computeCost = function(cost, spellName){
            for (let talentName in $scope.talents){
                let talent = $scope.talents[talentName];
                if (talent.apply === "mana" && talent.target.indexOf(spellName) > -1){
                    if ($scope.current_talents[talentName] > 0 ){
                        cost = cost - (cost*$scope.current_talents[talentName]*$scope.talents[talentName]['value']/100)
                    }
                }
            }
            return cost;
        };

        let computeCast = function(cast, spellName){
            for (let talentName in $scope.talents){
                let talent = $scope.talents[talentName];
                if (talent.apply === "cast" && talent.target.indexOf(spellName) > -1){
                    if ($scope.current_talents[talentName] > 0 ){
                        cast = cast - ($scope.current_talents[talentName]*$scope.talents[talentName]['value'])
                    }
                }
            }
            return cast;
        };

        $scope.increaseTalent = function(value, spell){

            if (value > 0){
                if ($scope.current_talents[spell] < $scope.talents[spell]['ranks']){
                    $scope.current_talents[spell] += value;
                }
            }
            else if (value < 0){
                if (0 < $scope.current_talents[spell]){
                    $scope.current_talents[spell] += value;
                }
            }
        }


    };



    dataController.$inject = ['$scope', '$http'];

    return dataController;
});