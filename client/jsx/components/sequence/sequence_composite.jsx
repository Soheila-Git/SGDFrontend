/** @jsx React.DOM */
"use strict";
/*
	A react component which can render locus diagrams, sub-feature tables, and a sequence toggler.
	If it doesn't have the models, returns the right loaders
*/
var React = require("react");
var _ = require("underscore");

var DataTable = require("../widgets/data_table.jsx");
var DownloadButton = require("../widgets/download_button.jsx");
var DropdownSelector = require("../widgets/dropdown_selector.jsx");
var HelpIcon = require("../widgets/help_icon.jsx");
var LocusDiagram = require("../viz/locus_diagram.jsx");
var SequenceToggler = require("./sequence_toggler.jsx");

module.exports = React.createClass({

	getDefaultProps: function () {
		return  {
			neighborsModel: null,
			detailsModel: null,
			focusLocusDisplayName: null,
			showAltStrains: false,
			showSequence: true,
			showSubFeatures: true,
			showSubFeaturesTable: true,
		};
	},

	getInitialState: function () {
		var _strainKey = null;
		if (this.props.defaultAltStrainKey) {
			_strainKey = this.props.defaultAltStrainKey;
		}

		return {
			activeStrainKey: _strainKey
		};
	},

	render: function () {
		if (!this.props.neighborsModel && !this.props.detailsModel) {
			return <div className="panel sgd-viz"><img className="loader" src="/static/img/dark-slow-wheel.gif" /></div>;
		} else {
			var titleNode = this._getTitleNode();
			var neighborsNode = this._getNeighborsNode();
			var detailsNode = this._getDetailsNode();
			var sequenceNode = this._getSequenceNode();
			return (<div>
				{titleNode}
				{neighborsNode}
				{detailsNode}
				{sequenceNode}
			</div>);
		}
	},

	_getStrainSelectorNode: function () {
		var node = null;
		if (this.props.showAltStrains && this.props.detailsModel && this.state.activeStrainKey) {
			var _elements = _.map(this.props.detailsModel.attributes.altStrainMetaData, s => {
				return {
					value: s.key,
					name: s.name,
					description: s.description
				};
			});
			var _onChange = (key) => { this.setState({ activeStrainKey: key }); };
			node = <DropdownSelector elements={_elements} onChange={_onChange} defaultActiveValue={this.state.activeStrainKey}/>;				
		}

		return node;
	},

	_getTitleNode: function () {
		var node;
		if (this.props.showAltStrains) {
			var selectNode = this._getStrainSelectorNode();
			var helpNode = <HelpIcon text="Alternative Reference strains are major laboratory yeast strains with a substantial history of use and experimental results. These strains include W303, Sigma1278b, SK1, SEY6210, CEN.PK, D273-10B, JK9-3d, FL100, RM11-1a, and Y55." isInfo={true} />;
			node = (<div>
				<h2>Alternative Reference Strains {helpNode}</h2>
				{selectNode}
			</div>);
		} else {
			var helpNode = <HelpIcon text={<span>The <i>S. cerevisiae</i> reference genome sequence is derived from laboratory strain S288C.</span>} isInfo={true} />;
			var _gbHref = "http://browse.yeastgenome.org/fgb2/gbrowse/scgenome/?name=" + this.props.focusLocusFormatName;
			var _mapHref = "http://www.yeastgenome.org/cgi-bin/ORFMAP/ORFmap?dbid=" + this.props.focusLocusFormatName;
			node = (<div className="row">
				<div className="columns small-6">
					<h2>Reference Strain: S288C {helpNode}</h2>
				</div>
				<div className="columns small-6 right">
					<p className="text-right">View in: <a href={_gbHref}>GBrowse</a> | <a href={_mapHref}>ORF Map</a></p>
				</div>
			</div>);
			
		}

		return node;
	},

	_getNeighborsNode: function () {
		var node = <div className="panel sgd-viz"><img className="loader" src="/static/img/dark-slow-wheel.gif" /></div>;
		if (this._canRenderNeighbors()) {
			var attr = this._getActiveStrainNeighborsData();
			if (!attr) return null
			node = (<div className="panel sgd-viz">
				<h3>
					{this.props.focusLocusDisplayName} Location: <a href={attr.contigData.href}>{attr.contigData.name}</a> {attr.focusLocusDomain[0].toLocaleString()} - {attr.focusLocusDomain[1].toLocaleString()}
				</h3>
				<LocusDiagram
					contigData={attr.contigData}
					data={attr.data}
					domainBounds={attr.domainBounds}
					focusLocusDisplayName={this.props.focusLocusDisplayName}
					showSubFeatures={false}
					watsonTracks={Math.abs(attr.trackDomain[1])}
					crickTracks={Math.abs(attr.trackDomain[0])}
				/>
			</div>);
		}
		return node;
	},

	_getDetailsNode: function () {
		if (!this.props.showSubFeatures) return null;

		var innerNode = <img className="loader" src="/static/img/dark-slow-wheel.gif" />;
		var tableNode = null;
		var downloadNode = null;
		if (this._canRenderDetails()) {
			var attr = this._getActiveStrainDetailsData();
			innerNode = (<LocusDiagram
				contigData={attr.contigData}
				data={attr.data}
				domainBounds={attr.domainBounds}
				focusLocusDisplayName={this.props.focusLocusDisplayName}
				showSubFeatures={true}
				watsonTracks={Math.abs(attr.trackDomain[1])}
				crickTracks={Math.abs(attr.trackDomain[0])}
			/>);

			tableNode = this._getSubFeaturesTable();
			// TODO add params
			downloadNode = <DownloadButton url="/download_table" />;
		}

		return (<div className="panel sgd-viz">
			{innerNode}
			{tableNode}
			{downloadNode}
		</div>);
	},

	_getSequenceNode: function () {
		if (!this.props.showSequence) return null;

		var innerNode = <img className="loader" src="/static/img/dark-slow-wheel.gif" />;
		if (this._canRenderDetails()) {
			var _text = this.props.showAltStrains ? "Sequence" : "Sequence - S288C";
			var _detailsData = this._getActiveStrainDetailsData()
			var _sequences = _detailsData.sequences;
			var _contigName = _detailsData.contigData.formatName;
			innerNode = <SequenceToggler sequences={_sequences} text={_text} locusDisplayName={this.props.focusLocusDisplayName} contigName={_contigName} subFeatureData={_detailsData.data.locci[0].tags}/>;
		}

		return <div className="panel sgd-viz">{innerNode}</div>;
	},

	_canRenderNeighbors: function () {
		return (this.props.neighborsModel && (!this.props.showAltStrains || this.state.activeStrainKey));
	},

	_canRenderDetails: function () {
		return (this.props.detailsModel && (!this.props.showAltStrains || this.state.activeStrainKey));
	},

	_getSubFeaturesTable: function () {
		if (!this.props.showSubFeaturesTable && !this._canRenderDetails()) return null;

		var _options = {
			bPaginate: false,
			oLanguage: { "sEmptyTable": "No subfeatures for " + this.props.focusLocusDisplayName + '.' }
		};
		var _tableData = this._getActiveStrainDetailsData().tableData;
		return <DataTable data={_tableData} usePlugin={true} pluginOptions={_options} />;
	},

	_getActiveStrainNeighborsData: function () {
		if (this.props.showAltStrains) {
			return _.findWhere(this.props.neighborsModel.attributes.altStrains, { strainKey: this.state.activeStrainKey });
		} else {
			return this.props.neighborsModel.attributes.mainStrain;
		}
	},

	_getActiveStrainDetailsData: function () {
		if (this.props.showAltStrains) {
			return _.findWhere(this.props.detailsModel.attributes.altStrains, { strainKey: this.state.activeStrainKey });
		} else {
			return this.props.detailsModel.attributes.mainStrain;	
		}
	}
});
