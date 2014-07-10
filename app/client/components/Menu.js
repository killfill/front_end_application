/**
  * @jsx React.DOM
  */


module.exports = React.createClass({
	getDefaultProps: function() {
		return {
			selected: '/',
			links: [
				{href: '/', title: 'Dashboard'},
				{href: '/table', title: 'Table'},
				{href: '/graph', title: 'Graph'},
				{href: '/about', title: '@'},
			]
		}
	},

	render: function() {
		
		var lis = this.props.links.map(function(d) {
			var cls = d.href === this.props.selected? 'selected': ''
			return <li className={cls}><a href={d.href}>{d.title}</a></li>
		}.bind(this))

		return <ul className='horizontal'>{lis}</ul>
	}
})