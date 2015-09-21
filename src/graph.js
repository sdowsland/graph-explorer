'use strict';

var Defaults = require('./defaults.js');

module.exports = (function () {

    var Graph = function(nodes, links, options){

        var settings = Defaults.extend({}, Defaults, options);

        var svg = d3.select(settings.element).append("svg");

        var element = document.getElementById(settings.element.replace('#',''));

        svg.attr("width", element.offsetWidth);
        svg.attr("height", element.offsetHeight);

        var color = d3.scale.category20();

        var graph = d3.layout.force()
            .nodes(nodes)
            .links(links)
            .size([element.offsetWidth, element.offsetHeight])
            .linkStrength(settings.linkStrength)
            .friction(settings.friction)
            .linkDistance(settings.linkDistance)
            .charge(settings.charge)
            .gravity(settings.gravity)
            .theta(settings.theta)
            .alpha(settings.alpha);

        var link = svg.selectAll(".link")
            .data(links)
            .enter().append("line")
            .attr("class", "link")
            .style("stroke-width", function(d) { return Math.sqrt(d.value); });

        var node = svg.selectAll(".node")
            .data(nodes)
            .enter().append("circle")
            .attr("class", "node")
            .attr("r", 5)
            .style("fill", function(d) { return color(d.type); })
            .call(graph.drag);

        node.append("title")
            .text(function(d) { return d.id; });

        graph.on("tick", function() {
            link.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node.attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
        });

        graph.start();
    };

    Graph.prototype = {
        constructor: Graph,
        something: function () {
            return 'Something goes here';
        }
    };

    return Graph;
})();