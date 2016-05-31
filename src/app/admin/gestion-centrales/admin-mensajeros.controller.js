/**
 * Created by Jose Soto
 * on 17/05/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.admin_centrales')
        .controller('AdminMensajerosController', AdminMensajerosController)

    function AdminMensajerosController($stateParams, DTOptionsBuilder, Restangular) {
        var vm = this;
        vm.newMensajero = newMensajero;
        vm.verMensajero = verMensajero;
        vm.mensajeros = [];
        vm.mensajerosActivos = 0;
        vm.mensajerosInactivos = 0;
        vm.nombreEmpresa = $stateParams.nombre;
        vm.dtOptions = DTOptionsBuilder
            .fromSource()
            .withLanguage({
                "sEmptyTable": "No hay mensajeros registrados en esta empresa",
                "sInfo": "Mostrando _START_ a _END_ de _TOTAL_ registros",
                "sInfoEmpty": "Mostrando 0 a 0 de 0 registros",
                "sInfoFiltered": "(filtrado desde _MAX_ registros)",
                "sInfoPostFix": "",
                "sInfoThousands": ",",
                "sLengthMenu": "Mostrar _MENU_ registros",
                "sLoadingRecords": "Cargando...",
                "sProcessing": "Procesando...",
                "sSearch": "Buscar:",
                "sZeroRecords": "No se encontraron registros que coincidar con la busqueda",
                "oPaginate": {
                    "sFirst": "Primero",
                    "sLast": "Último",
                    "sNext": "Siguiente",
                    "sPrevious": "Anterior"
                },
                "oAria": {
                    "sSortAscending": ": activar para ordenar las columnas ascendente",
                    "sSortDescending": ": activar para ordenar las columnas descendente"
                }
            })
            // Add Bootstrap compatibility
            .withBootstrap();

        cargarMensajeros();
        function cargarMensajeros() {
            vm.mensajeros = [];
            var campos = 'all';
            Restangular.all('/empresas/'+$stateParams.id+'/mensajeros?fields='+campos).getList().then(function (mensajeos) {
                vm.mensajeros = mensajeos;
                angular.forEach(mensajeos, function (m) {
                    if(m.activo == true){
                        vm.mensajerosActivos++;
                    }else{
                        vm.mensajerosInactivos++;
                    }
                })
            })
        }

        function verMensajero(mensajero) {
            vm.mensajero = mensajero;
            $('#newMensajero').modal('show');
        }
    }
})();
