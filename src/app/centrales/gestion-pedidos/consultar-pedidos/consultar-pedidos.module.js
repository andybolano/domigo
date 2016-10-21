/**
 * Created by Jose Soto
 * on 11/07/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.central_pedidos')
        .config(config)
        .run(run);

    function config($stateProvider) {
        $stateProvider
            .state('app.consulta-pedidos', {
                url: '/central/consultar-pedidos',
                templateUrl: 'app/centrales/gestion-pedidos/consultar-pedidos/consulta-pedidos.html',
                data: {
                    onlyAccess: 'EMPRESA'
                },
                controller: 'ConsultarPedidosController',
                controllerAs: 'vm'
            })
    }

    function run(appMenu) {
        appMenu.addTo([
            {nombre: 'Consulta Pedidos', link: 'app.consulta-pedidos', icon: 'fa fa-list-ol'}
        ], 'EMPRESA');
    }

})();
