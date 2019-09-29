define([], function () {
    let graphsController = function ($scope) {

        /* GRAPH OPTIONS */
        $scope.spell_selected = false;
        $scope.graphParam = {
            min: 0,
            max: 1500,
            step: 10
        };

        // Setting X labels
        for (let i=$scope.graphParam.min;
             i<=$scope.graphParam.max;
             i+=$scope.graphParam.step){

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
            },
            elements: {
                line: {
                    fill: false
                }
            }
        };

        $scope.computeGraph = function(spell){
            $scope.spell_selected = spell;
            $scope.graphs = {
                'labels': [],
                'series': [],
                data: {
                    'HPS': [],
                    'HPM': [],
                    'HPS/M': [],
                    'HES': []
                }
            };

            // Setting series
            let rankIndex = 1;
            for (let rank of spell['ranks']){

                $scope.graphs.series.push("RANK " + rankIndex);

                let rankHPSM = [];
                let rankHPM = [];
                let rankHPS = [];
                let rankHES = [];

                for (let i=$scope.graphParam.min;
                     i<=$scope.graphParam.max;
                     i+=$scope.graphParam.step){

                    if (rankIndex === 1){
                        $scope.graphs.labels.push(i);
                    }
                    let HPS_M = $scope.computeHPSM(i, spell, rankIndex-1);
                    let HPM = $scope.computeHPM(i, spell, rankIndex-1);
                    let HPS = $scope.computeHPS(i, spell, rankIndex-1);
                    let HES = $scope.computeSpecial(i, spell, rankIndex-1, [1, 1]);

                    rankHPSM.push(HPS_M);
                    rankHPM.push(HPM);
                    rankHPS.push(HPS);
                    rankHES.push(HES);

                }
                $scope.graphs.data['HPS/M'].push(rankHPSM);
                $scope.graphs.data['HPM'].push(rankHPM);
                $scope.graphs.data['HPS'].push(rankHPS);
                $scope.graphs.data['HES'].push(rankHES);
                rankIndex ++;
            }
        }


    };

    graphsController.$inject = ['$scope'];

    return graphsController;
});