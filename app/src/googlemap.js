import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import _ from "lodash";

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
      />
    ))}
  </GoogleMap>
));

function getLocation(){

  var xmlHTTP = new XMLHttpRequest();
  xmlHTTP.onreadystatechange = function() {
  if (xmlHTTP.readyState==4 && xmlHTTP.status==200) {
    console.log("Response received! WE DID IT!");
    var response = JSON.parse(xmlHTTP.responseText)
    console.log(JSON.stringify(response));
  }
  };
  xmlHTTP.open('GET', "http://localhost:3001/map", true );
  xmlHTTP.send(null);
  
  var mark = { markers:
        [{
      position: {
        lat: 53.5444,
        lng: -113.4909,
      },
      defaultAnimation: 2,
    }]}
    
  return mark;
}

export class MapElement extends Component {

  state = getLocation();
    

  handleMapLoad = this.handleMapLoad.bind(this);

  handleMapLoad(map) {
    this._mapComponent = map;
    if (map) {
      console.log(map.getZoom());
    }
  }

  render() {
    return (
      <div style={{height: `500px`, width: `1366px`}}>
        <RenderGoogleMap
          containerElement={
            <div style={{ height: `100%` }} />
          }
          mapElement={
            <div style={{ height: `100%` }} />
          }
          onMapLoad={this.handleMapLoad}
          markers={this.state.markers}
        />
      </div>
    );
  }
}

export default MapElement;