/**
  * @jsx React.DOM
  */

var store = require('../stores/Selected'),
	Graph = require('./Graph')

module.exports = React.createClass({

	getInitialState: function() {
		return {
			loading: false,
			data: [],
			list: store.getAll(),
			from: 1,
			to: 2
		}
	},

	onListChanged: function(all) {
		this.setState({list: all})
	},

	componentDidMount: function() {
		store.subscribe(this.onListChanged)
	},

	componentWillUnmount: function() {
		store.unsubscribe(this.onListChanged)
	},
	flattenData: function(raw) {
		//WANTED: {Date: 'the date', Symbol: 'AAPL', Currency: 'USD', value: 123, Type: 'price'}

		var data = []

		//Iterate all symbols.
		raw.Elements.forEach(function(sym) {

			//sym.Dataries.close = {max, min, values: []}
			var values = sym.DataSeries.close.values
			for (var i=0; i<values.length; i++) {

				var val = values[i],
					date = raw.Dates[i]

				var row = {
					Symbol: sym.Symbol,
					Currency: sym.Currency,
					Type: sym.Type,
					close: val,
					date: date.split('T')[0]
				}

				data.push(row)

			}

		})

		return data
	},
	handleClick: function(e) {

		var from = this.refs.from.state.value || '2012-01-01',
			to = this.refs.to.state.value || '2014-07-10'

		if (!from.match(/^(\d{4})-(\d{2})-(\d{2})$/))
			return this.setState({error: 'From value invalid.'})


		if (!to.match(/^(\d{4})-(\d{2})-(\d{2})$/))
			return this.setState({error: 'To value invalid.'})

		var elements = this.state.list.map(function(s) {
			return {Symbol: s.Symbol, Type: 'price', Params: ['c']}
		})

		var params = {
			Normalized: false,
			StartDate: from + 'T00:00:00-00',
			EndDate: to + 'T00:00:00-00',
			DataPeriod: 'Month',
			Elements: elements
		}

		this.setState({loading: true})
		io().emit('chart', params, function(err, raw) {

		if (err)
			return this.setState({loading: false, error: err})

		var data

		try { //Just in case.. :P
			data = this.flattenData(raw)
		}
		catch (e) {
			return this.setState({loading: false, error: e.stack})
		}

		this.setState({
			loading: false,
			data: data
		})

		}.bind(this))

	},
	buildHeader: function() {
		return (<div className='graph-form'>
			<h4>Compare the stocks</h4>
			From <input ref='from' placeholder='2012-01-01' />
			To <input ref='to' placeholder='2014-07-10' />
			<button className='center' onClick={this.handleClick}>Go!</button>
		</div>)
	},

	render: function() {

		var content

		if (this.state.data.length) {
			content = <Graph data={this.state.data} y='close' x='date' groupBy='Symbol' width='100%' height='350' legend={true} />
		}

		if (this.state.loading)
			content = <div className='muted center'>Loading...</div>

		if (this.state.error)
			content = <div className='negative center'>{this.state.error}</div>


		return (<div className='body'>
			{this.buildHeader()}
			<hr/>
			<div>{content}</div>
		</div>)
	}

})