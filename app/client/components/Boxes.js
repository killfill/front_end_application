/**
  * @jsx React.DOM
  */


/* This function should go away after connecting to the server! */
var n = 0
function buildSample(symbol) {
	symbol = symbol || 'SPL' + (n++)

	return {
	    "Name": symbol + ' Company Inc.',
	    "Symbol": symbol,
	    "LastPrice": (400 + 200 * Math.random()).toFixed(2),
	    "Change": (-20 + 40 * Math.random()).toFixed(2),
	    "ChangePercent": -10 + 20 * Math.random(),
	    "Timestamp": new Date().toString(),
	    "MSDate": 41570.568969907,
	    "MarketCap":476497591530,
	    "Volume":397562,
	    "ChangeYTD": (400 + 200 * Math.random()).toFixed(2),
	    "ChangePercentYTD": -5 + 10 * Math.random(),
	    "High": 400 + 200 * Math.random(),
	    "Low": 400 + 200 * Math.random(),
	    "Open": 400 + 200 * Math.random()
}
}

var Box = require('./Box')

module.exports = React.createClass({
	getInitialState: function() {
		return {
			list: []
		}
	},
	componentDidMount: function() {

		function addSample() {
			var SAMPLE = buildSample()
			this.setState({
				list: this.state.list.concat([SAMPLE])
			})
		}
		for (var i=0; i<40; i++)
			addSample.call(this)

		setInterval(function() {
			var l = this.state.list.map(function(d) {
				return buildSample(d.Symbol)
			})
			this.setState({
				list: l
			})
		}.bind(this), 1000)

	},
	render: function() {
		var list = this.state.list.map(function(d) {
			return <Box data={d}>Hijito</Box>
		})
		return <div className='box-container'>{list}</div>
	}
})
