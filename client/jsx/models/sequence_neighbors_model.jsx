
"use strict";

var _ = require("underscore");

var BaseModel = require("./base_model.jsx");
var LocusFormatHelper = require("../lib/locus_format_helper.jsx");

var MAIN_STRAIN_NAME = "S288C";

module.exports = class SequenceNeighborsModel extends BaseModel {

	constructor (options) {
		options = options || {};
		options.url = `/backend/locus/${options.id}/neighbor_sequence_details`;
		super(options);
		if (options.id) this.id = parseInt(options.id);
	}

	parse (response) {
		var _altNames = _.filter(_.keys(response), n => { return n !== MAIN_STRAIN_NAME; });
		var _altStrains = _.map(_altNames, n => {
			return this._formatStrainName(n, response[n]);
		});
		var _mainStrain = this._formatStrainName(MAIN_STRAIN_NAME, response[MAIN_STRAIN_NAME]);

		return {
			mainStrain: _mainStrain,
			altStrains: _altStrains
		};
	}

	_formatStrainName (strainDisplayName, strainData) {
		var _contigData = LocusFormatHelper.formatContigData(strainData.neighbors[0].contig);
		var _loci = this._assignTracksToLocci(strainData.neighbors);
		var _trackDomain = LocusFormatHelper.getTrackDomain(_loci);

		var _start = _.min(_loci, (d) => { return d.start; }).start;
		var _end = _.max(_loci, (d) => { return d.end; }).end;

		var _focusLocus = _.filter(_loci, l => {
			return l.locus.id === this.id;
		})[0];
		if (_focusLocus) {
			var _focusLocusDomain = [_focusLocus.start, _focusLocus.end];
		} else {
			var _focusLocusDomain = [_start, _end];
		}
		return {
			data: { locci: _loci },
			domainBounds: [_start, _end],
			contigData: _contigData,
			focusLocusDomain: _focusLocusDomain,
			strainKey: strainDisplayName + "_" + _contigData.formatName,
			trackDomain: _trackDomain
		};
	}

	/*
		Takes an array of locci, and assigns a track number to make sure they don't overlap.
		Positive for watson, negative for crick.  Further from 0 is further from the center.
	*/
	_assignTracksToLocci (locci) {
		return _.map(locci, (d) => {
			return LocusFormatHelper.assignTrackToSingleLocus(d, locci);
		});
	}
};
