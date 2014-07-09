/**
  * @jsx React.DOM
  */

var Table = require('./Table'),
	selectedStore = require('../stores/Selected'),
	pollingMixin = require('../mixins/Polling'),
	actions = require('../actions/Symbols')

module.exports = React.createClass({

	mixins: [pollingMixin],
	getInitialState: function() {
		return {
			data: {}
		}
	},

	getDefaultProps: function() {
		return {
			selected: selectedStore.getAll(),
			columsConfig: this.buildColumnConfig()
		}
	},

	handlePolledData: function(data) {
		this.state.data[data.Symbol] = data
		this.setState({
			data: this.state.data
		})
	},

	poll: function(sel) {
		this.startListening(
			sel.Symbol,
			this.handlePolledData,
			function e(err) {
				console.log('Could not start polling', sel.Symbol, 'Will remove it from the selected symbols list to preserve consistent state')
				console.log(err.Message || err)
				actions.remove(sel)
			}
		)
	},

	componentDidMount: function() {

		//Start polling for data on the already selected list of symbols
		this.props.selected.forEach(this.poll)

		//Start polling as new symbols get added. Subscribe gives us all the symbols. 
		//Maybe would be a good idea to add a 'onAdd' and 'onRm' event so we dont need to do this mess...
		selectedStore.subscribe(this.onSymbolChanged)

	},

	onSymbolChanged: function(all) {
		var data = this.state.data

		//Add symbols we dont already have
		all.forEach(function(i) {
			if (!data[i.Symbol])
				this.poll(i)
		}.bind(this))

		//Remove symbols that are not longer present.
		Object.keys(data).forEach(function(mine) {
			var isPresent = false
			all.forEach(function(their) {
				if (mine == their.Symbol)
					isPresent = true
			})

			if (!isPresent) {
				console.log('TODO: remove', mine, 'from this table list... :P')
			}

		})
	},

	componentWillUnmount: function() {

		selectedStore.unsubscribe(this.onSymbolChanged)

		Object.keys(this.state.data).forEach(function(sym) {
			this.stopListening(sym, this.handlePolledData)
		}.bind(this))
	},

	render: function() {
		var data = Object.keys(this.state.data).map(function(k) {return this.state.data[k]}.bind(this))

		return <Table data={data} columns={this.props.columsConfig} initialSortBy='Price' className='large-table hover'/>
	},

	buildColumnConfig: function() {
		return [
			{getter: 'Symbol', cls: 'center'},
			{getter: 'LastPrice', title: 'Price', cls: 'number strong'},
			{title: 'Change',
				getter: function(d) {  return d.Change.toFixed(2) + ' (' + d.ChangePercent.toFixed(2) + '%)'},
				sort:   function(d) { return d.ChangePercent},
				cls:    function(d) { return d.ChangePercent > 0? 'center number positive': 'center number negative'}
			},
			{getter: 'High', cls: 'number', commas: 2},
			{getter: 'Low', cls: 'number', commas: 2},
			{getter: 'Open', cls: 'number', commas: 2},
			{getter: 'ChangeYTD', title: 'Year', cls: 'number', commas: 2},
			{getter: 'MarketCap', title: 'Market', cls: 'number muted'}
		]
	}

})