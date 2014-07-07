/**
  * @jsx React.DOM
  */

module.exports = React.createClass({
	getInitialState: function() {
		return {
			sortBy: this.props.initialSortBy || this.props.columns[0].title || this.props.columns[0].getter,
			reverse: false
		}
	},
	getDefaultProps: function() {
		return {
			data: [],
			columns: []
		}
	},
	handleSort: function(col) {
		var colId = col.title || col.getter,

			//If clicked on the same column that is already sorted, toggle the reverse state
			reverse = this.state.sortBy == colId
				? !this.state.reverse
				: false

		this.setState({
			sortBy: colId,
			reverse: reverse
		})
	},
	buildHeader: function() {
		var ths = this.props.columns.map(function(col) {
			var colId = col.title || col.getter,
				sortIndicator = ''

			if (this.state.sortBy === colId)
				sortIndicator = this.state.reverse? '\u25b4' : '\u25be'

			return <th onClick={this.handleSort.bind(this, col)}>{colId} {sortIndicator}</th>
		}.bind(this))
		return <tr>{ths}</tr>
	},

	//Get the value from the row, specified by the column.
	getValue: function(row, col) {
		var value = typeof(col.getter) === 'function'
			? col.getter(row) //gett is a function, executed it to get the value of the cell
			: row[col.getter] //the key of the hash

		return value
	},
	buildBody: function() {
		return this.props.data.map(function(row) {

			var cells = this.props.columns.map(function(col) {

				var cls = typeof(col.cls) === 'function'
					? col.cls(row)
					: col.cls

				return <td className={cls}>{this.getValue(row, col)}</td>
			}.bind(this))

			return <tr>{cells}</tr>

		}.bind(this))
	},
	sortData: function() {
		var data = this.props.data

		if (!data.length) return data

		//Get the column struct from 'id'
		var col
		this.props.columns.forEach(function(c) {
			if (this.state.sortBy == (c.title || c.getter))
				col = c
		}.bind(this))

		if (!col) {
			console.error('Not sorting by column', this.state.sortBy + '. Could not find that column config.')
			return data
		}

		//Function that get the value of the column, for sort propouses
		var _getValue = this.getValue
		function getValueHelper(row, col) {
			return typeof(col.sort) == 'function'
				? col.sort(row)
				: _getValue(row, col)
		}

		//We need to know whats the type of the colum to order them as number or string. Take the first one as the canary
		var canary = getValueHelper(data[0], col)

		if (typeof(canary) === 'number')
			data = data.sort(function(a,b) {
				return getValueHelper(b, col) - getValueHelper(a, col)
			}.bind(this))

		else
			data = data.sort(function(a,b) {
				var valA = getValueHelper(a, col),
					valB = getValueHelper(b, col)

				if (valB > valA) return 1
				if (valB < valA) return -1
				return 0
			}.bind(this))

		return this.state.reverse? data.reverse(): data
	},
	render: function() {
		var header = this.buildHeader(),
			ordered = this.sortData()
			body = this.buildBody(ordered)

		// console.log('reender y sort by:', this.state)
		return <table className={this.props.className}><tbody>{header}{body}</tbody></table>
	}
})