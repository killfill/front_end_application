
var request = require('request')

var ENDPOINT = 'http://dev.markitondemand.com/Api/v2/:subject/json'

function endpointClosure(subject) {

	var url = ENDPOINT.replace(':subject', subject)
	
	return function query(params, cb) { 
		request({url: url, qs: params, json: true}, function(err, res, body) {

			//mark it on demand send errors on a 200 responses!
			if (!err && body.Message) return cb(body)
			
			cb(err, body)
		})
	}

}

var me = module.exports = {
	Lookup: endpointClosure('Lookup'),
	Quote: endpointClosure('Quote'),
	InteractiveChart: endpointClosure('InteractiveChart')
}

function StockPoller(opts) {
	opts = opts || {}
	this.interval = opts.interval || 1000
	this.pollings = {}

	//Emit the data comming to the listener.
	this.onNewQuote = function(data) {
		throw new Error('Override me: onNewQuote')
	}
	this.onError = function(err) {
		throw err
	}

}

StockPoller.prototype.startLoop = function(symbol) {
	var onError = this.onError,
		onNewQuote = this.onNewQuote

	var tick = setInterval(function() {

		me.Quote({symbol: symbol}, function(err, data) {

			//clearInterval does only prevent from running the loop again, it does not stop the one that was already triggered
			//So check here, if this is a still valid thing to do.
			if (!this.pollings[symbol]) return;

			if (err || data.Status !== 'SUCCESS')
				return onError(err || data)
			onNewQuote(data)

		}.bind(this))

	}.bind(this), this.interval)

	this.pollings[symbol] = tick
}

StockPoller.prototype.start = function(symbol, cb) {

	//Check if already present.
	if (this.pollings[symbol])
		return cb(symbol + ' already present')

	//Check if the symbol is actually valid
	me.Quote({symbol: symbol}, function(err, data) {
		if (err)
			return cb(err)

		//mark it on demans sends .Status = SUCCESS for quotes only, so lets make a special check here.
		if (data.Status !== 'SUCCESS')
			return cb({Message: 'Could not get quote', err: data})

		this.startLoop(symbol)
		cb(null, data)

	}.bind(this))

}

StockPoller.prototype.stop = function(symbol) {
	if (!this.pollings[symbol])
		return false

	clearInterval(this.pollings[symbol])
	delete this.pollings[symbol]
	return true
}

module.exports.Poller = StockPoller

