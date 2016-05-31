/**
 * Created by Jose Soto
 * on 15/05/2016.
 */
(function () {
    'use strict';

    angular
        .module('domigo')
        .controller('LayoutController', LayoutController);

    function LayoutController($state) {
        var vm = this;
        vm.hoy = new Date;

        vm.cerrarSesion = cerrarSesion;

        function cerrarSesion() {
            sessionStorage.clear();
            $state.go('login');
        };

    }

})();