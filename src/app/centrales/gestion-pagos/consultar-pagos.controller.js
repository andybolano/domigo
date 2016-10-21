/**
 * Created by Jose Soto
 * on 9/06/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.central_pagos')
        .controller('ConsultarPagosController', ConsultarPagosController);

    function ConsultarPagosController(Restangular, authService, $filter) {
        var vm = this;
        vm.buscar = '';
        vm.total = 0;
        vm.pagos = [];
        toastr.options = {
            "positionClass": "toast-top-center"
        };

        // funciones
        vm.cargarPagos = cargarPagos;
        function cargarPagos() {
            vm.pagos = [];
            vm.total = 0;
            var desde = $filter('date')(vm.fechaInicio, 'yyyy-MM-dd');
            var hasta = $filter('date')(vm.fechaFinal, 'yyyy-MM-dd');
            var aFecha1 = desde.split('-');
            var aFecha2 = hasta.split('-');
            var fFecha1 = Date.UTC(aFecha1[2],aFecha1[1]-1,aFecha1[0]);
            var fFecha2 = Date.UTC(aFecha2[2],aFecha2[1]-1,aFecha2[0]);
            var dif = fFecha2 - fFecha1;
            var dias = Math.floor(dif / (1000 * 60 * 60 * 24));
            if(dias < 0){
                toastr.warning('formato de fechas invalido, la fecha hasta debe ser mayor a la fecha desde', 'Espera!');
            }else{
                Restangular.service('pagos?fecha_desde=' + desde + '&fecha_hasta=' + hasta, Restangular.one('empresas', authService.currentUser().empresa.id)).getList().then(function (response) {
                    if (response.length <= 0) {
                        toastr.warning('No se registraron pagos en la fecha o fechas seleccionadas', 'Espera!');
                    } else {
                        vm.pagos = response;
                    }
                    angular.forEach(response, function (pago) {
                        vm.total += pago.valor;
                    })

                });
            }
        }

        cargarPagosIniciales()
        function cargarPagosIniciales() {
            vm.fechaInicio = new Date();
            vm.fechaFinal = new Date();
            vm.pagos = [];
            vm.total = 0;
            var desde = $filter('date')(vm.fechaInicio, 'yyyy-MM-dd');
            var hasta = $filter('date')(vm.fechaFinal, 'yyyy-MM-dd');
            var aFecha1 = desde.split('-');
            var aFecha2 = hasta.split('-');
            var fFecha1 = Date.UTC(aFecha1[2],aFecha1[1]-1,aFecha1[0]);
            var fFecha2 = Date.UTC(aFecha2[2],aFecha2[1]-1,aFecha2[0]);
            var dif = fFecha2 - fFecha1;
            var dias = Math.floor(dif / (1000 * 60 * 60 * 24));
            if(dias < 0){
                toastr.warning('formato de fechas invalido, la fecha hasta debe ser mayor a la fecha desde', 'Espera!');
            }else{
                Restangular.service('pagos?fecha_desde=' + desde + '&fecha_hasta=' + hasta, Restangular.one('empresas', authService.currentUser().empresa.id)).getList().then(function (response) {
                    if (response.length <= 0) {
                        toastr.warning('No se registraron pagos en la fecha o fechas seleccionadas', 'Espera!');
                    } else {
                        vm.pagos = response;
                    }
                    angular.forEach(response, function (pago) {
                        vm.total += pago.valor;
                    })

                });
            }
        }
    }
})();
