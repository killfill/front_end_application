#!/usr/bin/env node

var minimist = require('minimist'),
	Server = require('../server')

var argv = minimist(process.argv.slice(2), {
        default: {
                port: 3000,
                livereload: false,
                pollingInterval: 5000
        }
});

if (argv.help || argv.h)
	return console.log(['--port, --livereload', '--pollingInterval'].join('\n'))

var app = Server({interval: argv.pollingInterval})

app.http.listen(argv.port)
console.log('Running on port', argv.port)

if (argv.livereload) {
	var live = require('express-livereload'),
		dir = __dirname + '/../public'

	//Exclude .all.js so wachify can work its thin without triggering a reload, prior its finished.
	live(app.express, {watchDir: dir}) //, exclusions: [/\.all.js/]})
	console.log('With livereload watchif for changes in', dir)
}