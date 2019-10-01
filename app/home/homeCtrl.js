define(['app'], function (app) {
    app.register.controller('HomeController', ['$scope', '$window', '$http', '$sce', function ($scope, $window, $http, $sce) {

        $scope.labels = [
            "icon",
            "Name",
            "Cast time",
            "Rank",
            "Min",
            "Max",
            "Flat Heal",
            "Cost",
            "Efficiency"
        ];

        $scope.spellPower = "1"

    }])
});
