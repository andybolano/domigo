/**
 * Created by Jose Soto
 * on 9/06/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.central_pagos')
        .controller('CentralPagosController', CentralPagosController);

    function CentralPagosController(Restangular, authService) {
        var vm = this;
        vm.buscar = '';
        vm.cargarMensajero = cargarMensajero;
        vm.guardarPago = guardarPago;

        function cargarMensajero() {
            var campos = 'fotografia,condicion,direccion,nombre,apellidos,telefonos,email,vehiculo,cedula,id';
            Restangular.service('mensajeros?fields=' + campos, Restangular.one('empresas', authService.currentUser().empresa.id)).getList({cedula: vm.buscar}).then(function (response) {
                vm.mensajero = response;
                vm.mensajero.fecha_pago = new Date();
                if(vm.mensajero.length <= 0){
                    swal('No se encontro ningun mensajero con esta identificacion')
                }
            });
        }

        function guardarPago() {
            swal('Estamos trabajando en esta funcionalidad, por favor, sea paciente :)')
        }
    }
})();
