/**
  * @jsx React.DOM
  */

var Sidebar = require('./components/Sidebar'),
	Boxes = require('./components/Boxes'),
	TableManager = require('./components/TableManager'),
	Connected = require('./components/Connected'),
	Menu = require('./components/Menu'),
	BigGraph = require('./components/BigGraph')

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
	React.renderComponent(<TableManager/>, container)
})

page('/graph', function() {
	React.renderComponent(<Menu selected='/graph' />, menu)
	React.renderComponent(<BigGraph/>, container)
})

page('/about', function() {
	React.renderComponent(<Menu selected='/about' />, menu)
	React.renderComponent(<h1 className="center"><p><a href="https://twitter.com/killfil">@killfill</a></p><img src="unicorn.png"/></h1>, container)
})

page('*', function() {
	console.log('Nooooo')
})

page()

