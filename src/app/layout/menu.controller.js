(function () {
    'use strict';

    angular
        .module('domigo')
        .controller('MenuCtrl', MenuCtrl);

    function MenuCtrl(appMenu, authService) {
        var vm = this;
        vm.user = authService.currentUser();
        if (vm.user) {
            vm.menu = appMenu.getOf(vm.user.rol);
        }
    }
})();


