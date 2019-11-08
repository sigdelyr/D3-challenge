// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold the chart, and shift the latter by left and top margins.
var svg = d3.select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);
// Retrieve data from CSV file and execute everything below

d3.csv('./data.csv').then(function(healthData) {
//Parse data
  healthData.forEach(function(record){
    record.smokes = +record.smokes;
    record.age = +record.age;
    record.poverty = +record.poverty;
    record.healthcare = +record.healthcare;
    record.obesity = +record.obesity;
});

console.log(healthData);
// Create scale functions
var xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d=>d["poverty"]-1),
     d3.max(healthData,d=>d["poverty"])])
    .range([0,width]);
console.log("x-axis data");
console.log(d3.min(healthData, d=>d["poverty"]));
console.log(d3.max(healthData, d=>d["poverty"]));
console.log("y-axis data");
console.log(d3.min(healthData, d=>d["healthcare"]));
console.log(d3.max(healthData, d=>d["healthcare"]));
    
console.log(d3.max(healthData, d=>d["obesity"]));
console.log(d3.min(healthData, d=>d["obesity"]));

var yLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d=>d["healthcare"]-1),
    d3.max(healthData, d=>d["healthcare"])])
    .range([height,0]);
// Create axis functions
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

// append x axis
var xAxis = chartGroup.append("g")
.classed("x-axis", true)
.attr("transform", `translate(0, ${height})`)
.call(bottomAxis);

// append y axis
chartGroup.append("g")
.call(leftAxis);

var gdots =  chartGroup.selectAll("g.dot")
    .data(healthData)
    .enter()
    .append('g');
//Create & append Circles
gdots.append("circle")
     .attr("cx", d => xLinearScale(d["poverty"]))
      .attr("cy", d => yLinearScale(d["healthcare"]))
      .attr("r", d=>d.obesity / 2)
      .attr("fill", "steelblue")
      .attr("opacity", ".5");
//Create text labels with state abbreviation for each circle
gdots.append("text").text(d=>d.abbr)
      .attr("x", d => xLinearScale(d.poverty)-4)
      .attr("y", d => yLinearScale(d.healthcare)+2)
      .style("font-size",".6em")
      .classed("fill-text", true);
console.log(d => xLinearScale(d.poverty));
console.log(d => yLinearScale(d.healthcare));
// Create group for  2 x- axis labels
var labelsGroup = chartGroup.append("g")
.attr("transform", `translate(${width / 2}, ${height + 20})`);
// Create axes labels
var healthDataLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 1 - margin.left)
    .attr("x", 1 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Lacks Healthcare (%)");

}).catch(function(error) {
  console.log(error);
});






  





