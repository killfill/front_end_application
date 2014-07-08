
//This is like a hub. It let the backend poll for 1 symbol (using StockProvider), and share that info with multiple clients

function PollerHub(poller) {
	if (!poller) throw new Error('Need a poller!')
	this.poller = poller

	//I.e. {AAPL: clients[], lastKnownValue: {}}
	this.state = {}

	//When new data arrived, inform all clients about it.
	this.poller.onNewQuote = function(data) {

		var state = this.state[data.Symbol]

		//Remember the new polled data of the symbol, so when new clients connect, can send this right away.
		state.lastKnownValue = data

		state.clients.forEach(function(client) {
			this.informClient(client, data)

		}.bind(this))

	}.bind(this)

	//Catch up errors!
	this.poller.onError = function(err) {
		console.log('Got an error when polling..', (err.code || err))
	}
}

PollerHub.prototype.informClient = function(data, client) {
	throw new Error('Override me!')
}

PollerHub.prototype.subscribe = function(symbol, client, cb) {

	var state = this.state[symbol]

	//If symbol is already in the state, add the client to the notification list.
	if (state) {

		if (state.clients.indexOf(client) > -1)
			return cb('Client already registerd to this symbol')

		console.log('Subscription from', (client.id || client), 'to', symbol + '. Polling already setup, adding to the listeners.')
		state.clients.push(client)
		return cb(null, state.lastKnownValue)
	}

	//If not, start a new poll
	this.poller.start(symbol, function(err, data) {

		if (err) return cb(err)
		console.log('Subscription from', (client.id || client), 'to', symbol + '. Starting new polling...')
		this.state[symbol] = {clients: [client], lastKnownValue: data}
		cb && cb(null, data)

	}.bind(this))

}


PollerHub.prototype.unsubscribe = function(symbol, client) {

	var state = this.state[symbol]
	
	if (!state) {
		// console.log('I dont know about symbol', symbol)
		return false
	}


	var idx = state.clients.indexOf(client)
	
	if (idx < 0) {
		// console.log('unsubscribe error. Cannot find', (client.id || client), 'on my list!')
		return false
	}

	state.clients.splice(idx, 1)

	//If no more clients are listening, stop polling and reset the state for the symbol
	if (!state.length) {
		console.log('Stop polling', symbol)
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
		var idx = state.clients.indexOf(client)
		if (idx > -1 )
			state.clients.splice(idx, 1)

		//If no other client is listening to this symbol, clean the state.
		if (!this.state[symbol].clients.length) {
			console.log('Stop polling', symbol)
			this.poller.stop(symbol)
			delete this.state[symbol]
		}
	
	}.bind(this))
}

module.exports = PollerHub

