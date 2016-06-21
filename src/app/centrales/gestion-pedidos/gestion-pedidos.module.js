/**
 * Created by Jose Soto
 * on 9/06/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.central_pedidos', [])
        .config(config)
        .run(run);

    function config($stateProvider) {
        $stateProvider
            .state('app.gestion-pedidos', {
                url: '/central/pedidos',
                templateUrl: 'app/centrales/gestion-pedidos/central-pedidos.html',
                data: {
                    onlyAccess: 'EMPRESA'
                },
                controller: 'CentralPedidosController',
                controllerAs: 'vm'
            })
    }

    function run(appMenu) {
        appMenu.addTo([
            {nombre: 'Nuevos Pedidos', link: 'app.gestion-pedidos', icon: 'fa fa-gift'},
        ], 'EMPRESA');
    }
})();

