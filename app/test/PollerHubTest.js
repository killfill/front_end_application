var assert = require('assert'),
	Provider = require('../server/StockProvider'),
	PollerHub = require('../server/PollerHub')


describe('PollerHub', function() {

	var poller = new Provider.Poller({interval: 1000})


	it('Share 1 polling with multiple clients', function(done) {

		var hub = new PollerHub(poller),
			clients = ['Johnny', 'Walker', 'Jack', 'Daniels']

		var informed = 0
		hub.informClient = function(client, data) {
			assert.equal(typeof (data.LastPrice), 'number', 'Data not valid')
			if (++informed == clients.length + 1)
				done()
		}

		hub.subscribe('IBM', 'Master', function(err, data) {
			assert.equal(err, null, err)

			hub.subscribe('IBM', 'Master', function(err, data) {
				assert.equal(data, null, 'Error was expected')
			})

			//After the first one is registered, enter the others.
			clients.forEach(function(client) {
				hub.subscribe('IBM', client, function(err, data) {
					assert.equal(err, null, err)
				})
			})
		})

	})



	it('Stop polling', function(done) {

		var hub = new PollerHub(poller),
			client = 'Jura'

		hub.informClient = function(client, data) {

			var res = hub.unsubscribe('AAPL', client)
			assert.equal(res, true, 'Could not unsubscribe')

			var res = hub.unsubscribe('AAPL', client)
			assert.equal(res, false, 'Should not unsuscribe twice')

			assert.equal(hub.state['AAPL'], null, 'Did not delete state for symbol')

			done()

		}

		hub.subscribe('AAPL', client, function(err) {
			assert.equal(err, null, err)
		})

	})

	it('Unregister client', function(done) {

		var hub = new PollerHub(poller),
			client = 'Pipers'

		hub.informClient = function() {
			hub.unregisterClient(client)
			done()
		}
		hub.subscribe('ORC', client, function(err) {
			assert.equal(err, null, err)
		})

	})

})