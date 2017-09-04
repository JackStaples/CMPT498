import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import { Nav, NavItem, DropdownButton, MenuItem,Button } from 'react-bootstrap';
import Scatter, { renderScatterplotv2 } from './scatterplotv2.js';
import ToggleButtonGroup from 'react-bootstrap/lib/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/lib/ToggleButton';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar'
import Hexbin, { renderHexbin } from './hexbin.js';
import Linegraph, { renderLinegraphv2 } from './linegraphv2.js';
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
import Spinner from 'spin';
momentLocalizer(moment);

class NavElem extends React.Component{
	constructor(props) {
		super(props);
    	this.state = {
    		test : props.test2,
    		selected : 1004,
    		currentTab : 0,
    		locationName : "Wayne Gretzky Dr South End Bridge NB",
    		dateFrom: "2016/09/02",
    		dateTo: "2016/09/03",
    		column: 'speed',
    		year: 2016,
    		hexColumn: 'occ',
    		lane: 1,
    		hour: 7,
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
    	this.setLocationName = this.setLocationName.bind(this);
    	this.setLane = this.setLane.bind(this);
    	this.setup()
    }

	handleSelect(eventKey){
		if (eventKey === 0){
			ReactDOM.render(
				<RealTime hour={this.state.hour} lane={this.state.lane} locationName={this.state.locationName} selected={this.state.selected} column={this.state.column} dateFrom={ moment().set({ "hour": 0, "minute" : 0, "second": 0}) } dateTo={moment().set({ "hour": 0, "minute" : 0, "second": 0}).add(1,'d')}/>,
				document.getElementById('container')
			);
			ReactDOM.render(
				<DataWidgetsRealTime hour={this.state.hour} setLane={this.setLane} lane={this.state.lane} locationName={this.state.locationName} updateColumnNav={this.updateColumnNav} column={this.state.column} selected={this.state.selected} dateFrom={ moment().set({ "hour": 0, "minute" : 0, "second": 0}) } dateTo={moment().set({ "hour": 0, "minute" : 0, "second": 0}).add(1,'d')}/>,
				document.getElementById('widgets')
				);
			this.setCurrentTab(0);
			ReactDOM.render(
        <div>
          <h2>Map</h2>
          <MapElement getID={this.setSelected} getName={this.setLocationName}/>
        </div>,
        document.getElementById('thebigmap')
      );

		}
		else if (eventKey === 1){
			ReactDOM.render(
				<Historical lane={this.state.lane} locationName={this.state.locationName} test={this.state.column} selected={this.state.selected} date={new Date()} hexColumn={this.state.hexColumn} dateFrom={moment(this.state.dateFrom)} dateTo={moment(this.state.dateTo)} year={this.state.year}/>,
				document.getElementById('container')
			);
			ReactDOM.render(
				<DataWidgetsCalendar setLane={this.setLane} lane={this.state.lane} locationName={this.state.locationName} updateFromDateNav={this.updateFromDateNav} updateToDateNav={this.updateToDateNav} hexColumn={this.state.hexColumn}
				updateHexColumn={this.updateHexColumn} column={this.state.column} updateColumnNav={this.updateColumnNav} updateYearNav={this.updateYearNav}
				selected={this.state.selected} year={this.state.year} dateFrom={this.state.dateFrom} dateTo={this.state.dateTo}/>,
				document.getElementById('widgets')
				);
			this.setCurrentTab(1);
			ReactDOM.render(
        <div>
          <h2>Map</h2>
          <MapElement getID={this.setSelected} getName={this.setLocationName}/>
        </div>,
        document.getElementById('thebigmap')
      );

		}
		
		else if (eventKey === 2){
			ReactDOM.render(
				<Errors locationName={this.state.locationName} target={this.state.selected} sort={true} setSelected={this.setSelected} dateFrom={this.state.dateFrom} dateTo={this.state.dateTo}/>,
				document.getElementById('container')
			);

			ReactDOM.render(
				<DataWidgetsError locationName={this.state.locationName} selected={this.state.selected} setSelected={this.setSelected} dateFrom={this.state.dateFrom} dateTo={this.state.dateTo} updateToDateNav={this.updateToDateNav} updateFromDateNav={this.updateFromDateNav}/>,
				document.getElementById('widgets')
			);
			ReactDOM.render(
				<Refresh/>,
				document.getElementById('thebigmap')
			);
			this.setCurrentTab(2);
		}
	}

	setCurrentTab(t) {
		this.setState({
			currentTab: t
		});
	}

	setLane(e) {
  		this.setState({
  			lane: e
  		});
  	}

	setLocationName(l) {
	this.setState({
			locationName: l
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
		console.log("dateyy", e)
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
			<RealTime hour={this.state.hour} lane={this.state.lane} locationName={this.state.locationName}  selected={this.state.selected} column={this.state.column} dateFrom={ (moment().set({ "hour": 0, "minute" : 0, "second": 0}))} dateTo={ (moment().set({ "hour": 0, "minute" : 0, "second": 0}).add(1,'d'))}/>,
			document.getElementById('container')
		);
		ReactDOM.render(
			<DataWidgetsRealTime  hour={this.state.hour} setLane={this.setLane} lane={this.state.lane}  column={this.state.column} locationName={this.state.locationName} updateColumnNav={this.updateColumnNav} selected={this.state.selected} dateFrom={ moment().set({ "hour": 0, "minute" : 0, "second": 0}) } dateTo={moment().set({ "hour": 0, "minute" : 0, "second": 0}).add(1,'d')}/>,
			document.getElementById('widgets')
		);
    ReactDOM.render(
        <div>
          <h2>Map</h2>
          <MapElement getID={this.setSelected} getName={this.setLocationName}/>
        </div>,
        document.getElementById('thebigmap')
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
			<TableElem ID={this.state.selected} getID={this.setSelected} setName={this.setLocationName}/>,
			document.getElementById('locationstuff')
		);

		if (this.state.currentTab === 0) {
			console.log("this is the state" + this.state.selected);
			ReactDOM.render(
				<Refresh/>,
				document.getElementById('container')
			);
			ReactDOM.render(
				<RealTime  hour={this.state.hour} locationName={this.state.locationName} selected={this.state.selected} column={"vol"} dateFrom={ moment().set({ "hour": 0, "minute" : 0, "second": 0}) } dateTo={moment().set({ "hour": 0, "minute" : 0, "second": 0}).add(1,'d')}/>,
				document.getElementById('container')
			);
			ReactDOM.render(
				<Refresh/>,
				document.getElementById('widgets')
			);
			ReactDOM.render(
				<DataWidgetsRealTime hour={this.state.hour} setLane={this.setLane} lane={this.state.lane} column={this.state.column} locationName={this.state.locationName} updateHexColumn={this.updateHexColumn} updateColumnNav={this.updateColumnNav} selected={this.state.selected} dateFrom={ moment().set({ "hour": 0, "minute" : 0, "second": 0}) } dateTo={moment().set({ "hour": 0, "minute" : 0, "second": 0}).add(1,'d')}/>,
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
				<Historical lane={this.state.lane} locationName={this.state.locationName} selected={this.state.selected} hexColumn={this.state.hexColumn} year={this.state.year} test={this.state.column} date={moment(this.state.date)} dateTo={moment(this.state.dateTo)} dateFrom={moment(this.state.dateFrom)}/>,
				document.getElementById('container')
			);
			ReactDOM.render(
				<Refresh/>,
				document.getElementById('widgets')
			);
			ReactDOM.render(
				<DataWidgetsCalendar setLane={this.setLane} lane={this.state.lane} locationName={this.state.locationName} updateFromDateNav={this.updateFromDateNav} updateToDateNav={this.updateToDateNav} hexColumn={this.state.hexColumn} 
				updateYearNav={this.updateYearNav} updateColumnNav={this.updateColumnNav}  updateHexColumn={this.updateHexColumn}
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
				<Errors locationName={this.state.locationName} target={this.state.selected} sort={true} setSelected={this.setSelected} dateFrom={this.state.dateFrom} dateTo={this.state.dateTo}/>,
				document.getElementById('container')
			);

			ReactDOM.render(
				<DataWidgetsError locationName={this.state.locationName} selected={this.state.selected} setSelected={this.setSelected} dateFrom={this.state.dateFrom} dateTo={this.state.dateTo} updateToDateNav={this.updateToDateNav} updateFromDateNav={this.updateFromDateNav}/>,
				document.getElementById('widgets')
			);
		}
		});


	}



