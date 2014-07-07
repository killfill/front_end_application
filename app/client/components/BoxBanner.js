/**
  * @jsx React.DOM
  */

module.exports = React.createClass({

	render: function() {

		var color = this.props.color,
			data = this.props.data

		if (!data || !data.Change)
			return <span></span>

		return <div className={'banner ' + color + '-dark'}>
			<span className='number pull-left' title='Change'>{data.Change.toFixed(2)}</span>
			<span className='number pull-right'>{data.ChangePercent.toFixed(1)}%</span>
		</div>
	}
})