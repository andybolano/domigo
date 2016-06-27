/**
 * Created by Jose Soto
 * on 9/06/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.central_pedidos')
        .controller('CentralPedidosController', CentralPedidosController);

    function CentralPedidosController(SocketcSailsService, authService) {
        SocketcSailsService.suscribe(authService.currentUser().id);
        SocketcSailsService.pedidos();
        // variables privadas
        var vm = this;

        // variables publicas
        vm.pedidos = [];
        vm.pedido = {};
    }
})();
