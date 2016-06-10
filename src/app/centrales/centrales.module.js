/**
 * Created by Jose Soto
 * on 17/05/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.central', [
            'app.central_mensajeros',
            'app.central_pedidos',
            'app.central_pagos'
        ]);
})();
