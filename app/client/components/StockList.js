/**
  * @jsx React.DOM
  */

module.exports = React.createClass({
	getDefaultProps: function() {
		return {
			data: [],
			onClick: function() {},
			hoverChar: '?'
		}
	},
	render: function() {
		if (!this.props.data.length)
			return <div></div>

		var list = this.props.data.map(function(d, idx) {
			return (<li onClick={this.props.onClick.bind(null, d, idx)} title={d.Name + ' (' + d.Exchange + ')'}>
				<span className='show-on-hover'>{this.props.hoverChar}</span>
				<span>{d.Symbol}</span>
			</li>)
		}.bind(this))
		return <ul className='items hover pointer'>{list}</ul>
	}
})
