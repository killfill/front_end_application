
//This is like a hub. It let the backend poll for 1 symbol (using StockProvider), and share that info with multiple clients

function PollerHub(poller) {
	if (!poller) throw new Error('Need a poller!')
	this.poller = poller
	this.state = {}

	//When new data arrived, inform all clients about it.
	this.poller.onNewQuote = function(data) {
		this.state[data.Symbol].forEach(function(client) {
			this.informClient(client, data)
		}.bind(this))
	}.bind(this)
}

PollerHub.prototype.informClient = function(data, client) {
	throw new Error('Override me!')
}

PollerHub.prototype.subscribe = function(symbol, client, cb) {

	var state = this.state[symbol]

	//If symbol is already in the state, add the client to the notification list.
	if (state) {

		if (state.indexOf(client) > -1)
			return cb('Client already registerd to this symbol')

		// console.log('Subscription from', (client.id || client), 'to', symbol + '. Polling already setup, adding to the listeners.')
		state.push(client)		
		return cb(null, 'Suscrito a' + symbol + ' que ya lo tengo.. ;)')
	}
	
	//If not, start a new poll
	this.poller.start(symbol, function(err, data) {

		if (err) return cb(err)

		// console.log('Subscription from', (client.id || client), 'to', symbol + '. Starting new polling...')
		this.state[symbol] = [client]
		cb && cb(null, data)

	}.bind(this))

}


PollerHub.prototype.unsubscribe = function(symbol, client) {

	var state = this.state[symbol]
	
	if (!state) {
		// console.log('I dont know about symbol', symbol)
		return false
	}


	var idx = state.indexOf(client)
	
	if (idx < 0) {
		// console.log('unsubscribe error. Cannot find', (client.id || client), 'on my list!')
		return false
	}

	state.splice(idx, 1)

	//If no more clients are listening, stop polling and reset the state for the symbol
	if (!state.length) {
		// console.log('Stop polling', symbol)
		this.poller.stop(symbol)
		delete this.state[symbol]
	}

	return true
}

//unsubscribe the client to all events.
PollerHub.prototype.unregisterClient = function(client) {

	Object.keys(this.state).forEach(function(symbol) {

		//for each state
		var state = this.state[symbol]

		//Delete the client
		var idx = state.indexOf(client)
		if (idx > -1 )
			state.splice(idx, 1)

		//If no other client is listening to this symbol, clean the state.
		if (!this.state[symbol].length) {
			// console.log('Stop polling', symbol)
			this.poller.stop(symbol)
			delete this.state[symbol]
		}
	
	}.bind(this))
}

module.exports = PollerHub

