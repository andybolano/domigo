/**
 * Created by Jose Soto
 * on 15/05/2016.
 */
(function () {
    'use strict';

    angular
        .module('domigo')
        .controller('LayoutController', LayoutController);


    function LayoutController($state, authService) {
        var vm = this;
        vm.hoy = new Date;
        vm.user = authService.currentUser();
        vm.cerrarSesion = cerrarSesion;

        function cerrarSesion() {
            sessionStorage.clear();
            $state.go('login');
        };

    }

})();