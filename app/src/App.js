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
import tablesgen, { TableElemGen } from './genericTable.js';
momentLocalizer(moment);

class NavElem extends React.Component{
	constructor(props) {
		super(props);
    	this.state = {
    		test : props.test2,
    		selected : 1004,
    		currentTab : 0, 
    		dateFrom: "2016/09/02",
    		dateTo: "2016/09/03",
    		column: 'vol',
    		year: 2016,
    		hexColumn: 'speed',
    	};
    	this.setSelected = this.setSelected.bind(this);
    	this.setCurrentTab = this.setCurrentTab.bind(this);
    	this.handleSelect = this.handleSelect.bind(this);
    	this.updateYearNav = this.updateYearNav.bind(this);
    	this.updateColumnNav = this.updateColumnNav.bind(this)
    	this.updateHexColumn = this.updateHexColumn.bind(this);
    	this.updateFromDateNav = this.updateFromDateNav.bind(this);
    	this.updateToDateNav = this.updateToDateNav.bind(this);
    	this.setup = this.setup.bind(this);
    	this.setup()
    }

	handleSelect(eventKey){
		if (eventKey === 0){
			ReactDOM.render(
				<RealTime selected={this.state.selected} column={this.state.column} dateFrom={ moment().set({ "hour": 0, "minute" : 0, "second": 0}) } dateTo={moment()}/>,
				document.getElementById('container')
			);
			ReactDOM.render(
				<DataWidgetsRealTime updateColumnNav={this.updateColumnNav} column={this.state.column} selected={this.state.selected}/>,
				document.getElementById('widgets')
				);
			this.setCurrentTab(0);
		}
		else if (eventKey === 1){
			ReactDOM.render(
				<Historical test={this.state.column} selected={this.state.selected} date={new Date()} hexColumn={this.state.hexColumn} dateFrom={moment(this.state.dateFrom)} dateTo={moment(this.state.dateTo)} year='2017'/>,
				document.getElementById('container')
			);
			ReactDOM.render(
				<DataWidgetsCalendar updateFromDateNav={this.updateFromDateNav} updateToDateNav={this.updateToDateNav} hexColumn={this.state.hexColumn} 
				updateHexColumn={this.updateHexColumn} column={this.state.column} updateColumnNav={this.updateColumnNav} updateYearNav={this.updateYearNav} 
				selected={this.state.selected} year={this.state.year} dateFrom={this.state.dateFrom} dateTo={this.state.dateTo}/>,
				document.getElementById('widgets')
				);
			this.setCurrentTab(1);
		}
		
		else if (eventKey === 2){
			ReactDOM.render(
				<Errors/>,
				document.getElementById('container')
			);
			ReactDOM.render(
				<DataWidgetsError/>,
				document.getElementById('widgets')
			);
			this.setCurrentTab(2);
		}
		else if (eventKey === 3){
			ReactDOM.render(
				<Export/>,
				document.getElementById('container')
			);
		}
	}

	setCurrentTab(t) {
		this.setState({
			currentTab: t
		});
	}

	updateYearNav(e) { 
		this.setState({
			year: e
		});
	}

	updateFromDateNav(e) {
		this.setState({
			dateFrom: e
		});
	}

	updateToDateNav(e) {
		this.setState({
			dateTo: e
		});
	}

	updateHexColumn(e) {
		this.setState({
			hexColumn: e
		});
	}

	updateColumnNav(e) { 
		this.setState({
			column: e
		});
	}

	setup() {
		ReactDOM.render(
			<RealTime selected='1004' column='occ' dateFrom={ (moment().set({ "hour": 0, "minute" : 0, "second": 0}))} dateTo={ moment() }/>,
			document.getElementById('container')
		);
		ReactDOM.render(
			<DataWidgetsRealTime updateColumnNav={this.updateColumnNav} selected='1004'/>,
			document.getElementById('widgets')
		);
	}
	
