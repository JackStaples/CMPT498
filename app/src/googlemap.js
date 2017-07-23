
import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import _ from "lodash";

//import Helmet from "react-helmet";


// Wrap all `react-google-maps` components with `withGoogleMap` HOC
// and name it GettingStartedGoogleMap
export const RenderGoogleMap = withGoogleMap(props => (
  <GoogleMap
    ref={props.onMapLoad}
    defaultZoom={ 10 }
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

export class MapElement extends Component {


  state = {
    markers:
        [{
      position: {
        lat: 53.5444,
        lng: -113.4909,
      },
      defaultAnimation: 2,
    },{
      position: {
        lat: 52.5444,
        lng: -113.4909,
      },
      defaultAnimation: 2,
    }]
  };

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