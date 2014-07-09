module.exports = {
	startListening: function(symbol, cb, errCb) {

		io().emit('poll', symbol, function(err, data) {
			if (err) return errCb(err)

			cb(data)
			io().on('data:' + symbol, cb)

		})
	},

	stopListening: function(symbol, cb) {

		io().removeListener('data:' + symbol, cb)
		io().emit('poll stop', symbol)

	}

}