	setSelected(e) {
		this.setState({
			selected: e
		},function() {

		ReactDOM.render(
		<Refresh/>,
		document.getElementById('locationstuff')
		);
		ReactDOM.render(
			<TableElem ID={this.state.selected} getID={this.setSelected}/>,
			document.getElementById('locationstuff')
		);

		if (this.state.currentTab === 0) {
			console.log("this is the state" + this.state.selected);
			ReactDOM.render(
				<Refresh/>,
				document.getElementById('container')
			);
			ReactDOM.render(
				<RealTime selected={this.state.selected} column={"vol"} dateFrom={ moment().set({ "hour": 0, "minute" : 0, "second": 0}) } dateTo={moment()}/>,
				document.getElementById('container')
			);
			ReactDOM.render(
				<Refresh/>,
				document.getElementById('widgets')
			);
			ReactDOM.render(
				<DataWidgetsRealTime updateHexColumn={this.updateHexColumn} updateColumnNav={this.updateColumnNav} selected={this.state.selected}/>,
				document.getElementById('widgets')
				);
			this.setCurrentTab(0);

		}

		else if (this.state.currentTab === 1) {
			ReactDOM.render(
				<Refresh/>,
				document.getElementById('container')
			);
			ReactDOM.render(
				<Historical selected={this.state.selected} hexColumn={"occ"} year="2016" test={"vol"} date={moment(this.state.date)} dateTo={moment(this.state.dateTo)} dateFrom={moment(this.state.dateFrom)}/>,
				document.getElementById('container')
			);
			ReactDOM.render(
				<Refresh/>,
				document.getElementById('widgets')
			);
			ReactDOM.render(
				<DataWidgetsCalendar updateFromDateNav={this.updateFromDateNav} updateToDateNav={this.updateToDateNav} hexColumn={this.state.hexColumn} 
				updateYearNav={this.updateYearNav} updateColumnNav={this.updateColumnNav} 
				selected={this.state.selected} dateFrom={this.state.dateFrom} dateTo={this.state.dateTo} column={this.state.column} year={this.state.year}/>,
				document.getElementById('widgets')
				);
		}

		else if (this.state.currentTab === 2) {
			ReactDOM.render(
				<Refresh/>,
				document.getElementById('container')
			);

			ReactDOM.render(
				<Errors/>,
				document.getElementById('container')
			);

			ReactDOM.render(
				<DataWidgetsError/>,
				document.getElementById('widgets')
			);
		}
		});


	}