	render(){
		console.log("oh shit this ran god damn")
    console.log(this.state.year)
		ReactDOM.render(
				<TableElem ID={this.state.selected} getID={this.setSelected} setName={this.setLocationName}/>,
				document.getElementById('locationstuff')
		);
		console.log(this.state.selected)
		return (
		<Tabs onSelect={this.handleSelect} id="selectTabs">
    	<TabList>
      		<Tab>RealTime</Tab>
      		<Tab>Historical</Tab>
      		<Tab>Errors</Tab>
    	</TabList>
  		</Tabs>
		);
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
    	this.laneChange = this.laneChange.bind(this);
    	this.state = {year: this.props.year,
    				date: new Date(),
    				dateFrom: this.props.dateFrom,
    				dateTo: this.props.dateTo,
    				column: this.props.column,
    				hexColumn: this.props.hexColumn,
    				selected: this.props.selected,
    				locationName: this.props.locationName,
    				lane: this.props.lane};

  	}

  	update() {
  			console.log(this.state.date)
        console.log(this.state.dateFrom, this.state.dateTo)
  			if (this.state.dateFrom > this.state.dateTo){
  				alert("Please check the dates");
  			}
  			else {
  			this.reRender();
  		}
  		}

  	componentDidUpdate(){
  		this.reRender()
  	}

