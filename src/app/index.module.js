(function () {
    'use strict';

    angular
        .module('domigo', [
            'ngAnimate',
            'ngCookies',
            'ngTouch',
            'ngSanitize',
            'ngMessages',
            'ngAria',
            'ngResource',
            'ui.router',
            'ui.bootstrap',
            'localytics.directives',

            'commons',
            'angular-jwt',
            'restangular',
            'datatables',
            'datatables.bootstrap',
            'datatables.buttons',

            'app.auth',
            'app.admin',
            'app.central'
        ]);
})();
