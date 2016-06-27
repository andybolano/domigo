(function () {
    'use strict';

    angular
        .module('domigo')
        .run(runBlock);

    /** @ngInject */
    function runBlock($rootScope, $state, jwtHelper, authService) {
        $rootScope.$on('$stateChangeStart', function(e, to) {
            if (!to.data || !to.data.noRequiresLogin) {
                var jwt = sessionStorage.getItem('jwt');
                if (!jwt || jwtHelper.isTokenExpired(jwt)) {
                    e.preventDefault();
                    // console.log('token expired');
                    $state.go('login');
                }else if(to.data && to.data.onlyAccess){
                    var user = authService.currentUser();
                    // console.log('o: '+window.location.hash+'|d: '+to.url+'user_rol: '+user.rol);
                    if (!(!to.data.onlyAccess || to.data.onlyAccess == user.rol || to.data.onlyAccess == 'all')) {
                        e.preventDefault();
                        // console.log('token expired');
                        $state.go('login');
                    }
                }
            }
        });
    }

})();
