/**
 * Created by Jose Soto
 * on 9/06/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.central_pagos')
        .controller('ConsultarPagosController', ConsultarPagosController);

    function ConsultarPagosController(Restangular, authService) {
        var vm = this;
        vm.buscar = '';
        vm.total = 0;
        vm.pagos = [];
        vm.fechaInicio = new Date();
        vm.fechaFinal = new Date();

        // funciones
        vm.cargarPagos = cargarPagos;

        function cargarPagos() {

        }
    }
})();
