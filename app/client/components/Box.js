/**
  * @jsx React.DOM
  */

var BoxContentBig = require('./BoxContentBig'),
	BoxContentGraph = require('./BoxContentGraph'),
	BoxBanner = require('./BoxBanner'),
	actions = require('../actions/Symbols')

module.exports = React.createClass({

	getInitialState: function() {
		return {
			size: 'small',
			data: {}
		}
	},

	componentDidMount: function() {
		io().emit('quote', this.props.symbol.Symbol, function(err, data) {
			if (err)
				throw err

			this.setState({data: data})
		}.bind(this))
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
				return <BoxContentBig data={this.state.data} />
			case 'graph':
				return <BoxContentGraph data={this.state.data} />
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