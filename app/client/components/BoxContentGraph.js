/**
  * @jsx React.DOM
  */

module.exports = React.createClass({
	getDefaultProps: function() {
		return {
			x: 'id',
			y: 'LastPrice',
			type: 'line',
			interpolation: 'cardinal',
			legend: false,
			data: [],
			transition: null //200
		}
	},

	updateGraph: function(props) {
		var min = props.data.reduce(function(a,b) { return Math.min(a, b[this.props.y]) }.bind(this), 99999999)
		this.yAxis.overrideMin = min - .1

		var max = props.data.reduce(function(a,b) { return Math.max(a, b[this.props.y]) }.bind(this), 0)
		this.yAxis.overrideMax = max + .1

		this.chart.data = props.data
		this.chart.draw(this.props.transition)
	},

	componentWillReceiveProps: function(props) {
		this.updateGraph(props)
	},

	// Did not really notic any performance difference, so just leave it out.. :P
	// shouldComponentUpdate: function(props) {
	// 	return false
	// },

	createDimple: function() {

		var c = new dimple.chart(this.svg, this.props.data)

		c.addCategoryAxis("x", this.props.x)

		this.yAxis = c.addMeasureAxis("y", this.props.y)

		var serie = c.addSeries(null, dimple.plot[this.props.type])

		serie.interpolation = this.props.interpolation

		if (this.props.legend)
			c.addLegend(10, 10, 100, 20, "top")

		this.chart = c
	},

	componentDidMount: function() {
		this.svg = d3.select(this.getDOMNode())
			.append('svg')
				.attr('width', 390)
				.attr('height', 180)

		this.createDimple()
		this.updateGraph(this.props)

	},

	render: function() {
		return (<div className='body'></div>)
	}
})