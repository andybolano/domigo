/**
 * Created by Jose Soto
 * on 9/06/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.central_pedidos')
        .controller('CentralPedidosController', CentralPedidosController);

    function CentralPedidosController(Restangular, SocketcSailsService, authService, $scope) {
        SocketcSailsService.suscribe(authService.currentUser().empresa.id);
        // variables privadas
        var vm = this;
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

        function modalDescripcion(){
           
             $('#modalDescripcion').modal('show');
        }

        function selectMensajero(mensajero) {
            vm.selectedMensajero = mensajero;
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

        function cargarMensajeros() {
            vm.mensajeros = [];
            var campos = 'condicion,nombre,apellidos,telefonos,cedula,id';
            Restangular.service('mensajeros?fields=' + campos, Restangular.one('empresas', authService.currentUser().empresa.id)).getList({
                condicion: 'activo',
                estado: 1
            }).then(function (response) {
                vm.mensajeros = response;
            });
        }

        function guardarPedido(index) {
            if (vm.selectedMensajero && vm.selectedPedido) {
                var pedido = vm.clientes[index];
                vm.pedido.mensajero = vm.selectedMensajero.id;
                vm.pedido.empresa = authService.currentUser().empresa.id;
                io.socket.request({
                    method: 'post',
                    url: '/mensajeros/' + vm.selectedMensajero.id + '/domicilios',
                    data: pedido,
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
                    }
                }, function (response) {
                    cargarMensajeros();
                    vm.clientes.splice(index, 1);
                    sessionStorage.setItem('pedidos', JSON.stringify(vm.clientes));
                    swal('Se registro el pedido correctamente')
                });
            } else {
                swal('No ha seleccionado ninguna mensajero para registrar el pedido')
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

        }

        cargarMensajeros();
    }
})();
