/**
 * Created by Jose Soto
 * on 9/06/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.central_pagos')
        .controller('CentralPagosController', CentralPagosController);

    function CentralPagosController(Restangular, authService, $scope) {
        var vm = this;
        vm.buscar = '';
        vm.cargarMensajero = cargarMensajero;
        vm.guardarPago = guardarPago;

        function cargarConceptosEmpresa() {
            Restangular.service('conceptos_cobros', Restangular.one('empresas', authService.currentUser().empresa.id)).getList().then(function (response) {
                vm.conceptos = response;
            });
        }

        function cargarMensajero() {
            vm.pago = {}
            var campos = 'fotografia,condicion,direccion,nombre,apellidos,telefonos,email,vehiculo,cedula,id';
            Restangular.service('mensajeros?fields=' + campos + '&populate=pagos', Restangular.one('empresas', authService.currentUser().empresa.id)).getList({cedula: vm.buscar}).then(function (response) {
                if (response.length <= 0) {
                    swal('No se encontro ningun mensajero con esta identificacion')
                } else {
                    vm.mensajero = response[0];
                    cargarPagosMensajeros(response[0]);
                    vm.pago.fecha = new Date();
                }
            });
        }

        function guardarPago() {
            vm.pago.mensajero = vm.mensajero.id;
            io.socket.request({
                method: 'post',
                url: '/mensajeros/' + vm.mensajero.id + '/pagos',
                data: vm.pago,
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
                }
            }, function (response) {
                cargarPagosMensajeros(response.data)
                swal('Pago registrado correctamente')
            });
        }

        function cargarPagosMensajeros(mensajero) {
            Restangular.service('pagos?populate=concepto', Restangular.one('mensajeros', mensajero.id)).getList().then(function (response) {
                vm.pagos = response;
            });

        }

        cargarConceptosEmpresa();
    }
})();
