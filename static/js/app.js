// Get the data location
const samples = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the JSON data and console log it
d3.json(samples).then(function(data) {
  console.log(data);
});


// Makes dropdown and loads graphs
function makeDropdown() {

    // Use D3 to select dropdown
    let dropdownMenu = d3.select("#selDataset");

    // Use D3 to get sample names and input data
    d3.json(samples).then((data) => {
        
        // Collect names and make dropdown (loop)
        let names = data.names;

        names.forEach((id) => {

            console.log(id);
            dropdownMenu.append("option").text(id).property("value",id);
        });

        // Set the first sample from the list
        let firstSample = names[0];

        // Graph functions
        displayMetadata(firstSample);
        makeBarChart(firstSample);
        makeBubbleChart(firstSample);

    });
};

// Makes bar chart
function makeBarChart(sample) {

    // Use D3 to retrieve all of the data
    d3.json(samples).then((data) => {

        // Collect sample data and filter
        let sampledata = data.samples;
        let matches = sampledata.filter(result => result.id == sample);

        // First result from array
        let matchData = matches[0];

        // Get the otu_ids, otu_labels, and sample_values
        let otu_ids = matchData.otu_ids;
        let otu_labels = matchData.otu_labels;
        let sample_values = matchData.sample_values;

        // top 10 values to graph (reverse to do big to small)
        let y = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let x = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();
        
        // Trace
        let trace = {
            x: x,
            y: y,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        // Layout
        let layout = {
            title: "Top 10 OTUs Present"
        };

        // Actually makes chart
        Plotly.newPlot("bar", [trace], layout)
    });
};

// Makes bubble chart
function makeBubbleChart(sample) {

    // Use D3 to retrieve all of the data
    d3.json(samples).then((data) => {
        
        // Collect sample data and filter
        let sampleInfo = data.samples;
        let value = sampleInfo.filter(result => result.id == sample);

        // First result from array
        let valueData = value[0];

        // Get the otu_ids, otu_labels, and sample_values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;
        
        // Set up trace
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "continent"
            }
        };

        // Layout
        let layout = {
            title: "Bacteria Per Sample",
            xaxis: {title: "OTU ID"},
        };

        // Actually builds chart
        Plotly.newPlot("bubble", [trace1], layout)
    });
};

// Metadata thing
function displayMetadata(sample) {

    d3.json(samples).then((data) => {

        // Collect metadata and filter
        let metadata = data.metadata;
        let value = metadata.filter(result => result.id == sample);

        // First result from array
        let valueData = value[0];

        // Empty values  
        d3.select("#sample-metadata").html("");

        // Adds key/value pairs to display
        Object.entries(valueData).forEach(([key,value]) => {

            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });

};

// Updates page when dropdown is modified - woooooo!
function optionChanged(value) { 

    // Call all charts 
    displayMetadata(value);
    makeBarChart(value);
    makeBubbleChart(value);

};

// Runs everything
makeDropdown();