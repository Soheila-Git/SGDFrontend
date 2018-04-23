import React from 'react';
import _ from 'underscore';
import $ from 'jquery';

const DataTable = require("../widgets/data_table.jsx");
const Checklist = require("../widgets/checklist.jsx");
const Params = require("../mixins/parse_url_params.jsx");

const SeqtoolsUrl = "/run_seqtools";

// const LETTERS_PER_CHUNK = 10;
// const LETTERS_PER_LINE = 60;

var SearchForm = React.createClass({

	getInitialState: function () {
	        
		var param = Params.getParams();
		
		return {
			isComplete: false,
			isPending: false,
			userError: null,
			genome: 'S288C',
			seqtype: 'DNA',
			genes: null,
			strains: null,
			up: null,
			down: null,
			chr: null,
			start: null,
			end: null,
			seq: null,
			rev: 'off',
			resultData: {},
			param: param,
			didSeqAnal: 0,
			submitted: param['submit'],
			submitted2: param['submit2'], 
			submitted3: param['submit3']
		};
	},

	render: function () {	
	
		var formNode = this._getFormNode();
		
		return (<div>
			  <span style={{ textAlign: "center" }}><h1>Gene/Sequence Resources <a target="_blank" href="https://sites.google.com/view/yeastgenome-help/sequence-help/genesequence-resources"><img src="https://d1x6jdqbvd5dr.cloudfront.net/legacy_img/icon_help_circle_dark.png"></img></a></h1>
			  <hr /></span>
			  {formNode}
			</div>);
		
		 
	},

	componentDidMount: function () {
	        if (this.state.submitted) {
	              this._runSeqTools('genes');
	        }
		else if (this.state.submitted2) {
                      this._runSeqTools('chr');
                }
		else if (this.state.submitted3) {
                      this._runSeqTools('seq');
                }
	},

	_getFormNode: function () {
		
	        if (this.state.isComplete) {

			var data = this.state.resultData;

			
			// var _resultTable = this._getResultTable(data);

		       	// return (<div>
			//	     <p><center>{_resultTable}</center></p>
			//	     <p><center><blockquote style={{ fontFamily: "Monospace", fontSize: 14 }}><a href={downloadUrl}>Download Full Results</a></blockquote></center></p>
			//       </div>);			

			return (<div>
			       HELLO WORLD: { data }
			       </div>);

		} 
		else if (this.state.isPending) {

		        return (<div>
			       <div className="row">
			       	    <p><b>Something wrong with your search!</b></p>
			       </div>
			</div>);
			
		}
		else {

		        if (this.state.submitted || this.state.submitted2 || this.state.submitted3) {
			     return <p>Please wait... The search may take a while to run.</p>; 

			}
						
			var descText = "<p>Try <a target='infowin' href='https://yeastmine.yeastgenome.org/yeastmine/begin.do'>Yeastmine</a> for flexible queries and fast retrieval of chromosomal features, sequences, GO annotations, interaction data and phenotype annotations. The video tutorial <a target='infowin' href='https://vimeo.com/28472349'>Template Basics</a> describes how to quickly retrieve this type of information in YeastMine. To find a comprehensive list of SGD's tutorials describing the many other features available in YeastMine and how to use them, visit SGD's <a target='infowin' href='https://sites.google.com/view/yeastgenome-help/video-tutorials/yeastmine?authuser=0'>YeastMine Video Tutorials</a> page. </p><p>This resource allows retrieval of a list of options for accessing biological information, table/map displays, and sequence analysis tools for 1. a named gene or sequence. 2. a specified chromosomal region, or 3. a raw DNA or protein sequence.</p>";
				
			var geneNodeLeft = this._getGeneNodeLeft();
			var geneNodeRight = this._getGeneNodeRight();
                	var chrNode = this._getChrNode();
                	var seqNode = this._getSeqNode();

			var _nameSection = { headers: [[<span style={{ fontSize: 20 }}>1. Search a list of genes</span>, '']],
			    		     rows:    [[geneNodeLeft, geneNodeRight]] };

			var _chrSeqSection = { headers: [[<span style={{ fontSize: 20 }}><strong style={{ color: 'red'}}>OR</strong> 2. Search a specified chromosomal region</span>, '', '', <span style={{ fontSize: 20 }}><strong style={{ color: 'red'}}>OR</strong> 3. Analyze a raw DNA or Protein sequence</span>]],
                                               rows:    [[chrNode, '', '', seqNode]] };
					
			return (<div>
			        <div dangerouslySetInnerHTML={{ __html: descText}} />
				<div className="row">
				     <div className="large-12 columns">
					   <form onSubmit={this._onSubmit} target="infowin">
					   	 <DataTable data={_nameSection} />
					   </form>
					   <DataTable data={_chrSeqSection} />        
			             </div>
			        </div>
			</div>);
		}
	},

	// it doesnt work..

	_onSubmit: function (e) {
		
		var genes = this.refs.genes.value.trim();		
		var re = / +/g;
		genes = genes.replace(re, ":");
		if (genes == '') {
		   alert("Please enter one or more gene names.");
		   e.preventDefault();
                   return 1;
		}
		
		var up = this.refs.up.value.trim();
                var down = this.refs.down.value.trim();
                if (isNaN(up) || isNaN(down)) {
                   alert("Please enter a number for up & downstream basepairs.");
		   e.preventDefault();
                   return 1;
		}

		var strainList = document.getElementById('strains');
                var strains = '';
		   for (var i = 0; i < strainList.options.length; i++) {
                     if (strainList.options[i].selected) {
                         if (strains) {
                              strains = strains + ':' + strainList.options[i].value;
			      	               }
                         else {
                              strains = strainList.options[i].value;
                         }
                   }
                }

		if (strains == '') {
		   alert("Please pick one or more strains.");
                   e.preventDefault();
                   return 1;
		}	
	
		var seqtype = this.refs.seqtype1.value.trim(); // Protein or DNA 
		var rev = this.refs.rev1.value.trim();         // on or off
		
		if (rev == 'off') {
		   rev = '';
		} 		
		
		window.localStorage.clear();
                window.localStorage.setItem("genes", genes);
                window.localStorage.setItem("strains", strains);
		window.localStorage.setItem("seqtype", seqtype);
		if (seqtype == 'DNA') {
		   window.localStorage.setItem("rev", rev);
		   window.localStorage.setItem("up", up);
                   window.localStorage.setItem("down", down);
		}
		else {
		   window.localStorage.setItem("rev", '');
                   window.localStorage.setItem("up", '');
                   window.localStorage.setItem("down", '');  
		}
		
	},

	_onSubmit2: function (e) {

                var chr = this.refs.chr.value.trim();		
                if (chr == 0) {
                   alert("Please pick a chromosome.");
                   e.preventDefault();
                   return 1;
		}

		var start = this.refs.start.value.trim();
                var end = this.refs.end.value.trim();
		if (isNaN(start) || isNaN(end)) {
                   alert("Please enter a number for chromosomal coordinates.");
                   e.preventDefault();
                   return 1;
                }

		window.localStorage.setItem("chr", chr);
		window.localStorage.setItem("start", start);
		window.localStorage.setItem("end", end);

		var rev = this.refs.rev2.value.trim();
		if (rev == 'off') {
		   rev = '';
		}
		window.localStorage.setItem("rev", rev);

        },

	_onSubmit3: function (e) {

                var seq = this.refs.seq.value.trim();
                if (seq == '') {
                   alert("Please enter a raw sequence.");
                   e.preventDefault();
                   return 1;
                }
		
		var seqtype = this.refs.seqtype3.value.trim();
                var rev = this.refs.rev3.value.trim();
		if (rev == 'off') {
		   rev = '';
		}
				
		window.localStorage.setItem("seq", seq);
		window.localStorage.setItem("seqtype", seqtype);
		
		if (seqtype == 'DNA') {
		   window.localStorage.setItem("rev", rev);
		}
		else {
		   window.localStorage.setItem("rev", '');
		}

        },

	_getGeneNodeLeft: function() {
	
		var seqtypeNode = this._getSeqtypeNode('seqtype1');

                return (<div style={{ textAlign: "top" }}>
                        <h3>Enter a list of names:</h3>
			<p>(space-separated gene names (and/or ORF and/or SGDID). Example: ACT1 YHR023W SGD:S000000001) 
			<textarea ref='genes' name='genes' onChange={this._onChange} rows='2' cols='50'></textarea></p>
			<h3>Pick a sequence type:</h3>
			{ seqtypeNode }
			<h3><b>If available,</b> add flanking basepairs</h3>
			<p>Upstream: <input type='text' ref='up' name='up' onChange={this._onChange} size='50'></input>
			Downstream: <input type='text' ref='down' name='down' onChange={this._onChange} size='50'></input></p>
                </div>);

        },
	
	_getGeneNodeRight: function() {

                var reverseCompNode = this._getReverseCompNode('rev1');	
                var strainNode = this._getStrainNode();

                return (<div>
                        <h3>Pick one or more strains:</h3>
                        { strainNode }
			{ reverseCompNode }
			<p><input type="submit" ref='submit' name='submit' value="Submit Form" className="button secondary"></input> <input type="reset" ref='reset' name='reset' value="Reset Form" className="button secondary"></input></p>
                </div>);

        },

	_getChrNode: function() {
		 		    	      
		var chr2num = { '-- choose a chromosome --': 0, 
		    	        'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5, 'VI': 6,
                                'VII': 7, 'VIII': 8, 'IX': 9, 'X': 10, 'XI': 11, 'XII': 12,
                                'XIII': 13, 'XIV': 14, 'XV': 15, 'XVI': 16, 'Mito': 17 };

                var chromosomes = Object.keys(chr2num);

                var _elements = _.map(chromosomes, c => {
                       if (chr2num[c] == 0) {
                            return <option value={ chr2num[c] } selected="selected">{ c }</option>;
                       }
                       else {
                            return <option value={ chr2num[c] }>{ c }</option>;
                       }
                });
		
		var reverseCompNode = this._getReverseCompNode('rev2');

                return(<div>
		       <form onSubmit={this._onSubmit2} target="infowin">
                       <h3>Pick a chromosome: </h3>
                       <p><select ref='chr' name='chr' onChange={this._onChangeGenome}>{_elements}</select></p>
		       <p>Then enter coordinates (optional)
		       <input type='text' ref='start' name='start' onChange={this._onChange} size='50'></input></p>
		       <p>to
                       <input type='text' ref='end' name='end' onChange={this._onChange} size='50'></input></p>
		       <p>The entire chromosome sequence will be displayed if no coordinates are entered.</p>
		       <p><b>Note</b>: Enter coordinates in ascending order for the Watson strand and descending order for the Crick strand.</p>
		       { reverseCompNode }
		       <p><input type="submit" ref='submit2' name='submit2' value="Submit Form" className="button secondary"></input> <input type="reset" ref='reset2' name='reset2' value="Reset Form" className="button secondary"></input></p>
		       </form>
                </div>);
 		 
	},

	_getSeqNode: function() {

		var seqtypeNode = this._getSeqtypeNode('seqtype3');
		var reverseCompNode = this._getReverseCompNode('rev3');

		return(<div>
		       <form onSubmit={this._onSubmit3} target="infowin">
                       <h3>Type or Paste a: </h3>
		       { seqtypeNode }
		       <p>Sequence:
                       <textarea ref='seq' name='seq' onChange={this._onChange} rows='7' cols='50'></textarea></p>
                       <p>The sequence <b>MUST</b> be provided in RAW format, no comments (numbers are okay).</p>
                       { reverseCompNode }
		       <p><input type="submit" ref='submit3' name='submit3' value="Submit Form" className="button secondary"></input> <input type="reset" ref='reset3' name='reset3' value="Reset Form" className="button secondary"></input></p>
		       </form>
                </div>);    

	},

	_getSeqtypeNode: function(name) {

		var _elements = [];
               	_elements.push(<option value='DNA' selected="selected">DNA</option>);
               	_elements.push(<option value='Protein'>Protein</option>);
                
		return(<div>
                      <p><select name={name} ref={name} onChange={this._onChange}>{_elements}</select></p>
                </div>);

	},

	_getReverseCompNode: function(name) {

	        return (<div>
		       <p><input ref={name} name={name} id={name} type="checkbox" value={this.state.rev} onChange={this._onChangeCB}/> Use the reverse complement</p> 
		       </div>);

        },

	_getStrainNode: function() {

                var strain2label = { 'S288C':      'S. cerevisiae Reference Strain S288C',
		    		     'CEN.PK':     'S. cerevisiae Strain CEN.PK2-1Ca_JRIV01000000',
				     'D273-10B':   'S. cerevisiae Strain D273-10B_JRIY00000000', 
				     'FL100':      'S. cerevisiae Strain FL100_JRIT00000000',
				     'JK9-3d':     'S. cerevisiae Strain JK9-3d_JRIZ00000000',
				     'RM11-1a':    'S. cerevisiae Strain RM11-1A_JRIP00000000',
				     'SEY6210':    'S. cerevisiae Strain SEY6210_JRIW00000000', 
				     'Sigma1278b': 'S. cerevisiae Strain Sigma1278b-10560-6B_JRIQ00000000', 
				     'W303':       'S. cerevisiae Strain W303_JRIU00000000', 
				     'X2180-1A':   'S. cerevisiae Strain X2180-1A_JRIX00000000', 
				     'Y55':	   'S. cerevisiae Strain Y55_JRIF00000000' 
		    		   };

		var strains = Object.keys(strain2label)

                var _elements = _.map(strains, s => {
                       var label = strain2label[s];
                       if(s == 'S288C') {
                            return <option value={s} selected='selected'>{label}</option>;
                       }
                       else {
                            return <option value={s}>{label}</option>;
                       }
                });

                return(<div>
		       <p>(Select or unselect multiple strains by pressing the Control (PC) or Command (Mac) key while clicking.)
                       <select ref='strains' name='strains' id='strains' onChange={this._onChange} size='11' multiple>{_elements}</select></p>
                </div>);

        },

        _onChange: function(e) {
                this.setState({ text: e.target.value});
        },

	_onChangeCB: function() {
		if (this.state.rev == 'off') {
		     this.setState({ rev: 'on' });
		}
		else {
		     this.setState({ rev: 'off' });
		}
	},

	_runSeqTools: function(searchType) {

		var paramData = {};

		if (searchType == 'genes') {
		   paramData['genes'] = window.localStorage.getItem("genes");
		   paramData['strains'] = window.localStorage.getItem("strains");
		   paramData['seqtype'] = window.localStorage.getItem("seqtype");
		   if (window.localStorage.getItem("up")) {
		      paramData['up'] = window.localStorage.getItem("up");
		   }
		   if (window.localStorage.getItem("down")) {
		      paramData['down'] = window.localStorage.getItem("down");
		   }
		   if (window.localStorage.getItem("rev")) {
		      paramData['rev'] = window.localStorage.getItem("rev");
		   }
		   this._sendRequest(paramData)
		   return
		}
		
		if (searchType == 'chr') {
		   paramData['chr'] = window.localStorage.getItem("chr");
		   if (window.localStorage.getItem("start")) {
                      paramData['start'] = window.localStorage.getItem("start");
		   }
		   if (window.localStorage.getItem("end")) {
                      paramData['end'] = window.localStorage.getItem("end");
		   }
		   if (window.localStorage.getItem("rev")) {
                      paramData['rev'] = window.localStorage.getItem("rev");
		   }
		   this._sendRequest(paramData)
                   return
		}

		if (searchType == 'seq') {
		   paramData['seq'] = window.localStorage.getItem("seq");
                   paramData['seqtype'] = window.localStorage.getItem("seqtype");
		   if (window.localStorage.getItem("rev")) {
                      paramData['rev'] = window.localStorage.getItem("rev");
		   }
		   this._sendRequest(paramData)
                   return
		}		
   		
	},

	_sendRequest: function(paramData) {

		$.ajax({
			url: SeqtoolsUrl,
			data_type: 'json',
			type: 'POST',
			data: paramData,                        
			success: function(data) {
			      this.setState({isComplete: true,
			                     resultData: data});
			      console.log("SUCCESS: data="+data);
			}.bind(this),
			error: function(xhr, status, err) {
			      this.setState({isPending: true});
			      console.log("FAIL: paramData="+paramData+"; Error="+err);
			}.bind(this) 

		});

	}

});

module.exports = SearchForm;
