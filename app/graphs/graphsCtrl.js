define([], function () {
    let graphsController = function ($scope) {

        /* GRAPH OPTIONS */
        $scope.spell_selected = false;
        $scope.graphParam = {
            min: 0,
            max: 1500,
            step: 10,
            colors: [
                "#a2b9bc",
                "#b2ad7f",
                "#878f99",
                "#6b5b95",
                "#feb236",
                "#d64161",
                "#ff7b25",
                "#82b74b",
                "#034f84",
                "#b1cbbb"
            ],
            offColors: [
                "#d98880",
                "#9a7d0a",
                "#c39bd3",
                "#0e6251",
                "#f4d03f",
                "#78281f",
                "#7fb3d5",
                "#154360",
                "#1abc9c",
                "#512e5f"
            ]
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

                    let compute_all = $scope.compute_all(i, spell, rankIndex-1);

                    /*
                    let HPS_M = $scope.computeHPSM(i, spell, rankIndex-1);
                    let HPM = $scope.computeHPM(i, spell, rankIndex-1);
                    let HPS = $scope.computeHPS(i, spell, rankIndex-1);
                    let HES = $scope.computeSpecial(i, spell, rankIndex-1, [1, 1]);
                    */

                    rankHPSM.push(compute_all[2]);
                    rankHPM.push(compute_all[1]);
                    rankHPS.push(compute_all[0]);
                    rankHES.push(compute_all[3]);

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