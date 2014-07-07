
var provider = require('./StockProvider')

module.exports = function(io) {

	io.on('connection', function(socket) {
		console.log('> Hi', socket.id)

		socket.on('disconnect', function() {
			console.log('< Bye', socket.id)
		})

		socket.on('search', function(text, cb) {
			provider.Lookup({input: text}, cb)
		})

		socket.on('quote', function(symbol, cb) {
			provider.Quote({symbol: symbol}, cb)
		})

	})

}