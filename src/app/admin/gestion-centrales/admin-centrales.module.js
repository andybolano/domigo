/**
 * Created by Jose Soto
 * on 15/05/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.admin_centrales', [])
        .config(config)
        .run(run);

    function config($stateProvider) {
        $stateProvider
            .state('app.admin-centrales', {
                url: '/admin/centrales',
                templateUrl: 'app/admin/gestion-centrales/admin-centrales.html',
                data: {
                    onlyAccess: 'SUPER_ADM' //['rol']
                    //noRequiresLogin: true
                },
                controller: 'AdminCentralesController',
                controllerAs: 'vm'
            })
            .state('app.admin-centrales-mensajeros', {
                url: '/admin/centrales/mensajeros',
                templateUrl: 'app/admin/gestion-centrales/admin-mensajeros.html',
                params: {
                    id: null,
                    nombre: null
                },
                data: {
                    onlyAccess: 'SUPER_ADM'
                },
                controller: 'AdminMensajerosController',
                controllerAs: 'vm'
            });
    }

    function run(appMenu) {
        appMenu.addTo([
            {nombre: 'Empresas', link: 'app.admin-centrales', icon: 'fa fa-house'},
        ], 'SUPER_ADM');
    }
})();
