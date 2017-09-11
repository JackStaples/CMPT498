import React, { Component } from 'react';
import get, { httpGet } from './getRequest.js';
import * as d3 from 'd3';
import moment from 'moment';

var startTime;
var endTime;
var lane;

export function renderScatterplotv2(target, vdsID, column, lowDate, highDate, tarLane, live){
d3.select(target).html("");
console.log("hihi", vdsID)
  lane = tarLane;
  console.log("This is the lane that is being passed in Scatter:" ,lane)
 startTime = lowDate._d;
  endTime = highDate._d;
  var lowTime = (lowDate._d.getUTCHours()) + ":" + (lowDate._d.getUTCMinutes()) + ":" + (lowDate._d.getUTCSeconds());
  var lowD = lowDate._d.getFullYear() + "-" + (lowDate._d.getMonth() + 1) + "-" + lowDate._d.getUTCDate();
  var highTime = (highDate._d.getUTCHours() + 1) + ":" + (highDate._d.getUTCMinutes() + 1) + ":" + (highDate._d.getUTCSeconds() + 1);
  var highD = highDate._d.getFullYear() + "-" + (highDate._d.getMonth() + 1) + "-" + highDate._d.getUTCDate();
  httpGet("http://localhost:3001/scatterplot?column=" + column + "&vdsId=" + vdsID +"&lowdate=" + lowD +"+" + lowTime + "&highdate="+ highD + "+" + highTime + "&live=" + live, target, handleScatterplotv2);
}

function handleScatterplotv2(target, response){
  console.log("this is the response", response)
  d3.select(target).html("");
  var data = response.recordset;
  if (Object.keys(data).length === 0) {
    console.log("Hey it worked")
    return
  }
      var property = Object.keys(data[0]);
      console.log("handling scatterplot")
      var highVal = 0;
      var minVal = 0;
      var lowestTime = 0;
      var highestTime = 0;
      var len = data.length;
      // converts the csv strings to datetime and int, records the max and min values of speed
      for (var i in data){
        data[i][property[0]] = new Date(data[i][property[0]])
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
        .domain([startTime, endTime])
        .range([0, width]);
        
     

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
        .style("font", "14px times")
        .attr('transform', 'translate(0,' + height + ')')
        .attr('class', 'main axis date')
        .call(xAxis);

      // draw the y-axis
      var yAxis = d3.axisLeft(y);

      // append the y-axis to the chart
      main.append('g')
        .style("font", "14px times")
        .attr('transform', 'translate(0,0)')
        .attr('class', 'main axis date')
        .call(yAxis);

      var redDots = [];
      var greyDots = [];
      for (var i = 0; i < data.length; i++){
        if (data[i][property[1]] == lane){
          redDots.push(data[i]);
        }
        else {
          greyDots.push(data[i]);
        }
      }
      // selectAll the dataset, and add them to the chart as circles. the functions return the recordTime and speed position.
      
      var g = main.append("svg:g");
      g.selectAll("scatter-dots")
        .data(greyDots)
      .enter().append("circle")
        // if there are more than 3500 entries the graph will draw 2 px circles, otherwise 4
        .attr("r", function(greyDots) {
          return (len > 3500 ? 2 : 4); })
        .attr("cx", function(greyDots) { return x(greyDots[property[0]]); })
        .attr("cy", function(greyDots) { return y(greyDots[property[2]]); })
        .attr("fill", "#D3D3D3")
        // add the hover over on the circle that displays the time and speed
        .append("title")
          .text(function(greyDots) { return "Time: " + greyDots[property[0]].toString() + " "+ [property[2]] + ": " + greyDots[property[2]] });

      // selectAll the dataset, and add them to the chart as circles. the functions return the recordTime and speed position.
      var g = main.append("svg:g");
      g.selectAll("scatter-dots")
        .data(redDots)
      .enter().append("circle")
        // if there are more than 3500 entries the graph will draw 2 px circles, otherwise 4
        .attr("r", function(redDots) {
          return (len > 3500 ? 2 : 4); })
        .attr("cx", function(redDots) { return x(redDots[property[0]]); })
        .attr("cy", function(redDots) { return y(redDots[property[2]]); })
        .attr("fill","#ff4500")
        // add the hover over on the circle that displays the time and speed
        .append("title")
          .text(function(redDots) { return "Time: " + redDots[property[0]].toString() + " "+ [property[2]] + ": " + redDots[property[2]] });

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
          .style('fill', '#ff4500')
          .attr("text-anchor", "middle")
          .attr("transform", "translate(" + width/2 + "," + (margin.top-15) + ")")
          .text("Lane " + lane);
          d3.select(target+ " .spinner").html("");
          }

function getDateString(date){
  var jsDate = new Date(date)
  return jsDate.getFullYear() + "-" + (jsDate.getMonth() + 1) + "-" +  (jsDate.getDate());
}