  	laneChange(e) {
  		console.log("This is the lane: ", e)
  		this.setState({
  			lane: e
  		});
  		this.props.setLane(e)
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
				<Historical lane={this.state.lane} locationName={this.state.locationName} test={this.state.column} selected={this.state.selected} date={moment(this.state.date)} dateTo={moment(this.state.dateTo)} dateFrom={moment(this.state.dateFrom)} year={this.state.year}
				hexColumn={this.state.hexColumn}/>,
				document.getElementById('container')
			);
  	}

	render() {
		return (
		<div>
      <div id="SubmitButton">
        <Button onClick={this.update} > Submit </Button>
      </div>
      		<div> {this.state.lane}
		</div>
      <div id="column_selector">
        <p> Column Selector </p>
        <DropdownButton bsStyle="default" title={this.state.column} onSelect={this.updateColumn}>
          <MenuItem eventKey="occ">Occupancy</MenuItem>
          <MenuItem eventKey="speed">Speed</MenuItem>
          <MenuItem eventKey="vol">Volume	</MenuItem>
        </DropdownButton>
      </div>
      <div id="hexcolumn_selector">
        <p> Hexbin Selector </p>
        <DropdownButton bsStyle="default" title={this.state.hexColumn} onSelect={this.updateColumnHexbin}>
          <MenuItem eventKey="occ">Occupancy</MenuItem>
          <MenuItem eventKey="speed">Speed</MenuItem>
          <MenuItem eventKey="vol">Volume	</MenuItem>
        </DropdownButton>
      </div>
      <div id="year_selector">
        <p> Year </p>
        <DropdownButton bsStyle="default"  title={this.state.year} onSelect={this.updateYear}>
          <MenuItem eventKey='2016'>2016</MenuItem>
          <MenuItem eventKey='2017'>2017</MenuItem>
        </DropdownButton>
      </div>
      <div id="lowdatetimepicker">
        <p> From Date </p>
        <DateTimePicker id="test2" defaultValue={new Date(this.state.dateFrom)} onSelect={this.dateUpdate}>
        </DateTimePicker>
      </div>
      <div id="highdatetimepicker">
        <p> To Date </p>
        <DateTimePicker id="test" defaultValue={new Date(this.state.dateTo)} onSelect={this.dateUpdate2}>
        </DateTimePicker>
      </div>
			<div id="SubmitButton">
				<Button onClick={this.update} > Submit </Button>
			</div>
			<div id="ButtonToolbar">
			<ButtonToolbar>
      <ToggleButtonGroup type="radio" name="lanes" defaultValue={this.state.lane} onChange={this.laneChange}>
        <ToggleButton value={1}>Lane 1</ToggleButton>
        <ToggleButton value={2}>Lane 2</ToggleButton>
        <ToggleButton value={3}>Lane 3</ToggleButton>
        <ToggleButton value={4}>Lane 4</ToggleButton>
      </ToggleButtonGroup>
    </ButtonToolbar>
    </div>
		</div>
		);
	}
}


