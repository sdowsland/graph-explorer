'use strict';

module.exports = (function () {

    var Graph = function(element, nodes, links, options){
        //console.log(nodes);
        //console.log(links);

        var svg = d3.select(element).append("svg");

        element = document.getElementById(element.replace('#',''));

        svg.attr("width", element.offsetWidth);
        svg.attr("height", element.offsetHeight);

        var color = d3.scale.category20();


        console.log(element.offsetWidth);
        console.log(element.offsetHeight);

        var force = d3.layout.force()
            .nodes(nodes)
            .links(links)
            .size([element.offsetWidth, element.offsetHeight])
            .linkStrength(0.1)
            .friction(0.9)
            .linkDistance(20)
            .charge(-30)
            .gravity(0.1)
            .theta(0.8)
            .alpha(0.1)
            .start();

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
            .call(force.drag);

        node.append("title")
            .text(function(d) { return d.id; });

        force.on("tick", function() {
            link.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node.attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
        });


        console.log(force);
    };

    Graph.prototype = {
        constructor: Graph,
        something: function () {
            return 'Something goes here';
        }
    };

    return Graph;
})();