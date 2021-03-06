const React = require('react');
const ReactDOM = require('react-dom');
const _ = require('underscore');
import d3 from 'd3';

const Graph = require("../components/viz/graph.jsx");

var networkView = {};
networkView.render = function renderNetworkView (graphData) {
    var _colorScale = d3.scale.ordinal().domain(['REGULATOR', 'TARGET', 'FOCUS']).range(["#6CB665", "#9F75B8", "#1f77b4"]);
    var tempDate = new Date();
    var month = tempDate.getMonth() + 1;
    var formattedMonth = ('0' + month).slice(-2);
    var date = tempDate.getDate();
    var formattedDate = ('0' + date).slice(-2);
    var _HeaderText = `SGD ${tempDate.getFullYear()}-${formattedMonth}-${formattedDate}`; 
    ReactDOM.render(<Graph colorScale={_colorScale} data={graphData} headerText={_HeaderText} stage={0} />, document.getElementById('j-network'));
};

module.exports = networkView;