class DataWidgetsRealTime extends React.Component {
	constructor(props) {
    	super(props);
    	this.state = {
    	column: this.props.column,
    	dateFrom: this.props.dateFrom,
        dateTo: this.props.dateTo,
        selected: this.props.selected,
        locationName: this.props.locationName,
        lane: this.props.lane,
        hour: this.props.hour
    };
    console.log(this.props.column);

    	this.update = this.update.bind(this);
    	this.reRender = this.reRender.bind(this);
    	this.dateUpdate = this.dateUpdate.bind(this);
    	this.dateUpdate2 = this.dateUpdate2.bind(this);
    	this.updateColumn = this.updateColumn.bind(this);
    	this.tabIndex = 5;
    	this.laneChange = this.laneChange.bind(this);
    	this.updateHour = this.updateHour.bind(this);

  	}

  	componentDidUpdate(){
  		this.reRender()
  	}

  	updateHour(e){
  		this.setState({
  			hour: e
  		})
  	}

  	laneChange(e) {
  		console.log("This is the lane: ", e)
  		this.setState({
  			lane: e
  		});
  		console.log("this is the lane state: ", this.state.lane)
  		this.props.setLane(e)
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
  		console.log("rerender lane:", this.state.lane)
  		ReactDOM.render(
				<Refresh/>,
				document.getElementById('container')
			);
  		ReactDOM.render(
				<RealTime hour={this.state.hour} lane={this.state.lane} locationName={this.state.locationName} selected={this.state.selected} column={this.state.column} dateTo={moment(this.state.dateTo)} dateFrom={moment(this.state.dateFrom)}/>,
				document.getElementById('container')
			);
  	}



