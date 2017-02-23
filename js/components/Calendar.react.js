var React = require('react');
var ReactPropTypes = React.PropTypes;
var D3Util = require('../D3Util');
var DateUtil= require('../DateUtil');
var d3 = require('d3');

var Calendar = React.createClass({
		propTypes: {
				tdate : React.PropTypes.object,
				dataSet : React.PropTypes.array,
				changePage : React.PropTypes.func
		},

		getDefaultProps: function() {
				return {
						tdate : new Date(),
						dataSet : [],
				}
		},

		render : function() {
			return <div>
					<div id="Calendar"></div>
				   </div>;
		},

		componentDidMount: function() {
			var sDate = DateUtil.format(DateUtil.thisMonthFirstDate(this.props.tdate),"day");
				eDate = DateUtil.format(DateUtil.nextMonthFirstDate(this.props.tdate),"day");

			this.buildCalendar("#Calendar", sDate, eDate, 50);
			this.updateCalendar(this.props.dataSet);
		},

		buildCalendar : function(selector,sDate, eDate, cellsize) {
				var svg = D3Util.buildCalendarSvg(selector,sDate, eDate, cellsize);
				var weekTitle = D3Util.buildWeekTitle(svg, cellsize);
				var dayGroup = D3Util.buildDayGroup(svg);
				var rectOnFunc = {
						"click": function (d) {
							console.log("mouse on click data : " + d);
						}
				};
				var rect = D3Util.buildRect(dayGroup, cellsize, rectOnFunc); 
				var daytext = D3Util.buildDayText(dayGroup, cellsize);
				var tooltip = D3Util.buildToolTip(selector, "tooltip");
		},

		updateCalendar : function(dataSet) {
			if( !dataSet || !Array.isArray(dataSet) || dataSet.length === 0) {
					return;
			}
			var today = DateUtil.format(new Date(),"day"),
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
					that.props.changePage("Diary", "day", DateUtil.parse(d,"day"));
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
