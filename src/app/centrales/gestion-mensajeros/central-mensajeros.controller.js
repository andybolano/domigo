/**
 * Created by Jose Soto
 * on 17/05/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.central_mensajeros')
        .controller('CentralMensajerosController', CentralMensajerosController);

    function CentralMensajerosController(Restangular, authService) {
        // variables privadas
        var vm = this;
        vm.variableActivos = true;
        vm.variableBloqueados = false;

        // funciones publicas
        vm.cargarMensajeros = cargarMensajeros;
        vm.cargarMensajerosActivos = cargarMensajerosActivos;
        vm.cargarMensajerosBloqueados = cargarMensajerosBloqueados;
        vm.verMensajero = verMensajero;
        vm.addListaNegra = addListaNegra;
        vm.bloquearMensajero = bloquearMensajero;
        vm.desbloquearMensajero = desbloquearMensajero;
         vm.newMensajero = newMensajero;

        if(vm.variableActivos == true){
            cargarMensajerosActivos();
        }

        function cargarMensajeros() {
            vm.mensajerosActivos = 0;
            vm.mensajerosBloqueados = 0;
            vm.mensajerosSancionados = 0;
            var campos = 'all';
            Restangular.service('mensajeros?fields=' + campos, Restangular.one('empresas', authService.currentUser().id)).getList().then(function (response) {
                angular.forEach(response, function (m) {
                    if (m.activo == 1) {
                        vm.mensajerosActivos++;
                    } else if (m.activo == 2) {
                        vm.mensajerosBloqueados++;
                    } else if (m.activo == 3) {
                        vm.mensajerosSancionados++;
                    }
                })
            });
        }

        function cargarMensajerosActivos() {
            vm.texto = 'Mensajeros Activos';
            vm.mensajeros = [];
            var campos = 'activo,direccion,nombre,apellidos,telefonos,email,vehiculo,cedula,id';
            Restangular.service('mensajeros?fields='+campos, Restangular.one('empresas', authService.currentUser().id)).getList({activo: 1}).then(function (response) {
                vm.mensajeros = response;
            });
        }

        function cargarMensajerosBloqueados() {
            vm.texto = 'Mensajeros Bloqueados';
            vm.mensajeros = [];
            var campos = 'activo,direccion,nombre,apellidos,telefonos,email,vehiculo,cedula,id';
            Restangular.service('mensajeros?fields='+campos, Restangular.one('empresas', authService.currentUser().id)).getList({activo: 2}).then(function (response) {
                vm.mensajeros = response;
            });
        }

        function cargarDatosUnMensajero(responde) {
            vm.mensajero = responde;
        }

        function verMensajero(mensajero) {
            vm.mensajero = mensajero;
            $('#verMensajero').modal('show');
        }

        function addListaNegra() {
            $('#addListaNegra').modal('show');
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
                        cargarMensajeros();
                        cargarMensajerosBloqueados();
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
                        cargarMensajeros();
                        cargarMensajerosActivos();
                    });
                }, 200);
            })
        }

         function newMensajero() {
           
            $('#newMensajero').modal('show');
        }

        cargarMensajeros();
    }
})();