import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import { Nav, NavItem, DropdownButton, MenuItem } from 'react-bootstrap';
import Scatter, { renderScatterplot } from './scatterplot.js';
import Hexbin, { renderHexbin } from './hexbin.js';
import Linegraph, { renderLinegraph } from './linegraph.js';
import Barchart, { renderBargraph } from './bargraph.js';
import Google, { MapElement, RenderGoogleMap } from './googlemap.js';
import Calendar, { renderCalendar } from './calendar.js';
import moment from 'moment'
import ReactWidgets, {DateTimePicker} from 'react-widgets';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import 'react-widgets/dist/css/react-widgets.css';
import DropdownList from 'react-widgets/lib/DropdownList';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
momentLocalizer(moment);
class NavElem extends React.Component{
	anotherCall(){
		console.log("hey it worked");
	}

	handleSelect(eventKey){
		console.log(eventKey);
		if (eventKey === 0){
			ReactDOM.render(
				<RealTime/>,
				document.getElementById('container')
			);
		}
		else if (eventKey === 1){
			ReactDOM.render(
				<Historical test='occ'/>,
				document.getElementById('container')
			);
		}
		else if (eventKey === 2){
			ReactDOM.render(
				<Errors/>,
				document.getElementById('container')
			);
		}
		else if (eventKey === 3){
			ReactDOM.render(
				<Export/>,
				document.getElementById('container')
			);
		}
	}

	render(){
		return (
			<Tabs onSelect={this.handleSelect}>
    <TabList>
      <Tab>RealTime</Tab>
      <Tab>Historical</Tab>
      <Tab>Errors</Tab>
      <Tab>Export</Tab>
    </TabList>
  </Tabs>
		);
	}

	componentDidMount() {
		console.log("Navigation is mounted");
	}
}

class DataWidgets extends React.Component {

	constructor(props) {
    	super(props);
    	this.state = {column: "vol"};
    	this.state = {date: new Date()};
    	this.update = this.update.bind(this);
    	this.reRender = this.reRender.bind(this);
    	this.dateUpdate = this.dateUpdate.bind(this);

  	}

  	update(eventKey){
  		this.setState({
  			column: `${eventKey}`
  		}, function () {
  			this.reRender();
  			console.log(this.state.date)
  		});
  	}
  	dateUpdate(eventKey){
  		this.setState({
  			date: new Date(eventKey)
  		});
  	}
  	reRender(){
  		ReactDOM.render(
				<Refresh/>,
				document.getElementById('container')
			);
  		ReactDOM.render(
				<Historical test={this.state.column} date={this.state.date}/>,
				document.getElementById('container')
			);
  	}

	render() {
		return (
		<div>
		<DropdownButton bsStyle="default" id="column_selector" title="Columns" onSelect={this.update}>
			<MenuItem eventKey="occ">Occupancy</MenuItem>
			<MenuItem eventKey="speed">Speed</MenuItem>
			<MenuItem eventKey="vol">Volume	</MenuItem>
		</DropdownButton>
		<DateTimePicker defaultValue={new Date()} onSelect={this.dateUpdate} parse={str => new Date(str)}/>
		</div>
		);
	}
}

class RealTime extends React.Component {

	render() {
		return (


			<div name="Realtime">
				<MapElement />
				<div 
					id="realTimeScatterplot"
					margin="0 auto"
					ref={ renderScatterplot("#realTimeScatterplot") }
				/>
				<div 
					id="realTimeLinegraph"
					ref={ renderLinegraph("#realTimeLinegraph") }
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

	constructor(props) {
    	super(props);
        this.state = {column: "vol"};
        this.update = this.update.bind(this);
  	}
  	update(eventKey){
  		this.setState({
  			column: `${eventKey}`
  		}, function () {
  			console.log("This is the event key" + `${eventKey}`)
  			console.log("this is the state column" + this.state.column)
  		});

  	}

  	reRender(){
  		ReactDOM.render(
				<RealTime/>,
				document.getElementById('container')
			);
  	}
	render(){
		return (
			<div>
				<div
                    id="Calendar"
                    ref={ renderCalendar("#Calendar", this.props.date, this.props.test) }
                />
                <div>
                <p> {this.state.column} </p>
                </div>
				<MapElement />
				<div 
					id="hexbin"
					ref={ renderHexbin("#hexbin") }
				/>
				<div
					id="historicalScatterplot"
					ref={ renderScatterplot("#historicalScatterplot") }
				/>
				<div
					id="historicalLinegraph"
					ref={ renderLinegraph("#historicalLinegraph") }
				/>
			</div>
		);
	}
	componentDidMount() {
		console.log("Historical was mounted");
	}
	componentWillUnmount() {
		console.log("Historical is unmounting");
	}
	shouldComponentUpdate() {
		console.log("it tried to update")
		return true;
	}
}

class Errors extends React.Component {
	render(){
		return (
			<div>
				<svg width="1366" height="700"
					id="vdsidBargraph"
					ref={ renderBargraph(0, "#vdsidBargraph") }
				/>
				<svg width="1366" height="700"
					id="lanesBargraph"
					ref={ renderBargraph(1, "#lanesBargraph") }
				/>
			</div>
		);	
	}
	componentDidMount() {
		console.log("Errors was mounted");
	}
	componentWillUnmount() {
		console.log("Errors is unmounting");
	}
	shouldComponentUpdate() {
		return false;
	}
}

class Refresh extends React.Component {
	render() {
		return (
		<div>
		</div>
		)
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
	<Historical/>,
	document.getElementById('container')
);
ReactDOM.render(
			<DataWidgets/>,
			document.getElementById('widgets')
);
