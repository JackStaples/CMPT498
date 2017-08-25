import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import { Nav, NavItem, DropdownButton, MenuItem,Button } from 'react-bootstrap';
import Scatter, { renderScatterplot } from './scatterplot.js';
import Hexbin, { renderHexbin } from './hexbin.js';
import Linegraph, { renderLinegraph } from './linegraph.js';
import Barchart, { renderBargraph } from './bargraph.js';
import Google, { MapElement, RenderGoogleMap } from './googlemap.js';
import Calendar, { renderCalendar } from './calendar.js';
import moment from 'moment';
import momenttz from 'moment-timezone';
import ReactWidgets, {DateTimePicker} from 'react-widgets';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import 'react-widgets/dist/css/react-widgets.css';
import DropdownList from 'react-widgets/lib/DropdownList';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import tables, { TableElem } from './table.js';
momentLocalizer(moment);

class NavElem extends React.Component{
	constructor(props) {
		super(props);
    	this.state = {
    		test : props.test2,
    		selected : 1004
    	};
    	this.setSelected = this.setSelected.bind(this);
    }

	handleSelect(eventKey){
		if (eventKey === 0){
			ReactDOM.render(
				<RealTime column={"speed"} dateFrom={ moment().set({ "hour": 0, "minute" : 0, "second": 0}) } dateTo={moment()}/>,
				document.getElementById('container')
			);
			ReactDOM.render(
				<DataWidgetsRealTime/>,
				document.getElementById('widgets')
				);
		}
		else if (eventKey === 1){
			ReactDOM.render(
				<Historical test='occ' date={new Date()} hexColumn='speed' dateFrom={moment(new Date("2016-09-02"))} dateTo={moment(new Date("2016-09-03"))} year='2017'/>,
				document.getElementById('container')
			);
			ReactDOM.render(
				<DataWidgetsCalendar/>,
				document.getElementById('widgets')
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

	setSelected(e) {
		this.setState({
			selected: e
		});
		console.log("this ran")
	}

	render(){
		ReactDOM.render(
				<TableElem getID={this.setSelected}/>,
				document.getElementById('locationstuff')
		);
		console.log(this.state.selected)
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
	}
}

class DataWidgetsCalendar extends React.Component {

	constructor(props) {
    	super(props);
    	this.update = this.update.bind(this);
    	this.reRender = this.reRender.bind(this);
    	this.dateUpdate = this.dateUpdate.bind(this);
    	this.dateUpdate2 = this.dateUpdate2.bind(this);
    	this.updateYear = this.updateYear.bind(this);
    	this.updateColumn = this.updateColumn.bind(this);
    	this.updateColumnHexbin = this.updateColumnHexbin.bind(this);
    	this.state = {year: 2017, 
    				date: new Date(),
    				dateFrom: new Date("2016-09-03"),
    				dateTo: new Date("2016-09-04"),
    				column: "vol",
    				hexColumn: "occ"};
    	console.log("The constructor has been run");

  	}

  	update() {
  			console.log(this.state.date)
  			this.reRender();
  		}

  	updateColumn(eventKey){
  		this.setState({
  			column: `${eventKey}`
  		});
  	}
  	updateColumnHexbin(eventKey){
  		this.setState({
  			hexColumn: `${eventKey}`
  		});
  	}
  	dateUpdate(eventKey){
  		this.setState({
  			dateFrom: new Date(eventKey)
  		});
  	}
  	dateUpdate2(eventKey){
  		this.setState({
  			dateTo: new Date(eventKey)
  		});
  	}
  	updateYear(eventKey){
  		this.setState({
  			year: eventKey
  		});
  	}

  	reRender(){
  		ReactDOM.render(
				<Refresh/>,
				document.getElementById('container')
			);
  		ReactDOM.render(
				<Historical test={this.state.column} date={moment(this.state.date)} dateTo={moment(this.state.dateTo)} dateFrom={moment(this.state.dateFrom)} year={this.state.year} 
				hexColumn={this.state.hexColumn}/>,
				document.getElementById('container')
			);
  	}

	render() {
		console.log(this.state.dateFrom);

		return (
		<div>
		<Button onClick={this.update}> Submit </Button>
		<DropdownButton bsStyle="default" id="column_selector" title="Columns" onSelect={this.updateColumn}>
			<MenuItem eventKey="occ">Occupancy</MenuItem>
			<MenuItem eventKey="speed">Speed</MenuItem>
			<MenuItem eventKey="vol">Volume	</MenuItem>
		</DropdownButton>
		<DropdownButton bsStyle="default" id="column_selector" title="HexBinDropdown" onSelect={this.updateColumnHexbin}>
			<MenuItem eventKey="occ">Occupancy</MenuItem>
			<MenuItem eventKey="speed">Speed</MenuItem>
			<MenuItem eventKey="vol">Volume	</MenuItem>
		</DropdownButton>
		<DropdownButton bsStyle="default" id="year_selector" title="Year" onSelect={this.updateYear}>
			<MenuItem eventKey='2016'>2016</MenuItem>
			<MenuItem eventKey='2017'>2017</MenuItem>
		</DropdownButton>
		<DateTimePicker id="test2" defaultValue={new Date("2016-09-03")} onSelect={this.dateUpdate}>
		</DateTimePicker>

		<DateTimePicker id="test" defaultValue={new Date("2016-09-04")} onSelect={this.dateUpdate2}>
		</DateTimePicker>

		</div>
		);
	}
}


class DataWidgetsRealTime extends React.Component {
	constructor(props) {
    	super(props);
    	this.state = {column: "vol",
    	dateFrom: new Date("2016-09-08"),
        dateTo: new Date("2016-09-09")};
    	this.update = this.update.bind(this);
    	this.reRender = this.reRender.bind(this);
    	this.dateUpdate = this.dateUpdate.bind(this);
    	this.dateUpdate2 = this.dateUpdate2.bind(this);
    	this.updateColumn = this.updateColumn.bind(this);
    	this.tabIndex = 5;

  	}
  	update(){
  			this.reRender();
  	}

  	dateUpdate(eventKey){
  		this.setState({
  			dateFrom: new Date(eventKey)
  		});
  	}
  	updateColumn(eventKey){
  		this.setState({
  			column: `${eventKey}`
  		});
  	}
  	dateUpdate2(eventKey){
  		this.setState({
  			dateTo: new Date(eventKey)
  		});
  	}
  	reRender(){
  		ReactDOM.render(
				<Refresh/>,
				document.getElementById('container')
			);
  		ReactDOM.render(
				<RealTime column={this.state.column} dateTo={moment(this.state.dateTo)} dateFrom={moment(this.state.dateFrom)}/>,
				document.getElementById('container')
			);
  	}

	render() {
		return (
		<div>
		<Button onClick={this.update}> Submit </Button>
		<DropdownButton bsStyle="default" id="column_selector" title="Columns" onSelect={this.updateColumn}>
			<MenuItem eventKey="occ">Occupancy</MenuItem>
			<MenuItem eventKey="speed">Speed</MenuItem>
			<MenuItem eventKey="vol">Volume	</MenuItem>
		</DropdownButton>
		<DateTimePicker defaultValue={this.state.dateFrom} onSelect={this.dateUpdate}/>
		</div>
		);
	}
}
class RealTime extends React.Component {

	constructor(props) {
    	super(props);
  	}
	render() {
		return (


			<div name="Realtime" id="Realtime">
				<MapElement id="thebigmap" />
				<div
					id="realTimeScatterplot"
					margin="0 auto"
					ref={ renderScatterplot("#realTimeScatterplot", this.props.column, this.props.dateFrom, this.props.dateTo, true) }
				/>
				<div
					id="realTimeLinegraph"
					ref={ renderLinegraph("#realTimeLinegraph",this.props.column,this.props.dateFrom,this.props.dateTo, true) }
				/>
      		</div>
		);
	}

	componentDidMount() {
		

	}
	componentWillUnmount() {
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
                    ref={ renderCalendar("#Calendar", this.props.year, this.props.test) }
                />
                <div>
                <p> {this.state.column} </p>
                </div>
				<MapElement />
				<div
					id="hexbin"
					ref={ renderHexbin("#hexbin", this.props.test, this.props.hexColumn, this.props.dateFrom, this.props.dateTo) }
				/>
				<div
					id="historicalScatterplot"
					ref={ renderScatterplot("#historicalScatterplot", this.props.test, this.props.dateFrom, this.props.dateTo , false) }
				/>
				<div
					id="historicalLinegraph"
					ref={ renderLinegraph("#historicalLinegraph", this.props.test, this.props.dateFrom, this.props.dateTo, false) }
				/>
			</div>
		);
	}
	componentDidMount() {
	}
	componentWillUnmount() {
	}
	shouldComponentUpdate() {
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
	}
	componentWillUnmount() {

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
	<NavElem test2="hi"/>,
	document.getElementById('navigation')
);

ReactDOM.render(
	<RealTime column='occ' dateFrom={ (moment().set({ "hour": 0, "minute" : 0, "second": 0}))} dateTo={ moment() }/>,
	document.getElementById('container')
);
ReactDOM.render(
			<DataWidgetsRealTime/>,
			document.getElementById('widgets')
);

