import * as d3 from 'd3';
import get, { httpGet } from './getRequest.js';



export function renderCalendar(target){
  httpGet("http://localhost:3001/calendar?column=occ&year=2016", target, handleCalendar);
}

export function handleCalendar(target,response){
  
var data = response.recordset;
var parseDate = d3.timeParse("%Y-%m-%d");
var property = Object.keys(data[0]);
for (var i in data){
  data[i][property[0]] = data[i][property[0]].slice(0,10)
}
      for (var i in data){
        console.log(data[i][property[0]])
        data[i][property[0]] = data[i][property[0]].slice(0,10)
        data[i][property[1]] = parseInt(data[i][property[1]]);
        console.log("\nThis is the timestamp     " + data[i][property[0]]);
}
var width = 1366,
    height = 136,
    cellSize = 17;

var formatPercent = d3.format(".1%");

var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];



var color = d3.scaleQuantize()
    .domain([0, 10])
    .range(["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850", "#006837"]);
//Creates the number of
var svg = d3.select(target)
  .selectAll("svg")
  .data(d3.range(2016, 2018))
  .enter().append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");

svg.append("text")
    .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("text-anchor", "middle")
    .text(function(d) { return d; });

//svg.append("text")
  //.text("Jan")
  //.attr("transform", "translate(20)");

//svg.append("text")
  //.text("Feb")
  //.attr("transform", "translate(115)");

//svg.append("text")
  //.text("Su")
  //.attr("font-size", 10)
  //.attr("transform", "translate(-14, 12)");

//svg.append("text")
  //.text("Sat")
  //.attr("font-size", 10)
  //.attr("transform", "translate(-15, 112)");

var rect = svg.append("g")
    .attr("fill", "none")
    .attr("stroke", "#ccc")
  .selectAll("rect")
  .data(function(d) { return d3.timeDays(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
  .enter().append("rect")
    .attr("width", cellSize)
    .attr("height", cellSize)
    .attr("x", function(d) { return d3.timeWeek.count(d3.timeYear(d), d) * cellSize; })
    .attr("y", function(d) { return d.getDay() * cellSize; })
    .datum(d3.timeFormat("%Y-%m-%d"));

svg.append("g")
    .attr("fill", "none")
    .attr("stroke", "#500")
  .selectAll("path")
  .data(function(d) { return d3.timeMonths(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
  .enter().append("path")
    .attr("d", pathMonth);

 
  for (var i in data){
    console.log("\nThis is the 1th property " + data[i][property[1]]);
  rect.filter(function(d) { return data[i][property[0]]; })
      .attr("fill", function(d) { return color(data[i][property[1]]); })
    .append("title")
      .text(function(d) { return d + ": " + data[i][property[1]] });
  }
}

function pathMonth(t0) {
	var cellSize = 17;
  var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
      d0 = t0.getDay(), w0 = d3.timeWeek.count(d3.timeYear(t0), t0),
      d1 = t1.getDay(), w1 = d3.timeWeek.count(d3.timeYear(t1), t1);

  return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
      + "H" + w0 * cellSize + "V" + 7 * cellSize
      + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
      + "H" + (w1 + 1) * cellSize + "V" + 0
      + "H" + (w0 + 1) * cellSize + "Z";
}