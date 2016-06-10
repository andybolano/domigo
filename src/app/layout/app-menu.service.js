/**
 * Created by tav0 on 14/02/16.
 */

(function () {
    'use strict';

    angular
        .module('domigo')
        .factory('appMenu', appMenu);

    function appMenu() {
        var items = [];
        var itemsAll = [];

        function addTo(item, owner) {
            if (item instanceof Array) {
                for (var i = 0; i < item.length; i++) {
                    addTo(item[i], owner)
                }
            } else {
                if (owner == 'all' || !owner) {
                    itemsAll.push(item);
                }
                if (!angular.isDefined(items[owner])) items[owner] = [];
                items[owner].push(item);
            }
        }

        function getOf(owner) {
            return items[owner] ? items[owner].concat(itemsAll) : itemsAll;
        }

        return {
            addTo: addTo,
            getOf: getOf
        };
    }
})();



