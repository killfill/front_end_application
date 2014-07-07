


var assert = require('assert'),
	provider = require('../server/StockProvider')


describe('StockProvider:Quote', function() {

	it('Should error on invalid symbol', function(done) {
		provider.Quote({symbol: 'No!'}, function(err, data) {
			assert.equal(data, null, 'Error expected')
			assert.equal(typeof err, typeof {}, 'Has no error')
			done()
		})
	})

	it('Should quote valid symbol', function(done) {
		provider.Quote({symbol: 'AAPL'}, function(err, data) {
			assert.equal(err, null, 'Unexpected error')
			assert.equal(typeof data, typeof {}, 'Has data')
			assert.equal(typeof data.LastPrice, 'number', 'Should return LastPrice')
			done()
		})
	})	

})

describe('StockProvider:Lookup', function() {

	it('Should find Apple', function(done) {
		provider.Lookup({input: 'Apple'}, function(err, data) {
			assert.equal(data.length, 2, 'Apple not found')
			done()
		})
	})

})

describe('StockProvider:Poller', function() {


	it('Should subscribe and unsubscribe', function(done) {

		var poller = new provider.Poller({interval: 500})

		poller.subscribe('AAPL', function(err, data) {

			assert.equal(err, null, 'Could not subscribe')
			assert.equal(typeof data.LastPrice, 'number', 'Not valid data')

			var res = poller.unsubscribe('AAPL')
			assert.equal(res, true, 'Could not unsubscribe')

			res = poller.unsubscribe('AAPL')
			assert.equal(res, false, 'Should not unsubscribe twice')

			done()

		})

	})

	it('Should emit poll events', function(done) {

		var poller = new provider.Poller({interval: 500})

		poller.onNewQuote = function(data) {
			assert.equal(typeof data.LastPrice, 'number', 'Not valid data')
			done()
		}

		poller.onError = function(err) {
			assert.equal(err, null, 'Unexpected error event on poller')
			done()
		}

		poller.subscribe('AAPL', function(err, data) {
			assert.equal(typeof data.LastPrice, 'number', 'Not valid data')
		})


	})

})

