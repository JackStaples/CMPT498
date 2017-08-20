import * as d3 from 'd3';
import get, { httpGet } from './getRequest.js';

export function renderLinegraph(target, column, lowDate, highDate){
  var lowTime = lowDate.toTimeString().slice(0,8);
  var lowD = lowDate.toISOString().slice(0,10);
  var highTime = highDate.toTimeString().slice(0,8);
  var highD = highDate.toISOString().slice(0,10);
  var hour = highTime.slice(0,2)
  var queryString = "http://localhost:3001/linegraph?column=" + column + "&vdsId=1011&hour=" + hour + "&lowdate=";
    httpGet("http://localhost:3001/linegraph?column=speed&vdsId=1011&hour=9&lowdate="+lowD +"+" + lowTime + "&highdate="+highD+"+" + highTime + "&live=false", target, handleLinegraph);
}

function handleLinegraph(target, response){
  var data = response.recordset;
  console.log("this is the data" + data);
          var property = Object.keys(data[0]);
          var highVal = 0;
          var minVal = 0;
          var lowestTime = 0;
          var highestTime = 0;
          var len = data.length;

          // will contain the data for each line
          var lanesOne = [];
          var lanesTwo = [];
          var lanesThree = [];
          var lanesFour = [];
          var lane = 0;

          // converts the csv strings to datetime and int, records the max and min values of speed
          for (var i in data){
            data[i][property[0]] = new Date(data[i][property[0]]);
            data[i][property[1]] = parseInt(data[i][property[1]]);
            data[i][property[2]] = parseInt(data[i][property[2]]);

            // fill the arrays for the lines
            if ( data[i][property[1]] == 1 ) {
              lanesOne.push(data[i]);
              if (lane < 1){
              lane = 1 }
            }
            else if ( data[i][property[1]] == 2 ) {
              lanesTwo.push(data[i]);
              if (lane < 2){
              lane = 2 }
            }
            else if ( data[i][property[1]] == 3 ) {
              lanesThree.push(data[i]);
              if (lane < 3){
              lane = 3 }
            }
            else if ( data[i][property[1]] == 4 ) {
              lanesFour.push(data[i]);
              if (lane < 4){
              lane = 4}
            }

            // track the minimum value for the x axis
            if (data[i][property[2]] > highVal){
              highVal = data[i][property[2]];
            }
            // track the minimum value for the y axis
            if (data[i][property[0]] < minVal){
              minVal = data[i][property[0]];
            }
            // track the lowest time for the title
            if (data[i][property[0]] < data[lowestTime][property[0]] && data[i][property[0]] != null ){
              lowestTime = i;
            }
            // track the highest time for the title
            if (data[i][property[0]] > data[highestTime][property[0]] && data[i][property[0]] != null ){
              highestTime = i;
            }
          }

          // this defines the whitespace around the graph, as well as the size of the graph
          var margin = {top: 40, right: 15, bottom: 60, left: 60}
            , width = 1366 - margin.left - margin.right
            , height = 600 - margin.top - margin.bottom;

          // define the x-axis that will be used for the visualization, it uses a time scale
          var x = d3.scaleTime()
            .domain([data[lowestTime][property[0]], data[highestTime][property[0]]])
            .range([0, width]);
          x.nice();

          // define the y-axis that will be used for the visualization, it uses a number scale.
          // nice formats it so there is space above the upper bounds
          var y = d3.scaleLinear()
            .domain([minVal, highVal])
            .range([ height, 0 ]);
          y.nice();

          // define the line
          var line = d3.line()
            .x(function(data) { return x( data[property[0]]); })
            .y(function(data) { return y( data[property[2]]); });

          // select the body of the DOM and assign spacing to it
          var chart = d3.select(target)
            .append('svg:svg')
            .attr('width', width + margin.right + margin.left)
            .attr('height', height + margin.top + margin.bottom)
            .attr('class', 'chart')

          // insert the chart into the body
          var main = chart.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            .attr('width', width)
            .attr('height', height)
            .attr('class', 'main')

          // draw the x-axis
          var xAxis = d3.axisBottom(x);

          // append the x-axis
          main.append('g')
            .attr('transform', 'translate(0,' + height + ')')
            .attr('class', 'main axis date')
            .call(xAxis);

          // draw the y-axis
          var yAxis = d3.axisLeft(y);

          // append the y-axis to the chart
          main.append('g')
            .attr('transform', 'translate(0,0)')
            .attr('class', 'main axis date')
            .call(yAxis);

          var g = main.append("svg:g");


          if (lanesOne.length > 0){
          // Add the first line
          g.append("path")
            .attr("fill", "none")
            .attr("stroke", "#800000")
            .attr("stroke-width", 2)
            .datum(lanesOne)
            .attr("d", line)
            .append("title")
              .text(function() { return "Lane: " + lanesOne[0][property[1]] });
          }

          if (lanesTwo.length > 0){
          // Add the second line
          g.append("path")
            .attr("fill", "none")
            .attr("stroke", "#00eeee")
            .attr("stroke-width", 2)
            .datum(lanesTwo)
            .attr("d", line)
            .append("title")
              .text(function() { return "Lane: " + lanesTwo[0][property[1]] });
          }
          if (lanesThree.length > 0){
          // Add the third line
          g.append("path")
            .attr("fill", "none")
            .attr("stroke", "#00ee00")
            .attr("stroke-width", 2)
            .datum(lanesThree)
            .attr("d", line)
            .append("title")
              .text(function() { return "Lane: " + lanesThree[0][property[1]] });
          }

          if (lanesFour.length > 0){
          // Add the fourth line
          g.append("path")
            .attr("fill", "none")
            .attr("stroke", "#ffff00")
            .attr("stroke-width", 2)
            .datum(lanesFour)
            .attr("d", line)
            .append("title")
              .text(function() { return "Lane " + lanesFour[0][property[1]] });
          }
        //this section adds the titles to the chart
        // y-axis title
        chart.append("text")
          .attr("text-anchor", "middle")
          .attr("transform", "translate(" + 15 + "," + (height/2) + ")rotate(-90)")
          .text(property[1]);

        //x-axis title
        chart.append("text")
          .attr("text-anchor", "middle")
          .attr("transform", "translate(" + ((width+ margin.right + margin.left)/2) + "," + (height + margin.top + margin.bottom - 20) + ")")
          .text(property[0]);

        // header title
        /*chart.append("text")
          .attr("text-anchor", "middle")
          .attr("transform", "translate(" + width/2 + "," + (margin.top-15) + ")")
          .text(property[1] + " of different lanes from " + data[lowestTime][property[0]].toLocaleString() + " to " + data[highestTime][property[0]].toLocaleString());

        var lanes = ["Lane 1", "Lane 2", "Lane 3", "Lane 4"];
        var legend = g.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "end")
          .selectAll("g")
          .data(lanes.slice(0, lane))
          .enter().append("g")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

          var z = d3.scaleOrdinal()
            .range(["#800000", "#00eeee", "#00ee00", "#ffff00"]);
          legend.append("rect")
            .attr("x", width - 19)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", z);

          legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .text(function(d) { return d; });*/
}
