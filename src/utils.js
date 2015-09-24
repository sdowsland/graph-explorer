'use strict';

module.exports = (function(){

    var nodes,
        links,
        settings;

    function log(message){
        console.log(message);
    }

    var Utils = function(n, l, s){
        nodes = n;
        links = l;
        settings = s
    };

    Utils.prototype = {
        constructor: Utils,
        mouseover: function (obj) {
            console.log('mouseover');
        },
        mousedown: function (obj) {
            log(obj);

            this.hasConnections(obj.index);
        },
        mouseout: function (obj) {
            console.log('mouseout');
        },
        isConnected: function (a, b) {
            //return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
        },
        hasConnections: function (a) {

            console.log(a);
            console.log(links);

            /*for (var property in linkedByIndex) {
             s = property.split(",");
             if ((s[0] == a.index || s[1] == a.index) && linkedByIndex[property]) return true;
             }

             return false;*/
        }
    };

    return Utils;

}());

