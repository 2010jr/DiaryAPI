var React = require('react');
var ReactPropTypes = React.PropTypes;
var D3Util = require('../D3Util');
var d3 = require('d3');

var Calendar = React.createClass({
		propTypes: {
				tdate : React.PropTypes.object,
				dataSet : React.PropTypes.array,
		},

		getDefaultProps: function() {
				return {
						tdate : new Date(),
						dataSet : [],
				}
		},

		render : function() {
			return <div>
					<p>{D3Util.month_format(this.props.tdate)}</p>
					<div id="Calendar"></div>
				   </div>;
		},

		componentDidMount: function() {
			var sDate = D3Util.date_format(D3Util.nextMonthFirstDate(this.props.tdate)),
				eDate = D3Util.date_format(D3Util.thisMonthFirstDate(this.props.tdate));

			this.buildCalendar("#Calendar", sDate, eDate, 50);
			this.updateCalendar(this.props.dataSet);
		},

		buildCalendar : function(selector,sDate, eDate, cellsize) {
				var svg = D3Util.buildCalendarSvg(selector,sDate, eDate, cellsize);
				var weekTitle = D3Util.buildWeekTitle(svg, cellsize);
				var dayGroup = D3Util.buildDayGroup(svg);
				var rect = D3Util.buildRect(dayGroup, cellsize); 
				var daytext = D3Util.buildDayText(dayGroup, cellsize);
				var tooltip = D3Util.buildToolTip(selector, "tooltip");
		},

		updateCalendar : function(dataSet) {
			if( !dataSet || !Array.isArray(dataSet) || dataSet.length === 0) {
					return;
			}
			var today = D3Util.date_format(new Date()),
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
					.attr("class", function(d) { return "day-off " + color(data[d][0].rate);})
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
							tooltip.html(that.formatTooltipText(data[d][0]))
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
			rect.on("click", function(d) {
					//TODO
					//Write to update container code 
					console.log("Click is invoked");
					console.log(d);
			});
		},

		formatTooltipText: function(data) {
		    var rateTag = "<h6>Rate:" + data.rate + "</h6>",
				goalCommentTag = data.goalComments.map(function(val) {
					return "<tr><td>" + val.goal + "</td>" + 
							"<td>" + val.comment + "</td></tr>";
				}).join(''),
				freeCommentTag = data.freeComments.map(function(val) {
					return "<tr><td>" + val.name + "</td>" + 
							"<td>" + val.comment + "</td></tr>";
				}).join('');
				header = "<tr><th>Goal</th><th>Comment</th></tr>";
			return rateTag + "<table class=table>" + header + goalCommentTag + freeCommentTag + "</table>";
		},

		componentWillUnmount : function() {
			d3.select("#Calendar").selectAll("svg").selectAll("g").remove();
			d3.select("#Calendar").selectAll("svg").remove();
		},
});

module.exports = Calendar;
