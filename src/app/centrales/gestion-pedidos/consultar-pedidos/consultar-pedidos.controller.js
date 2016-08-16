/**
 * Created by Jose Soto
 * on 11/07/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.central_pedidos')
        .controller('ConsultarPedidosController', ConsultarPedidosController);

    function ConsultarPedidosController(Restangular, authService) {
        var vm = this;
        vm.domicilios = [];
        vm.cargarPedidos = cargarPedidos;

        function cargarPedidos() {
            vm.domicilios = [];
            Restangular.service('domicilios', Restangular.one('empresas', authService.currentUser().empresa.id)).getList().then(function (response) {
                vm.domicilios = response;
            });
        }

        cargarPedidos();
    }
})();
