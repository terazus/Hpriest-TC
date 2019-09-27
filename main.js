require.config({
    baseUrl: 'app',

    // alias libraries paths
    paths: {
        'angular': '../node_modules/angular/angular.min',
        'angular-route': '../node_modules/angular-route/angular-route',
        'jquery': '../node_modules/jquery/dist/jquery',
        'bootstrap': '../node_modules/bootstrap/dist/js/bootstrap.min',
        'HomeController': 'home/homeCtrl',
        'app': 'app'
    },

    // Dependencies
    shim: {
        'app': ['angular-route'],
        'angular-route': ['angular'],
        'angular': {
            exports: 'angular'
        }
    },

    // kick start application
    deps: ['app']

});