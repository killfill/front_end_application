/**
  * @jsx React.DOM
  */

var StockList = require('./StockList')

module.exports = React.createClass({
	getInitialState: function() {
		return {
			selected: [],
			founded: [],
		}
	},
	handleStockSelect: function(stock, foundedIdx) {

		var sels = this.state.selected,
			founds = this.state.founded

		sels.push(stock)
		founds.splice(foundedIdx, 1)

		this.setState({
			selected: sels,
			founded: founds
		})
	},
	handleStockUnselect: function(stock) {
		var sels = this.state.selected

		var idx = sels.indexOf(stock)
		sels.splice(idx, 1)
		this.setState({selected: sels})
	},
	handleSearch: function(e) {
		e.preventDefault()
		var val = this.refs.searchText.getDOMNode().value

		var found = [
			{Symbol: 'NFLX1', Name: 'Netflix Inc', Exchange: 'NASDAQ'},
			{Symbol: 'NFLX2', Name: 'Netflix Inc', Exchange: 'NASDAQ'},
			{Symbol: 'NFLX3', Name: 'Netflix Inc', Exchange: 'NASDAQ'},
			{Symbol: 'NFLX4', Name: 'Netflix Inc', Exchange: 'NASDAQ'},
			{Symbol: 'NFLX5', Name: 'Netflix Inc', Exchange: 'NASDAQ'},
			{Symbol: 'NFLX6', Name: 'Netflix Inc', Exchange: 'NASDAQ'},
			{Symbol: 'NFLX7', Name: 'Netflix Inc', Exchange: 'NASDAQ'},
			{Symbol: 'NFLX8', Name: 'Netflix Inc', Exchange: 'NASDAQ'},
			{Symbol: 'NFLX9', Name: 'Netflix Inc', Exchange: 'NASDAQ'},
			{Symbol: 'NFLX0', Name: 'Netflix Inc', Exchange: 'NASDAQ'},
		]

		//Hide the symbols that are already selected list.
		var alreadySelected = this.state.selected.map(function(d) { return d.Symbol }),
			filtered = found.map(function(f) {
				if (alreadySelected.indexOf(f.Symbol) < 0)
					return f
			}).filter(function(i) {return i})

		this.setState({founded: filtered})
		this.refs.searchText.getDOMNode().value = ''
	},
	render: function() {

		var selectedH4 = this.state.selected.length
			? (this.state.selected.length + ' Items')
			: 'Add some items'

		var foundH4 = this.state.founded.length
			? (this.state.founded.length + ' Results')
			: ''

		return (<span>
			<h4>{selectedH4}</h4>
			<StockList data={this.state.selected} onClick={this.handleStockUnselect} hoverChar='-' />
			<form onSubmit={this.handleSearch}>
				<input ref='searchText' type="text" placeholder='Search for ...' />
			</form>
			<h4>{foundH4}</h4>
			<StockList data={this.state.founded} onClick={this.handleStockSelect} hoverChar='+' />
		</span>)
	}
})