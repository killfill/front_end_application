
module.exports = function(opts) {

	var express = require('express'),
		logger = require('morgan'),
		http = require('http'), //socket.io seems to need to listen on the raw http, not on the express listen function.
		sio = require('socket.io'),
		realtime = require('./realtime'),
		fs = require('fs')

	var app = express(),
		httpServer = http.Server(app),
		io = sio(httpServer)

	app.use(logger('dev'))
	app.use(express.static(__dirname + '/../public'))

	//Send alwais the index.. probably could use some caching here...
	app.get('/*', function(req, res, next) {
		var file = __dirname + '/../public/index.html'

		fs.readFile(file, function(err, data) {
			if (err)
				res.send(500)

			res.setHeader('content-type', 'text/html; charset=UTF-8')
			res.send(200, data)
		})
	})

	//Socket.io logic
	realtime(io, opts)

	return {
		express: app,
		http: httpServer
	}

}
