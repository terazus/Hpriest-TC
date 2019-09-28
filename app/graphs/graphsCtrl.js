define([], function () {
    let graphsController = function ($scope) {
        $scope.test = "abc";

        function computeGraph(spell){
            console.log(spell);
        }


    };

    graphsController.$inject = ['$scope'];

    return graphsController;
});