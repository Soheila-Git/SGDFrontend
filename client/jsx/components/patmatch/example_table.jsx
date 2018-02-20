"use strict";

var React = require("react");
var $ = require("jquery");
var _ = require("underscore");

var DataTable = require("../widgets/data_table.jsx");


module.exports = {

	examples: function() {
		 
		var rows = [["Search type", "Character", "Meaning", "Examples"]];
		rows.push(["Peptide Searches", "IFVLWMAGCYPTSHEDQNKR", "Exact match", <span><a href='/nph-patmatch?pattern=ELVIS'>ELVIS</a></span>]);
		rows.push(["Peptide Searches", "J", "Any hydrophobic residue (IFVLWMAGCY)", <span><a href='/nph-patmatch?pattern=AAAAAAJJ'>AAAAAAJJ</a></span>]);
		rows.push(["Peptide Searches", "O", "Any hydrophilic residue (TSHEDQNKR)", <span><a href='/nph-patmatch?pattern=GLFGO'>GLFGO</a></span>]);
		rows.push(["Peptide Searches", "B", "D or N", <span><a href='/nph-patmatch?pattern=FLGB'>FLGB</a></span>]);
	        rows.push(["Peptide Searches", "Z", "E or Q", <span><a href='/nph-patmatch?pattern=GLFGZ'>GLFGZ</a></span>]);



/*		rows.push(["Peptide Searches", "X or .", "Any amino acid", <span><a href="/nph-patmatch?pattern=DXXXDN..RQS">DXXXDN..RQS</a><span>]); */





		rows.push(["Nucleotide Searches", "ACTGU", "Exact match", <span><a href='/nph-patmatch?seqtype=nuc&pattern=ACGGCGTA'>ACGGCGTA</a></span>]);
		rows.push(["Nucleotide Searches", "R", "Any purine base (AG)", <span><a href='/nph-patmatch?seqtype=nuc&pattern=AATTTGGRGGR'>AATTTGGRGGR</a></span>]);
		rows.push(["Nucleotide Searches", "Y", "Any pyrimidine base (CT)", <span><a href='/nph-patmatch?seqtype=nuc&pattern=CCCATAYYGGYY'>CCCATAYYGGYY</a></span>]);

		rows.push(["Nucleotide Searches", "S", "G or C", <span><a href='/nph-patmatch?seqtype=nuc&pattern=YGGTWCAMWTGTY'>YGGTWCAMWTGTY</a></span>]);
		rows.push(["Nucleotide Searches", "W", "A or T", <span><a href='/nph-patmatch?seqtype=nuc&pattern=YGGTWCAMWTGTY'>YGGTWCAMWTGTY</a></span>]);
		rows.push(["Nucleotide Searches", "M", "A or C", <span><a href='/nph-patmatch?seqtype=nuc&pattern=YGGTWCAMWTGTY'>YGGTWCAMWTGTY</a></span>]);
		rows.push(["Nucleotide Searches", "K", "G or T", <span><a href='/nph-patmatch?seqtype=nuc&pattern=YGGTWCAMWTGTY'>YGGTWCAMWTGTY</a></span>]);
		rows.push(["Nucleotide Searches", "V", "A or C or G", <span><a href='/nph-patmatch?seqtype=nuc&pattern=CGG...WH.{3,5}HW...CCG'>CGG...WH.{3,5}HW...CCG</a></span>]);
		rows.push(["Nucleotide Searches", "H", "A or C or T", <span><a href='/nph-patmatch?seqtype=nuc&pattern=CGG...WH.{3,5}HW...CCG'>CGG...WH.{3,5}HW...CCG</a></span>]);
		rows.push(["Nucleotide Searches", "D", "A or G or T", <span><a href='/nph-patmatch?seqtype=nuc&pattern=CGG...WH.{3,5}HW...CCG'>CGG...WH.{3,5}HW...CCG</a></span>]);		
		rows.push(["Nucleotide Searches", "B", "C or G or T", <span><a href='/nph-patmatch?seqtype=nuc&pattern=CGG...WH.{3,5}HW...CCG'>CGG...WH.{3,5}HW...CCG</a></span>]);
		rows.push(["Nucleotide Searches", "N or X or .", "Any base", <span><a href='/nph-patmatch?seqtype=nuc&pattern=ATGCNNNNNATCG'>ATGCNNNNNATCG</a></span>]);
		rows.push(["All Searches", "[]", "A subset of elements", <span><a href='/nph-patmatch?seqtype=pep&pattern=[WFY]XXXDN[RK][ST]'>[WFY]XXXDN[RK][ST]</a></span>]);
		rows.push(["All Searches", "[^]", "An excluded subset of elements", <span><a href='/nph-patmatch?seqtype=pep&pattern=NDBB...[VILM]Z[DE]...[^PG]'>NDBB...[VILM]Z[DE]...[^PG]</a></span>]);
		rows.push(["All Searches", "()", "Specifies a sub-pattern", <span><a href={ "/nph-patmatch?seqtype=pep&pattern=(YDXXX){2,}" }>(YDXXX){'{2,}'}</a></span>]); 
		rows.push(["All Searches", "{m,n}", "{m} = exactly m times<br>{m,} = at least m times<br>{,m} = 0 to m times<br>{m,n} = between m and n times", <span><a href={ '/nph-patmatch?seqtype=pep&pattern=L{3,5}X{5}DGO' }>{'L{3,5}X{5}DGO'}</a></span>]);
		rows.push(["All Searches", "<", "Constrains pattern to N-terminus or 5' end", <span><a href={ '/nph-patmatch?seqtype=pep&pattern=<MNTD' }>{ '<MNTD' }</a>{ ' (pep)' }<a href={ '/nph-patmatch?seqtype=nuc&pattern=<ATGX{6,10}RTTRTT' }>{ '<ATGX{6,10}RTTRTT' }</a>{ ' (nuc)' }</span>]);


		rows.push(["All Searches", ">", "Constrains pattern to C-terminus or 3' end", <span><a href={ "/nph-patmatch?seqtype=pep&pattern=sjgo>" }>{ "sjgo>" }</a>{ ' (pep)' }<a href={ "/nph-patmatch?seqtype=nuc&pattern=yattrtga>" }>{ "yattrtga>" }</a>{ ' (nuc)' }</span>]);


		rows.push(["All Searches", "<", "Constrains pattern to N-terminus or 5' end" , <span><a href={ '/nph-patmatch?seqtype=pep&pattern=<MNTD' }>{ '<MNTD' }</a>{ ' (pep)' }<a href={ '/nph-patmatch?seqtype=nuc&pattern=<ATGX{6,10}RTTRTT' }>{ '<ATGX{6,10}RTTRTT' }</a>{ ' (nuc)' }</span>]);

		
		var _tableData = {
                        headers: [["Search type", "Character", "Meaning", "Examples"]],
                        rows: rows
                };

                return <DataTable data={_tableData} />;


	}	
};

