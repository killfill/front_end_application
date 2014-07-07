/* 
	Component to decouple views from doing actions on the stores.

	This could probably trigger actions to a dispatcher instead of directly to the stores, 
	as described by flux arch, but the app is quite simple, and it probably do not justify adding that complexity.
*/

var store = require('../stores/Selected')

module.exports = {

	add: function(data) {
		store.set(data.Symbol, data)
	},

	remove: function(data) {
		store.remove(data.Symbol)
	}

}