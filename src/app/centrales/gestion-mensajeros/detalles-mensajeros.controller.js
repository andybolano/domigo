/**
 * Created by Jose Soto
 * on 20/06/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.central_mensajeros')
        .controller('CentralDetallesMensajerosController', CentralDetallesMensajerosController);

    function CentralDetallesMensajerosController(Restangular, $stateParams) {
        // variables privadas
        var vm = this;


        function cargarMensajero() {
            var mensajero = Restangular.one('mensajeros', $stateParams.id);
            mensajero.put().then(function (response) {
                vm.mensajero = response;
            })
        }

        // funciones publicas
        vm.bloquearMensajero = bloquearMensajero;
        vm.desbloquearMensajero = desbloquearMensajero;

        function cargarDatosUnMensajero(response) {
            vm.mensajero = response;
        }


        function bloquearMensajero(mensajero) {
            vm.m = mensajero;
            swal({
                title: "ESTAS SEGURO?",
                text: "Estas intentando bloquear al mensajero " + mensajero.nombre + ' ' + mensajero.apellidos,
                type: "info",
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Si',
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
            }, function () {
                setTimeout(function () {
                    var mensjaero = Restangular.one('mensajeros/' + vm.m.id + '/estado');
                    mensjaero.activo = 2;
                    mensjaero.put().then(function (response) {
                        swal(response.nombre + ' ' + response.apellidos + ' bloqueado correctamente');
                        cargarDatosUnMensajero(response)
                    });
                }, 200);
            })
        }

        function desbloquearMensajero(mensajero) {
            vm.m = mensajero;
            swal({
                title: "ESTAS SEGURO?",
                text: "Estas intentando desbloquear al mensajero " + mensajero.nombre + ' ' + mensajero.apellidos,
                type: "info",
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Si',
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
            }, function () {
                setTimeout(function () {
                    var mensjaero = Restangular.one('mensajeros/' + vm.m.id + '/estado');
                    mensjaero.activo = 1;
                    mensjaero.put().then(function (response) {
                        swal(response.nombre + ' ' + response.apellidos + ' desbloqueado correctamente');
                        cargarDatosUnMensajero(response)
                    });
                }, 200);
            })
        }

        cargarMensajero();
    }
})();
