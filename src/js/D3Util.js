var d3 = require('d3');
var DateUtil = require('./DateUtil');

var d3Util = function() {
		var buildToolTipText = function(diary) {
						var rateTag = "<h6>Rate:" + diary.rate + "</h6>",
						goalCommentTag = diary.goalComments.map(function(val) {
								return "<tr><td>" + val.goal + "</td>" + 
										"<td>" + val.comment + "</td></tr>";
						}).join(''),
						freeCommentTag = diary.freeComments.map(function(val) {
								return "<tr><td>" + val.name + "</td>" + 
										"<td>" + val.comment + "</td></tr>";
						}).join('');
						header = "<tr><th>Goal</th><th>Comment</th></tr>";
						return rateTag + "<table class=table>" + header + goalCommentTag + freeCommentTag + "</table>";
		};

		return {
				buildCalendarSvg: function(selector, sDate, eDate, cellsize) {
						var width = cellsize * 10; 
						var height = cellsize * (10 + 1); //including month title
						var svg = d3.select(selector).selectAll("svg")
								.data(d3.timeMonths(sDate, eDate))
								.enter().append("svg")
									.attr("width", width)
									.attr("height", height)
									.attr("class", "RdYlGn date")
								.append("g");
						return svg;
				},
				
				buildDayGroup : function (frame, cellsize) {
						var dayGroup = frame.selectAll("g")
								.data(function(d) { return d3.timeDays(d, DateUtil.nextMonthFirstDate(d)); })
								.enter().append("g"),
							today = DateUtil.format(new Date(),"day");
						
						// Building rectangular for each date
						dayGroup.append("rect")
								.attr("width", cellsize)
								.attr("height", cellsize)
								.attr("x", function(d) {
										return cellsize + parseInt(DateUtil.dayOfWeek(d)) * cellsize; 
								})
								.attr("y", function(d) { 
										var weekDiff = DateUtil.weekOfMonth(d); 
										return weekDiff * cellsize + cellsize; 
								})
								.datum(function(d) { return DateUtil.format(d,"day")})
								.attr("class", function (d) { return "day " + (d >= today ? "off" : "past");})
							   

						// Append text for each date
						dayGroup.append("text")
								.attr("x", function(d) {
										return cellsize + parseInt(DateUtil.dayOfWeek(d)) * cellsize + cellsize * 0.3;
								})
								.attr("y", function(d) { 
										var weekDiff = DateUtil.weekOfMonth(d); 
										return weekDiff * cellsize + cellsize * 1.6; 
								})
								.attr("class", "day-title")
								.text( function(d) { return DateUtil.dayOfMonth(d) });
						
						return dayGroup;
				},

				buildWeekTitle : function(frame,cellsize) {
						// It is important to using unique selector not to pick up existing selector
						return frame.selectAll("week title text")
								.data(["Sun","Mon","Tue","Wed","Thu","Fri","Sat"])
							    .enter().append("text")
							    .attr("x", function(d,ind) { 
							    	   return cellsize + cellsize * (ind+0.2);
							  	 })
							    .attr("y", cellsize * 1.4  + cellsize / 2)
							    .text(function(d) { return d; });
				},

				buildWeekRect: function(frame, sDate, eDate, cellsize) {
						var firstWeekDate = DateUtil.sunday(sDate),
							finalWeekDate = DateUtil.offsetDate(eDate,"day",-1),
							thisWeek = DateUtil.format(new Date(), "week");

						frame.selectAll("week group g")
								.data(d3.timeWeeks(firstWeekDate, finalWeekDate))
								.enter().append("g")
								.append("rect")
									.datum(function(d) { return DateUtil.format(d, "week");})
									.attr("width", cellsize)
									.attr("height", cellsize)
									.attr("x", function(d) {
											return cellsize * 8 + cellsize / 2;
									})
									.attr("y", function(d,ind) {
											return (ind+1) * cellsize + cellsize;
									})
									.attr("class", function(d) { return "week " + (d >= thisWeek ? "off" : "past");});


				},

				buildMonthTitle: function(frame, cellsize) {
						var monthGroup = frame.append("g"),
							thisMonth = DateUtil.format(new Date(),"month");
						monthGroup.append("rect")
									.datum(function(d) { return DateUtil.format(d, "month");})
									.attr("width", cellsize * 8.5 )
									.attr("height", cellsize)
									.attr("x", cellsize ) 
									.attr("y", cellsize * 0.5)
									.attr("class", function(d) { return "month " + (d >= thisMonth ? "off" : "past");});

						monthGroup.append("text")
									.attr("width", cellsize * 8)
									.attr("height", cellsize)
									.attr("x", cellsize * 4) 
									.attr("y", cellsize * 1.1)
									.attr("class", "month-title")
									.text(function(d) { return DateUtil.format(d,"month");});
						return monthGroup;
				},

				coloringRectByDiaries: function(diaryJson, baseDate, goalType, changePageFunc) {
						var allRect = d3.selectAll("rect." + goalType),
							tooltip = d3.select("div.tooltip"),
							diaryMap = d3.nest()
										.key(function(d) { return d.date;})
										.object(diaryJson),
							coloring = d3.scaleQuantize().domain([1,5]).range(d3.range(9).map(function(d) { return "q" + d + "-9"; })),
							baseDateStr = DateUtil.format(baseDate, goalType);

						// Coloring by rate	
						allRect.filter(function(d) { return d in diaryMap; })
								.attr("class", function(d) { 
										return "off " + coloring(diaryMap[d][0].rate);
								});
						// Registering mouse event 
						allRect.on("mouseover", function(d) {
								var className = d3.select(this).attr("class");
								d3.select(this).attr("class", className.replace(/\boff\b/, "on"));

								if (diaryMap[d]) {
										tooltip.style("visibility", "visible");
										tooltip.transition()
												.duration(100)
												.style("opacity", .9);
										tooltip.html(buildToolTipText(diaryMap[d][0]))
												.style("left", (d3.event.pageX) + 30 + "px")
												.style("top", (d3.event.pageY) + "px");
								}
						});

						allRect.on("mouseout", function(d) {
								var className = d3.select(this).attr("class");
								d3.select(this).attr("class",className.replace(/\bon\b/, "off"));

								tooltip.transition()
										.duration(100)
										.style("opacity", 0);

								tooltip.empty();
						});

						allRect.on("click", function(d) {
								changePageFunc("Diary", goalType, DateUtil.parse(d,goalType));
						});

						return allRect;
				},

				registerEventsToRect : function(selectionRect) {
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
				},

		};
}();

module.exports = d3Util;

