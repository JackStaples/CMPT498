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
    		currentTab : 0
    	};
    	this.setSelected = this.setSelected.bind(this);
    	this.setCurrentTab = this.setCurrentTab.bind(this);
    	this.handleSelect = this.handleSelect.bind(this);
    }

	handleSelect(eventKey){
		if (eventKey === 0){
			ReactDOM.render(
				<RealTime selected={this.state.selected} column={"speed"} dateFrom={ moment().set({ "hour": 0, "minute" : 0, "second": 0}) } dateTo={moment(new Date())}/>,
				document.getElementById('container')
			);
			ReactDOM.render(
				<DataWidgetsRealTime selected={this.state.selected}/>,
				document.getElementById('widgets')
				);
			this.setCurrentTab(0);
		}
		else if (eventKey === 1){
			ReactDOM.render(
				<Historical test='occ' selected={this.state.selected} date={new Date()} hexColumn='speed' dateFrom={moment(new Date("2016-09-02"))} dateTo={moment(new Date("2016-09-03"))} year='2017'/>,
				document.getElementById('container')
			);
			ReactDOM.render(
				<DataWidgetsCalendar selected={this.state.selected}/>,
				document.getElementById('widgets')
				);
			this.setCurrentTab(1);
		}
		
		else if (eventKey === 2){
			ReactDOM.render(
				<Errors/>,
				document.getElementById('container')
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
				<DataWidgetsRealTime selected={this.state.selected}/>,
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
				<Historical selected={this.state.selected} hexColumn={"occ"} year="2016" test={"vol"} dateFrom={new Date("2016/09/02")} dateTo={new Date("2016/09/03")}/>,
				document.getElementById('container')
			);
			ReactDOM.render(
				<DataWidgetsCalendar selected={this.state.selected}/>,
				document.getElementById('widgets')
				);
		}
		});
	}

	render(){
		ReactDOM.render(
				<TableElem ID={this.state.selected} getID={this.setSelected}/>,
				document.getElementById('locationstuff')
		);
		console.log(this.state.selected)
		return (
		<Tabs onSelect={this.handleSelect} id="selectTabs">
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
    	this.state = {year: 2017,
    				date: new Date(),
    				dateFrom: new Date("2016/09/03"),
    				dateTo: new Date("2016/09/04"),
    				column: "vol",
    				hexColumn: "occ",
    				selected: this.props.selected};
    	console.log("The constructor has been run");

  	}

  	update() {
  			console.log(this.state.date)
  			if (this.state.dateFrom > this.state.dateTo){ 
  				alert("Please check the dates");
  			}
  			else {
  			console.log("This is the dateTo motherfucker" + this.state.dateTo)
  			this.reRender();
  		}
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
  		console.log("This is the event key this is the issue" + eventKey);
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

				<Historical test={this.state.column} selected={this.state.selected} date={moment(this.state.date)} dateTo={moment(this.state.dateTo)} dateFrom={moment(this.state.dateFrom)} year={this.state.year} 

				hexColumn={this.state.hexColumn}/>,
				document.getElementById('container')
			);
  	}

	render() {
		console.log(this.state.dateFrom);

		return (
		<div>
     
      
		<div id="SubmitButton">
			<Button onClick={this.update}> Submit </Button>
		</div>
		<p> Column Selector </p>
      <div id="column_selector">
		<DropdownButton bsStyle="default" title={this.state.column} onSelect={this.updateColumn}>
			<MenuItem eventKey="occ">Occupancy</MenuItem>
			<MenuItem eventKey="speed">Speed</MenuItem>
			<MenuItem eventKey="vol">Volume	</MenuItem>
		</DropdownButton>
		</div>

      
      
      
      
		<div id="hexcolumn_selector">
		<p> Hexbin Selector </p>
		<DropdownButton bsStyle="default"  title={this.state.hexColumn} onSelect={this.updateColumnHexbin}>
			<MenuItem eventKey="occ">Occupancy</MenuItem>
			<MenuItem eventKey="speed">Speed</MenuItem>
			<MenuItem eventKey="vol">Volume	</MenuItem>
		</DropdownButton>
		</div>

		<div id="year_selector">
		<DropdownButton bsStyle="default"  title="Year" onSelect={this.updateYear}>
			<MenuItem eventKey='2016'>2016</MenuItem>
			<MenuItem eventKey='2017'>2017</MenuItem>
		</DropdownButton>
		</div>

		<div id="lowdatetimepicker">
		<DateTimePicker id="test2" defaultValue={new Date("2016-09-03")} onSelect={this.dateUpdate}>
		<p> Year </p>
		<DropdownButton bsStyle="default" id="year_selector" title={this.state.year} onSelect={this.updateYear}>
			<MenuItem eventKey='2016'>2016</MenuItem>
			<MenuItem eventKey='2017'>2017</MenuItem>
		</DropdownButton>

		<p> From Date </p>
		<DateTimePicker id="test2" defaultValue={new Date("2016/09/03")} onSelect={this.dateUpdate}>
		</DateTimePicker>
		</div>


		<div id="highdatetimepicker">

		<p> To Date </p>
		<DateTimePicker id="test" defaultValue={new Date("2016/09/04")} onSelect={this.dateUpdate2}>
		</DateTimePicker>
		</div>

		);
	}
}


