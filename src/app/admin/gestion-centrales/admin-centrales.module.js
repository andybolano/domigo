/**
 * Created by Jose Soto
 * on 15/05/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.admin_centrales', [])
        .config(config);

    function config($stateProvider) {
        $stateProvider
            .state('app.admin-centrales', {
                url: '/admin/centrales',
                templateUrl: 'app/admin/gestion-centrales/admin-centrales.html',
                data: {
                    noRequiresLogin: true
                },
                controller: 'AdminCentralesController',
                controllerAs: 'vm'
            })
            .state('app.admin-centrales-mensajeros', {
               url: '/admin/centrales/mensajeros',
                templateUrl: 'app/admin/gestion-centrales/admin-mensajeros.html',
                data:{
                    noRequiresLogin: true
                },
                controller: 'AdminMensajerosController',
                controllerAs: 'vm'
            });
    }
})();
