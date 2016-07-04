/**
 * Created by Jose Soto
 * on 9/06/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.central_pagos', [])
        .config(config)
        .run(run);

    function config($stateProvider) {
        $stateProvider
            .state('app.gestion-pagos', {
                url: '/central/pagos',
                templateUrl: 'app/centrales/gestion-pagos/central-pagos.html',
                data: {
                    onlyAccess: 'EMPRESA'
                },
                controller: 'CentralPagosController',
                controllerAs: 'vm'
            })
    }

    function run(appMenu) {
        appMenu.addTo([
            {nombre: 'Gestion de pagos', link: 'app.gestion-pagos', icon: 'fa fa-money'},
        ], 'EMPRESA');
    }
})();

