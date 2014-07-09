/**
  * @jsx React.DOM
  */

var store = require('../stores/Selected')

module.exports = React.createClass({

	getInitialState: function() {
		return {
			list: store.getAll(),
			from: 1,
			to: 2
		}
	},

	buildHeader: function() {
		return <h1>This is the header</h1>
	},

	render: function() {

		var content = this.state.list.map(function(d) {
			return <div>{d.Symbol}</div>
		})

		return (<div className='body'>
			{this.buildHeader()}
			<hr/>
			<p>{content}</p>
		</div>)
	}

})