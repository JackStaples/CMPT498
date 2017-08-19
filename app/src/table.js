import ReactTable from 'react-table';
import 'react-table/react-table.css';
import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';

export class TableElem extends Component {

  render() {
  	return (
  		<div>
  <ReactTable
    data={this.props.data}
    columns={this.props.columns}
  	/>
  	</div>
	);
  }
}

TableElem.defaultProps = {
	data : [{
    name: 'Tanner Linsley',
    age: 26,
    friend: {
      name: 'Jason Maurer',
      age: 23,
    }
  },{
  	name: 'Jack',
  	age: 24,
  	friend: {
  		name: 'fetus',
  		age: 'unborn',
  	}
  }],

  columns : [{
    Header: 'Name',
    accessor: 'name' 
  }, {
    Header: 'Age',
    accessor: 'age',
  }, {
    id: 'friendName', 
    Header: 'Friend Name',
    accessor: d => d.friend.name 
  }, {
    Header: 
  }]

}

function getColumns(jsonObj) {
  
}

export default TableElem;

