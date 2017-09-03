import ReactTable from 'react-table';
import 'react-table/react-table.css';
import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom'
import tableLocations, { table } from './tableLocations.js'
import get, { httpGet } from './getRequest.js';

export class TableElemGen extends Component {

  constructor(props) {
  super(props);
  console.log(props)
  this.getJSONObj = this.getJSONObj.bind(this);
  this.setJSONState = this.setJSONState.bind(this);
  this.getJSONObj();
  this.state = {columns : [{loading: "This was a loading error"}],
    obj : [{loading: "There was a loading error"}],
  }
  }
  getJSONObj() {

    var lowTime = (this.props.lowDate._d.getUTCHours()) + ":" + (this.props.lowDate._d.getUTCMinutes()) + ":" + (this.props.lowDate._d.getUTCSeconds());
    var lowD = this.props.lowDate._d.getFullYear() + "-" + (this.props.lowDate._d.getMonth() + 1) + "-" + this.props.lowDate._d.getUTCDate();
    var highTime = (this.props.highDate._d.getUTCHours() + 1) + ":" + (this.props.highDate._d.getUTCMinutes() + 1) + ":" + (this.props.highDate._d.getUTCSeconds() + 1);
    var highD = this.props.highDate._d.getFullYear() + "-" + (this.props.highDate._d.getMonth() + 1) + "-" + this.props.highDate._d.getUTCDate();
    if (this.props.type == 0){
    var querystring = "http://localhost:3001/scatterplot?column=" + this.props.column + "&vdsId=" + this.props.vdsID +" &lowdate=" +lowD +"+" + lowTime + "&highdate="+highD+"+" + highTime + "&live=" + this.props.live;
  }
  else {
    var querystring = "http://localhost:3001/bargraphLanes?VDSID=" + this.props.vdsID + "&lowdate=" + lowD + "&highdate=" + highD
    console.log(querystring)
  }
    httpGet(querystring, null, this.setJSONState);
  }

  setJSONState(target, response) {
  var data = response.recordset;
  console.log(data, "THIS IS THE DATA YAH COOOOONT")
  if (Object.keys(data).length === 0) {
    return
  }
  else {
  this.setState( {
    obj: data,
    columns: getColumns(data),
  });}
  }

  render() {
    console.log(this.state)
  	return (
  		<div>
      <ReactTable className="-highlight"
    data={this.state.obj}
    columns={this.state.columns}
    />
    </div>
    );
  }
}

function getColumns(jsonObj) {
    var keys = Object.keys(jsonObj[0]);
    var column = []
    for (var i =0; i< keys.length; i++) {

      var string = {
        Header : keys[i],
        accessor : keys[i]
      }
      column.push(string)
    }
    console.log(column)
    return column;
}


export default TableElemGen;