
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

module.exports = {
	Lookup: endpointClosure('Lookup'),
	Quote: endpointClosure('Quote'),
	InteractiveChart: endpointClosure('InteractiveChart')
}


if (require.main === module) {

	var assert = require('assert')
		me = module.exports,
	
	me.Quote({symbol: 'No'}, function(err, data) {
		assert.equal(data, null, 'Should return error on Not Valid symbol')
		assert.equal(typeof err, typeof {}, 'Has error')

	})

	me.Quote({symbol: 'AAPL'}, function(err, data) {
		assert.equal(err, null, 'Should have no error')
		assert.equal(typeof data, typeof {}, 'Has data')
		assert.equal(typeof data.LastPrice, 'number', 'Should return LastPrice')
	})

}
