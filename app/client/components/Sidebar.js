/**
  * @jsx React.DOM
  */

var StockList = require('./StockList'),
	store = require('../stores/Selected'),
	actions = require('../actions/Symbols')

module.exports = React.createClass({

	getInitialState: function() {
		return {
			selected: [],
			founded: [],
			isSearching: false
		}
	},

	componentDidMount: function() {
		store.subscribe(this.onStoreChanged)
	},
	componentWillUnmount: function() {
		store.unsubscribe(this.onStoreChanged)
	},

	//Handle changes comming from the store.
	onStoreChanged: function(all) {

		//Hide the founded elements that are already in the 'selected' list.
		var founded = this.state.founded
			.map(function(d) { if (!store.get(d.Symbol)) return d })
			.filter(function(d) {return d})

		this.setState({
			selected: all,
			founded: founded
		})

	},

	handleStockSelect: function(stock) {
		actions.add(stock)
	},

	handleStockUnselect: function(stock) {
		actions.remove(stock)
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

		this.setState({isSearching: val, founded: []})
		io().emit('search', val, function(err, found) {
			if (err)
				throw err

			this.setState({
				isSearching: false,
				founded: this.filterFoundSymbols(found)
			})
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

		if (this.state.isSearching)
			foundH4 = 'Looking for ' + this.state.isSearching

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