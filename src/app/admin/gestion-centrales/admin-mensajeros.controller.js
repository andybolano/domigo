/**
 * Created by Jose Soto
 * on 17/05/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.admin_centrales')
        .controller('AdminMensajerosController', AdminMensajerosController)

    function AdminMensajerosController() {
        var vm = this;
        vm.newMensajero = newMensajero;

        function newMensajero() {
            $('#newMensajero').modal('show');
        }
    }
})();
