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

        $scope.spellPower = "1";

        $scope.computeDetails = {
            "HPS": "HPS = Total healing done / cast time",
            "HPM": "HPM = Total healing done / mana cost",
            "HPS/M": "HPS/M (HPM generate per point of mana used) = (Total healing done / cast time) / mana cost",
            "HES": "HES = log(squareRoot(HPS*HPM))"
        }

    }])
});
