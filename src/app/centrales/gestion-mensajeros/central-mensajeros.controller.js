/**
 * Created by Jose Soto
 * on 17/05/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.central_mensajeros')
        .controller('CentralMensajerosController', CentralMensajerosController);

    function CentralMensajerosController(Restangular, authService, $http) {
        // variables privadas
        var vm = this;
        var gMensajero = Restangular.all('/empresas/'+authService.currentUser().id+'/mensajeros')
        vm.variableActivos = true;
        vm.variableBloqueados = false;
        vm.fotografia = '';

        // funciones publicas
        vm.cargarMensajeros = cargarMensajeros;
        vm.cargarMensajerosActivos = cargarMensajerosActivos;
        vm.cargarMensajerosBloqueados = cargarMensajerosBloqueados;
        vm.cargarMensajerosAusentes = cargarMensajerosAusentes;

        vm.verMensajero = verMensajero;
        vm.addListaNegra = addListaNegra;
        vm.bloquearMensajero = bloquearMensajero;
        vm.desbloquearMensajero = desbloquearMensajero;
        vm.newMensajero = newMensajero;
        vm.guardarMensajero = guardarMensajero;

        if (vm.variableActivos == true) {
            cargarMensajerosActivos();
        }

        function cargarMensajeros() {
            vm.mensajerosActivos = 0;
            vm.mensajerosBloqueados = 0;
            vm.mensajerosAusentes = 0;
            var campos = 'condicion';
            Restangular.service('mensajeros?fields=' + campos, Restangular.one('empresas', authService.currentUser().id)).getList().then(function (response) {
                angular.forEach(response, function (m) {
                    if (m.condicion == 'activo') {
                        vm.mensajerosActivos++;
                    } else if (m.condicion == 'sancionado') {
                        vm.mensajerosBloqueados++;
                    } else if (m.condicion == 'ausente') {
                        vm.mensajerosAusentes++;
                    }
                })
            });
        }

        function cargarMensajerosActivos() {
            vm.texto = 'Mensajeros Activos';
            vm.mensajeros = [];
            var campos = 'condicion,direccion,nombre,apellidos,telefonos,email,vehiculo,cedula,id';
            Restangular.service('mensajeros?fields=' + campos, Restangular.one('empresas', authService.currentUser().id)).getList({condicion: 'activo'}).then(function (response) {
                vm.mensajeros = response;
            });
        }

        function cargarMensajerosBloqueados() {
            vm.texto = 'Mensajeros Sancionados';
            vm.mensajeros = [];
            var campos = 'condicion,direccion,nombre,apellidos,telefonos,email,vehiculo,cedula,id';
            Restangular.service('mensajeros?fields=' + campos, Restangular.one('empresas', authService.currentUser().id)).getList({condicion: 'sancionado'}).then(function (response) {
                vm.mensajeros = response;
            });
        }

        function cargarMensajerosAusentes() {
            vm.texto = 'Mensajeros Ausentes';
            vm.mensajeros = [];
            var campos = 'condicion,direccion,nombre,apellidos,telefonos,email,vehiculo,cedula,id';
            Restangular.service('mensajeros?fields=' + campos, Restangular.one('empresas', authService.currentUser().id)).getList({condicion: 'ausente' }).then(function (response) {
                vm.mensajeros = response;
            });
        }

        function cargarDatosUnMensajero(responde) {
            vm.mensajero = responde;
            vm.mensajero.cedula = parseInt(vm.mensajero.cedula);
            vm.mensajero.telefonos = parseInt(vm.mensajero.telefonos);
            vm.mensajero.licencia_conducion = parseInt(vm.mensajero.licencia_conducion);
            vm.mensajero.fecha_expedicion_licencia = new Date(vm.mensajero.fecha_expedicion_licencia);
            vm.mensajero.fecha_vencimiento_licencia = new Date(vm.mensajero.fecha_vencimiento_licencia);
            vm.mensajero.fecha_nacimiento = new Date(vm.mensajero.fecha_nacimiento);
        }

        function verMensajero(mensajero) {
            vm.mensajero = mensajero;
            vm.mensajero.cedula = parseInt(vm.mensajero.cedula);
            vm.mensajero.telefonos = parseInt(vm.mensajero.telefonos);
            $('#verMensajero').modal('show');
        }

        function addListaNegra() {
            $('#addListaNegra').modal('show');
        }

        function bloquearMensajero(mensajero) {
            vm.m = mensajero;
            swal({
                title: "ESTAS SEGURO?",
                text: "Estas intentando sancionar al mensajero " + mensajero.nombre + ' ' + mensajero.apellidos,
                type: "info",
                showCancelButton: true,
                cancelButtonText: 'No',
                confirmButtonText: 'Si',
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
            }, function () {
                setTimeout(function () {
                    var mensjaero = Restangular.one('mensajeros/' + vm.m.id + '/condicion');
                    mensjaero.condicion = 'sancionado';
                    mensjaero.put().then(function (response) {
                        console.log(response)
                        swal(response.nombre + ' ' + response.apellidos + ' sancionado correctamente');
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
                text: "Estas intentando quitar la sancion al mensajero " + mensajero.nombre + ' ' + mensajero.apellidos,
                type: "info",
                showCancelButton: true,
                cancelButtonText: 'No',
                confirmButtonText: 'Si',
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
            }, function () {
                setTimeout(function () {
                    var mensjaero = Restangular.one('mensajeros/' + vm.m.id + '/condicion');
                    mensjaero.condicion = 'activo';
                    mensjaero.put().then(function (response) {
                        swal('Sancion quitada correctamente al mensajero ' +response.nombre + ' ' + response.apellidos + ' correctamente');
                        cargarDatosUnMensajero(response)
                        cargarMensajeros();
                        cargarMensajerosActivos();
                    });
                }, 200);
            })
        }

        function newMensajero() {
            vm.mensajero = {};
            $('#newMensajero').modal('show');
            document.getElementById("image").innerHTML = ['<img class="center" id="imagenlogo" style="width:200px; height: 200px; border-radius: 50%; ng-src="http://', vm.mensajero.fotografia, '"  />'].join('');
        }

        function guardarMensajero(){
            gMensajero.post(vm.mensajero).then(function (response) {
                swal('Se guardo correctamente al mensajero '+ response.nombre + ' '+ response.apellidos);
                $('#newMensajero').modal('toggle');
                guardarImagen(response);
                cargarMensajeros();
                if(response.condicion == 'activo'){
                    cargarMensajerosActivos();
                }else{
                    cargarMensajerosBloqueados();
                }
            })
        }

        function guardarImagen(mensajero) {
            console.log(mensajero)
            console.log(vm.fotografia)
            // console.log($scope.fileimage)
            if (vm.fotografia) {
                var data = new FormData();
                data.append('fotografia', vm.fotografia);

                return $http.post(
                    'http://localhost:1337' + '/mensajeros/' + mensajero.id + '/fotografia', data,
                    {
                        transformRequest: angular.identity, headers: {'Content-Type': undefined}
                    }
                );
            }
        }

        cargarMensajeros();
    }
})();