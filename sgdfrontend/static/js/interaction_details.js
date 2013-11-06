var ev_table;
var cy;
var format_name_to_id = new Object();

function set_up_evidence_table(header_id, interactors_gene_header_id, table_id, download_button_id, analyze_button_id, download_link, download_table_filename, 
	analyze_link, bioent_display_name, bioent_format_name, bioent_link, 
	phys_button_id, gen_button_id, union_button_id, intersect_button_id, data) { 
	var datatable = [];
	var self_interacts = false;
	for (var i=0; i < data.length; i++) {
		var evidence = data[i];
		
		format_name_to_id[evidence['bioentity1']['format_name']] = evidence['bioentity1']['id']
		format_name_to_id[evidence['bioentity2']['format_name']] = evidence['bioentity2']['id']
		
		if(evidence['bioentity1']['id'] == evidence['bioentity2']['id']) {
			self_interacts = true;
		}
		
		var icon;
		if(evidence['note'] != null) {
			icon = "<a href='#' data-dropdown='drop" + i + "'><i class='icon-info-sign'></i></a><div id='drop" + i + "' class='f-dropdown content medium' data-dropdown-content><p>" + evidence['note'] + "</p></div>"
		}
		else {
			icon = null;
		}
		
		var bioent1 = create_link(evidence['bioentity1']['display_name'], evidence['bioentity1']['link'])
		var bioent2 = create_link(evidence['bioentity2']['display_name'], evidence['bioentity2']['link'])
			
		var experiment = '';
		if(evidence['experiment'] != null) {
			//experiment = create_link(evidence['experiment']['display_name'], evidence['experiment']['link']);
			experiment = evidence['experiment']['display_name'];
		}
		var phenotype = '';
		if(evidence['phenotype'] != null) {
			//phenotype = create_link(evidence['phenotype']['display_name'], evidence['phenotype']['link']);
			phenotype = evidence['phenotype']['display_name'];
		}
		var modification = '';
		if(evidence['modification'] != null) {
			modification = evidence['modification'];
  		}
  		var reference = create_link(evidence['reference']['display_name'], evidence['reference']['link']);;
  		datatable.push([icon, bioent1, evidence['bioentity1']['format_name'], bioent2, evidence['bioentity2']['format_name'], evidence['interaction_type'], experiment, evidence['annotation_type'], evidence['direction'], modification, phenotype, evidence['source'], reference, evidence['note']])
  	}
  	document.getElementById(header_id).innerHTML = data.length;
  	var total_interactors = Object.keys(format_name_to_id).length;
  	if(!self_interacts){
  		total_interactors = total_interactors - 1;
  	}
  	document.getElementById(interactors_gene_header_id).innerHTML = total_interactors;
  		         
    var options = {};
	options["bPaginate"] = true;
	options["aaSorting"] = [[3, "asc"]];
	options["aoColumns"] = [{"bSearchable":false, "bSortable":false}, {"bSearchable":false, "bVisible":false}, {"bSearchable":false, "bVisible":false}, null, {"bSearchable":false, "bVisible":false}, null, null, null, null, null, null, {"bSearchable":false, "bVisible":false}, null, {"bSearchable":false, "bVisible":false}]		
	options["aaData"] = datatable;
  
   	setup_datatable_highlight();				
  	ev_table = $('#' + table_id).dataTable(options);
  	ev_table.fnSearchHighlighting();
  	
  	//set up Analyze buttons
	document.getElementById(phys_button_id).onclick = function() {analyze_phys(analyze_link, bioent_display_name, bioent_format_name, bioent_link)};
	document.getElementById(gen_button_id).onclick = function() {analyze_gen(analyze_link, bioent_display_name, bioent_format_name, bioent_link)};
	document.getElementById(intersect_button_id).onclick = function() {analyze_phys_gen_intersect(analyze_link, bioent_display_name, bioent_format_name, bioent_link)};
	document.getElementById(union_button_id).onclick = function() {analyze_phys_gen_union(analyze_link, bioent_display_name, bioent_format_name, bioent_link)};
	
	document.getElementById(union_button_id).removeAttribute('disabled');
	if(r > 0) {
		document.getElementById(phys_button_id).removeAttribute('disabled');
	}	
	if(s > 0) {
		document.getElementById(gen_button_id).removeAttribute('disabled');
	}
	if(r > 0 && s > 0 && x != r+s+1) {
		document.getElementById(intersect_button_id).removeAttribute('disabled');
	}
  	  		
  	document.getElementById(download_button_id).onclick = function() {download_table(ev_table, download_link, download_table_filename)};
  	document.getElementById(analyze_button_id).onclick = function() {analyze_table(analyze_link, bioent_display_name, bioent_format_name, bioent_link, 'Interactions', ev_table, 4, format_name_to_id)};

	document.getElementById(download_button_id).removeAttribute('disabled');
	document.getElementById(analyze_button_id).removeAttribute('disabled');
}
  		
