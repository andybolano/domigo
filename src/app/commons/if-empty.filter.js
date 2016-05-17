/**
 * Created by tav0 on 13/02/16.
 */

(function() {
    'use strict';

    angular
        .module('commons')
        .filter('ifEmpty', function () {
            return function (input, defaultValue) {
                if (angular.isUndefined(input) || input === null || input === '') {
                    return defaultValue;
                }

                return input;
            };
        });
})();