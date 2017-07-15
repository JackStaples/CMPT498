import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import { Nav, NavItem, Jumbotron, Button } from 'react-bootstrap';

var NavElem = React.createClass({
	handleSelect(eventKey){
		alert(`selected ${eventKey}`);
	},

	render: function(){
		return (
			<Nav bsStyle="pills" onSelect={this.handleSelect}>
				<NavItem eventKey="Real-Time" href="#">Real-Time</NavItem>
				<NavItem eventKey="Historical" href="#">Historical</NavItem>
				<NavItem eventKey="Errors" href="#">Errors</NavItem>
				<NavItem eventKey="Export" href="#">Export</NavItem>
			</Nav>
		);
	}
});

ReactDOM.render(
	<NavElem/>,
	document.getElementById('container')
);
