require.config({
    baseUrl: 'app',

    // alias libraries paths
    paths: {
        'angular': '../node_modules/angular/angular.min',
        'angular-route': '../node_modules/angular-route/angular-route',
        'chart': '../node_modules/chart.js/dist/Chart.min',
        'angular-chart': '../node_modules/angular-chart.js/dist/angular-chart.min',
        'jquery': '../node_modules/jquery/dist/jquery',
        'bootstrap': '../node_modules/bootstrap/dist/js/bootstrap.bundle',
        'HomeController': 'home/homeCtrl',
        'app': 'app'
    },

    // Dependencies
    shim: {
        'app': ['angular-route', 'angular-chart', 'bootstrap'],
        'angular-chart': ['angular', 'chart'],
        'chart': ['angular'],
        'bootstrap': ['jquery'],
        'angular-route': {
            deps: ['angular']
        },
        'angular': {
            exports: 'angular'
        },
        'jquery': {
            exports: '$'
        }
    },

    // kick start application
    deps: ['app']

});