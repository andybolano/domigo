/**
 * Created by tav0 XD
 * on 22/05/2016.
 */

(function() {
    'use strict';

    angular
        .module('domigo')
        .config(httpConfig);

    /* @ngInject */
    function httpConfig(RestangularProvider) {
        // config restangular
        RestangularProvider.setBaseUrl('http://localhost:1337');
        RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
            var extractedData;
            // .. to look for getList operations
            extractedData = data.data;
            return extractedData;
        });
    }
})();
