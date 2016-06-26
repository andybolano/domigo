/**
 * Created by Jose Soto
 * on 9/06/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.central_home', [])
        .config(config)
        .run(run);

    function config($stateProvider) {
        $stateProvider
            .state('app.home', {
                url: '/home/',
                templateUrl: 'app/centrales/home/home.html',
                data: {
                    onlyAccess: 'EMPRESA'
                },
                controller: 'HomeController',
                controllerAs: 'vm'
            })
    }

    function run(appMenu) {
        appMenu.addTo([
            {nombre: 'Home', link: 'app.home', icon: 'fa fa-home'},
        ], 'EMPRESA');
    }
})();

