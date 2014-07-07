

var memory = {},
	subscribed = []

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

	//Order by?
	getAll: function() {
		return Object.keys(memory).map(function(k) {
			return memory[k]
		})
	},

	//Simpliest pub/sub thing...
	emit: function() {
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