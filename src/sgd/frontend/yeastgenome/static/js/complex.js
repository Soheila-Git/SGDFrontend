
$(document).ready(function() {

	$.getJSON(go_details_link, function(data) {
	  	var go_table = create_go_table(data);
        create_download_button("go_table_download", go_table, download_table_link, display_name + '_go_annotations');
        create_analyze_button("go_table_analyze", go_table, analyze_link, analyze_filename, true);
	});

    $.getJSON(complex_details_link, function(data) {
        var gene_table = create_gene_table(data);
        create_download_button("gene_list_table_download", gene_table, download_table_link, display_name + '_genes');
        create_analyze_button("gene_list_table_analyze", gene_table, analyze_link, analyze_filename, true);
        var enrichment_table = create_enrichment_table("enrichment_table", gene_table, null);
        create_download_button("enrichment_table_download", enrichment_table, download_table_link, display_name + "_go_enrichment");
    });

    $.getJSON(complex_graph_link, function(data) {
	    var graph = create_cytoscape_vis("cy", layout, graph_style, data, null, false);
        //var slider = create_slider("slider", graph, data['min_cutoff'], data['max_cutoff'], slider_filter, data['max_cutoff']+1);
    });

    //Hack because footer overlaps - need to fix this.
	add_footer_space("annotations");

});

function create_go_table(data) {
	var datatable = [];
	var genes = {};
	for (var i=0; i < data.length; i++) {
        datatable.push(go_data_to_table(data[i], i));
		genes[data[i]["bioentity"]["id"]] = true;
	}

    set_up_header('go_table', datatable.length, 'entry', 'entries', Object.keys(genes).length, 'gene', 'genes');

	var options = {};
	options["bPaginate"] = true;
	options["aaSorting"] = [[3, "asc"]];
	options["bDestroy"] = true;
	options["oLanguage"] = {"sEmptyTable": "No genes annotated directly to " + display_name + '.'};
    options["aoColumns"] = [{"bSearchable":false, "bVisible":false}, {"bSearchable":false, "bVisible":false}, {"bSearchable":false, "bSortable":false}, null, {"bSearchable":false, "bVisible":false}, null, {"bSearchable":false, "bVisible":false}, null, {"bSearchable":false, "bVisible":false}, null, null, null, null, null, {"bSearchable":false, "bVisible":false}];
	options["aaData"] = datatable;

    return create_table("go_table", options);
}

function create_gene_table(data) {
    var gene_table = null;
    if(data != null && data.length > 0) {
	    var datatable = [];

        for (var i=0; i < data.length; i++) {
            datatable.push(gene_data_to_table(data[i]['locus']));
        }

        $("#gene_list_table_header").html(data.length);

        var options = {};
	    options["bPaginate"] = false;
	    options["aaSorting"] = [[3, "asc"]];
	    options["aoColumns"] = [{"bSearchable":false, "bVisible":false}, {"bSearchable":false, "bVisible":false}, {"bSearchable":false, "bVisible":false}, null, null];
	    options["aaData"] = datatable;

        gene_table = create_table("gene_list_table", options);
	}
	return gene_table;
}

function slider_filter(new_cutoff) {
    var filter = "node[gene_count >= " + new_cutoff + "], edge";
    return filter;
}

var graph_style = cytoscape.stylesheet()
	.selector('node')
	.css({
		'content': 'data(name)',
		'font-family': 'helvetica',
		'font-size': 14,
		'text-outline-width': 3,
		'text-outline-color': '#888',
		'text-valign': 'center',
		'color': '#fff',
		'width': 30,
		'height': 30,
		'border-color': '#fff'
	})
	.selector('edge')
	.css({
		'width': 2
	})
    .selector("node[sub_type='FOCUS']")
	.css({
		'background-color': "#fade71",
		'text-outline-color': '#fff',
		'color': '#888'
	})
    .selector("node[type='BIOCONCEPT']")
	.css({
		'shape': 'rectangle',
		'text-outline-color': '#fff',
		'color': '#888',
		'background-color': "#7FBF7B"
	});

var layout = {
	"name": "arbor",
	"liveUpdate": true,
	"ungrabifyWhileSimulating": true
};