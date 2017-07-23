import * as d3 from 'd3';

export function renderMap(target) {

  const script = document.createElement("script");

  script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDKjGHFwdw-vL0GxlmTwYSh6uDmjs3jyU8&callback=initMap";
  script.async = true;

  document.body.appendChild(script);

	var map;
      var latC = 53.5444;
      var longC  = -113.4909;
      function initMap() {
        map = new google.maps.Map(document.getElementById(target), {
          center: {lat: 53.5444, lng: -113.4909},
          zoom: 11
        });

        //var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';

        //var beachMarker = new google.maps.Marker({
          //position: {lat: latC, lng: longC},
          //map: map,
          //icon: image
      //});


      
/*d3.csv("locations.csv", function(error, data) {
  if (error) throw error;
  console.log(data[0].Name);
  var overlay = new google.maps.OverlayView();
  // Add the container when the overlay is added to the map.
  overlay.onAdd = function() {
    var layer = d3.select(this.getPanes().overlayLayer).append("div")
        .attr("class", "stations");
    // Draw each marker as a separate SVG element.
    // We could use a single SVG, but what size would it have?
    overlay.draw = function() {
      var projection = this.getProjection(),
          padding = 10;
      var marker = layer.selectAll("svg")
          .data(data)
          .each(transform) // update existing markers
        .enter().append("svg")
          .each(transform)
          .attr("class", "marker");
      // Add a circle.
      marker.append("circle")
          .attr("r", 4.5)
          .attr("cx", padding)
          .attr("cy", padding);
      // Add a label.
      marker.append("text");
          //.attr("x", padding + 3)
          //.attr("y", padding)
          //.attr("dy", ".81em")
          //.text(function(d) { return d.Name; });
      function transform(d) {
        var lats = parseFloat(d.Lat);
        var longs = parseFloat(d.Long);
        console.log(longs);
        d = new google.maps.LatLng(lats, longs);

        d = projection.fromLatLngToDivPixel(d);
        return d3.select(this)
            .style("left", (d.x - padding) + "px")
            .style("top", (d.y - padding) + "px");
      }
    };
  };
  // Bind our overlay to the map…
  overlay.setMap(map);
});*/

}
}