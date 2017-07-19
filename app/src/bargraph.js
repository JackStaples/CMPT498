import * as d3 from 'd3';

export function renderBargraph(vals, target) {
  d3.csv(vals, function(data) {
     //d3.csv("./laneCorrectness.csv", function(data) {
        var property = Object.keys(data[0]);
        var highVal = 0;
        var lowVal = 0;
        for (var i in data){
          data[i][property[0]] = parseInt(data[i][property[0]]);
          data[i][property[1]] = parseInt(data[i][property[1]]);
          data[i][property[2]] = parseInt(data[i][property[2]]);
        }
        // sort it so 1003 is at the top
        data.sort(function(a, b) { return a[property[2]] - b[property[2]]; });
        
        var svg = d3.select(target),
          margin = {top: 20, right: 20, bottom: 30, left: 40},
          width = +svg.attr("width") - margin.left - margin.right,
          height = +svg.attr("height") - margin.top - margin.bottom,
          g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
          
        var x = d3.scaleLinear()
          .domain([0, d3.max(data, function(d) { return d[property[1]]; })])
          .range([0, width])
          .nice();
          
        
        var y = d3.scaleBand()
          .domain(data.map(function(d) { return d[property[0]]; }))
          .rangeRound([ height, 0 ])
          .paddingInner(0.05)
          .align(0.5);
       

        var z = d3.scaleOrdinal()
          .range(["orangered", "LightGray"]);
          
        var keys = data.columns.slice(1);
        var b = keys[1];
        keys[1] = keys[0];
        keys[0] = b;
        
        g.append("g")
          .selectAll("g")
          .data(d3.stack().keys(keys)(data))
          .enter().append("g")
            .attr("fill", function(d) { return z(d.key); })
          .selectAll("rect")
          .data(function(d) { return d; })
          .enter().append("rect")
            .attr("x", function(d) { return x(d[0]); })
            .attr("y", function(d) { return y(d.data[property[0]])})
            .attr("height", (y.bandwidth()-2))
            .attr("width", function(d) {return x(d[1]) - x(d[0]);});

        
        var xAxis = d3.axisBottom(x).ticks(null, "s");
        
        g.append('g')
          .attr('transform', 'translate(0,' + height + ')')
          .attr('class', 'axis')
          .call(xAxis);
        
        // draw the y-axis
        var yAxis = d3.axisLeft(y)
        .tickPadding([2]);

        // append the y-axis to the chart
        g.append('g')
          .attr('transform', 'translate(0,0)')
          .attr('class', 'axis')
          .call(yAxis);

          d3.select("#sortIncorrect").on("change", change);
          
          
            function change() {
              console.log("changing!");
              

              // Copy-on-write since tweens are evaluated after a delay.
              
              var ysort = y.domain(data.sort(this.checked
                ? function(a, b) { return b[property[2]] - a[property[2]]; }
                : function(a, b) { return b[property[1]] - a[property[1]];; })
                .map(function(d) { return d[property[0]]; }))
                .copy();
                
              svg.selectAll(".group")
                .sort(function(a, b) { return ysort(a[property[0]]) - ysort(b[property[0]]); });

              var transition = svg.transition().duration(750),
                delay = function(d, i) { return i * 50; };
              
              transition.selectAll(".group")
                .delay(delay)
                .attr("transform", function(d) { return "translate("+ (ysort(d[property[0]]) + ",0)");})
                .attr("y", function(d) { return ysort(d[property[0]]); });
                
                
              console.log();
              transition.select(".y.axis")
                .call(d3.axisLeft(y))
                .selectAll("g")
                .delay(delay);
              };          
        console.log("done");
      });
}