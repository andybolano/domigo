(function () {
    'use strict';

    angular
        .module('app.admin_centrales')
        .controller('AdminCentralesController', AdminCentralesController)


    function AdminCentralesController(DTOptionsBuilder, Restangular) {
        var vm = this;
        var empresas = Restangular.all('/empresas');
        vm.empresas = [];
        vm.empresa = {};
        vm.empresasActivas = 0;
        vm.empresasInactivas = 0;
        vm.mensajerosActivos = 0;
        vm.mensajerosInactivos = 0;
        vm.editMode = true;

        vm.verEmpresa = verEmpresa;
        vm.nuevaEmpresa = nuevaEmpresa;
        vm.registrarEmpresa = registrarEmpresa;

        vm.dtOptions = DTOptionsBuilder
            .fromSource()
            .withLanguage({
                "sEmptyTable": "No hay empresas registradas",
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
        cargarEmpresas();
        function cargarEmpresas() {
            limpiar();
            var campos = 'nit,nombre,telefonos,direccion,ciudad,n_mensajeros,barrio,horario,activa'
            Restangular.all('/empresas?fields='+campos).getList().then(function (empresas) {
                vm.empresas = empresas;
                angular.forEach(empresas, function (e) {
                    if(e.activa == true){
                        vm.empresasActivas++;
                    }else{
                        vm.empresasInactivas++;
                    }
                    vm.mensajeros += e.n_mensajeros;
                })
            })
        }

        function verEmpresa(empresa) {
            vm.empresa = empresa;
            vm.editMode = false;
            $('#newEmpresa').modal('show');
        }
        function nuevaEmpresa() {
            vm.editMode = true;
            vm.empresa = {};
            $('#newEmpresa').modal('show');
        }

        function registrarEmpresa() {
            empresas.post(vm.empresa).then(function (d) {
                cargarEmpresas();
                $('#newEmpresa').modal('hide');
            }, function (error) {
                var mensajeError = error.status == 401 ? error.data.mensajeError : 'A ocurrido un error inesperado';
            })
        }

        function limpiar() {
            vm.empresas = [];
            vm.empresa = {};
        }
    }
})();