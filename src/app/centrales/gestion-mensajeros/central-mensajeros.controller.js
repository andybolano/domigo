/**
 * Created by Jose Soto
 * on 17/05/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.central_mensajeros')
        .controller('CentralMensajerosController', CentralMensajerosController);

    function CentralMensajerosController(Restangular, authService, $http, API) {
        // variables privadas
        var vm = this;
        var gMensajero = Restangular.all('/empresas/' + authService.currentUser().empresa.id + '/mensajeros')
        vm.variableActivos = true;
        vm.variableBloqueados = false;
        vm.fotografia = '';
        vm.editMode = true;

        // funciones publicas
        vm.cargarMensajeros = cargarMensajeros;
        vm.cargarMensajerosActivos = cargarMensajerosActivos;
        vm.cargarMensajerosBloqueados = cargarMensajerosBloqueados;
        vm.cargarMensajerosAusentes = cargarMensajerosAusentes;

        vm.verMensajero = verMensajero;
        vm.verMmensajero = verMmensajero;
        vm.addListaNegra = addListaNegra;
        vm.bloquearMensajero = bloquearMensajero;
        vm.desbloquearMensajero = desbloquearMensajero;
        vm.newMensajero = newMensajero;
        vm.guardarMensajero = guardarMensajero;
        vm.modificarMensajero = modificarMensajero;

        if (vm.variableActivos == true) {
            cargarMensajerosActivos();
        }

        function cargarMensajeros() {
            vm.mensajerosActivos = 0;
            vm.mensajerosBloqueados = 0;
            vm.mensajerosAusentes = 0;
            var campos = 'condicion';
            Restangular.service('mensajeros?fields=' + campos, Restangular.one('empresas', authService.currentUser().empresa.id)).getList().then(function (response) {
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
            // var campos = 'enlista_negra,n_domicilios_exitosos,n_domicilios_rechazados,fotografia,condicion,direccion,nombre,apellidos,telefonos,email,vehiculo,cedula,id';
            var campos = 'all';
            Restangular.service('mensajeros?fields=' + campos, Restangular.one('empresas', authService.currentUser().empresa.id)).getList({condicion: 'activo'}).then(function (response) {
                vm.mensajeros = response;
            });
        }

        function cargarMensajerosBloqueados() {
            vm.texto = 'Mensajeros Sancionados';
            vm.mensajeros = [];
            var campos = 'all';
            // var campos = 'enlista_negra,n_domicilios_exitosos,n_domicilios_rechazados,fotografia,condicion,direccion,nombre,apellidos,telefonos,email,vehiculo,cedula,id';
            Restangular.service('mensajeros?fields=' + campos, Restangular.one('empresas', authService.currentUser().empresa.id)).getList({condicion: 'sancionado'}).then(function (response) {
                vm.mensajeros = response;
            });
        }

        function cargarMensajerosAusentes() {
            vm.texto = 'Mensajeros Ausentes';
            vm.mensajeros = [];
            var campos = 'all';
            // var campos = 'enlista_negra,n_domicilios_exitosos,n_domicilios_rechazados,fotografia,condicion,direccion,nombre,apellidos,telefonos,email,vehiculo,cedula,id';
            Restangular.service('mensajeros?fields=' + campos, Restangular.one('empresas', authService.currentUser().empresa.id)).getList({condicion: 'ausente'}).then(function (response) {
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
            Restangular.service('domicilios', Restangular.one('mensajeros',responde.id)).getList().then(function (response) {
                vm.domicilios = response;
            });

        }

        function verMensajero(mensajero) {
            vm.mensajero = mensajero;
            vm.mensajero.cedula = parseInt(vm.mensajero.cedula);
            vm.mensajero.telefonos = parseInt(vm.mensajero.telefonos);
            vm.mensajero.licencia_conducion = parseInt(vm.mensajero.licencia_conducion);
            vm.mensajero.fecha_expedicion_licencia = new Date(vm.mensajero.fecha_expedicion_licencia);
            vm.mensajero.fecha_vencimiento_licencia = new Date(vm.mensajero.fecha_vencimiento_licencia);
            vm.mensajero.fecha_nacimiento = new Date(vm.mensajero.fecha_nacimiento);
            Restangular.service('domicilios', Restangular.one('mensajeros',mensajero.id)).getList().then(function (response) {
                vm.domicilios = response;
            });
            $('#verMensajero').modal('show');
        }

        function addListaNegra(mensajero) {
            vm.m = mensajero;
            swal({
                title: "ESTAS SEGURO?",
                text: "Estas intentando agregar a la lista negra, al mensajero " + mensajero.nombre + ' ' + mensajero.apellidos,
                type: "input",
                showCancelButton: true,
                closeOnConfirm: false,
                animation: "slide-from-top",
                inputPlaceholder: "Escribe aca la causa de sancion"
            }, function (inputValue) {
                if (inputValue === false) return false;
                if (inputValue === "") {
                    swal.showInputError("No has escrito nada en el campo!");
                    return false
                }
                var listaNegra = Restangular.all('lista_negra');
                var obj = {
                    id: vm.m.id,
                    razon: inputValue
                }
                listaNegra.post(obj).then(function (response) {
                    $('#verMensajero').modal('toggle');
                    // cargarDatosUnMensajero(response)
                    cargarMensajeros();
                    cargarMensajerosBloqueados();
                    swal('Sancionado correctamente');
                })
            });
        }

        function bloquearMensajero(mensajero) {
            vm.m = mensajero;
            swal({
                title: "ESTAS SEGURO?",
                text: "Estas intentando sancionar al mensajero " + mensajero.nombre + ' ' + mensajero.apellidos,
                type: "input",
                showCancelButton: true,
                closeOnConfirm: false,
                animation: "slide-from-top",
                inputPlaceholder: "Escribe aca la causa de sancion"
            }, function (inputValue) {
                if (inputValue === false) return false;
                if (inputValue === "") {
                    swal.showInputError("No has escrito nada en el campo!");
                    return false
                }
                var mensjaero = Restangular.one('mensajeros/' + vm.m.id + '/condicion');
                mensjaero.condicion = 'sancionado';
                mensjaero.razon = inputValue;
                mensjaero.put().then(function (response) {
                    $('#verMensajero').modal('toggle');
                    // swal(response.nombre + ' ' + response.apellidos + ' sancionado correctamente');
                    swal('Sancionado correctamente');
                    // cargarDatosUnMensajero(response)
                    cargarMensajeros();
                    cargarMensajerosBloqueados();
                });
            });
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
                        // swal('Sancion quitada correctamente al mensajero ' +response.nombre + ' ' + response.apellidos + ' correctamente');
                        $('#verMensajero').modal('toggle');
                        swal('Sancion quitada correctamente al mensajero ');
                        // cargarDatosUnMensajero(response)
                        cargarMensajeros();
                        cargarMensajerosActivos();
                    });
                }, 200);
            })
        }

        function newMensajero() {
            vm.editMode = true;
            vm.mensajero = {};
            $('#newMensajero').modal('show');
            document.getElementById("image").innerHTML = ['<img class="center" id="imagenlogo" style="width:200px; height: 200px; border-radius: 50%; ng-src="http://api.domigo.co/images/mensajeros/', vm.mensajero.fotografia, '"  />'].join('');
        }

        function verMmensajero(mensajero){
            vm.mensajero = mensajero;
            vm.mensajero.cedula = parseInt(vm.mensajero.cedula);
            vm.mensajero.telefonos = parseInt(vm.mensajero.telefonos);
            vm.mensajero.licencia_conducion = parseInt(vm.mensajero.licencia_conducion);
            vm.mensajero.fecha_expedicion_licencia = new Date(vm.mensajero.fecha_expedicion_licencia);
            vm.mensajero.fecha_vencimiento_licencia = new Date(vm.mensajero.fecha_vencimiento_licencia);
            vm.mensajero.fecha_nacimiento = new Date(vm.mensajero.fecha_nacimiento);
            vm.editMode = false;
            document.getElementById("image").innerHTML = ['<img class="center" id="imagenlogo" style="width:200px; height: 200px; border-radius: 50%; ng-src="http://api.domigo.co/images/mensajeros/', vm.mensajero.fotografia, '"  />'].join('');
            $('#newMensajero').modal('show');
        }

        function modificarMensajero() {
            var mensajero = Restangular.one('mensajeros', vm.mensajero.id);
            mensajero.cedula = vm.mensajero.cedula;
            mensajero.nombre = vm.mensajero.nombre;
            mensajero.apellidos = vm.mensajero.apellidos;
            mensajero.fecha_nacimiento = vm.mensajero.fecha_nacimiento;
            mensajero.sexo = vm.mensajero.sexo;
            mensajero.direccion = vm.mensajero.direccion;
            mensajero.barrio = vm.mensajero.barrio;
            mensajero.telefonos = vm.mensajero.telefonos;
            mensajero.ciudad = vm.mensajero.ciudad;
            mensajero.email = vm.mensajero.email;
            mensajero.vehiculo = vm.mensajero.vehiculo;
            mensajero.licencia_conduccion = vm.mensajero.licencia_conduccion;
            mensajero.licencia_tipo = vm.mensajero.licencia_tipo;
            mensajero.fecha_expedicion_licencia = vm.mensajero.fecha_expedicion_licencia;
            mensajero.fecha_vencimiento_licencia = vm.mensajero.fecha_vencimiento_licencia;
            mensajero.put().then(function (response) {
                guardarImagen(response);
                swal('Actualizado correctamente')
                cargarMensajeros();
                if (response.condicion == 'activo') {
                    cargarMensajerosActivos();
                } else {
                    cargarMensajerosBloqueados();
                }
                $('#newMensajero').modal('hide');
            })
        }

        function guardarMensajero() {
            gMensajero.post(vm.mensajero).then(function (response) {
                swal('Se guardo correctamente al mensajero ' + response.nombre + ' ' + response.apellidos);
                $('#newMensajero').modal('toggle');
                guardarImagen(response);
                cargarMensajeros();
                if (response.condicion == 'activo') {
                    cargarMensajerosActivos();
                } else {
                    cargarMensajerosBloqueados();
                }
            })
        }

        function guardarImagen(mensajero) {
            if (vm.fotografia) {
                var data = new FormData();
                data.append('fotografia', vm.fotografia);

                return $http.post(
                    API + '/mensajeros/' + mensajero.id + '/fotografia', data,
                    {
                        transformRequest: angular.identity, headers: {'Content-Type': undefined}
                    }
                );
            }
        }

        cargarMensajeros();
    }
})();