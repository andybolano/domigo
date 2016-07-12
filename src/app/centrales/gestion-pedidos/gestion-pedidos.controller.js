/**
 * Created by Jose Soto
 * on 9/06/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.central_pedidos')
        .controller('CentralPedidosController', CentralPedidosController);

    function CentralPedidosController(Restangular, SocketcSailsService, authService, $scope, $uibModal) {
        SocketcSailsService.suscribe(authService.currentUser().empresa.id);
        // variables privadas
        var vm = this;
        vm.newPedidoManual = newPedidoManual;
        vm.selectPedido = selectPedido;
        vm.selectMensajero = selectMensajero;
        vm.cargarDireccionesOrigen = cargarDireccionesOrigen;
        vm.cargarDireccionesDestino = cargarDireccionesDestino;
        vm.guardarPedido = guardarPedido;
        vm.removePedido = removePedido;
        vm.modalDescripcion = modalDescripcion;
        // variables publicas
        vm.dorigens = [];
        vm.ddestinos = [];
        vm.pedido = {};
        vm.mensajerosS = [];
        vm.clientes = JSON.parse(sessionStorage.getItem('pedidos')) || [];

        io.socket.on('newCall', function (msg) {
            $scope.$apply(function () {
                msg.cliente.telefono = parseInt(msg.cliente.telefono)
                vm.clientes.push(msg);
                sessionStorage.setItem('pedidos', JSON.stringify(vm.clientes));
            });
        });

        function selectPedido(pedido) {
            vm.selectedPedido = pedido;
        }

        function modalDescripcion() {

            $('#modalDescripcion').modal('show');
        }

        function selectMensajero(mensajero) {
            vm.selectedMensajero = mensajero;
            vm.selectedCantidadMensajeros(vm.selectedMensajero)
        }

        function cargarDireccionesOrigen(cliente_id, tipo) {
            io.socket.request({
                method: 'get',
                url: '/clientes/' + cliente_id + '/direcciones_frecuentes?direccion=' + tipo,
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
                }
            }, function (response) {
                vm.dorigens = response.data;
            });
        }

        function cargarDireccionesDestino(cliente_id, tipo) {
            io.socket.request({
                method: 'get',
                url: '/clientes/' + cliente_id + '/direcciones_frecuentes?direccion=' + tipo,
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
                }
            }, function (response) {
                vm.ddestinos = response.data;
            });
        }

        function cargarMensajerosDisponibles() {
            vm.mensajeros = [];
            var campos = 'condicion,nombre,apellidos,telefonos,cedula,id';
            Restangular.service('mensajeros?fields=' + campos, Restangular.one('empresas', authService.currentUser().empresa.id)).getList({
                condicion: 'activo',
                estado: 1
            }).then(function (response) {
                vm.mensajeros = response;
            });
        }

        function cargarMensajerosOcupados() {
            vm.mensajerosOcupados = [];
            var campos = 'condicion,nombre,apellidos,telefonos,cedula,id';
            Restangular.service('mensajeros?fields=' + campos, Restangular.one('empresas', authService.currentUser().empresa.id)).getList({
                condicion: 'activo',
                estado: 0
            }).then(function (response) {
                vm.mensajerosOcupados = response;
            });
        }

        vm.selectedCantidadMensajeros = function (mensajero) {
            vm.mensajerosS.push(mensajero.id);
            console.log(vm.mensajerosS)
        }

        function guardarPedido(index) {
            if (vm.selectedMensajero && vm.selectedPedido && vm.mensajerosS.length > 0) {
                var pedido = vm.clientes[index];
                pedido.mensajeros = vm.mensajerosS;
                pedido.empresa = authService.currentUser().empresa.id;
                if(pedido.cliente.tipo == 'empresa' || pedido.cliente.tipo == 'particular'){
                    io.socket.request({
                        method: 'post',
                        url: '/domicilios',
                        data: pedido,
                        headers: {
                            'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
                        }
                    }, function (response) {
                        vm.selectedMensajero = {};
                        vm.mensajerosS = [];
                        swal('Se registro el pedido correctamente')
                        vm.clientes.splice(index, 1);
                        sessionStorage.setItem('pedidos', JSON.stringify(vm.clientes));
                        setTimeout(cargarMensajerosDisponibles(),2000);
                        setTimeout(cargarMensajerosOcupados(),2000);

                    });
                }else{
                    swal('No has seleccionado el tipo de cliente Empresa/Particular')
                }
            } else {
                swal('No ha seleccionado ninguna mensajero para registrar el pedido')
            }
        }

        vm.selectedColorTipoIconoParticular = function ($index) {
            if (vm.clientes[$index].cliente.tipo == 'particular') {
                return {
                    'color': '#64dd17',
                }
            } else {
                return {
                    'color': '#b71c1c'
                }
            }
        };

        vm.selectedColorTipoIconoEmpresa = function ($index) {
            if (vm.clientes[$index].cliente.tipo == 'empresa') {
                return {
                    'color': '#64dd17',
                }
            } else {
                return {
                    'color': '#b71c1c'
                }
            }
        }

        vm.selectedColorTipoBotonParticular = function ($index) {
            if (vm.clientes[$index].cliente.tipo == 'particular') {
                return {
                    'border': '3px solid #64dd17'
                }
            } else {
                return {
                    'border': '3px solid #b71c1c'
                }
            }
        }

        vm.selectedColorTipoBotonEmpresa = function ($index) {
            if (vm.clientes[$index].cliente.tipo == 'empresa') {
                return {
                    'border': '3px solid #64dd17'
                }
            } else {
                return {
                    'border': '3px solid #b71c1c'
                }
            }
        }

        function removePedido(index) {
            var pedido = vm.clientes[index];
            swal({
                title: "Estas seguro?",
                text: "Estas intentando eliminar un pedido!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                cancelButtonText: "No",
                confirmButtonText: "Si",
                closeOnConfirm: false
            }, function () {
                vm.clientes.splice(index, 1);
                sessionStorage.setItem('pedidos', JSON.stringify(vm.clientes));
                swal("Eliminado!", "Has eliminado el pedido correctamente.", "success");
            });
        };

        vm.agregarDescripcion = function ($index) {
            vm.pedido = vm.clientes[$index];
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'modal-descripcion.html',
                controller: 'modalDescripcionController',
                resolve: {
                    descripcion: function () {
                        return $scope.descripcion;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                vm.pedido.descripcion = selectedItem
                vm.clientes.slice(vm.pedido, 1);
                sessionStorage.setItem('pedidos', JSON.stringify(vm.clientes));
            }, function () {
               console.log('Modal dismissed at: ' + new Date());
            });
        }

        vm.changeTipoCliente = function (tipo, $index) {
            if(tipo == 'empresa'){
                vm.clientes[$index].cliente.tipo = tipo;
                sessionStorage.setItem('pedidos', JSON.stringify(vm.clientes));
            }else if(tipo == 'particular'){
                vm.clientes[$index].cliente.tipo = tipo;
                sessionStorage.setItem('pedidos', JSON.stringify(vm.clientes));
            }
        };

        vm.colocarDisponible = function (mensajero) {
            vm.m = mensajero;
            swal({
                title: "ESTAS SEGURO?",
                text: "Estas intentando colocar disponible al mensajero " + mensajero.nombre + ' ' + mensajero.apellidos,
                showCancelButton: true,
                closeOnConfirm: false,
                cancelButtonText: 'No',
                confirmButtonText: 'Si',
                animation: "slide-from-top",
            }, function () {
                var mensjaero = Restangular.one('mensajeros/' + vm.m.id + '/estado');
                mensjaero.estado = 1;
                mensjaero.put().then(function (response) {
                    cargarMensajerosDisponibles();
                    cargarMensajerosOcupados();
                    swal('Se coloco disponible al mensajero')
                });
            });
        }

        function newPedidoManual() {
            var item = {
                cliente : {
                    tipo : '',
                    telefono : '',
                    direccion : '',
                    nombre: ''
                },
                direccion_origen : '',
                direccion_destino: '',
                tipo : '',
                descripcion: ''
            }
            vm.clientes.push(item)
        }

        cargarMensajerosDisponibles();
        cargarMensajerosOcupados();
    }
})();
