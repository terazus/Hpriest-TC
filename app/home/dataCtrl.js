define([], function () {
    let dataController = function ($scope, $http) {
        let data_file = "app/data/priest.json";
        let request = {
            method: 'GET',
            url: data_file
        };

        $scope.graphs = {
          "Greater Heal": {
            'series': [],
            'data': []
          },
          "labels" : []
        }

        // Setting X labels
        for (let i=0;i<=1000;i+=10){
          $scope.graphs.labels.push(i)
        }

        $scope.onClick = function (points, evt) {
          console.log(points, evt);
        };
        $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];
        $scope.options = {
        scales: {
          yAxes: [
            {
              id: 'y-axis-1',
              type: 'linear',
              display: true,
              position: 'left'
            }
          ]
        }
      };


        $http(request).then(function(response){

            let output = {
                "spells": [],
                "iconLocation": response.data['iconLocation']
            };

            for (let spellIt in response.data['spells']){

                let currentSpell = response.data['spells'][spellIt]

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

                $scope.graphs[currentSpell.name] = {
                  'series': [],
                  'data': []
                }

                // Setting series
                let rankIndex = 0;
                for (let rank in response.data['spells'][spellIt]['ranks']){
                    $scope.graphs[currentSpell.name].series.push("RANK " + response.data['spells'][spellIt]['ranks'][rank]['rank'])

                    let rankValues = []
                    // Setting up data
                    for (let i=0;i<=1000;i+=10){
                        let HPM = $scope.computeHPSM(i, response.data['spells'][spellIt], rankIndex)
                        rankValues.push(HPM);
                    }
                    $scope.graphs[currentSpell.name].data.push(rankValues);
                    rankIndex ++;

                }
                console.log($scope.graphs);
            }

            $scope.data = output;
        });

        $scope.computeHPM = function(spellPower, spell, rank){
            let rankValue = spell['ranks'][rank];
            return (rankValue['flat'] + (rankValue['effectiveCoefficient'] * spellPower)) / rankValue['cost']
        }

        $scope.computeHPSM = function(spellPower, spell, rank){
            let rankValue = spell['ranks'][rank];
            return ((rankValue['flat'] + (rankValue['effectiveCoefficient'] * spellPower)) / spell['effectiveCastTime'] ) / rankValue['cost']
        }




    };



    dataController.$inject = ['$scope', '$http'];

    return dataController;
});