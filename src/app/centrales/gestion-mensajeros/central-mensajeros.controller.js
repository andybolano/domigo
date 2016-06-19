/**
 * Created by Jose Soto
 * on 17/05/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.central_mensajeros')
        .controller('CentralMensajerosController', CentralMensajerosController);

    function CentralMensajerosController() {

 	var vm = this;
 	 vm.verMensajero = verMensajero;
 	 vm.addListaNegra = addListaNegra;

    	function verMensajero(mensajero) {
            $('#verMensajero').modal('show');
        }

        function addListaNegra() {
            $('#addListaNegra').modal('show');
        }

    }
})();