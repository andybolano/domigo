(function () {
    'use strict';

    angular
            .module('app.auth', [])
            .config(config);

    function config($stateProvider) {
        $stateProvider
                .state('login', {
                    url: '/login',
                    templateUrl: 'app/auth/login.html',
                    data: {
                        noRequiresLogin: true
                    },
                    controller : 'LoginController',
                    controllerAs: 'vm'
                })
    }
})();