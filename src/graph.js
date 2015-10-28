'use strict';

var Defaults = require('./defaults.js'),
    Utils = require('./utils.js'),
    Events = require('./events.js');

module.exports = (function() {

    var Graph = function(nodeData, linkData, shapes, options){

        var settings = Defaults.extend({}, Defaults, options),
            zoom = d3.behavior.zoom().scaleExtent([settings.minZoom,settings.maxZoom]),
            svg = d3.select(settings.element).append('svg'),
            g = svg.append('g'),
            element = document.getElementById(settings.element.replace('#','')),
            width = element.offsetWidth,
            height = element.offsetHeight,
            utils = new Utils(nodeData, linkData, settings);

        svg.attr('width', width);
        svg.attr('height', height);

        if(settings.directed){
            // build the arrow.
            svg.append('svg:defs').selectAll('marker')
                .data(['end'])      // Different link/path types can be defined here
                .enter().append('svg:marker')    // This section adds in the arrows
                .attr('id', String)
                .attr('viewBox', '0 -5 10 10')
                .attr('refX', 27)
                .attr('refY', 0)
                .attr('markerWidth', 6)
                .attr('markerHeight', 6)
                .attr('orient', 'auto')
                .append('svg:path')
                .attr('d', 'M0,-5L10,0L0,5')
                .style('fill', settings.linkColour);
        }

        var nodes = [],
            links = [],
            bilinks = [];

        if(settings.curvedLinks) {

            nodes = nodeData.slice();

            linkData.forEach(function (link) {
                var s = nodeData[link.source],
                    t = nodeData[link.target],
                    i = {type:'curve'}; // intermediate node
                nodeData.push(i);
                links.push({source: s, target: i}, {source: i, target: t});
                bilinks.push([s, i, t]);
            });

            console.log(bilinks);
        }
        else {
            nodes = nodeData;
            links = linkData;
        }

        var color = d3.scale.category10();

        console.log(color);

        var graph = d3.layout.force()
            .nodes(nodeData)
            .links(linkData)
            .size([width, height])
            .linkStrength(settings.linkStrength)
            .friction(settings.friction)
            .linkDistance(settings.linkDistance)
            .charge(function(node) {
                if(settings.curvedLinks && node.type == 'curve') {
                    return settings.curvedLinksCharge;
                }
                else {
                    return settings.charge;
                }

            })
            .gravity(settings.gravity)
            .theta(settings.theta)
            .alpha(settings.alpha);

        if(settings.curvedLinks){
            var links = g.selectAll('.link')
                .data(bilinks)
                .enter().append('path')
                .attr('class', 'link')
                .style('stroke', settings.linkColour)
                .style('stroke-width', function(d) { return "1px"; })
                .style('fill', 'none');
        }
        else {
            var links = g.selectAll('.link')
                .data(links)
                .enter().append('line')
                .attr('class', 'link')
                .style('stroke', settings.linkColour)
                .style('stroke-width', function(d) { return "1px"; });
        }

        if(settings.directed){
            links.attr('marker-end', 'url(#end)');
        }


        var nodes = g.selectAll('.node')
            .data(nodes)
            .enter()
            .append('path')
            .attr("d", d3.svg.symbol().type(function(d) { return shapes[d.type]; }).size(200))
            .attr('class', 'node')
            .style('fill', function(d) { return color(d.type); })
            .style('stroke', settings.nodeStrokeColour)
            .style('stroke-width', settings.nodeStrokeWidth)
            .call(graph.drag);

        nodes.append('title').text(function(d) { return d.name; });

        if(settings.labelNodes){
            var text = g.selectAll(".text")
                .data(nodeData)
                .enter().append("text")
                .attr("dy", "16px")
                .style("font-size", "6px")
                .text(function(d) { return d.name; })
                .style("text-anchor", "middle");
        }

        nodes.on('mouseover', function(d)
            {
                if(settings.nodeFadeOnMouseOver){
                    nodes.transition().duration(300).style('opacity', function(o){
                        return d == o || utils.isConnected(d, o) ? '1' : '0.25';
                    });

                    links.transition().duration(300).style('opacity', function(o){

                        if(settings.curvedLinks){
                            return o[0].index == d.index || o[2].index == d.index ? '1' : '0.1';
                        }
                        else {
                            return o.source.index == d.index || o.target.index == d.index ? '1' : '0.1';
                        }

                    });
                }
                else {
                    nodes.style('opacity', function(o){
                        return d == o || utils.isConnected(d, o) ? '1' : '0.25';
                    });

                    links.style('opacity', function(o){

                        if(settings.curvedLinks){
                            return o[0].index == d.index || o[2].index == d.index ? '1' : '0.1';
                        }
                        else {
                            return o.source.index == d.index || o.target.index == d.index ? '1' : '0.1';
                        }

                    });
                }
            })
            .on('mousedown', function(d) {
                d3.event.stopPropagation();
                console.log(d);
            })
            .on('mouseout', function(d) {

                if(settings.nodeFadeOnMouseOver){
                    nodes.transition().duration(300).style('opacity',  '1');
                    links.transition().duration(300).style('opacity',  '1');
                }
                else {
                    nodes.style('opacity',  '1');
                    links.style('opacity',  '1');
                }

            });

        if(settings.enableCentering) {

            nodes.on('dblclick.zoom', function(d) {
                d3.event.stopPropagation();
                var dcx = (width/2-d.x*zoom.scale());
                var dcy = (height/2-d.y*zoom.scale());
                zoom.translate([dcx,dcy]);
                g.attr('transform', 'translate('+ dcx + ',' + dcy  + ')scale(' + zoom.scale() + ')');
            });
        }

        graph.on('tick', function() {

            if(settings.labelNodes) {
                text.attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });
            }

            nodes.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

            if(settings.curvedLinks){

                links.attr("d", function(d) {
                    return "M" + d[0].x + "," + d[0].y
                        + "S" + d[1].x + "," + d[1].y
                        + " " + d[2].x + "," + d[2].y;
                });
            }
            else {
                links.attr('x1', function(d) { return d.source.x; })
                    .attr('y1', function(d) { return d.source.y; })
                    .attr('x2', function(d) { return d.target.x; })
                    .attr('y2', function(d) { return d.target.y; });
            }

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