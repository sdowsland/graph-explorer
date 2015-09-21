var d3 = require('d3'),
    options = require('./defaults.js'),
    Graph = require('./graph.js');

d3.json("examples/data/data.json", function(error, data) {

    var graph = new Graph('#graph-explorer', data.nodes, data.links, options);

    console.log(graph);
    console.log(graph.something());
});