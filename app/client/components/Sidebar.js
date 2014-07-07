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

	//Filter the found symbols that are already selected
	filterFoundSymbols: function(found) {

		var alreadySelected = this.state.selected.map(function(d) { return d.Symbol }),
			filtered = found.map(function(f) {
				if (alreadySelected.indexOf(f.Symbol) < 0)
					return f
			}).filter(function(i) {return i})

		return filtered
	},
	handleSearch: function(e) {
		e.preventDefault()
		var val = this.refs.searchText.getDOMNode().value

		io().emit('search', val, function(err, found) {
			if (err)
				throw err

			this.setState({founded: this.filterFoundSymbols(found)})
			this.refs.searchText.getDOMNode().value = ''

		}.bind(this))
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