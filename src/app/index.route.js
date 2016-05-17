(function () {
    'use strict';

    angular
        .module('domigo')
        .config(routerConfig)
        .constant('API', '../api');

    /** @ngInject */
    function routerConfig($stateProvider, $urlRouterProvider, jwtInterceptorProvider, $httpProvider) {
        jwtInterceptorProvider.tokenGetter = function (jwtHelper, $http, API) {
            var jwt = sessionStorage.getItem('jwt');
            if (jwt) {
                if (jwtHelper.isTokenExpired(jwt)) {
                    return $http({
                        url: API + '/new_token',
                        skipAuthorization: true,
                        method: 'GET',
                        headers: {Authorization: 'Bearer ' + jwt},
                    }).then(function (response) {
                        sessionStorage.setItem('jwt', response.data.token);
                        return response.data.token;
                    }, function (response) {
                        sessionStorage.removeItem('jwt');
                    });
                } else {
                    return jwt;
                }
            }
        };

        $httpProvider.interceptors.push('jwtInterceptor');

        $urlRouterProvider.when('', '/');
        $urlRouterProvider.when('/', '/login');

        $stateProvider
            .state('app', {
                // abstract: true,
                url: "/app",
                templateUrl: "app/layout/layout.html",
                controller: 'LayoutController',
                controllerAs: 'vm'
            });
    }

})();
