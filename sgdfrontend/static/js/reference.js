
$(document).ready(function() {

    $.getJSON(literature_details_link, function(data) {
        create_literature_list('primary', data['primary'])
        create_literature_list('additional', data['additional'])
        create_literature_list('review', data['reviews'])
    });

  	$.getJSON(interaction_details_link, function(data) {
  	    if(data.length > 0) {
            var interaction_table = create_interaction_table(data);
            create_download_button("interaction_table_download", interaction_table, download_table_link, interaction_download_filename);
            create_analyze_button("interaction_table_analyze", interaction_table, analyze_link, interaction_analyze_filename, true);
        }
        else {
            hide_section("interaction");
        }
  	});

  	$.getJSON(go_details_link, function(data) {
  	    if(data.length > 0) {
  		    var go_table = create_go_table(data);
  		    create_download_button("all_go_table_download", go_table, download_table_link, go_download_filename);
	  	    create_analyze_button("all_go_table_analyze", go_table, analyze_link, go_analyze_filename, true);
	  	}
        else {
            hide_section("all_go");
        }
  	});

  	$.getJSON(phenotype_details_link, function(data) {
  	    if(data.length > 0) {
  		    var phenotype_table = create_phenotype_table(data);
            create_download_button("phenotype_table_download", phenotype_table, download_table_link, phenotype_download_filename);
            create_analyze_button("phenotype_table_analyze", phenotype_table, analyze_link, phenotype_analyze_filename, true);
        }
        else {
            hide_section("phenotype");
        }
  	});

  	$.getJSON(regulation_details_link, function(data) {
  	    if(data.length > 0) {
  		    var regulation_table = create_regulation_table(data);
  	        create_download_button("all_regulation_table_download", regulation_table, download_table_link, regulation_download_filename);
  		    create_analyze_button("all_regulation_table_analyze", regulation_table, analyze_link, regulation_analyze_filename, true);
  		}
        else {
            hide_section("all_regulation");
        }
  	});

  	//Hack because footer overlaps - need to fix this.
  	if(counts["regulation"] > 0) {
        add_footer_space("all_regulation");
  	}
  	else if(counts["phenotype"] > 0) {
  	    add_footer_space("phenotype");
  	}
  	else if(counts["go"] > 0) {
  	    add_footer_space("all_go");
  	}
  	else if(counts["interaction"] > 0) {
  	    add_footer_space("interaction");
  	}
  	else {
  	    add_footer_space("summary");
  	}
});

function create_literature_list(list_id, data) {
    var primary_list = $("#" + list_id + "_list");
    var see_more_list = document.createElement('span');
    see_more_list.id = list_id + '_see_more'
    if(data.length > 0) {
        for(var i=0; i < data.length; i++) {
            var a = document.createElement('a');
            a.href = data[i]['bioentity']['link'];
            a.innerHTML = data[i]['bioentity']['display_name'];
            if(i > 10) {
                see_more_list.appendChild(a);
            }
            else {
                primary_list.append(a);
            }
            if(i != data.length-1) {
                var comma = document.createElement('span');
                comma.innerHTML = ', ';
                if(i > 10) {
                    see_more_list.appendChild(comma);
                }
                else {
                    primary_list.append(comma);
                }
            }
            else {
                if(data.length > 10) {
                    var see_less = document.createElement('a');
                    see_less.innerHTML = " << See less";
                    see_less.id = list_id + '_see_less_button';
                    see_less.onclick = function() {
                         $('#' + list_id + '_see_more').hide();
                         $('#' + list_id + '_see_more_button').show();
                    };
                    see_more_list.appendChild(see_less);
                }
            }
            if(i==10) {
                var see_more = document.createElement('a');
                see_more.innerHTML = '... See more >>';
                see_more.id = list_id + '_see_more_button';
                see_more.onclick = function() {
                    $('#' + list_id + '_see_more').show();
                    $('#' + list_id + '_see_more_button').hide();
                };

                primary_list.append(see_more);
                primary_list.append(see_more_list);
            }
        }
        $('#' + list_id + '_see_more').hide();
    }
    else {
        primary_list.hide();
    }
}

function create_interaction_table(data) {
    if("Error" in data) {
        var options = {};
        options["bPaginate"] = true;
        options["aaSorting"] = [[3, "asc"]];
        options["aoColumns"] = [{"bSearchable":false, "bVisible":false}, {"bSearchable":false, "bVisible":false}, {"bSearchable":false, "bSortable":false}, null, {"bSearchable":false, "bVisible":false}, null, {"bSearchable":false, "bVisible":false}, null, null, null, null, null, null, null, {"bSearchable":false, "bVisible":false}, {"bSearchable":false, "bVisible":false}]
        options["oLanguage"] = {"sEmptyTable": data["Error"]};
        options["aaData"] = [];
    }
    else {
        var datatable = [];
        var genes = {};
        for (var i=0; i < data.length; i++) {
            datatable.push(interaction_data_to_table(data[i], i));
            genes[data[i]["bioentity2"]["id"]] = true;
        }

        $("#interaction_header").html(data.length);
        $("#interaction_subheader").html(Object.keys(genes).length);
        $("#interaction_subheader_type").html("genes");

        var options = {};
        options["bPaginate"] = true;
        options["aaSorting"] = [[3, "asc"]];
        options["aoColumns"] = [{"bSearchable":false, "bVisible":false}, {"bSearchable":false, "bVisible":false}, {"bSearchable":false, "bSortable":false}, null, {"bSearchable":false, "bVisible":false}, null, {"bSearchable":false, "bVisible":false}, null, null, null, null, null, null, null, {"bSearchable":false, "bVisible":false}, {"bSearchable":false, "bVisible":false}]
        options["oLanguage"] = {"sEmptyTable": "No interaction data for " + display_name};
        options["aaData"] = datatable;
    }

    return create_table("interaction_table", options);
}

