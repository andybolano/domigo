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
        SocketcSailsService.suscribe(authService.currentUser().id);
        // variables privadas
        var vm = this;
        vm.selectPedido = selectPedido;
        vm.selectMensajero = selectMensajero;
        vm.cargarDirecciones = cargarDirecciones;
        vm.guardarPedido = guardarPedido;

        // variables publicas
        vm.pedidos = [];
        vm.pedido = {};

        io.socket.on('newCall', function (msg) {
            $scope.$apply(function () {
                if (JSON.parse(sessionStorage.getItem('pedidos'))) {
                    msg.id_pedido += 1;
                    vm.pedidos.push(msg);
                    sessionStorage.setItem('pedidos', JSON.stringify(vm.pedidos));
                    vm.pedidos = JSON.parse(sessionStorage.getItem('pedidos'));
                } else {
                    msg.id_pedido = 1;
                    sessionStorage.setItem('pedidos', JSON.stringify(vm.pedidos));
                    vm.pedidos = JSON.parse(sessionStorage.getItem('pedidos'));
                }
            });
        });

        function selectPedido(pedido) {
            vm.selectedPedido = pedido;
        }

        function selectMensajero(mensajero) {
            vm.selectedMensajero = mensajero;
        }

        function cargarDirecciones(tipo) {
            var data = 'c';
            io.socket.request({
                method: 'get',
                url: '/clientes/' + vm.selectedPedido.id + '/direcciones_frecuentes/' + data + '?direccion=' + tipo,
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
                }
            }, function (response) {
                vm.dorigens = response;
                console.log(response)
            });
        }

        function cargarMensajeros() {
            vm.mensajeros = [];
            var campos = 'condicion,nombre,apellidos,telefonos,cedula,id';
            Restangular.service('mensajeros?fields=' + campos, Restangular.one('empresas', authService.currentUser().id)).getList({condicion: 'activo'}).then(function (response) {
                vm.mensajeros = response;
            });
        }

        function guardarPedido() {
            if (vm.selectedMensajero && vm.selectedPedido) {
                vm.pedido.mensajero = vm.selectedMensajero.id;
                vm.pedido.cliente = vm.selectedPedido.id;
                vm.pedido.empresa = authService.currentUser().id;
                io.socket.request({
                    method: 'post',
                    url: '/mensajeros/' + vm.selectedMensajero.id + '/domicilios',
                    data: vm.pedido,
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
                    }
                }, function (response) {
                    swal('Aceptada la solicitud correctamente');
                    console.log(response)
                });
            } else {
                swal('No ha seleccionado ninguna solicitud/mensajero para registrar el pedido')
            }
        }

        cargarMensajeros();
    }
})();
