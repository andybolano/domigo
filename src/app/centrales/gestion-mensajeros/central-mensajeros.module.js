/**
 * Created by Jose Soto
 * on 17/05/2016.
 */
(function () {
    'use strict';
    
    angular
        .module('app.central_mensajeros', [])
        .config(config);

    function config($stateProvider) {
        $stateProvider
            .state('app.central-mensajeros', {
                url: '/central/mensajeros',
                templateUrl: 'app/centrales/gestion-mensajeros/central-mensajeros.html',
                data: {
                    onlyAccess: ['EMPRESA']
                },
                controller: 'CentralMensajerosController',
                controllerAs: 'vm'
            })
    }
})();
