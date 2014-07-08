/**
  * @jsx React.DOM
  */

module.exports = React.createClass({

	getInitialState: function() {
		return {
			isConnected: false,
			pollerError: false
		}
	},

	componentDidMount: function() {

		io().on('connect', function() {
			this.setState({isConnected: true})
		}.bind(this))

		io().on('disconnect', function() {
			this.setState({isConnected: false})
		}.bind(this))

		io().on('poller status', function(error) {
			this.setState({pollerError: error || false})
		}.bind(this))

	},

	render: function() {

		if (!this.state.isConnected)
			return <span style={{color: 'rgb(166, 28, 28)'}}>Not connected</span>

		if (this.state.pollerError)
			return <span title={this.state.pollerError.code ||this.state.pollerError}>Connected with problems</span>

		return <span>Connected</span>

	}

})