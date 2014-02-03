
if(target_count + regulator_count > 0){
    google.load("visualization", "1", {packages:["corechart"]});
    google.setOnLoadCallback(drawChart);
    function drawChart() {
        var data_table = google.visualization.arrayToDataTable([['Category', 'Genes', { role: 'style' }, { role: 'annotation' }],
                                                                ['Targets', target_count, '#AF8DC3', target_count],
                                                                ['Regulators', regulator_count, '#7FBF7B', regulator_count]]);

        var graph_options = {
            'title': 'Transcriptional Targets and Regulators for ' + display_name,
            'legend': {'position': 'none'},
            'hAxis': {title: 'Genes', minValue: 0},
            'dataOpacity':1,
            'backgroundColor': 'transparent'
        };
        if(Math.max(target_count, regulator_count) == 1) {
            options['hAxis']['gridlines'] = {count:"2"}
        }

        var chart = new google.visualization.BarChart(document.getElementById('summary_diagram'));
        chart.draw(data_table, graph_options);
    }
}
else {
  	document.getElementById("summary_message").style.display = "block";
  	document.getElementById("summary_wrapper").style.display = "none";
}