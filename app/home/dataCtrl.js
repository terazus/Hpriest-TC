define([], function () {
    let dataController = function ($scope, $http) {
        let data_file = "app/data/priest.json";
        let request = {
            method: 'GET',
            url: data_file
        };

        $http(request).then(function(response){

            let output = {
                "spells": [],
                "iconLocation": response.data['iconLocation']
            };

            for (let spellIt in response.data['spells']){
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
        })
    };

    dataController.$inject = ['$scope', '$http'];

    return dataController;
});