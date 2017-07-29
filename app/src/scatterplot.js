import React, { Component } from 'react';
import get, { httpGet } from './getRequest.js';
import * as d3 from 'd3';

export function renderScatterplot(target){
  httpGet("http://localhost:3001/scatterplot?column=speed&vdsId=1003&lowdate=2016-09-01+00:00:00&highdate=2016-09-02+00:00:00&live=false", target, handleScatterplot);
}

function handleScatterplot(target, response){
  var data = response.recordset;
  console.log(JSON.stringify(data));
    var parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");
      var property = Object.keys(data[0]);
      var highVal = 0;
      var minVal = 0;
      var lowestTime = 0;
      var highestTime = 0;
      var len = data.length;
      // converts the csv strings to datetime and int, records the max and min values of speed
      for (var i in data){
        data[i][property[0]] = parseDate(data[i][property[0]])
        data[i][property[2]] = parseInt(data[i][property[2]])
        // track the minimum value for the x axis
        if (data[i][property[2]] > highVal){
          highVal = data[i][property[2]]; 
        }
        // track the minimum value for the y axis
        if (data[i][property[2]] < minVal){
          minVal = data[i][property[2]];
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
            
      // create the x-axis that will be used for the visualization, it uses a time scale
      var x = d3.scaleTime()
        .domain([data[lowestTime][property[0]], data[highestTime][property[0]]])
        .range([0, width]);
      x.nice();
      
      // create the y-axis that will be used for the visualization, it uses a number scale.
      // nice formats it so there is space above the upper bounds
      var y = d3.scaleLinear()
        .domain([minVal, highVal])
        .range([ height, 0 ]);
      y.nice();

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
    
      // selectAll the dataset, and add them to the chart as circles. the functions return the recordTime and speed position.
      var g = main.append("svg:g"); 
      g.selectAll("scatter-dots")
        .data(data)
      .enter().append("circle")
        // if there are more than 3500 entries the graph will draw 2 px circles, otherwise 4
        .attr("r", function(data) { 
          return (len > 3500 ? 2 : 4); })
        .attr("cx", function(data) { return x(data[property[0]]); })
        .attr("cy", function(data) { return y(data[property[2]]); })
        .attr("fill", function(data){
          return (data[property[2]] >= 0 ? "LimeGreen" : "Crimson");
        })
        // add the hover over on the circle that displays the time and speed
        .append("title")
          .text(function(data) { return "Time: " + data[property[0]].toString() + " "+ [property[2]] + ": " + data[property[2]] });

      
        //this section adds the titles to the chart  
        // y-axis title
        chart.append("text")
          .attr("text-anchor", "middle")
          .attr("transform", "translate(" + 15 + "," + (height/2) + ")rotate(-90)")
          .text(property[2]);
      
        //x-axis title
        chart.append("text")
          .attr("text-anchor", "middle")
          .attr("transform", "translate(" + ((width+ margin.right + margin.left)/2) + "," + (height + margin.top + margin.bottom - 20) + ")")
          .text(property[0]);
        
        // header title
        chart.append("text")
          .attr("text-anchor", "middle")
          .attr("transform", "translate(" + width/2 + "," + (margin.top-15) + ")")
          .text(property[1] + " from " + data[lowestTime][property[0]].toLocaleString() + " to " + data[highestTime][property[0]].toLocaleString());
  console.log("Scatterplot code has run");
}