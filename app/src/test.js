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