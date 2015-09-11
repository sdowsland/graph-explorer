'use strict';

module.exports = {
    target: '#graph-explorer',
    focus_node: null,
    highlight_node: null,
    text_center: false,
    outline: false,
    min_score: 0,
    max_score: 1,
    color: d3.scale.linear().domain([this.min_score, (this.min_score+this.max_score)/2, this.max_score]).range(["lime", "yellow", "red"]),
    highlight_color: "blue",
    highlight_trans: 0.1,
    size: d3.scale.pow().exponent(1).domain([1,100]).range([8,24]),
    default_node_color: "#ccc",
    default_link_color: "#888",
    nominal_base_node_size: 8,
    nominal_text_size: 10,
    max_text_size: 24,
    nominal_stroke: 1.5,
    max_stroke: 4.5,
    max_base_node_size: 36,
    min_zoom: 0.1,
    max_zoom: 7
};