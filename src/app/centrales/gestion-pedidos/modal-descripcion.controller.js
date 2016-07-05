/**
 * Created by Jose Soto
 * on 5/07/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.central_pedidos')
        .controller('modalDescripcionController', modalDescripcionController);

    function modalDescripcionController($uibModalInstance, $scope, descripcion) {
        // variables
        $scope.descripcion = descripcion;

        $scope.ok = function() {
            // modalFactory.open('lg', 'result.html', {searchTerm: $scope.searchTerm});
            $uibModalInstance.close($scope.descripcion);
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }

})();