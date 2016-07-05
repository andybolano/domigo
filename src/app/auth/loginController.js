/**
 * Created by tav0 on 6/01/16.
 */
(function () {
    'use strict';

    angular.module('app.auth')
        .controller('LoginController', LoginController);

    function LoginController(authService, $state, Restangular) {
        var vm = this;
        var login = Restangular.all('/usuario/token');

        vm.usuario = {};
        vm.mensajeError = '';

        vm.iniciarSesion = iniciarSesion;

        if (authService.currentUser()) redirect(authService.currentUser().rol);

        function iniciarSesion() {
            // $state.go('app.admin-centrales');
            // // document.getElementById("loading").style.display = "block";
            // // document.getElementById("btn-inicio").disabled = true;
            vm.mensajeError = '';
            login.post(vm.usuario).then(success, error);
            function success(p) {
                // document.getElementById("loading").style.display = "none";
                // document.getElementById("btn-inicio").disabled = false;
                var usuario = authService.storeUser(p.token, p.user);
            redirect(usuario.rol);
            }

            function error(error) {
                vm.mensajeError = '';
                if(error.status == 401 && error.data.code == 'E_USER_NOT_FOUND'){
                    vm.mensajeError = 'Usuario y/o contraseña incorrectas, intentalo de nuevo';
                }
                if(error.status == 401 && error.data.code == 'E_INACTIVE'){
                    swal('Tu usuario ha sido desactivado, contacta a soporte para volver a activarl0')
                }
                // console.log(error)
                // document.getElementById("loading").style.display = "none";
                // document.getElementById("btn-inicio").disabled = false;
                // vm.mensajeError = error.status == 401 ? 'Usuario y/o contraseña incorrectas, intentalo de nuevo' : 'Ha ocurrido un error inesperado';
            }
        }

        function redirect(rol) {

            if (rol == 'SUPER_ADM') {
                $state.go('app.admin-centrales');
            } else if (rol == 'EMPRESA') {
                $state.go('app.gestion-pedidos');
            }else if(rol == 'MENSAJERO'){
                vm.mensajeError = 'Este usuario no tiene autorizacion para acceder al sistema del administrador, por favor comuniquese con soporte';
            }
        }
    }
})();
