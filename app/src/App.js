import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import { Nav, NavItem } from 'react-bootstrap';
import Scatter, { renderScatterplot } from './scatterplot.js';
import Hexbin, { renderHexbin } from './hexbin.js';

class NavElem extends React.Component{
	anotherCall(){
		console.log("hey it worked");
	}

	handleSelect(eventKey){
		if (`${eventKey}` === "Real-Time"){
			ReactDOM.render(
				<RealTime/>,
				document.getElementById('container')
			);
		}
		else if (`${eventKey}` === "Historical"){
			ReactDOM.render(
				<Historical/>,
				document.getElementById('container')
			);
		}
		else if (`${eventKey}` === "Errors"){
			ReactDOM.render(
				<Errors/>,
				document.getElementById('container')
			);
		}
		else if (`${eventKey}` === "Export"){
			ReactDOM.render(
				<Export/>,
				document.getElementById('container')
			);
		}
	}

	render(){
		return (
			<Nav bsStyle="tabs" onSelect={this.handleSelect}>
				<NavItem eventKey="Real-Time" href="#">Real-Time</NavItem>
				<NavItem eventKey="Historical" href="#">Historical</NavItem>
				<NavItem eventKey="Errors" href="#">Errors</NavItem>
				<NavItem eventKey="Export" href="#">Export</NavItem>
			</Nav>
		);
	}

	componentDidMount() {
		console.log("Navigation is mounted");
	}
}

class RealTime extends React.Component {

	render() {
		return (
			<div name="Realtime">
				<div>Hello, I am the RealTime Module</div>
				<div 
					id="realTimeScatterplot"
					ref={ renderScatterplot("#realTimeScatterplot") }
				/>
				<div 
					id="Linegraph"

				/>
      		</div>
		);
	}

	componentDidMount() {
		console.log("Realtime was mounted");
	}
	componentWillUnmount() {
		console.log("Realtime is unmounting");
	}
	shouldComponentUpdate() {
		return false;
	}

}

class Historical extends React.Component {
	render(){
		return (
			<div>
				<div>Hello, I am the Historical Module</div>
				<div 
					id="hexbin"
					ref={ renderHexbin }
				/>
				<div
					id="historicalScatterplot"
					ref={ renderScatterplot("#historicalScatterplot") }
				/>
			</div>
		);
	}
}

class Errors extends React.Component {
	render(){
		return (
			<div>Hello, I am the Errors Module</div>
		);
	}
}

class Export extends React.Component {
	render(){
		return (
			<div>Hello, I am the Export Module</div>
		);
	}
}

ReactDOM.render(
	<NavElem/>,
	document.getElementById('navigation')
);
ReactDOM.render(
	<RealTime/>,
	document.getElementById('container')
);
