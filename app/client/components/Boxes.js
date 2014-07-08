/**
  * @jsx React.DOM
  */


var Box = require('./Box'),
	selectedSymbols = require('../stores/Selected')

module.exports = React.createClass({
	getInitialState: function() {
		return {list: selectedSymbols.getAll()}
	},
	onSymbolChanged: function(list) {
		this.setState({list: list})
	},
	componentDidMount: function() {
		selectedSymbols.subscribe(this.onSymbolChanged)
	},
	componentWillUnmount: function() {
		selectedSymbols.unsubscribe(this.onSymbolChanged)
	},
	render: function() {

		if (!this.state.list.length)
			return <h4>Add some items with the sidebar at the left</h4>

		var boxes = this.state.list.map(function(d) {
			return <Box key={d.Symbol} symbol={d}></Box>
		})
		return <div className='box-container'>{boxes}</div>
	}
})
