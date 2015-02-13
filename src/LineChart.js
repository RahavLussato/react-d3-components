let React = require('./ReactProvider');
let d3 = require('./D3Provider');

let Chart = require('./Chart');
let Axis = require('./Axis');
let Path = require('./Path');
let Tooltip = require('./Tooltip');

let DefaultPropsMixin = require('./DefaultPropsMixin');
let HeightWidthMixin = require('./HeightWidthMixin');
let ArrayifyMixin = require('./ArrayifyMixin');
let AccessorMixin = require('./AccessorMixin');
let DefaultScalesMixin = require('./DefaultScalesMixin');
let TooltipMixin = require('./TooltipMixin');

let DataSet = React.createClass({
	propTypes: {
		data: React.PropTypes.array.isRequired,
		line: React.PropTypes.func.isRequired,
		colorScale: React.PropTypes.func.isRequired
	},

	render() {
		let {data,
			 line,
			 strokeWidth,
			 colorScale,
			 values,
			 label,
			 onMouseEnter,
			 onMouseLeave} = this.props;

		let lines = data.map(stack => {
			return (
					<Path
				className="line"
				d={line(values(stack))}
				stroke={colorScale(label(stack))}
				data={data}
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
					/>
			);
		});

		return (
				<g>
				{lines}
			</g>
		);
	}
});

let LineChart = React.createClass({
	mixins: [DefaultPropsMixin,
			 HeightWidthMixin,
			 ArrayifyMixin,
			 AccessorMixin,
			 DefaultScalesMixin,
			 TooltipMixin],

	propTypes: {
		interpolate: React.PropTypes.string
	},

	getDefaultProps() {
		return {
			interpolate: 'linear',
			tooltipHtml: (d, position, xScale, yScale) => {
				return d3.round(yScale.invert(position[1]), 2);
			}
		};
	},

	render() {
		let {data,
			 height,
			 width,
			 innerHeight,
			 innerWidth,
			 margin,
			 xScale,
			 yScale,
			 colorScale,
			 interpolate,
			 strokeWidth,
			 stroke,
			 values,
			 label,
			 x,
			 y} = this.props;

		let line = d3.svg.line()
				.x(function(e) { return xScale(x(e)); })
				.y(function(e) { return yScale(y(e)); })
				.interpolate(interpolate);

		return (
				<div>
				<Chart height={height} width={width} margin={margin}>

				<DataSet
			data={data}
			line={line}
			strokeWidth={strokeWidth}
			colorScale={colorScale}
			values={values}
			label={label}
			onMouseEnter={this.onMouseEnter}
			onMouseLeave={this.onMouseLeave}
				/>

				<Axis
			className={"x axis"}
			orientation={"bottom"}
			scale={xScale}
			height={innerHeight}
				/>

				<Axis
			className={"y axis"}
			orientation={"left"}
			scale={yScale}
			width={innerWidth}
				/>
				</Chart>

				<Tooltip
			hidden={this.state.tooltip.hidden}
			top={this.state.tooltip.top}
			left={this.state.tooltip.left}
			html={this.state.tooltip.html}/>
				</div>
		);
	}
});

module.exports = LineChart;