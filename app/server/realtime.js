
module.exports = function(io, opts) {

	var provider = require('./StockProvider')

	var PollerHub = require('./PollerHub'),
		poller = new provider.Poller({interval: opts.interval || 1000}),
		hub = new PollerHub(poller)

	hub.informClient = function(client, data) {
		client.emit('data:' + data.Symbol, data)
	}


	hub.onNewPollerStatus = function(err) {
		io.emit('poller status', err)
	}

	io.on('connection', function(socket) {
		console.log('> Hi', socket.id)

		socket.on('disconnect', function() {
			console.log('< Bye', socket.id)
			hub.unregisterClient(socket)
		})

		socket.on('search', function(text, cb) {
			provider.Lookup({input: text}, cb)
		})

		socket.on('quote', function(symbol, cb) {
			provider.Quote({symbol: symbol}, cb)
		})

		socket.on('poll', function(symbol, cb) {
			hub.subscribe(symbol, socket, cb)
		})

		socket.on('poll stop', function(symbol) {
			hub.unsubscribe(symbol, socket)
		})

	})

}