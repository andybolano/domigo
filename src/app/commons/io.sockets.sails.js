/**
 * Created by Jose Soto
 * on 26/06/2016.
 */
(function () {
    'use strict';

    angular
        .module('commons')
        .service('SocketcSailsService', SocketcSailsService);

    function SocketcSailsService($scope) {

        this.pedidos = function () {
            io.socket.on('newCall', function (msg) {
                $scope.$apply(function () {
                    setItemPedido(msg)
                });
            });
        }

        this.suscribe = function(empresa) {
            io.socket.request({
                method: 'get',
                url: '/empresas/' + empresa + '/join_ws',
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
                }
            }, function (response) {
                console.log(response)
            });
        }

        function setItemPedido(item) {
            for(var i = 0; i < sessionStorage.getItem('pedidos').length; i++){
                sessionStorage.setItem("pedidos"[i], JSON.stringify(item));
            }
        }
    }
})();
