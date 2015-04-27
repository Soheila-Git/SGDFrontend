/** @jsx React.DOM */
"use strict";

var React = require("react");
var $ = require("jquery");

var GenomeSnapshotModel = require("../models/genome_snapshot_model.jsx");
var NavBar = React.createFactory(require("../components/widgets/navbar.jsx"));
var TableAlternative = React.createFactory(require("../components/snapshot/table_alternative.jsx"));
var ToggleBarChart = React.createFactory(require("../components/viz/toggle_bar_chart.jsx"));
var BarChart = React.createFactory(require("../components/viz/bar_chart.jsx"));

var snapshotView = {};
snapshotView.render = function () {

	// render date
	var currentDate = new Date()
	$(".date-container").text(` (as of ${currentDate.getMonth()+1}/${currentDate.getDate()}/${currentDate.getFullYear()})`);

	// render nav bar
	var navElements = [
		{ name: "Genome Inventory", target: "genome-inventory" },
		{ name: "GO Annotations", target: "go-annotations" },
		{ name: "Phenotype Annotations", target: "phenotype-annotations" }
	];
	React.render(
		<NavBar title="Genome Snapshot" elements={navElements} />,
		document.getElementsByClassName("navbar-container")[0]
	);

	// init the model and fetch data
	var genomeModel = new GenomeSnapshotModel();
	genomeModel.fetch( (err, nestedData) => {

		// features visualization and table alt
		var featuresData = nestedData.featuresData;
		React.render(
			<TableAlternative vizType="genomeSnapshot" isInitiallyTable={false} graphData={featuresData.graphData} tableData={featuresData.tableData} />,
			document.getElementsByClassName("genome-snapshot-target")[0]
		);

		var _labelValue = (d) => { return d.display_name; };

		// GO viz
		var _goData = nestedData.goData;
		var _goYValue = (d) => { return d.descendant_annotation_gene_count; };
		React.render(
			<ToggleBarChart
				data={_goData} initialActiveDataKey="biological_process"
				labelValue={_labelValue} yValue={_goYValue}
			/>,
			document.getElementsByClassName("go-snapshot-target")[0]
		);

		// phenotype viz
		var _phenotypeData = nestedData.phenotypeData;
		var _colorValue = (d) => { return "#DF8B93"; }
		var _phenoYValue = (d) => { return d.descendant_annotation_gene_count; };
		var barChart = (
			<BarChart
				data={_phenotypeData} yValue={_phenoYValue}
				labelValue={_labelValue} labelRatio={0.20}
				hasTooltip={true} colorScale={_colorValue}
				yAxisLabel="Genes Products Annotated"
			/>
		);
		React.render(barChart, document.getElementsByClassName("phenotype-snapshot-target")[0]);

	});
};

module.exports = snapshotView;
