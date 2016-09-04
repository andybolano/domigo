/**
 * Created by Jose Soto on 04/09/16.
 */
(function() {
    'use strict';

    angular
        .module('commons')
        .directive('stopPropagation', function () {
            return {
                restrict: 'A',
                link: function (scope, element) {
                    element.bind('click', function (e) {
                        return false;
                    });
                }
            };
        });
})();