	render() {
		return (
		<div>
		<div id="realTimecolumn_selector">
		<DropdownButton bsStyle="default"  title={this.state.column} onSelect={this.updateColumn}>
			<MenuItem eventKey="occ">Occupancy</MenuItem>
			<MenuItem eventKey="speed">Speed</MenuItem>
			<MenuItem eventKey="vol">Volume	</MenuItem>
		</DropdownButton>
		</div>

		<DropdownButton bsStyle="default"  title={this.state.hour} onSelect={this.updateHour}>
			<MenuItem eventKey="0">0</MenuItem>
			<MenuItem eventKey="1">1</MenuItem>
			<MenuItem eventKey="2">2</MenuItem>
			<MenuItem eventKey="3">3</MenuItem>
			<MenuItem eventKey="4">4</MenuItem>
			<MenuItem eventKey="5">5</MenuItem>
			<MenuItem eventKey="6">6</MenuItem>
			<MenuItem eventKey="7">7</MenuItem>
			<MenuItem eventKey="8">8</MenuItem>
			<MenuItem eventKey="9">9</MenuItem>
			<MenuItem eventKey="10">10</MenuItem>
			<MenuItem eventKey="11">11</MenuItem>
			<MenuItem eventKey="12">12</MenuItem>
			<MenuItem eventKey="13">13</MenuItem>
			<MenuItem eventKey="14">14</MenuItem>
			<MenuItem eventKey="15">15</MenuItem>
			<MenuItem eventKey="16">16</MenuItem>
			<MenuItem eventKey="17">17</MenuItem>
			<MenuItem eventKey="18">18</MenuItem>
			<MenuItem eventKey="19">19</MenuItem>
			<MenuItem eventKey="20">20</MenuItem>
			<MenuItem eventKey="21">21</MenuItem>
			<MenuItem eventKey="22">22</MenuItem>
			<MenuItem eventKey="23">23</MenuItem>
		</DropdownButton>

		<div id="realTimeSubBttn" >
			<Button onClick={this.update}> Submit </Button>
		</div>
		<div id="ButtonToolbar">
			<ButtonToolbar>
      <ToggleButtonGroup type="radio" name="lanes" defaultValue={this.state.lane} onChange={this.laneChange}>
        <ToggleButton value={1}>Lane 1</ToggleButton>
        <ToggleButton value={2}>Lane 2</ToggleButton>
        <ToggleButton value={3}>Lane 3</ToggleButton>
        <ToggleButton value={4}>Lane 4</ToggleButton>
      </ToggleButtonGroup>
    	</ButtonToolbar>
    	</div>

		</div>
		);
	}
}

class DataWidgetsError extends React.Component {
	constructor(props) {
		super(props);
    this.state = {
			dateTo: this.props.dateTo,
			dateFrom: this.props.dateFrom,
			locationName: this.props.locationName
		}
    this.swapCheck = {
      sort: this.props.sort
    }
    this.update = this.update.bind(this);
    this.sortBoolean = this.sortBoolean.bind(this);
    this.rerenderSorted = this.rerenderSorted.bind(this);
    this.dateUpdate = this.dateUpdate.bind(this);
    this.dateUpdate2 = this.dateUpdate2.bind(this);
    this.updatePage = this.updatePage.bind(this);
	}

  sortBoolean(){
    if (this.swapCheck.sort === true){ 
      this.swapCheck.sort = false;
      return this.swapCheck.sort;
    } else {
      this.swapCheck.sort = true;
      return this.swapCheck.sort;
    }
  }
  
	dateUpdate2(eventKey){
  		this.setState({
  			dateTo: new Date(eventKey)
  		});
  		this.props.updateToDateNav(eventKey)
  	}

    dateUpdate(eventKey){
  		this.setState({
  			dateFrom: new Date(eventKey)
  		});
  		this.props.updateFromDateNav(eventKey)
  	}

  	laneChange(e) {
  		this.setState({
  			lane: e
  		});
  		this.props.setLane(e)
  		this.reRender()
  	}

  rerenderSorted(){
  	ReactDOM.render(
        <div id="unseen">
        </div>,
      document.getElementById('container')
		);
    ReactDOM.render(
      <Errors locationName={this.state.locationName} target={this.props.selected} sort={this.sortBoolean()} setSelected={this.props.setSelected} dateFrom={this.state.dateFrom} dateTo={this.state.dateTo}/>,
      document.getElementById('container')
    );
  }
  
  update(){
    console.log("This update ran for some unknown goddamn reason")
    this.rerenderSorted();
  }