	render(){
		console.log("oh shit this ran god damn")
		ReactDOM.render(
				<TableElem ID={this.state.selected} getID={this.setSelected}/>,
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

	shouldComponentUpdate(){
		console.log("It should have updated")
		return true;
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
    	this.state = {year: this.props.year, 
    				date: new Date(),
    				dateFrom: this.props.dateFrom,
    				dateTo: this.props.dateTo,
    				column: this.props.column,
    				hexColumn: this.props.hexColumn,
    				selected: this.props.selected};
    	console.log("The constructor has been run");
    	console.log("This is the selected property" + this.props.selected)

  	}

  	update() {
  			console.log(this.state.date)
  			if (this.state.dateFrom > this.state.dateTo){ 
  				alert("Please check the dates");
  			}
  			else {
  			console.log("This is the dateTo motherfucker" + this.state.dateTo)
  			console.log("This is the selcted ID" + this.state.selected)
  			this.reRender();
  		}
  		}

  	updateColumn(eventKey){
  		this.setState({
  			column: `${eventKey}`
  		});
  		this.props.updateColumnNav(eventKey)
  	}
  	updateColumnHexbin(eventKey){
  		this.setState({
  			hexColumn: `${eventKey}`
  		});
  		this.props.updateHexColumn(eventKey)
  	}
  	dateUpdate(eventKey){
  		this.setState({
  			dateFrom: new Date(eventKey)
  		});
  		this.props.updateFromDateNav(eventKey)
  	}
  	dateUpdate2(eventKey){
  		console.log("This is the event key this is the issue" + eventKey);
  		this.setState({
  			dateTo: new Date(eventKey)
  		});
  		this.props.updateToDateNav(eventKey)
  	}
  	updateYear(eventKey){
  		this.setState({
  			year: eventKey
  		});
  		this.props.updateYearNav(eventKey)

  	}

  	reRender(){
  		ReactDOM.render(
				<Refresh/>,
				document.getElementById('container')
			);
		console.log("This is what is being passed in" + this.state.selected)
  		ReactDOM.render(
				<Historical test={this.state.column} selected={this.state.selected} date={moment(this.state.date)} dateTo={moment(this.state.dateTo)} dateFrom={moment(this.state.dateFrom)} year={this.state.year} 
				hexColumn={this.state.hexColumn}/>,
				document.getElementById('container')
			);
  	}

	render() {

		return (
		<div>
		<Button onClick={this.update}> Submit </Button>
		<p> Column Selectorss </p>
		<div id="column_div">
		<DropdownButton bsStyle="default" id="column_selector" title={this.state.column} onSelect={this.updateColumn}>
			<MenuItem eventKey="occ">Occupancy</MenuItem>
			<MenuItem eventKey="speed">Speed</MenuItem>
			<MenuItem eventKey="vol">Volume	</MenuItem>
		</DropdownButton>
		</div>
		<p> Hexbin Selector </p>
		<DropdownButton bsStyle="default" id="column_selector_hex" title={this.state.hexColumn} onSelect={this.updateColumnHexbin}>
			<MenuItem eventKey="occ">Occupancy</MenuItem>
			<MenuItem eventKey="speed">Speed</MenuItem>
			<MenuItem eventKey="vol">Volume	</MenuItem>
		</DropdownButton>
		<p> Year </p>
		<DropdownButton bsStyle="default" id="year_selector" title={this.state.year} onSelect={this.updateYear}>
			<MenuItem eventKey='2016'>2016</MenuItem>
			<MenuItem eventKey='2017'>2017</MenuItem>
		</DropdownButton>

		<p> From Date </p>
		<DateTimePicker id="test2" defaultValue={new Date(this.state.dateFrom)} onSelect={this.dateUpdate}>
		</DateTimePicker>

		<p> To Date </p>
		<DateTimePicker id="test" defaultValue={new Date(this.state.dateTo)} onSelect={this.dateUpdate2}>
		</DateTimePicker>

		</div>
		);
	}
}


class DataWidgetsRealTime extends React.Component {
	constructor(props) {
    	super(props);
    	this.state = {
    	column: this.props.column,
    	dateFrom: new Date("2016/09/08"),
        dateTo: new Date("2016/09/09"),
        selected: this.props.selected
    };

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
  		this.props.updateColumnNav(eventKey)
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
				<RealTime selected={this.state.selected} column={this.state.column} dateTo={moment(this.state.dateTo)} dateFrom={moment(this.state.dateFrom)}/>,
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

class DataWidgetsError extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
		<div>

		
		<Button> Sort by Errors </Button>
		<p> From Date </p>
		<DateTimePicker id="test2" defaultValue={new Date("2016/09/03")}>
		</DateTimePicker>

		<p> To Date </p>
		<DateTimePicker id="test" defaultValue={new Date("2016/09/04")}>
		</DateTimePicker>
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

					ref={ renderScatterplot("#realTimeScatterplot", this.props.selected,this.props.column, this.props.dateFrom, this.props.dateTo, true) }
				/>
				<div
					id="realTimeLinegraph"
					ref={ renderLinegraph("#realTimeLinegraph",this.props.selected,this.props.column,this.props.dateFrom,this.props.dateTo, true) }
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
					ref={ renderScatterplot("#historicalScatterplot", this.props.selected, this.props.test, this.props.dateFrom, this.props.dateTo , false) }
				/>
				<div
					id="historicalLinegraph"
					ref={ renderLinegraph("#historicalLinegraph", this.props.selected, this.props.test, this.props.dateFrom, this.props.dateTo, false) }
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
	<NavElem/>,
	document.getElementById('navigation')
);