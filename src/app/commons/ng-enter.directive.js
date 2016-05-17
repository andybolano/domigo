/**
 * Created by tav0 on 13/02/16.
 */
(function() {
    'use strict';

    angular
        .module('commons')
        .directive('ngEnter', function () {
            return function (scope, elements, attrs) {
                elements.bind('keydown keypress', function (event) {
                    if (event.which === 13) {
                        scope.$apply(function () {
                            scope.$eval(attrs.ngEnter);
                        });
                        event.preventDefault();
                    }
                });
            };
        });
})();