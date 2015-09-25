var Graph = require('./graph.js');

d3.json("examples/data/data.json", function(error, data) {

    var options = {
        element: '#graph-explorer',
        directed: true
    };

    var graph = new Graph(data.nodes, data.links, data.shapes, options);

});