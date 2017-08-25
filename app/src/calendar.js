import * as d3 from 'd3';
import get, { httpGet } from './getRequest.js';



export function renderCalendar(target, year, occ){
  var queryString = "http://localhost:3001/calendar?column=" + occ + "&year=" + year;
  console.log(queryString)
  httpGet(queryString, target, handleCalendar);
}

export function handleCalendar(target,response){
  
var data = response.recordset;
  if (Object.keys(data).length === 0) {
    console.log("Hey it worked")
    return
  }
var property = Object.keys(data[0]);
var max = 0;
var min = 1000;
console.log("This is the property" + property)
for (var i in data){
  data[i][property[0]] = data[i][property[0]].slice(0,10)
}
      for (var i in data){
        console.log("This is the number         " + data[i][property[1]])
        data[i][property[0]] = data[i][property[0]].slice(0,10)
        data[i][property[1]] = parseInt(data[i][property[1]]);
        if (data[i][property[1]] > max){
          max = data[i][property[1]];
        } 
        if (data[i][property[1]] < min){
          min = data[i][property[1]];
        }

}
var year = parseInt(data[0][property[0]].slice(0,4));
var width = 1366,
    height = 136,
    cellSize = 17;

var formatPercent = d3.format(".1%");

var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

var color = d3.scaleQuantize()
    .domain([min, max])
    .range(["#FF4500", "#FA5315", "#F6612A", "#F16F3F", "#ED7D54", "#E98C69", "#E49A7E", "#E0A893", "#DBB6A8", "#D7C4BD", "#D3D3D3"]);
//Creates the number of
var svg = d3.select(target)
  .selectAll("svg")
  .data(d3.range(year, year+1))
  .enter().append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");

svg.append("text")
    .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
    .attr("font-family", "sans-serif")
    .attr("font-size", 14)
    .attr("text-anchor", "middle")
    .text(function(d) { return d; });

svg.append("text")
  .text("Jan")
  .attr("transform", "translate(20)");

svg.append("text")
  .text("Dec")
  .attr("transform", "translate(875)");

svg.append("text")
  .text("Sun")
  .attr("font-size", 14)
  .attr("transform", "translate(-25, 12)");

svg.append("text")
  .text("Sat")
  .attr("font-size", 14)
  .attr("transform", "translate(-25, 112)");

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

  var d3nest = d3.nest()
      .key(function(d) { return d.datetime; })
      .rollup(function(d) { return d[0].aggregate; })
    .object(data);
  rect.filter(function(d) { return d in d3nest; })
      .attr("fill", function(d) { return color(d3nest[d]); })
    .append("title")
      .text(function(d) { return d + ": " + d3nest[d] });
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