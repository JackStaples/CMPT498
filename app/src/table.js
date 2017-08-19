import ReactTable from 'react-table';
import 'react-table/react-table.css';
import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';

export class TableElem extends Component {

  constructor(props) {
  super(props);
  this.state = {
    columns: getColumns(this.props.data)
  };
}


  render() {
    console.log(this.state.columns);
  	return (
  		<div>
  <ReactTable
    data={this.props.data}
    columns={this.state.columns}
  	/>
  	</div>
	);
  }
}

TableElem.defaultProps = {
	data : [{"datetime":"2016-09-02","occupancy":"30"}],

}

function getColumns(jsonObj) {
    var keys = Object.keys(jsonObj[0]);
    var column = []
    for (var i =0; i< keys.length; i++) {
      //var string =  '{ Header : ' + keys[i] + ',';
      //string = string + ' accessor: ' + keys[i];
      //string = string + ' },';
      var string = {
        Header : keys[i],
        accessor : keys[i]
      }
      column.push(string)
    }
    console.log(column)
    return column;
}

export default TableElem;

