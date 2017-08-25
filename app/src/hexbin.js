
import React, { Component } from 'react';
import * as d3 from 'd3';
import * as d3hexbin from 'd3-hexbin';
import get, { httpGet } from './getRequest.js';

export function renderHexbin(target, x, y, lowDate, highDate) {
var lowTime = (lowDate._d.getHours()) + ":" + (lowDate._d.getMinutes()) + ":" + (lowDate._d.getSeconds());
  var lowD = lowDate._d.getFullYear() + "-" + (lowDate._d.getMonth() + 1) + "-" + lowDate._d.getDate();
  var highTime = (highDate._d.getHours() + 1) + ":" + (highDate._d.getMinutes() + 1) + ":" + (highDate._d.getSeconds() + 1);
  var highD = highDate._d.getFullYear() + "-" + (highDate._d.getMonth() + 1) + "-" + highDate._d.getDate();
  var queryString = "http://localhost:3001/hexbin?xAxis=" + x + "&yAxis=" + y + "&lowdate="+lowD +"+" + lowTime + "&highdate="+highD+"+" + highTime;
	 httpGet(queryString, target, handleHexbin);
   console.log(queryString);
}

function handleHexbin(target, response) {
        var data = response.recordset;
        var property = Object.keys(data[0]);
        var highColumnOne = 0;
        var lowColumnOne = 0;
        var highColumnTwo = 0;
        var lowColumnTwo = 0;
   
        var points = [];
        
        for (var i in data){
          data[i][property[0]] = parseInt(data[i][property[0]]);
          data[i][property[1]] = parseInt(data[i][property[1]]);
          points.push([data[i][property[1]], data[i][property[0]]])
          
          if (data[i][property[0]] > highColumnOne){
            highColumnOne = data[i][property[0]]
          }
          if (data[i][property[0]] < lowColumnOne){
            lowColumnOne = data[i][property[0]]
          }
          
          if (data[i][property[1]] > highColumnTwo){
            highColumnTwo = data[i][property[1]]
          }
          if (data[i][property[1]] < lowColumnTwo){
            lowColumnTwo = data[i][property[1]]
          }
          
        }
        // this defines the whitespace around the graph, as well as the size of the graph
        var margin = {top: 40, right: 15, bottom: 60, left: 60}
          , width = 1366 - margin.left - margin.right
          , height = 600 - margin.top - margin.bottom;
        
        // could be 20 different colours between white and steelblue
        var color = d3.scaleSequential(d3.interpolateLab("LightGray", "OrangeRed"))
          .domain([0, 150]);
          
        // defines the size of the hexagonal bins
        var hexbin = d3hexbin.hexbin()
          .size([width, height])
          .x(function(d) { return x(d[0]); })
          .y(function(d) { return y(d[1]); })
          .radius(10)
          .extent([[0, 0], [width, height]]);
          
        // define the x-axis that will be used for the visualization, it uses a time scale
        var x = d3.scaleLinear()
          .domain([lowColumnTwo, (highColumnTwo)])
          .range([0, width]);
        x.nice();
        
        // define the y-axis that will be used for the visualization, it uses a number scale.
        // nice formats it so there is space above the upper bounds
        var y = d3.scaleLinear()
          .domain([lowColumnOne, highColumnOne])
          .range([ height, 0 ]);
        y.nice();
        
        // select the body of the DOM and add the svg to it
        var chart = d3.select(target)
          .append('svg:svg')
          .attr('width', width + margin.right + margin.left)
          .attr('height', height + margin.top + margin.bottom)
          .attr('class', 'chart')
        
        // insert the graphic onto the svg
        var main = chart.append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
           
      
        // draw the x-axis
        var xAxis = d3.axisBottom(x);
    
        // append the x-axis
        main.append('g')
          .attr('transform', 'translate(0,' + height + ')')
          .attr('class', 'main axis')
          .call(xAxis);
    
        // draw the y-axis
        var yAxis = d3.axisLeft(y);

        // append the y-axis to the chart
        main.append('g')
          //.attr('transform', 'translate(0,0)')
          .attr('class', 'main axis')
          .call(yAxis);

        // add a rectangle that will cut off anything that moves out of the chart
        main.append("clipPath")
          .attr("id", "clip")
          .append("rect")
          .attr("width", width)
          .attr("height", height);
         
        main.append("g")
          .attr("class", "hexagon")
          .attr("clip-path", "url(#clip)")
          .selectAll("path")
            .data(hexbin(points))
            .enter().append("path")
            .attr("d", hexbin.hexagon())
            .attr("class", "bin")
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
            .attr("fill", function(d) { return color(d.length); })
            .append("title").text(function(d) {return "Coordinates: " + d[0] + " Count: " + d.length});
    
        //this section adds the titles to the chart  
        // y-axis title
        chart.append("text")
          .attr("text-anchor", "middle")
          .attr("transform", "translate(" + 15 + "," + (height/2) + ")rotate(-90)")
          .text(property[0]);
      
        //x-axis title
        chart.append("text")
          .attr("text-anchor", "middle")
          .attr("transform", "translate(" + ((width+ margin.right + margin.left)/2) + "," + (height + margin.top + margin.bottom - 20) + ")")
          .text(property[1]);
        
        // header title
        chart.append("text")
          .attr("text-anchor", "middle")
          .attr("transform", "translate(" + width/2 + "," + (margin.top-15) + ")")
          .text(property[0] + " vs." + property[1]);
        
      }