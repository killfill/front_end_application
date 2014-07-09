/**
  * @jsx React.DOM
  */

var Sidebar = require('./components/Sidebar'),
	Boxes = require('./components/Boxes'),
	Table = require('./components/Table'),
	Connected = require('./components/Connected'),
	Menu = require('./components/Menu')

React.renderComponent(<Connected/>, document.getElementById('connected'))
React.renderComponent(<Sidebar/>, document.getElementsByClassName('sidebar')[0])


/* Routing stuff */

var menu = document.getElementById('menu'),
	container = document.getElementsByClassName('middle')[0]

page('/', function() {
	React.renderComponent(<Menu/>, menu)
	React.renderComponent(<Boxes/>, container)
})

page('/table', function() {
	React.renderComponent(<Menu selected='/table' />, menu)
	React.renderComponent(<Table data={tableData} columns={columsConfig} initialSortBy='Price' className='large-table hover'/>, container)
})

page('/graph', function() {
	React.renderComponent(<Menu selected='/graph' />, menu)
	React.renderComponent(<div>GRAPH</div>, container)
})

page('/bench', function() {
	React.renderComponent(<Menu selected='/bench' />, menu)
	React.renderComponent(<div>BENCH</div>, container)
})

page('/about', function() {
	React.renderComponent(<Menu selected='/about' />, menu)
	React.renderComponent(<h1 className="center"><p><a href="https://twitter.com/killfil">@killfill</a></p><img src="unicorn.png"/></h1>, container)
})

page('*', function() {
	console.log('Nooooo')
})

page()



var columsConfig = [
	{getter: 'Symbol', cls: 'center'},
	{getter: 'LastPrice', title: 'Price', cls: 'number strong'},
	{title: 'Change',
		getter: function(d) { return d.Change + ' (' + d.ChangePercent.toFixed(2) + '%)'}, 
		sort:   function(d) { return d.ChangePercent},
		cls:    function(d) { return d.ChangePercent > 0? 'center number positive': 'center number negative'}
	},
	{getter: 'High', cls: 'number'},
	{getter: 'Low', cls: 'number'},
	{getter: 'Open', cls: 'number'},
	{getter: 'ChangeYTD', title: 'Year', cls: 'number'},
	{getter: 'MarketCap', title: 'Market', cls: 'number muted'}
]


function random(from, to, comma) {
	//Numbers after the comma
	comma = comma || 2

	var delta = to - from

	//Damn.. this should work..
	//return from + ( Math.floor(Math.pow(10, comma) * delta * Math.random())) / Math.pow(10, comma)

	//Ugly way
	var raw = from + delta * Math.random(),
		parts = raw.toString().split('.')
	parts[1] = parts[1].slice(0, comma)
	return parseFloat(parts.join('.'), 10)

}
var n = 0
function buildSample(symbol) {
	symbol = symbol || 'SPL' + (n++)

	return {
		"Name": symbol + ' Company Inc.',
		"Symbol": symbol,
		"LastPrice": random(400, 600),
		"Change": random(-20, 20),
		"ChangePercent": random(-10, 10),
		"Timestamp": new Date().toString(),
		"MSDate": 41570.568969907,
		"MarketCap":476497591530,
		"Volume":397562,
		"ChangeYTD": random(400 , 600),
		"ChangePercentYTD": random(-5, 5),
		"High": random(400, 600),
		"Low": random(400, 600),
		"Open": random(400, 600),
	}
}

var tableData = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].map(function() {
	return buildSample()
})
