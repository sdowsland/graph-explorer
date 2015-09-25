'use strict';

var _where = require('lodash.where');

module.exports = (function(){

    var nodes,
        links,
        settings;

    var Utils = function(n, l, s){
        nodes = n;
        links = l;
        settings = s;
    };

    Utils.prototype = {
        constructor: Utils,
        isConnected: function (a, b) {
            var sources = _where(links, { 'source': a, 'target': b });
            var targets = _where(links, { 'source': b, 'target': a });

            return sources.concat(targets).length > 0;
        },
        hasConnections: function (node) {

            var sources = _where(links, { 'source': node });
            var targets = _where(links, { 'target': node });

            return sources.concat(targets).length > 0;
        },
        getConnections: function(node) {
            var sources = _where(links, { 'source': node });
            var targets = _where(links, { 'target': node });

            return sources.concat(targets);
        }
    };

    return Utils;

}());

