/**
 * Created by Jose Soto
 * on 25/07/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.central_configuracion')
        .controller('CentralconfigController', CentralconfigController);

    function CentralconfigController(Restangular, authService) {
        var vm = this;
        vm.conceptoCobro = {};
        vm.tipoServicio = {};
        vm.editMode = false;

        vm.guardarConcepto = guardarConcepto;
        vm.guardarServicio = guardarServicio;
        vm.editarServicio = editarServicio;
        vm.modificarServicio = modificarServicio;
        vm.eliminarConcepto = eliminarConcepto;
        vm.eliminarTipoServicio = eliminarTipoServicio;

        function init() {
            cargarConceptosCobros();
            cargarTiposServicios();
        }

        function cargarTiposServicios() {
            vm.tiposServicios = [];
            Restangular.service('tipos_servicios', Restangular.one('empresas', authService.currentUser().empresa.id)).getList().then(function (response) {
                vm.tiposServicios = response;
            });
        }

        function cargarConceptosCobros() {
            vm.conceptosCobros = [];
            Restangular.service('conceptos_cobros', Restangular.one('empresas', authService.currentUser().empresa.id)).getList().then(function (response) {
                vm.conceptosCobros = response;
            });
        }

        function guardarConcepto() {
            io.socket.request({
                method: 'post',
                url: '/empresas/' + authService.currentUser().empresa.id + '/conceptos_cobros',
                data: vm.conceptoCobro,
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
                }
            }, function (response) {
                vm.conceptoCobro = {};
                vm.editMode = false;
                cargarConceptosCobros();
                swal('Concepto registrado correctamente')
            });
        }

        function guardarServicio() {
            io.socket.request({
                method: 'post',
                url: '/empresas/' + authService.currentUser().empresa.id + '/tipos_servicios',
                data: vm.tipoServicio,
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
                }
            }, function (response) {
                vm.tipoServicio = {};
                cargarTiposServicios();
                swal('Tipo de servicio registrado correctamente')
            });
        }

        function editarServicio(servicio) {
            vm.tipoServicio = servicio;
            vm.editMode = true;
        }

        function modificarServicio() {
            var servicio = Restangular.one('tipos_servicios', vm.tipoServicio.id);
            servicio.nombre = vm.tipoServicio.nombre;
            servicio.valor = vm.tipoServicio.valor;
            servicio.put().then(function (response) {
                cargarTiposServicios();
                swal('Actualizado correctamente')
            })


        }

        function eliminarConcepto(id) {
            swal({
                title: "Estas seguro?",
                text: "Estas intentando eliminar este concepto de pago!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                cancelButtonText: "No",
                confirmButtonText: "Si",
                closeOnConfirm: false
            }, function () {
                cargarConceptosCobros();
                swal("Eliminado!", "Has eliminado el concepto correctamente.", "success");
            });
        };

        function eliminarTipoServicio(id) {
            swal({
                title: "Estas seguro?",
                text: "Estas intentando eliminar este tipo de servicio!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                cancelButtonText: "No",
                confirmButtonText: "Si",
                closeOnConfirm: false
            }, function () {
                cargarTiposServicios();
                swal("Eliminado!", "Has eliminado el servicio correctamente.", "success");
            });
        };

        init();
    }
})();
