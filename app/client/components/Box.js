/**
  * @jsx React.DOM
  */

var BoxContentBig = require('./BoxContentBig'),
	BoxContentGraph = require('./BoxContentGraph')

module.exports = React.createClass({
	getInitialState: function() {
		return {
			size: 'small'
		}
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
				return <BoxContentBig data={this.props.data} />
			case 'graph':
				return <BoxContentGraph data={this.props.data} />
		}
	},
	render: function() {

		var data = this.props.data,
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

		var content = this.getBoxContent(this.state.size)

		return (<article className={'box ' + this.state.size}>

			<div className={'header ' + color}>
				<button className='pull-left' title='Change box size' onClick={this.changeSize}>{this.state.size}</button>
				{data.Symbol} {arrow}
				<button className='pull-right' title='Unselect this stock'>-</button>
			</div>

			<div className={'banner ' + color + '-dark'}>
				<span className='number pull-left' title='Change'>{data.Change}</span>
				<span className='number pull-right'>{data.ChangePercent.toFixed(1)}%</span>
			</div>

			{content}

		</article>)
	}
})