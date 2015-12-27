var d3 = require('d3');
var d3Util = function() {
		return {
				day : d3.time.format("%w"), // day of the week
				day_of_month : d3.time.format("%e"), // day of the month
				day_of_year : d3.time.format("%j"),
				week : d3.time.format("%U"), // week number of the year
				weekName: d3.time.format("%a"),
				month : d3.time.format("%m"), // month number
				year : d3.time.format("%Y"),
				date_format : d3.time.format("%Y-%m-%d"),
				month_format: d3.time.format("%Y-%m"),
				week_format: d3.time.format("%Y-%m-%U"),
				formatDate: function(date, formatType) { 
						switch (formatType) {
								case "year": 
										return d3Util.year(date);
								case "month":
										return d3Util.month_format(date);
								case "week":
										var year = d3Util.year(date),
											month = d3Util.month(date),
											weekAbs = d3Util.week(date);
										//上で求めたweekAbsは年単位での週の番号なので、月単位に変換する必要がある
										var week = parseInt(weekAbs) - parseInt(d3Util.week(new Date(year, month, 1)));
										return year + "-" + month + "-" + week;
								default:
										return d3Util.date_format(date);
						}
				},
				parseToDate : function(str, formatType) { 
						switch (formatType) {
								case "year": 
										return d3Util.year.parse(str);
								case "month":
										return d3Util.month_format.parse(str);
								default:
										return d3Util.date_format.parse(str);
						}
				},
				nextMonthFirstDate: function(date) { return new Date(d3Util.year(date), parseInt(d3Util.month(date)) - 1, 1)},
				thisMonthFirstDate: function(date) { return new Date(d3Util.year(date), parseInt(d3Util.month(date)) - 1 + 1, 1)},
				offsetByFormatType: function(date, formatType, offset) {
						var year = d3Util.year(date),
							month = parseInt(d3Util.month(date)) - 1,
							day = d3Util.day_of_month(date);

						switch (formatType)  {
								case "year" :
										return new Date(year + offset, month, day);
								case "month" : 
										return new Date(year, month + offset, day); 
								case "day" : 
										return new Date(year, month , day + offset);
								default :
										return date;
						}
				},

				getHigherGoalType : function(goalType) {
						var higherGoalTypes = ["year", "month", "week", "day"].filter(function(val, ind, array) {
								return goalType === array[ind + 1];
						});
						return higherGoalTypes.length > 0 ? higherGoalTypes[0] : null;
				},

				buildCalendarSvg: function(selector, sDate, eDate, cellsize) {
						var width = cellsize * 7; 
						var height = cellsize * (6 + 1); //including month title
						var svg = d3.select(selector).selectAll("svg")
								.data(d3.time.months(d3Util.date_format.parse(sDate), d3Util.date_format.parse(eDate)))
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
										var thisMonth = parseInt(d3Util.month(d));
										var nextMonth = thisMonth % 12 + 1; 
										var nextYear = (thisMonth + 1) > 12 ? parseInt(d3Util.year(d)) + 1 : parseInt(d3Util.year(d));
										return d3.time.days(d, new Date(nextYear, nextMonth -1, 1));
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
										return parseInt(d3Util.day(d)) * cellsize; 
								})
						.attr("y", function(d) { 
								var year = parseInt(d3Util.year(d)),
								month = parseInt(d3Util.month(d));
								var week_diff = parseInt(d3Util.week(d)) - parseInt(d3Util.week(new Date(year,month-1,1)));
								return cellsize + (week_diff*cellsize); 
						})
						.datum(d3Util.date_format);
						return rect;
				},
				
				buildDayText: function(dayGroup, cellsize) {
						var daytext = dayGroup 
								.append("text")
								.attr("x", function(d) {
										return parseInt(d3Util.day(d)) * cellsize + cellsize * 0.3;
								})
								.attr("y", function(d) { 
										var year = parseInt(d3Util.year(d)),
										month = parseInt(d3Util.month(d));
										var week_diff = parseInt(d3Util.week(d)) - parseInt(d3Util.week(new Date(year,month-1,1)));
										return cellsize + week_diff * cellsize + cellsize * 0.6; 
								})
								.attr("class", "day-title")
								.text( function(d) { return d3Util.day_of_month(d)});
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
								.text(function(d) { return d3Util.year(d) + "/" + d3Util.month(d)});
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
		}
}();

module.exports = d3Util;