function analyze_phys_gen_intersect(analyze_link, bioent_display_name, bioent_format_name, bioent_link) {
	var bioent_sys_names = [];

	var gen_bioent_sys_names = {};
	var data = ev_table.fnGetData();
	for (var i=0,len=data.length; i<len; i++) { 
		var ev_type = data[i][5];
		if(ev_type == 'Genetic') {
			var sys_name = data[i][4];
			gen_bioent_sys_names[sys_name] = true;
		}
	}	

	for (var i=0,len=data.length; i<len; i++) { 
		var ev_type = data[i][5];
		if(ev_type == 'Physical') {
			var sys_name = data[i][4];
			if(sys_name in gen_bioent_sys_names) {
				bioent_sys_names.push(format_name_to_id[sys_name]);
			}
		}
	}	
	post_to_url(analyze_link, {'bioent_display_name': bioent_display_name, 'bioent_format_name': bioent_format_name, 'bioent_link': bioent_link, 
										'bioent_ids': JSON.stringify(bioent_sys_names), 'list_name': 'Physical and Genetic Interactors'});
}
	
function analyze_phys(analyze_link, bioent_display_name, bioent_format_name, bioent_link) {
	var bioent_sys_names = [];

	var data = ev_table.fnGetData();
	for (var i=0,len=data.length; i<len; i++) { 
		var ev_type = data[i][5];
		if(ev_type == 'Physical') {
			var sys_name = data[i][4];
			bioent_sys_names.push(format_name_to_id[sys_name]);
		}
	}	
	post_to_url(analyze_link, {'bioent_display_name': bioent_display_name, 'bioent_format_name': bioent_format_name, 'bioent_link': bioent_link, 
										'bioent_ids': JSON.stringify(bioent_sys_names), 'list_name': 'Physical Interactors'});
}
	
function analyze_gen(analyze_link, bioent_display_name, bioent_format_name, bioent_link) {
	var bioent_sys_names = [];

	var data = ev_table.fnGetData();
	for (var i=0,len=data.length; i<len; i++) { 
		var ev_type = data[i][5];
		if(ev_type == 'Genetic') {
			var sys_name = data[i][4];
			bioent_sys_names.push(format_name_to_id[sys_name]);
		}
	}	
	post_to_url(analyze_link, {'bioent_display_name': bioent_display_name, 'bioent_format_name': bioent_format_name, 'bioent_link': bioent_link,
										 'bioent_ids': JSON.stringify(bioent_sys_names), 'list_name': 'Genetic Interactors'});
}
	
function analyze_phys_gen_union(analyze_link, bioent_display_name, bioent_format_name, bioent_link) {
	var bioent_sys_names = [];

	var data = ev_table.fnGetData();
	for (var i=0,len=data.length; i<len; i++) { 
		var sys_name = data[i][4];
		bioent_sys_names.push(format_name_to_id[sys_name]);
	}	
	post_to_url(analyze_link, {'bioent_display_name': bioent_display_name, 'bioent_format_name': bioent_format_name, 'bioent_link': bioent_link,
										 'bioent_ids': JSON.stringify(bioent_sys_names), 'list_name': 'Interactors'});
}

