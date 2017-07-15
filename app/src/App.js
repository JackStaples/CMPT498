import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import { Nav, NavItem, Jumbotron, Button } from 'react-bootstrap';

var NavElem = React.createClass({

	anotherCall(){
		console.log("hey it worked");
	},

	handleSelect(eventKey){
		alert(`selected ${eventKey}`);
		if (`${eventKey}` == "Real-Time"){
			ReactDOM.render(
				<RealTime/>,
				document.getElementById('container')
			);
		}
		else if (`${eventKey}` == "Historical"){
			ReactDOM.render(
				<Historical/>,
				document.getElementById('container')
			);
		}
		else if (`${eventKey}` == "Errors"){
			ReactDOM.render(
				<Errors/>,
				document.getElementById('container')
			);
		}
		else if (`${eventKey}` == "Export"){
			ReactDOM.render(
				<Export/>,
				document.getElementById('container')
			);
		}
	},

	render: function(){
		return (
			<Nav bsStyle="tabs" onSelect={this.handleSelect}>
				<NavItem eventKey="Real-Time" href="#">Real-Time</NavItem>
				<NavItem eventKey="Historical" href="#">Historical</NavItem>
				<NavItem eventKey="Errors" href="#">Errors</NavItem>
				<NavItem eventKey="Export" href="#">Export</NavItem>
			</Nav>
		);
	}
});

var RealTime = React.createClass ({
	render: function(){
		return (
			<div>Hello, I am the Real-Time Module</div>
		);
	}
})
var Historical = React.createClass ({
	render: function(){
		return (
			<div>Hello, I am the Historical Module</div>
		);
	}
})
var Errors = React.createClass ({
	render: function(){
		return (
			<div>Hello, I am the Errors Module</div>
		);
	}
})
var Export = React.createClass ({
	render: function(){
		return (
			<div>Hello, I am the Export Module</div>
		);
	}
})

ReactDOM.render(
	<NavElem/>,
	document.getElementById('navigation')
);
