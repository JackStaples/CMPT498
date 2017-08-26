import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import _ from "lodash";
import * as locations from './locations.js';

import * as d3 from 'd3';
import get, { httpGet } from './getRequest.js';

// Wrap all `react-google-maps` components with `withGoogleMap` HOC
// and name it GettingStartedGoogleMap
export const RenderGoogleMap = withGoogleMap(props => (
  <GoogleMap
    ref={props.onMapLoad}
    defaultZoom={ 11 }
    defaultCenter={{ lat: 53.5444, lng: -113.4909 }}
    onClick={props.onMapClick}
  >
  {props.markers.map(marker => (
      <Marker
        {...marker}
        onClick={() => props.onMarkerClick(marker)}
      />
    ))}
  </GoogleMap>
));

export class MapElement extends Component {
  state = locations;
  
  handleMapLoad = this.handleMapLoad.bind(this);

  handleMapLoad(map) {
    this._mapComponent = map;
  }
  
  handleMarkerClick(targetMarker) {
    console.log("something happened", targetMarker.VDSID);
  }
  
  render() {
    return (
      <div style={{height: `500px`, width: `1366px`}}>
        <RenderGoogleMap
          onMarkerClick={this.handleMarkerClick.bind(this)}
          containerElement={
            <div style={{ height: `100%` }} />
          }
          mapElement={
            <div style={{ height: `100%` }} />
          }
          onMapLoad={this.handleMapLoad}
          markers= {this.state.markers}
        />
      </div>
    );
  }
}

export default MapElement;


  /*
  var xmlHTTP = new XMLHttpRequest();
  xmlHTTP.onreadystatechange = function() {
  if (xmlHTTP.readyState==4 && xmlHTTP.status==200) {
    console.log("response received");
    var response = JSON.parse(xmlHTTP.responseText)
    var data = response.recordsets[0];
    for (var i = 1; i < data.length; i++){
      this.markerObj.markers.push(
        [{
          position: {
            lat: data[i].lat,
            lng: data[i].long,
          },
          defaultAnimation: 2,
      }]
      )      
    }
    console.log("This is what is being returned" + JSON.stringify(this.markerObj.markers));
  this.setState(this.markerObj.markers);

  }
  }
  xmlHTTP.open('GET', "http://localhost:3001/map", true );
  xmlHTTP.send(null);*/