/**
 * Created by tav0 on 6/01/16.
 */
(function () {
    'use strict';

    angular.module('app.auth')
        .controller('LoginController', LoginController);

    function LoginController(authService, $state) {
        var vm = this;

        vm.usuario = {};
        vm.mensajeError = '';

        vm.iniciarSesion = iniciarSesion;

        if (authService.currentUser()) redirect(authService.currentUser().rol);

        function iniciarSesion() {
            $state.go('app.admin-centrales');
            // vm.mensajeError = '';
            // // document.getElementById("loading").style.display = "block";
            // // document.getElementById("btn-inicio").disabled = true;
            // authService.login(vm.usuario).then(success, error);
            // function success(p) {
            //     // document.getElementById("loading").style.display = "none";
            //     // document.getElementById("btn-inicio").disabled = false;
            //     var usuario = authService.storeUser(p.data.token);
            // }
            //
            // function error(error) {
            //     // document.getElementById("loading").style.display = "none";
            //     // document.getElementById("btn-inicio").disabled = false;
            //     $log('Error en Login');
            //     vm.mensajeError = error.status == 401 ? error.data.mensajeError : 'A ocurrido un erro inesperado';
            // }
        }
    }
})();
