'use strict';

var Defaults = require('./defaults.js'),
    Utils = require('./utils.js'),
    Events = require('./events.js');

module.exports = (function () {

    var Graph = function(nodes, links, options){

        var settings = Defaults.extend({}, Defaults, options),
            zoom = d3.behavior.zoom().scaleExtent([settings.minZoom,settings.maxZoom]),
            svg = d3.select(settings.element).append('svg'),
            g = svg.append('g'),
            element = document.getElementById(settings.element.replace('#','')),
            width = element.offsetWidth,
            height = element.offsetHeight,
            utils = new Utils(nodes, links, settings);

        svg.attr('width', width);
        svg.attr('height', height);

        // build the arrow.
        svg.append("svg:defs").selectAll("marker")
            .data(["end"])      // Different link/path types can be defined here
            .enter().append("svg:marker")    // This section adds in the arrows
            .attr("id", String)
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 27)
            .attr("refY", 0)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("svg:path")
            .attr("d", "M0,-5L10,0L0,5")
            .style('fill', settings.linkColour);

        var color = d3.scale.category20();

        var graph = d3.layout.force()
            .nodes(nodes)
            .links(links)
            .size([width, height])
            .linkStrength(settings.linkStrength)
            .friction(settings.friction)
            .linkDistance(settings.linkDistance)
            .charge(settings.charge)
            .gravity(settings.gravity)
            .theta(settings.theta)
            .alpha(settings.alpha);

        var link = g.selectAll('.link')
            .data(links)
            .enter().append('line')
            .attr('class', 'link')
            .style('stroke', settings.linkColour)
            .style('stroke-width', function(d) { return 1; })
            .attr("marker-end", "url(#end)");

        var node = g.selectAll('.node')
            .data(nodes)
            .enter().append('circle')
            .attr('class', 'node')
            .attr('r', settings.nodeRadius)
            .style('fill', function(d) { return color(d.type); })
            .style('stroke', settings.nodeStrokeColour)
            .style('stroke-width', settings.nodeStrokeWidth)
            .call(graph.drag);

        node.append('title')
            .text(function(d) { return d.id; });

        node.on('mouseover', function(d)
            {
                if(settings.nodeFadeOnMouseOver){
                    node.transition().duration(300).style('opacity', function(o){
                        return d == o || utils.isConnected(d, o) ? '1' : '0.25';
                    });

                    link.transition().duration(300).style('opacity', function(o){
                        return o.source.index == d.index || o.target.index == d.index ? '1' : '0.1';
                    });
                }
                else {
                    node.style('opacity', function(o){
                        return d == o || utils.isConnected(d, o) ? '1' : '0.25';
                    });

                    link.style('opacity', function(o){
                        return o.source.index == d.index || o.target.index == d.index ? '1' : '0.1';
                    });
                }
            })
            .on('mousedown', function(d) {
                d3.event.stopPropagation();
                console.log(d);
            })
            .on('mouseout', function(d) {

                if(settings.nodeFadeOnMouseOver){
                    node.transition().duration(300).style('opacity',  '1');
                    link.transition().duration(300).style('opacity',  '1');
                }
                else {
                    node.style('opacity',  '1');
                    link.style('opacity',  '1');
                }

            });

        if(settings.enableCentering) {

            node.on('dblclick.zoom', function(d) {
                d3.event.stopPropagation();
                var dcx = (width/2-d.x*zoom.scale());
                var dcy = (height/2-d.y*zoom.scale());
                zoom.translate([dcx,dcy]);
                g.attr('transform', 'translate('+ dcx + ',' + dcy  + ')scale(' + zoom.scale() + ')');
            });
        }

        graph.on('tick', function() {

            link.attr('x1', function(d) { return d.source.x; })
                .attr('y1', function(d) { return d.source.y; })
                .attr('x2', function(d) { return d.target.x; })
                .attr('y2', function(d) { return d.target.y; });

            node.attr('cx', function(d) { return d.x; })
                .attr('cy', function(d) { return d.y; });
        });

        zoom.on('zoom', function() {
            g.attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
        });

        svg.call(zoom);

        resize();

        function resize() {

            var w = width,
                h = height;

            svg.attr('width', w).attr('height', h);

            graph.size([graph.size()[0]+(w-width)/zoom.scale(),graph.size()[1]+(h-height)/zoom.scale()]).resume();

            width = w;
            height = h;
        }

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