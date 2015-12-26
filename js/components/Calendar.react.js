var React = require('react');
var ReactPropTypes = React.PropTypes;
var d3Util = require('../util');
var d3 = require('d3');

var Calendar = React.createClass({
		propTypes: {
				tdate : React.PropTypes.object,
				dataSet : React.PropTypes.array,
				activeIndex : React.PropTypes.number,
		},

		getDefaultProps: function() {
				return {
						tdate : new Date(),
						dataSet : [],
						activeIndex: 0,
				}
		},

		render : function() {
			return <div id="Calendar"></div>;
		},

		componentDidMount: function() {
			var sDate = d3Util.date_format(d3Util.nextMonthFirstDate(this.props.tdate)),
				eDate = d3Util.date_format(d3Util.thisMonthFirstDate(this.props.tdate));

			this.buildCalendar("#Calendar", sDate, eDate, 50);
			this.updateCalendar(this.props.dataSet, this.props.activeIndex);
		},

		buildCalendar : function(selector,sDate, eDate, cellsize) {
				var svg = d3Util.buildCalendarSvg(selector,sDate, eDate, cellsize);
				var weekTitle = d3Util.buildWeekTitle(svg, cellsize);
				var dayGroup = d3Util.buildDayGroup(svg);
				var rect = d3Util.buildRect(dayGroup, cellsize); 
				var daytext = d3Util.buildDayText(dayGroup, cellsize);
				var tooltip = d3Util.buildToolTip(selector, "tooltip");
		},

		updateCalendar : function(dataSet, activeIndex) {
			if( !dataSet || !Array.isArray(dataSet) || dataSet.length === 0) {
					return;
			}
			var today = d3Util.date_format(new Date()),
				that = this, 
			    data = d3.nest()
						 .key(function(d) { return d.date;})
						 .map(dataSet),
				rect = d3.selectAll("rect"),
				tooltip = d3.select("div.tooltip"),
				color = d3.scale.quantize()
						.domain([1, 5])
						.range(d3.range(9).map(function(d) { return "q" + d + "-9"; }));


			rect.filter(function(d) { return d in data;})
					.attr("class", function(d) { return "day-off " + color(data[d][0].evaluates[activeIndex]);})
					.select("title");

			rect.filter(function(d) { return (!( d in data) && d < today);})
					.attr("class", "day-past");

			rect.on("mouseover", function(d) {
					var className = d3.select(this).attr("class");
					d3.select(this).attr("class",className.replace("day-off", "day-on"));

					if (data[d]) {
							tooltip.style("visibility", "visible");
							tooltip.transition()
									.duration(100)
									.style("opacity", .9);
							tooltip.html(that.formatTooltipText(data[d][0], activeIndex))
									.style("left", (d3.event.pageX) + 30 + "px")
									.style("top", (d3.event.pageY) + "px");
					}
			});

			rect.on("mouseout", function(d) {
					var className = d3.select(this).attr("class");
					d3.select(this).attr("class",className.replace("day-on", "day-off"));

					tooltip.transition()
							.duration(100)
							.style("opacity", 0);

					$("div.tooltip").empty();
			});
		},

		formatTooltipText: function(data, ind) {
			return ("<p>" + data.date + "</p>" + 
				    "<p>Evaluate : " + data.evaluates[ind] + "</p>" + 
					"<p>Comment : " + data.comments[ind] + "</p>");
		},

		componentWillUnmount : function() {
			d3.select("#Calendar").selectAll("svg").selectAll("g").remove();
			d3.select("#Calendar").selectAll("svg").remove();
		},
});

module.exports = Calendar;
