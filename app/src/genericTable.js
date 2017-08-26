import ReactTable from 'react-table';
import 'react-table/react-table.css';
import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom'
import tableLocations, { table } from './tableLocations.js'
import get, { httpGet } from './getRequest.js';

export class TableElemGen extends Component {

  constructor(props) {
  super(props);
  this.getJSONObj = this.getJSONObj.bind(this);
  this.setJSONState = this.setJSONState.bind(this);
  this.getJSONObj();
  this.state = {columns : [{loading: "This was a loading error"}],
    obj : [{loading: "There was a loading error"}],
  }
  }
  getJSONObj() {
    httpGet("http://localhost:3001/scatterplot?column=speed&vdsId=1011&lowdate=2016-09-01+00:00:00&highdate=2016-09-02+00:00:00&live=false", null, this.setJSONState);
  }

  setJSONState(target, response) {
  var data = response.recordset;
  console.log(data, "THIS IS THE DATA YAH COOOOONT")
  this.setState( {
    obj: data,
    columns: getColumns(data),
  });
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