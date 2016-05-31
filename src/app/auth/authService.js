/**
 * Created by tav0 on 6/01/16.
 */

(function () {
    'use strict';

    angular
        .module('app.auth')
        .service('authService', authService);

    function authService() {
        this.storeUser = function (jwt, user) {
            sessionStorage.setItem('jwt', jwt);
            var usuario = user;
            sessionStorage.setItem('usuario', JSON.stringify(user));
            return usuario;
        }

        this.currentUser = function () {
            return JSON.parse(sessionStorage.getItem('usuario'));
        }
    }
})();
