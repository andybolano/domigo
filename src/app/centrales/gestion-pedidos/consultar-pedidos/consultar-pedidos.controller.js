/**
 * Created by Jose Soto
 * on 11/07/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.central_pedidos')
        .controller('ConsultarPedidosController', ConsultarPedidosController);

    function ConsultarPedidosController(Restangular, authService, $filter) {
        var vm = this;
        vm.domicilios = [];
        vm.fechaInicio = new Date();
        vm.fechaFinal = new Date();

        vm.removeDomicilio = removeDomicilio;

        toastr.options = {
            "positionClass": "toast-top-center"
        };

        vm.cargarPedidos = cargarPedidos;
        vm.cargarRangoDePedidos = cargarRangoDePedidos;

        function cargarPedidos() {
            vm.domicilios = [];
            Restangular.service('domicilios', Restangular.one('empresas', authService.currentUser().empresa.id)).getList().then(function (response) {
                vm.domicilios = response;
            });
        }

        function cargarRangoDePedidos() {
            vm.domicilios = [];
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
                Restangular.service('domicilios?fecha_desde=' + desde + '&fecha_hasta=' + hasta, Restangular.one('empresas', authService.currentUser().empresa.id)).getList().then(function (response) {
                    if (response.length <= 0) {
                        toastr.warning('No se registraron domicilios en la fecha o fechas seleccionadas', 'Espera!');
                    } else {
                        vm.domicilios = response;
                    }
                });
            }
        }

        function removeDomicilio($index, domicilio) {
            var dr = vm.domicilios[$index];
            swal({
                title: "Estas seguro?",
                text: "Estas intentando eliminar este domicilio!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                cancelButtonText: "No",
                confirmButtonText: "Si",
                closeOnConfirm: true
            }, function () {
                Restangular.one('domicilios/'+ domicilio.id).remove().then(function (response) {
                    toastr.success('Has eliminado el domicilio correctamente.', 'Eliminado!');
                    vm.domicilios.splice($index, 1);
                });
                // swal("Eliminado!", "Has eliminado el pedido correctamente.", "success");
            });
        }

        cargarPedidos();
    }
})();