function setup_slider(div_id, min, max, current, slide_f) {
	if(max==min) {
		var slider = $("#" + div_id).noUiSlider({
			range: [min, min+1]
			,start: current
			,step: 1
			,handles: 1
			,connect: "lower"
			,slide: slide_f
		});
		slider.noUiSlider('disabled', true);
		var spacing =  100;
	    i = min-1
	    var value = i+1;
	    if(value >= 10) {
	    	var left = ((spacing * (i-min+1))-1)
	       	$('<span class="ui-slider-tick-mark muted">10+</span>').css('left', left + '%').css('display', 'inline-block').css('position', 'absolute').css('top', '15px').appendTo(slider);
	    }
	    else {
	    	var left = ((spacing * (i-min+1))-.5)
			$('<span class="ui-slider-tick-mark muted">' +value+ '</span>').css('left', left + '%').css('display', 'inline-block').css('position', 'absolute').css('top', '15px').appendTo(slider);
		}
	}
	else {
		var slider = $("#" + div_id).noUiSlider({
			range: [min, max]
			,start: current
			,step: 1
			,handles: 1
			,connect: "lower"
			,slide: slide_f
		});
		
		var spacing =  100 / (max - min);
	    for (var i = min-1; i < max ; i=i+1) {
	    	var value = i+1;
	    	if(value >= 10) {
	    		var left = ((spacing * (i-min+1))-1)
	        	$('<span class="ui-slider-tick-mark muted">10+</span>').css('left', left + '%').css('display', 'inline-block').css('position', 'absolute').css('top', '15px').appendTo(slider);
	    	}
	    	else {
	    		var left = ((spacing * (i-min+1))-.5)
				$('<span class="ui-slider-tick-mark muted">' +value+ '</span>').css('left', left + '%').css('display', 'inline-block').css('position', 'absolute').css('top', '15px').appendTo(slider);
	    	}
		}
	}
}

var union_max;
var phys_max;
var gen_max;
var intersect_max;
var evidence_min;

function setup_interaction_cytoscape_vis(graph_id,
				phys_slider_id, gen_slider_id, union_slider_id,  
				phys_radio_id, gen_radio_id, union_radio_id,
				style, data) {
	
	function f() {
		filter_cy(phys_slider_id, gen_slider_id, union_slider_id,  
				phys_radio_id, gen_radio_id, union_radio_id);
	}
	
	cy = setup_cytoscape_vis(graph_id, style, data, f);

			
	union_max = data['max_evidence_cutoff'];
	phys_max = data['max_phys_cutoff'];
	gen_max = data['max_gen_cutoff'];
	evidence_min = data['min_evidence_cutoff'];
	
	setup_slider(union_slider_id, evidence_min, Math.min(union_max, 10), Math.max(Math.min(union_max, 3), evidence_min), f);
	setup_slider(phys_slider_id, evidence_min, Math.min(phys_max, 10), Math.max(Math.min(phys_max, 3), evidence_min), f);
	setup_slider(gen_slider_id, evidence_min, Math.min(gen_max, 10), Math.max(Math.min(gen_max, 3), evidence_min), f);
	
	document.getElementById(phys_slider_id).style.display = 'none';
	document.getElementById(gen_slider_id).style.display = 'none';
	
	if(data['max_phys_cutoff'] < evidence_min) {
		document.getElementById(phys_radio_id).disabled = true;
	}
	if(data['max_gen_cutoff'] < evidence_min) {
		document.getElementById(gen_radio_id).disabled = true;
	}
	if(data['max_both_cutoff'] < evidence_min) {
		document.getElementById(intersect_radio_id).disabled = true;
	}
	
	function g() {
		change_scale(phys_slider_id, gen_slider_id, union_slider_id,  
				phys_radio_id, gen_radio_id, union_radio_id);
		filter_cy(phys_slider_id, gen_slider_id, union_slider_id,  
				phys_radio_id, gen_radio_id, union_radio_id);
	}
	
	document.getElementById(phys_radio_id).onclick = g;
	document.getElementById(gen_radio_id).onclick = g;
	document.getElementById(union_radio_id).onclick = g;
}

