/**
 * Created by Jose Soto
 * on 17/05/2016.
 */
(function () {
    'use strict';
    
    angular
        .module('app.central_mensajeros', [])
        .config(config)
        .run(run);

    function config($stateProvider) {
        $stateProvider
            .state('app.central-mensajeros', {
                url: '/central/mensajeros',
                templateUrl: 'app/centrales/gestion-mensajeros/central-mensajeros.html',
                data: {
                    onlyAccess: 'EMPRESA'
                },
                controller: 'CentralMensajerosController',
                controllerAs: 'vm'
            })
            .state('app.detalle-mensajero', {
                url: '/central/detalle/mensajero',
                templateUrl: 'app/centrales/gestion-mensajeros/detalles-mensajeros.html',
                data: {
                    onlyAccess: 'EMPRESA'
                },
                params: {
                    id: null,
                },
                controller: 'CentralDetallesMensajerosController',
                controllerAs: 'vm'
            })
    }

    function run(appMenu) {
        appMenu.addTo([
            {nombre: 'Mensajeros', link: 'app.central-mensajeros', icon: 'fa fa-users'},
        ], 'EMPRESA');
    }
})();
