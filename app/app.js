let dependencies = [
    'angular',
    'home/dataCtrl',
    'graphs/graphsCtrl'
];

define(dependencies, function (angular,
                               dataCtrl,
                               graphsCtrl) {

    let app = angular.module("HealerHPM", ['ngRoute', 'chart.js']);

    app.controller('dataController', dataCtrl);
    app.controller('graphsController', graphsCtrl);

    app.config(['$routeProvider', '$controllerProvider', '$provide', function ($routeProvider,
                                                                               $controllerProvider,
                                                                               $provide) {
        app.register = {
            controller: $controllerProvider.register,
            factory: $provide.factory
        };

        function resolveController(names) {
            return {
                load: ['$q', '$rootScope', function ($q, $rootScope) {
                    let defer = $q.defer();
                    require(names, function () {
                        defer.resolve();
                        $rootScope.$apply();
                    });
                    return defer.promise;
                }]
            }
        }

        $routeProvider
            .when("/", {
                templateUrl: "app/home/home.html",
                controller: "HomeController",
                resolve: resolveController(["HomeController"])
            })
            .when("/graphs", {
                templateUrl: "app/graphs/graphs.html"
            })
            .otherwise({redirectTo: '/'});
    }]);

    angular.element(document).ready(function () {
        angular.bootstrap(document, ['HealerHPM']);
    });

    app.directive('navigation', function(){
        return{
            restrict: 'A',
            templateUrl: 'app/navigation/navBar.html',
        }
    });

    app.filter('remove_dash', function() {
        return function (str) {
            return str.replace(/-/g, ' ');
        };
    });

    return app;
});