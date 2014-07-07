/**
  * @jsx React.DOM
  */

module.exports = React.createClass({
	render: function() {
		var d = this.props.data,
			yearColor = d.ChangePercentYTD > 0 ? 'positive': d.ChangePercentYTD < 0 ? 'negative': ''

		return (<div className='body'>
			<table>
				<tr><td>Price</td><td className='number'>{d.LastPrice}</td></tr>
				<tr><td>&rarr;Open</td><td className='number'>{d.Open.toFixed(2)}</td></tr>
				<tr><td>&darr;Low</td><td className='number'>{d.Low.toFixed(2)}</td></tr>
				<tr><td>&uarr;High</td><td className='number'>{d.High.toFixed(2)}</td></tr>
				<tr><td>Volume</td><td className='number'>{d.Volume}</td></tr>
				<tr><td>Market</td><td className='number'>{d.MarketCap}</td></tr>
				<tr><td>Year</td><td className='number'>
					{d.ChangeYTD}
					<span className={yearColor}> {d.ChangePercentYTD.toFixed(2)}%</span>
					</td></tr>
			</table>
			<p>{new Date(d.Timestamp).toLocaleString()}</p>

			<div>{d.Name}</div>
		</div>)
	}
})