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
                // document.getElementById("loading").style.display = "none";
                // document.getElementById("btn-inicio").disabled = false;
                vm.mensajeError = error.status == 401 ? 'Uusuario y/o contraseña incorrectas, intentalo de nuevo' : 'Ha ocurrido un error inesperado';
            }
        }

        function redirect(rol) {

            if (rol.nombre == 'SUPER_ADM') {
                $state.go('app.admin-centrales');
            } else if (rol.nombre == 'EMPRESA') {
                $state.go('app.empresas');
            }
        }
    }
})();
