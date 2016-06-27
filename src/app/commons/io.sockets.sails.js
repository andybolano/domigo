/**
 * Created by Jose Soto
 * on 26/06/2016.
 */
(function () {
    'use strict';

    angular
        .module('commons')
        .service('SocketcSailsService', SocketcSailsService);

    function SocketcSailsService() {

        this.pedidos = function () {
            io.socket.on('newCall', function (msg) {
                console.log(msg)
                setItemPedido(msg)
                // $scope.$apply(function () {
                //
                // });
            });
        }

        this.suscribe = function (empresa) {
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
            var i = 0;
            var pedidos = [];
            if(JSON.parse(sessionStorage.getItem('pedidos'))){
                pedidos = JSON.parse(sessionStorage['pedidos']);
                i = pedidos.length;
                console.log(i)
                pedidos.push(item);
                sessionStorage['pedidos'[i]] = JSON.stringify(pedidos);
            }else{
                pedidos[0] = item;
                sessionStorage['pedidos'] = JSON.stringify(pedidos);
            }

            // if(sessionStorage.getItem('pedidos')){
            //     for(var i = 0; i < sessionStorage.getItem('pedidos').length; i++){
            //         sessionStorage.setItem("pedidos", JSON.stringify(item));
            //     }
            // }else{
            //     sessionStorage.setItem("pedidos", JSON.stringify(item));
            // }
        }
    }
})();
