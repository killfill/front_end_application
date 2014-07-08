

var memory = {},
	subscribed = []

function stringSorter(a,b) {
	if (a > b) return 1
	if (a < b) return -1
	return 0
}

if (localStorage.selectedStore)
	memory = JSON.parse(localStorage.selectedStore)

module.exports = {

	get: function(id) {
		return memory[id] || false
	},

	//merge? add?
	set: function(id, data) {
		memory[id] = data
		this.emit()
	},

	remove: function(id) {
		var el = memory[id]
		if (!el) throw new Error('Could not remove ' + id)
		delete memory[id]
		this.emit()
		return el
	},

	getAll: function() {
		return Object.keys(memory)
			// .sort(stringSorter)
			.map(function(k) {
				return memory[k]
			})
	},

	//Simpliest pub/sub thing...
	emit: function() {

		//All modifications triggers this action. Persist the data here.. bad me bad me.. :P
		localStorage.selectedStore = JSON.stringify(memory)

		subscribed.forEach(function(sub) {
			sub(this.getAll())
		}.bind(this))
	},

	subscribe: function(cb) {
		subscribed.push(cb)
	},

	unsubscribe: function(cb) {
		var idx = subscribed.indexOf(cb)
		if (idx < 0) return false
		subscribed.splice(idx, 1)
		return true
	}

}