module.exports = function(io) {

	io.on('connection', function(socket) {
		console.log('> Hi', socket.id)

		socket.on('disconnect', function() {
			console.log('< Bye', socket.id)
		})

	})

}