var d3 = require('d3'),
    options = require('./options.js');

d3.json("examples/data/data.json", function(error, graph) {

    console.log('Graph Data');
    console.log(graph);

    console.log('Options');
    console.log(options);

});