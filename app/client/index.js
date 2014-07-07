/**
  * @jsx React.DOM
  */

var Sidebar = require('./components/Sidebar'),
	Boxes = require('./components/Boxes'),
	Table = require('./components/Table')

React.renderComponent(<Sidebar/>, document.getElementsByClassName('sidebar')[0])



React.renderComponent(<Boxes/>, document.getElementsByClassName('middle')[0])
//Just focus on the boxes list.. :P


// function random(from, to, comma) {
// 	//Numbers after the comma
// 	comma = comma || 2

// 	var delta = to - from

// 	//Damn.. this should work..
// 	//return from + ( Math.floor(Math.pow(10, comma) * delta * Math.random())) / Math.pow(10, comma)

// 	//Ugly way
// 	var raw = from + delta * Math.random(),
// 		parts = raw.toString().split('.')
// 	parts[1] = parts[1].slice(0, comma)
// 	return parseFloat(parts.join('.'), 10)

// }
// var n = 0
// function buildSample(symbol) {
// 	symbol = symbol || 'SPL' + (n++)

// 	return {
// 		"Name": symbol + ' Company Inc.',
// 		"Symbol": symbol,
// 		"LastPrice": random(400, 600),
// 		"Change": random(-20, 20),
// 		"ChangePercent": random(-10, 10),
// 		"Timestamp": new Date().toString(),
// 		"MSDate": 41570.568969907,
// 		"MarketCap":476497591530,
// 		"Volume":397562,
// 		"ChangeYTD": random(400 , 600),
// 		"ChangePercentYTD": random(-5, 5),
// 		"High": random(400, 600),
// 		"Low": random(400, 600),
// 		"Open": random(400, 600),
// 	}
// }


// var tableData = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].map(function() {
// 	return buildSample()
// })
// var columsConfig = [
// 	{getter: 'Symbol', cls: 'center'},
// 	{getter: 'LastPrice', title: 'Price', cls: 'number strong'},
// 	{title: 'Change',
// 		getter: function(d) { return d.Change + ' (' + d.ChangePercent.toFixed(2) + '%)'}, 
// 		sort:   function(d) { return d.ChangePercent},
// 		cls:    function(d) { return d.ChangePercent > 0? 'center number positive': 'center number negative'}
// 	},
// 	{getter: 'High', cls: 'number'},
// 	{getter: 'Low', cls: 'number'},
// 	{getter: 'Open', cls: 'number'},
// 	{getter: 'ChangeYTD', title: 'Year', cls: 'number'},
// 	{getter: 'MarketCap', title: 'Market', cls: 'number muted'}
// ]

// React.renderComponent((
// 	<div>
// 		<h4>Some kind of routing could be use here?... Showing table and boxes:3</h4>
// 		<Table data={tableData} columns={columsConfig} initialSortBy='Price' className='large-table hover'/>
// 		<Boxes/>
// 	</div>), document.getElementsByClassName('middle')[0])


