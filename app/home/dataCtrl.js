define([], function () {
    let dataController = function ($scope, $http) {
        let data_file = "app/data/priest.json";
        let request = {
            method: 'GET',
            url: data_file
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

            $scope.talents = response.data['talents']
        });

        $scope.computeHPM = function(spellPower, spell, rank){
            let rankValue = spell['ranks'][rank];
            return Math.round((rankValue['flat'] + (rankValue['effectiveCoefficient'] * spellPower)) / rankValue['cost']*1000)/1000
        };

        $scope.computeHPSM = function(spellPower, spell, rank){
            let rankValue = spell['ranks'][rank];
            return Math.round(((rankValue['flat'] + (rankValue['effectiveCoefficient'] * spellPower)) / spell['effectiveCastTime'] ) / rankValue['cost']*1000)/1000
        };

        $scope.computeHPS = function(spellPower, spell, rank){
            let rankValue = spell['ranks'][rank];
            return Math.round(((rankValue['flat'] + (rankValue['effectiveCoefficient'] * spellPower)) / spell['effectiveCastTime'] )*1000)/1000
        };

        $scope.computeSpecial = function(spellPower, spell, rank, coefficient) {
            let HPM = $scope.computeHPM(spellPower, spell, rank);
            let HPS = $scope.computeHPS(spellPower, spell, rank);

            return Math.round(Math.sqrt(HPM*HPS)*1000)/1000;

           //return Math.pow(HPM, coefficient[0]) * Math.pow(Math.log(HPS), coefficient[1]);
        }




    };



    dataController.$inject = ['$scope', '$http'];

    return dataController;
});