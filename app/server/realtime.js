
var provider = require('./StockProvider')

var PollerHub = require('./PollerHub'),
	poller = new provider.Poller({interval: 3000}),
	hub = new PollerHub(poller)

hub.informClient = function(client, data) {
	client.emit('data:' + data.Symbol, data)
}

module.exports = function(io) {

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

		socket.on('poll stop', function(symbol, cb) {
			hub.unsubscribe(symbol, socket, cb)
		})

	})

}