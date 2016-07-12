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
        vm.fechaInicio = new Date();
        vm.fechaFinal = new Date();

        // funciones
        vm.cargarPagos = cargarPagos;

        function cargarPagos() {
            vm.pagos = [];
            vm.total = 0;
            var desde = $filter('date')(vm.fechaInicio, 'yyyy-MM-dd');
            var hasta = $filter('date')(vm.fechaFinal, 'yyyy-MM-dd');
            Restangular.service('pagos?fecha_desde=' + desde + '&fecha_hasta=' + hasta, Restangular.one('empresas', authService.currentUser().empresa.id)).getList().then(function (response) {
                if(response.length <= 0){
                    swal('No se registraron pagos en la fecha o fechas seleccionadas')
                }else{
                    vm.pagos = response;
                }
                angular.forEach(response, function (pago) {
                    vm.total += pago.valor;
                })

            });
        }
    }
})();