function create_go_table(data) {
    if("Error" in data) {
        var options = {};
        options["bPaginate"] = true;
        options["aaSorting"] = [[3, "asc"]];
        options["bDestroy"] = true;
        options["oLanguage"] = {"sEmptyTable": data["Error"]};
        options["aoColumns"] = [{"bSearchable":false, "bVisible":false}, {"bSearchable":false, "bVisible":false}, {"bSearchable":false, "bSortable":false}, null, {"bSearchable":false, "bVisible":false}, null, null, {"bSearchable":false, "bVisible":false}, null, null, null, null, {"bSearchable":false, "bVisible":false}, {"bSearchable":false, "bVisible":false}];
        options["aaData"] = [];
    }
    else {
        var datatable = [];
        var genes = {};
        for (var i=0; i < data.length; i++) {
            datatable.push(go_data_to_table(data[i], i));
            genes[data[i]["bioentity"]["id"]] = true;
        }

        $("#all_go_header").html(data.length);
        $("#all_go_subheader").html(Object.keys(genes).length);
        $("#all_go_subheader_type").html("genes");

        var options = {};
        options["bPaginate"] = true;
        options["aaSorting"] = [[3, "asc"]];
        options["bDestroy"] = true;
        options["oLanguage"] = {"sEmptyTable": "No gene ontology data for " + display_name};
        options["aoColumns"] = [{"bSearchable":false, "bVisible":false}, {"bSearchable":false, "bVisible":false}, {"bSearchable":false, "bSortable":false}, null, {"bSearchable":false, "bVisible":false}, null, null, {"bSearchable":false, "bVisible":false}, null, null, null, null, {"bSearchable":false, "bVisible":false}, {"bSearchable":false, "bVisible":false}];
        options["aaData"] = datatable;
    }

    return create_table("all_go_table", options);
}

function create_phenotype_table(data) {
    if("Error" in data) {
        var options = {};
        options["bPaginate"] = true;
        options["aaSorting"] = [[4, "asc"]];
        options["aoColumns"] = [{"bSearchable":false, "bVisible":false}, {"bSearchable":false, "bVisible":false}, null, {"bSearchable":false, "bVisible":false}, null, null, null, null, null, {'sWidth': '250px'}, {"bSearchable":false, "bVisible":false}];
        options["oLanguage"] = {"sEmptyTable": data["Error"]};
        options["aaData"] = [];
    }
    else {
        var datatable = [];
        var phenotypes = {};
        for (var i=0; i < data.length; i++) {
            datatable.push(phenotype_data_to_table(data[i], i));
            phenotypes[data[i]['bioconcept']['id']] = true;
        }

        $("#phenotype_header").html(data.length);
        $("#phenotype_subheader").html(Object.keys(phenotypes).length);
        $("#phenotype_subheader_type").html('phenotypes');

        var options = {};
        options["bPaginate"] = true;
        options["aaSorting"] = [[4, "asc"]];
        options["aoColumns"] = [{"bSearchable":false, "bVisible":false}, {"bSearchable":false, "bVisible":false}, null, {"bSearchable":false, "bVisible":false}, null, null, null, null, null, {'sWidth': '250px'}, {"bSearchable":false, "bVisible":false}];
        options["oLanguage"] = {"sEmptyTable": "No phenotype data for " + display_name};
        options["aaData"] = datatable;
    }

    return create_table("phenotype_table", options);
}

function create_regulation_table(data) {
    if("Error" in data) {
        var options = {};
        options["bPaginate"] = true;
        options["aaSorting"] = [[4, "asc"]];
        options["aoColumns"] = [{"bSearchable":false, "bVisible":false}, {"bSearchable":false, "bVisible":false}, null, {"bSearchable":false, "bVisible":false}, null, {"bSearchable":false, "bVisible":false}, null, null, null, null, {"bSearchable":false, "bVisible":false}]
        options["oLanguage"] = {"sEmptyTable": data["Error"]};
        options["aaData"] = [];
    }
    else {
        var datatable = [];
        var genes = {};
        for (var i=0; i < data.length; i++) {
            datatable.push(regulation_data_to_table(data[i], false));
            genes[data[i]["bioentity2"]["id"]] = true;
        }

        $("#all_regulation_header").html(data.length);
        $("#all_regulation_subheader").html(Object.keys(genes).length);
        $("#all_regulation_subheader_type").html("genes");

        var options = {};
        options["bPaginate"] = true;
        options["aaSorting"] = [[4, "asc"]];
        options["aoColumns"] = [{"bSearchable":false, "bVisible":false}, {"bSearchable":false, "bVisible":false}, null, {"bSearchable":false, "bVisible":false}, null, {"bSearchable":false, "bVisible":false}, null, null, null, null, {"bSearchable":false, "bVisible":false}]
        options["oLanguage"] = {"sEmptyTable": "No regulation data for " + display_name};
        options["aaData"] = datatable;
    }

	return create_table("all_regulation_table", options);
}