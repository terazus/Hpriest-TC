define(['app'], function (app) {
    app.register.controller('HomeController', ['$scope', '$window', '$http', '$sce', function ($scope, $window, $http, $sce) {

        $scope.labels = [
            "icon",
            "Name",
            "Efficiency",
            "Cast time",
            "Rank",
            "Minimum Heal",
            "Maximum Heal",
            "Flat Heal",
            "Cost",
            "Heal Per Mana"
        ];

        $scope.spellPower = "1"



    }])
});
