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
            .style('stroke-width', function(d) { return Math.sqrt(d.value); });

        var node = g.selectAll('.node')
            .data(nodes)
            .enter().append('circle')
            .attr('class', 'node')
            .attr('r', 5)
            .style('fill', function(d) { return color(d.type); })
            .call(graph.drag);

        node.append('title')
            .text(function(d) { return d.id; });

        node.on('mouseover', function(d) {

                node.style('stroke', function(o) {
                    return d ==o || utils.isConnected(d, o) ? 'blue' : 'white';
                });

            })
            .on('mousedown', function(d) {
                d3.event.stopPropagation();
                utils.mousedown(d);
            })
            .on('mouseout', function(d) {

                node.style('stroke', 'white');

            });

        if(settings.enableCentering) {

            node.on('dblclick.zoom', function(d) {

                console.log('Enable Centering: ' + settings.enableCentering);


                console.log(d);

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