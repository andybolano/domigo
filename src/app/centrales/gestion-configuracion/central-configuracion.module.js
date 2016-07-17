/**
 * Created by Jose Soto
 * on 17/05/2016.
 */
(function () {
    'use strict';
    
    angular
        .module('app.central_configuracion', [])
        .config(config)
        .run(run);

    function config($stateProvider) {
        $stateProvider
            .state('app.central-configuracion', {
                url: '/central/configuracion',
                templateUrl: 'app/centrales/gestion-configuracion/central-configuracion.html',
                data: {
                    onlyAccess: 'EMPRESA'
                },
                controller: 'CentralConfiguracionController',
                controllerAs: 'vm'
            })
            
    }

    function run(appMenu) {
        appMenu.addTo([
            {nombre: 'Configuracion', link: 'app.central-configuracion', icon: 'fa fa-cogs'},
        ], 'EMPRESA');
    }
})();

