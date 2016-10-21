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
        toastr.options = {
            "positionClass": "toast-top-center"
        };

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

        function guardarConcepto($event) {
            $event.stopPropagation();
	        $event.preventDefault();
            Restangular.one('/empresas', authService.currentUser().empresa.id).post('conceptos_cobros', vm.conceptoCobro).then(function (response) {
                vm.conceptoCobro = {};
                vm.editMode = false;
                cargarConceptosCobros();
                toastr.success('Concepto registrado correctamente');
            });
        }

        function guardarServicio($event) {
            $event.stopPropagation();
            $event.preventDefault();
            Restangular.one('/empresas', authService.currentUser().empresa.id).post('tipos_servicios', vm.tipoServicio).then(function (response) {
                    vm.tipoServicio = {};
                    cargarTiposServicios();
                    toastr.success('Tipo de servicio registrado correctamente');
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
                vm.tipoServicio = {};
                cargarTiposServicios();
                toastr.success('Actualizado correctamente');
            })


        }

        function eliminarConcepto(concepto) {
            swal({
                title: "Estas seguro?",
                text: "Estas intentando eliminar este concepto de pago!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                cancelButtonText: "No",
                confirmButtonText: "Si",
                closeOnConfirm: true
            }, function () {
                Restangular.one('conceptos_cobros', concepto.id).remove().then(function (response) {
                    cargarConceptosCobros();
                    toastr.success('Has eliminado el concepto correctamente.', 'Eliminado!');
                });
            });
        };

        function eliminarTipoServicio(servicio) {
            swal({
                title: "Estas seguro?",
                text: "Estas intentando eliminar este tipo de servicio!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                cancelButtonText: "No",
                confirmButtonText: "Si",
                closeOnConfirm: true
            }, function () {
                Restangular.one('tipos_servicios', servicio.id).remove().then(function (response) {
                    cargarTiposServicios();
                    toastr.success('Has eliminado el servicio correctamente.', 'Eliminado!');
                });
            });
        };

        init();
    }
})();