class DataWidgetsRealTime extends React.Component {
	constructor(props) {
    	super(props);
    	this.state = {column: "vol",
    	dateFrom: new Date("2016/09/08"),
        dateTo: new Date("2016/09/09"),
        selected: this.props.selected};
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
				<RealTime selected={this.state.selected} column={this.state.column} dateTo={moment(this.state.dateTo)} dateFrom={moment(this.state.dateFrom)}/>,
				document.getElementById('container')
			);
  	}

	render() {
		return (
		<div>

		<div id="realTimeSubBttn" >
		<Button onClick={this.update}> Submit </Button>
		</div>

		<div id="realTimecolumn_selector">
		<DropdownButton bsStyle="default"  title="Columns" onSelect={this.updateColumn}>
			<MenuItem eventKey="occ">Occupancy</MenuItem>
			<MenuItem eventKey="speed">Speed</MenuItem>
			<MenuItem eventKey="vol">Volume	</MenuItem>
		</DropdownButton>
		</div>

		<div id="realTimedatepicker">
		<DateTimePicker id="getAdate" defaultValue={this.state.dateFrom} onSelect={this.dateUpdate}/>
		</div>

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
				<h2>Big ass map</h2>
				<div id="thebigmap">
					<MapElement />
				</div>
				<h2>Scatterplot</h2>
				<div
					id="realTimeScatterplot"
					margin="0 auto"

					ref={ renderScatterplot("#realTimeScatterplot", this.props.selected,this.props.column, this.props.dateFrom, this.props.dateTo, true) }
				/>
				<h2>Linegraph</h2>
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
			<div id="historical">
			<h2>Calendar</h2>
				<div  id="Calendar">
					<div ref={ renderCalendar("#Calendar", this.props.year, this.props.test) } />
        </div>
				<h2>Big ass map2</h2>
				<div id="historicalmap">
					<MapElement />
				</div>
				<h2>Hexbin</h2>
				<div id="historicalhexbin">
				<div
					id="hexbin"
					ref={ renderHexbin("#hexbin", this.props.test, this.props.hexColumn, this.props.dateFrom, this.props.dateTo) }
				/>
				</div>
				<h2>Scatterplot2</h2>
				<div
					id="historicalScatterplot"
					ref={ renderScatterplot("#historicalScatterplot", this.props.selected, this.props.test, this.props.dateFrom, this.props.dateTo , false) }
				/>
				<h2>Linegraph</h2>
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
			<div id="Errors">
				<h2>Errors by vdsId</h2>
				<svg width="1366" height="700"
					id="vdsidBargraph"
					ref={ renderBargraph(0, "#vdsidBargraph") }
				/>
				<h2>Errors by lane</h2>
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
		<div id="unseen">
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

	<RealTime selected='1004' column='occ' dateFrom={ (moment().set({ "hour": 0, "minute" : 0, "second": 0}))} dateTo={ moment().utc() }/>,
	document.getElementById('container')
);
ReactDOM.render(
			<DataWidgetsRealTime selected='1004'/>,
			document.getElementById('widgets')
);

ReactDOM.render(
  <TableElem />,
  document.getElementById('locationstuff')
);

