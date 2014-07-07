var express = require('express'),
	logger = require('morgan'),
	http = require('http'), //socket.io seems to need to listen on the raw http, not on the express listen function.
	sio = require('socket.io'),
	realtime = require('./realtime')

var app = express(),
	httpServer = http.Server(app),
	io = sio(httpServer)

module.exports = {
	express: app,
	http: httpServer
}

app.use(logger('dev'))
app.use(express.static(__dirname + '/../public'))

//Socket.io logic
realtime(io)