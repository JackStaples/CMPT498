import ReactTable from 'react-table';
import 'react-table/react-table.css';
import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom'
import tableLocations, { table } from './tableLocations.js'

export class TableElem extends Component {

  constructor(props) {
  super(props);
  this.state = {
    columns: getColumns(this.props.data),
    selected: this.props.ID
  };
}




  render() {
  	return (
  		<div id="tablestuff">
  <ReactTable className="-highlight"
    data={this.props.data}
    columns={this.state.columns}
    showPagination={false}
    defaultPageSize={48} 
  	getTdProps={(state, rowInfo, column, instance) => {
    if (rowInfo == undefined){ 
      return {
        onClick: (e) => {
        if (rowInfo == undefined){
        }
        else {
        this.setState({ 
        selected: rowInfo.row.VDSID
        });
        this.props.getID(rowInfo.row.VDSID)
      }
      }
      }
    }
    else {
    return {
      style: {
        background: rowInfo.row.VDSID ==  this.props.ID ? 'lightgrey' : 'white'
      },
      onClick: (e) => {
        if (rowInfo == undefined){
        }
        else {
        console.log('It was in this row:', rowInfo.row.VDSID)
        console.log("this is the row info",rowInfo.row.Location)
        this.setState({
        selected: rowInfo.row.VDSID
        });
        this.props.getID(rowInfo.row.VDSID)
        this.props.setName(rowInfo.row.Location)
      }
      }
    }}


  }}
/>
  	</div>
	);
  }
}

TableElem.defaultProps = {
	data : table,

}

function getColumns(jsonObj) {
    var keys = Object.keys(jsonObj[0]);
    var column = []
    for (var i =0; i< keys.length; i++) {
      var widthVar = 380;
      console.log("This is the key", keys[i]);
      if (keys[i] == "VDSID"){
        widthVar = 75;
      }
      var string = {
        Header : keys[i],
        accessor : keys[i],
        width : widthVar,
      }
      column.push(string)
    }
    console.log(column)
    return column;
}


export default TableElem;

