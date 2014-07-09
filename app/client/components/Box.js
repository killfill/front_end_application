/**
  * @jsx React.DOM
  */

var BoxContentBig = require('./BoxContentBig'),
	BoxContentGraph = require('./BoxContentGraph'),
	BoxBanner = require('./BoxBanner'),
	actions = require('../actions/Symbols'),
	pollingMixin = require('../mixins/Polling')

module.exports = React.createClass({

	mixins: [pollingMixin],

	getInitialState: function() {
		return {
			size: 'small',
			data: {},
			dataHistory: [],
			error: false
		}
	},
	handlePolledData: function(data) {

		var h = this.state.dataHistory
		h.push(data)

		if (h.length > 20)
			h.shift()

		//Put an id on the data...
		h.forEach(function(d, idx) {
			d.id = idx
		})

		this.setState({
			data: data,
			dataHistory: h
		})
	},

	handlePolledError: function(err) {
		this.setState({error: err})
	},

	componentDidMount: function() {

		this.startListening(this.props.symbol.Symbol, this.handlePolledData, this.handlePolledError)

		//Con reconnect, start polling again. Not working well.. :S
		// io().on('connect', this.startListening)
	},
	componentWillUnmount: function() {
		this.stopListening(this.props.symbol.Symbol, this.handlePolledData)
	},
	changeSize: function() {
		var curr = this.state.size

		var next = curr === 'small'
			? 'big'
			: curr === 'big'
				? 'graph'
				: 'small'

		this.setState({size: next})
	},

	getBoxContent: function(size) {
		switch (size) {
			case 'small':
				return null
			case 'big':
				return <BoxContentBig key={this.state.data.Symbol + 'bigbox'} data={this.state.data} />
			case 'graph':
				return <BoxContentGraph key={this.state.data.Symbol + 'graph'} data={this.state.dataHistory} y='LastPrice' />
		}
	},
	closeSymbol: function() {
		actions.remove(this.props.symbol)
	},
	render: function() {

		var data = this.state.data,
			color = '',
			arrow = ''

		if (data.Change > 0) {
			color = 'positive'
			arrow = '\u25b2'
		}

		if (data.Change < 0) {
			color = 'negative'
			arrow = '\u25bc'
		}

		var content = Object.keys(this.state.data).length === 0
			? <div className='body muted'>Waiting for quote...</div>
			: this.getBoxContent(this.state.size)

		if (this.state.error)
			content = <div className='body' title={this.state.error.err && this.state.error.err.Status || JSON.stringify(this.state.error)}>{this.state.error.Message || this.state.error.code || this.state.error}</div>

		return (<article className={'box ' + this.state.size}>

			<div className={'header ' + color}>
				<button className='pull-left' title='Change box size' onClick={this.changeSize}>{this.state.size}</button>
				<span title={this.props.symbol.Name}>{this.props.symbol.Symbol} {arrow}</span>
				<button className='pull-right' title='Unselect this stock' onClick={this.closeSymbol}>-</button>
			</div>

			<BoxBanner color={color} data={data} />
			{content}

		</article>)
	}
})