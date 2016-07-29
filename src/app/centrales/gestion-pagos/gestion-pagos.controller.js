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
        vm.total = 0;
        vm.fechaInicio = new Date();
        vm.fechaFinal = new Date();
        vm.mostrar = false;
        vm.cargarMensajero = cargarMensajero;
        vm.guardarPago = guardarPago;

        function cargarConceptosEmpresa() {
            Restangular.service('conceptos_cobros', Restangular.one('empresas', authService.currentUser().empresa.id)).getList().then(function (response) {
                vm.conceptos = response;
            });
        }

        function cargarMensajero() {
            vm.pago = {};
            var campos = 'fotografia,condicion,direccion,nombre,apellidos,telefonos,email,vehiculo,cedula,id';
            Restangular.service('mensajeros?fields=' + campos + '&populate=pagos', Restangular.one('empresas', authService.currentUser().empresa.id)).getList({cedula: vm.buscar}).then(function (response) {
                if (response.length <= 0) {
                    toastr.info('No se encontro ningun mensajero con esta identificacion');
                    // swal('No se encontro ningun mensajero con esta identificacion')
                } else {
                    vm.mostrar = true;
                    vm.mensajero = response[0];
                    cargarPagosMensajeros(response[0]);
                    vm.pago.fecha = new Date();
                }
            });
        }

        function guardarPago() {
            vm.pago.mensajero = vm.mensajero.id;
            // vm.pago.empresa = authService.currentUser().empresa.id;
            io.socket.request({
                method: 'post',
                url: '/mensajeros/' + vm.mensajero.id + '/pagos',
                data: vm.pago,
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
                }
            }, function (response) {
                vm.pago = {}
                vm.pago.fecha = new Date();
                cargarPagosMensajeros(vm.mensajero);
                cargarUltimosPagos();
                toastr.success('Pago registrado correctamente')
            });
        }

        function cargarPagosMensajeros(mensajero) {
            vm.pagos = [];
            vm.total = 0;
            Restangular.service('pagos?populate=concepto', Restangular.one('mensajeros', mensajero.id)).getList().then(function (response) {
                vm.pagos = response;
                angular.forEach(vm.pagos, function (pago) {
                    vm.total += pago.valor;
                })
            });

        }

        function cargarUltimosPagos() {
            // var upagos = Restangular.all('empresas/'+authService.currentUser().empresa.id+'/total_ultimos_pagos');

            Restangular.one('empresas/', authService.currentUser().empresa.id).customGET('total_ultimos_pagos').then(function (response) {
                vm.ultimosPagos = response;
            })
            // ultimosPagos = Restangular.all('empresas/' + authService.currentUser().empresa.id + '/total_ultimos_pagos').getList();
            // Restangular.service('total_ultimos_pagos', Restangular.one('empresas', authService.currentUser().empresa.id)).get().then(function (response) {
            //     vm.ultimosPagos = response;
            // });
        }

        cargarUltimosPagos();
        cargarConceptosEmpresa();
    }
})();
