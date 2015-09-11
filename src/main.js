var d3 = require('d3'),
    options = require('./options.js'),
    Graph = require('./graph.js');

d3.json("examples/data/data.json", function(error, data) {

    console.log(Graph);

    Graph.init('#graph-explorer', data.nodes, data.links, options);

});