function change_scale(phys_slider_id, gen_slider_id, union_slider_id,  
				phys_radio_id, gen_radio_id, union_radio_id) {
					
	var all = document.getElementById(union_radio_id).checked;
	var phys = document.getElementById(phys_radio_id).checked;
	var gen = document.getElementById(gen_radio_id).checked;
	
	var prev_value = 3;
	if(document.getElementById(union_slider_id).style.display == 'block') {
		prev_value = $("#" + union_slider_id).val();
	}
	else if(document.getElementById(phys_slider_id).style.display == 'block') {
		prev_value = $("#" + phys_slider_id).val();
	}
	else if(document.getElementById(gen_slider_id).style.display == 'block') {
		prev_value = $("#" + gen_slider_id).val();
	}
	
	if(all) {
		$("#" + union_slider_id).val(Math.min(union_max, prev_value));
		document.getElementById(union_slider_id).style.display = 'block';
		document.getElementById(phys_slider_id).style.display = 'none';
		document.getElementById(gen_slider_id).style.display = 'none';
	}
	else if(phys) {
		$("#" + phys_slider_id).val(Math.min(phys_max, prev_value));
		document.getElementById(union_slider_id).style.display = 'none';
		document.getElementById(phys_slider_id).style.display = 'block';
		document.getElementById(gen_slider_id).style.display = 'none';
	}
	else if(gen) {
		$("#" + gen_slider_id).val(Math.min(gen_max, prev_value));
		document.getElementById(union_slider_id).style.display = 'none';
		document.getElementById(phys_slider_id).style.display = 'none';
		document.getElementById(gen_slider_id).style.display = 'block';
	}
}

function filter_cy(phys_slider_id, gen_slider_id, union_slider_id,  
				phys_radio_id, gen_radio_id, union_radio_id) {
	var all = document.getElementById(union_radio_id).checked;
	var phys = document.getElementById(phys_radio_id).checked;
	var gen = document.getElementById(gen_radio_id).checked;
	
    if(all) {
    	var cutoff;
    	if(union_max == evidence_min) {
    		cutoff = union_max;
    	}
    	else {
    		cutoff = $("#" + union_slider_id).val();
    	}
        cy.elements("node[evidence >= " + cutoff + "]").css({'visibility': 'visible',});
        cy.elements("edge[evidence >= " + cutoff + "]").css({'visibility': 'visible',});
        
        cy.elements("node[evidence < " + cutoff + "]").css({'visibility': 'hidden',});
        cy.elements("edge[evidence < " + cutoff + "]").css({'visibility': 'hidden',});
    }
    else if(phys) {
        var cutoff;
    	if(phys_max == evidence_min) {
    		cutoff = phys_max;
    	}
    	else {
    		cutoff = $("#" + phys_slider_id).val();
    	}
        cy.elements("node[physical >=  " + cutoff + "]").css({'visibility': 'visible',});
        cy.elements("edge[class_type = 'PHYSICAL'][evidence >=  " + cutoff + "]").css({'visibility': 'visible',});
        
        cy.elements("node[physical < " + cutoff + "]").css({'visibility': 'hidden',});
        cy.elements("edge[class_type = 'GENETIC']").css({'visibility': 'hidden',});
        cy.elements("edge[evidence < " + cutoff + "]").css({'visibility': 'hidden',});
    }
    else if(gen) {
    	var cutoff;
    	if(gen_max == evidence_min) {
    		cutoff = gen_max;
    	}
    	else {
    		cutoff = $("#" + gen_slider_id).val();
    	}
        cy.elements("node[genetic >= " + cutoff + "]").css({'visibility': 'visible',});
        cy.elements("edge[class_type = 'GENETIC'][evidence >= " + cutoff + "]").css({'visibility': 'visible',});
        
        cy.elements("node[genetic < " + cutoff + "]").css({'visibility': 'hidden',});
        cy.elements("edge[class_type = 'PHYSICAL']").css({'visibility': 'hidden',});
        cy.elements("edge[evidence < " + cutoff + "]").css({'visibility': 'hidden',});
    }
}
