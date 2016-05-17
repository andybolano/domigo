/**
 * Created by tav0 on 13/02/16.
 */

(function() {
    'use strict';

    angular
        .module('commons')
        .filter('esdate', fechaEs);

    function fechaEs(){
        return function (date, format) {
            var meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
            var diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
            if(format == 'full') {
                return diasSemana[date.getDay()] + ", " + date.getDate() + " de " + meses[date.getMonth()] + " de " + date.getFullYear();
            }
            if(format == 'short') {
                return date.getDate() + " de " + meses[date.getMonth()];
            }
        };
    }
})();