  updatePage(){
  	ReactDOM.render(
        <div id="unseen">
        </div>,
      document.getElementById('container')
		);
    ReactDOM.render(
      <Errors locationName={this.state.locationName} target={this.props.selected} sort={this.swapCheck.sort} setSelected={this.props.setSelected} dateFrom={this.state.dateFrom} dateTo={this.state.dateTo}/>,
      document.getElementById('container')
    );
  }


  
	render() {
		return (
		<div>
			<div id="sort_button">
				<Button onClick={this.update}> Sort </Button>
			</div>

			<div id="error_fromdate">
				<p> From Date </p>
			</div>

			<div id="error_fromdatepicker">
				<DateTimePicker id="test2" defaultValue={new Date(this.props.dateFrom)} onSelect={this.dateUpdate}>
        </DateTimePicker>
			</div>
			<div id="error_todatepicker">
				<DateTimePicker id="test" defaultValue={new Date(this.props.dateTo)} onSelect={this.dateUpdate2}>
        </DateTimePicker>
        </div>
        <div id="SubmitButton">
				<Button onClick={this.updatePage} > Submit </Button>
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
				<h2>{ this.props.column + " on " + this.props.locationName + " (" + this.props.selected + "): " + new Date(this.props.dateFrom).toLocaleString()}</h2>

				<div
					id="realTimeScatterplot"
					margin="0 auto"

					ref={ renderScatterplotv2("#realTimeScatterplot", this.props.selected,this.props.column, this.props.dateFrom, this.props.dateTo,this.props.lane, true) }
				/>
				<h2>{ this.props.column + " on " + this.props.locationName + " (" + this.props.selected + "): " + new Date(this.props.dateFrom).toLocaleString() + " " + this.props.hour} </h2>
				<div
					id="realTimeLinegraph"
					ref={ renderLinegraphv2("#realTimeLinegraph",this.props.selected,this.props.column,this.props.dateFrom,this.props.dateTo, this.props.hour, this.props.lane, true) }
				/>
				<h2>{ this.props.column + " on " + this.props.locationName + " (" + this.props.selected + "): " + new Date(this.props.dateFrom).toLocaleString()}</h2>
        <TableElemGen type={0} vdsID={this.props.selected} column={this.props.column} lowDate={this.props.dateFrom} highDate={this.props.dateTo} live={true}/>
      		</div>
		);
	}

