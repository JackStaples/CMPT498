import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import { Nav, NavItem, Jumbotron, Button } from 'react-bootstrap';

var NavElem = React.createClass({
	render: function(){
		return (
			<Nav bsStyle="pills">
				<NavItem href="#">Real-Time</NavItem>
				<NavItem href="#">Historical</NavItem>
				<NavItem href="#">Errors</NavItem>
				<NavItem href="#">Export</NavItem>
			</Nav>
		);
	}
});

ReactDOM.render(
	<NavElem/>,
	document.getElementById('container')
);
