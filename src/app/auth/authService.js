/**
 * Created by tav0 on 6/01/16.
 */

(function() {
    'use strict';

    angular
        .module('app.auth')
        .service('authService', authService);

    function authService($http, jwtHelper, API){
        this.login = function (usuario){
            return $http.post(API+'/login', usuario);
        };

        this.updatePassword = function (usuario, contrasenas){
            return $http.post(
                API+'/usuarios/'+usuario.id+'/change_pass',
                contrasenas,
                {headers:  {'Authorization': 'Bearer '+sessionStorage.getItem('jwt')}}
            );
        };

        this.storeUser = function (jwt) {
            sessionStorage.setItem('jwt', jwt);
            var usuario = jwtHelper.decodeToken(jwt).usuario;
            sessionStorage.setItem('usuario',JSON.stringify(usuario));
            return usuario;
        }

        this.currentUser = function(){
            return JSON.parse(sessionStorage.getItem('usuario'));
        }
    }
})();