	componentDidMount() {
    var opts = {
      
  lines: 10, // The number of lines to draw
  length: 9, // The length of each line
  width: 5, // The line thickness
  radius: 14, // The radius of the inner circle
  color: 'OrangeRed', // #rgb or #rrggbb or array of colors
  speed: 1.9, // Rounds per second
  trail: 50, // Afterglow percentage
  className: 'spinner', // The CSS class to assign to the spinner
};
    var scatterSpinner = new Spinner(opts).spin()
    var lineSpinner = new Spinner(opts).spin()
    document.getElementById('realTimeScatterplot').appendChild(scatterSpinner.el)
    document.getElementById('realTimeLinegraph').appendChild(lineSpinner.el)
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

	render(){
		return (
			<div id="historical">
			<h2>{this.props.test + " on " + this.props.locationName + " (" + this.props.selected + ") from " + this.props.year}</h2>
				<div  id="Calendar">
					<div ref={ renderCalendar("#Calendar", this.props.year, this.props.test) } />
       		 </div>

				<div id="hexbin_label"><h2>{this.props.test + " and " + this.props.hexColumn +  " on " + this.props.locationName + " (" + this.props.selected +  "): " + moment(this.props.dateFrom)._d.toLocaleString() + " - " + moment(this.props.dateTo)._d.toLocaleString()}</h2></div>
				<div
					id="hexbin"
					ref={ renderHexbin("#hexbin", this.props.test, this.props.hexColumn, this.props.dateFrom, this.props.dateTo) }
				/>
				<div id="abNormal_label"><h2>S</h2></div>
				<h2>{this.props.test + " on " + this.props.locationName + " (" + this.props.selected +  "): " + new Date(this.props.dateFrom).toLocaleString() + " - " + new Date(this.props.dateTo).toLocaleString()}</h2>
				<div
					id="historicalScatterplot"
					ref={ renderScatterplotv2("#historicalScatterplot", this.props.selected, this.props.test, this.props.dateFrom, this.props.dateTo , this.props.lane, false) }
				/>
				<h2>{this.props.test + " on " + this.props.locationName + " (" + this.props.selected +  "): " + new Date(this.props.dateFrom).toLocaleString() + " - " + new Date(this.props.dateTo).toLocaleString()}</h2>
				<TableElemGen type={0} vdsID={this.props.selected} column={this.props.test} lowDate={this.props.dateFrom} highDate={this.props.dateTo} live={false}/>
				<div id="historicalScatterplot_label">
					<h2>Scatterplot</h2>
				</div>
			</div>
		);
	}
	componentDidMount() {
        var opts = {
      
  lines: 10, // The number of lines to draw
  length: 9, // The length of each line
  width: 5, // The line thickness
  radius: 14, // The radius of the inner circle
  color: 'OrangeRed', // #rgb or #rrggbb or array of colors
  speed: 1.9, // Rounds per second
  trail: 50, // Afterglow percentage
  className: 'spinner', // The CSS class to assign to the spinner
};
    var scatterSpinner = new Spinner(opts).spin()
    var calendarSpinner = new Spinner(opts).spin()
    var hexSpinner = new Spinner(opts).spin()
    document.getElementById('historicalScatterplot').appendChild(scatterSpinner.el)
    document.getElementById('hexbin').appendChild(hexSpinner.el)
    document.getElementById('Calendar').appendChild(calendarSpinner.el)
	}
	componentWillUnmount() {
	}
	shouldComponentUpdate() {
		return true;
	}
}

export default class Errors extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    	dateTo: this.props.dateTo,
    	dateFrom: this.props.dateFrom
    }
    console.log("This is the state of things", this.state)
  }
	render(){
    console.log(this.props.target, "This is the state in the render")
		return (
			<div id="Errors">
				<h2>{"Errors by VDSID: " + new Date(this.state.dateFrom).toLocaleString() + " - " + new Date(this.state.dateTo).toLocaleString() }</h2>
				<svg width="1366" height="700"
					id="vdsidBargraph"
					ref={ renderBargraph(0, "#vdsidBargraph", this.props.target, this.props.sort, moment(this.props.dateFrom), moment(this.props.dateTo), this.props.setSelected) }
				/>
					<h2>{"Errors by lane for " + this.props.locationName + " (" + this.props.target + "): " + new Date(this.state.dateFrom).toLocaleString() + " - " + new Date(this.state.dateTo).toLocaleString()}</h2>
				<svg width="1366" height="700"
					id="lanesBargraph"
					ref={ renderBargraph(1, "#lanesBargraph", this.props.target, this.props.sort, moment(this.props.dateFrom), moment(this.props.dateTo), this.props.setSelected) }
				/>
				<h2>{"Errors by lane for " + this.props.locationName + " (" + this.props.target + "): " + new Date(this.state.dateFrom).toLocaleString() + " - " + new Date(this.state.dateTo).toLocaleString()}</h2>
				<TableElemGen type={1} vdsID={this.props.target} column={this.props.test} lowDate={moment(this.props.dateFrom)} highDate={moment(this.props.dateTo)} live={false}/>
			</div>
		);
	}
	componentDidMount() {
    var opts = {
      
  lines: 10, // The number of lines to draw
  length: 9, // The length of each line
  width: 5, // The line thickness
  radius: 14, // The radius of the inner circle
  color: 'OrangeRed', // #rgb or #rrggbb or array of colors
  speed: 1.9, // Rounds per second
  trail: 50, // Afterglow percentage
  className: 'spinner', // The CSS class to assign to the spinner
};
    var barSpinner = new Spinner(opts).spin()
    var laneSpinner = new Spinner(opts).spin()
    document.getElementById('vdsidBargraph').appendChild(barSpinner.el)
    document.getElementById('lanesBargraph').appendChild(laneSpinner.el)
	}
	componentWillUnmount() {

	}
	shouldComponentUpdate() {
		return true;
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


ReactDOM.render(
	<NavElem/>,
	document.getElementById('navigation')
);
