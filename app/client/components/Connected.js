/**
  * @jsx React.DOM
  */

module.exports = React.createClass({

	getInitialState: function() {
		return {isConnected: false}
	},

	componentDidMount: function() {
		io().on('connect', function() {
			this.setState({isConnected: true})
		}.bind(this))

		io().on('disconnect', function() {
			this.setState({isConnected: false})
		}.bind(this))
	},

	render: function() {
		if (this.state.isConnected)
			return <span>Connected</span>

		return <span style={{color: 'rgb(166, 28, 28)'}}>Not connected</span>
	}

})