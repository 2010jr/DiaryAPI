var d3 = require('d3');
var DateUtil = require('./DateUtil');

var d3Util = function() {
		return {
				buildCalendarSvg: function(selector, sDate, eDate, cellsize) {
						var width = cellsize * 7; 
						var height = cellsize * (6 + 1); //including month title
						var svg = d3.select(selector).selectAll("svg")
								.data(d3.time.months(DateUtil.parse(sDate,"day"), DateUtil.parse(eDate,"day")))
								.enter().append("svg")
								.attr("width", width)
								.attr("height", height)
								.attr("class", "RdYlGn")
								.append("g");
						return svg;
				},

				buildDayGroup: function (svg) {
						var dayGroup = svg.selectAll("g")
								.data(function(d) { 
										return d3.time.days(d, DateUtil.nextMonthFirstDate(d));
								})
						.enter().append("g");
						return dayGroup;
				},

				buildWeekTitle : function(svg,cellsize) {
						var weekTitle = svg.selectAll("text")
										   .data(["Sun","Mon","Tue","Wed","Thu","Fri","Sat"])
										   .enter()
										   .append("text")
										   .attr("x", function(d,ind) { 
										    	   return cellsize * ind;
										   })
										   .attr("y", cellsize / 2)
										   .text(function(d) {
										    	   return d; 
										   });
						return weekTitle;
				},
				
				buildRect: function(dayGroup, cellsize) {
						var rect = dayGroup 
								.append("rect")
								.attr("class", "day-off")
								.attr("width", cellsize)
								.attr("height", cellsize)
								.attr("x", function(d) {
										return parseInt(DateUtil.dayOfMonth(d)) * cellsize; 
								})
						.attr("y", function(d) { 
								var weekDiff = DateUtil.weekOfMonth(d); 
								return weekDiff * cellsize; 
						})
						.datum(DateUtil.dateFormat);
						return rect;
				},
				
				buildDayText: function(dayGroup, cellsize) {
						var daytext = dayGroup 
								.append("text")
								.attr("x", function(d) {
										return parseInt(DateUtil.dayOfMonth(d)) * cellsize + cellsize * 0.3;
								})
								.attr("y", function(d) { 
										var weekDiff = DateUtil.weekOfMonth(d); 
										return weekDiff * cellsize + cellsize * 0.6; 
								})
								.attr("class", "day-title")
								.text( function(d) { return DateUtil.dayOfMonth(d)});
						return daytext;
				},
				
				buildMonthTitle: function(svg, cellsize) {
						var month_titles = svg  // Jan, Feb, Mar and the whatnot
								.append("text")
								.attr("width",cellsize)
								.attr("height", cellsize)
								.attr("x", 0) 
								.attr("y", cellsize * 0.5)
								.attr("class", "month-title")
								.text(function(d) { return DateUtil.fullYear(d) + "/" + DateUtil.monthOfYear(d);});
						return month_titles;
				},

				buildToolTip: function(selector,tooltipType, id) {
						return d3.select(selector)
								.append("div")
								.attr("id", id)
								.attr("class", "tooltip")
								.style("position", "absolute")
								.style("z-index", "10")
								.style("visibility", "hidden")
								.text("a simple tooltip");
				}
		};
}();

module.exports = d3Util;

