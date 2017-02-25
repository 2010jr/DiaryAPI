var d3 = require('d3');
var Const = require('./Constants');

module.exports = function() {
		// Date Format variables
		var dayOfWeek = d3.timeFormat("%w"),
			dayOfMonth = d3.timeFormat("%d"), 
			weekOfYear = d3.timeFormat("%U"),
			monthOfYear = d3.timeFormat("%m"), //Note Janually is 1
			year = d3.timeFormat("%Y"), 
			weekOfMonth =  function(date) {
					var thisYear = parseInt(year(date)),
					thisMonth = parseInt(monthOfYear(date));
					return parseInt(weekOfYear(date)) - parseInt(weekOfYear(new Date(thisYear,thisMonth-1,1))) + 1;
			},
			FORMAT_TYPES = Const.GOAL_TYPES, 
			VIEW_FORMAT_TYPES = Const.GOAL_TYPES; 

		var FORMAT_FUNC_MAP = {
				"year" : year, 
				"month" : d3.timeFormat("%Y-%m"),
				"week" : d3.timeFormat("%Y-W%U"),
				"day" : d3.timeFormat("%Y-%m-%d"),
		};

		var PARSE_FUNC_MAP = {
				"year" : d3.timeParse("%Y"),
				"month" : d3.timeParse("%Y-%m"),
				"week" : d3.timeParse("%Y-W%U"),
				"day" : d3.timeParse("%Y-%m-%d"),
		}
		
		return {
				dayOfWeek: dayOfWeek,
				dayOfMonth: dayOfMonth,
				weekOfMonth: weekOfMonth,
				parse : function(date, formatType) {
					var formatObj = PARSE_FUNC_MAP[formatType];
					return formatObj ? formatObj(date) : null;
				},
				format : function(date, formatType) { 
					// It's hard to judge date object so judging by having getFullYear method or not	
					var formatObj = FORMAT_FUNC_MAP[formatType];
					return formatObj ? formatObj(date) : null;
				},
				nextMonthFirstDate: function(date) { return new Date(year(date), parseInt(monthOfYear(date)) - 1 + 1, 1);},
				thisMonthFirstDate: function(date) { return new Date(year(date), parseInt(monthOfYear(date)) - 1, 1);},
				sunday : function(date) {
						return new Date(year(date), parseInt(monthOfYear(date)) - 1, parseInt(dayOfMonth(date)) - dayOfWeek(date))
				},
				offsetDate: function(date, formatType, offset) {
						if (-1 === FORMAT_TYPES.indexOf(formatType)) {
								throw new Error("argument 'formatType' must be one of " + FORMAT_TYPES);
						}
						var yearNum = parseInt(year(date)),
							monthNum = parseInt(monthOfYear(date)) - 1,
							dayNum = parseInt(dayOfMonth(date));
						switch (formatType)  {
								case "year" :
										return new Date(yearNum + offset, monthNum, dayNum);
								case "quarter" :
										var offsetMonth = parseInt(offset) * 3;
										return new Date(yearNum, monthNum + offsetMonth, dayNum);
								case "month" : 
										return new Date(yearNum, monthNum + offset, dayNum); 
								case "week" : 
										return new Date(yearNum, monthNum, dayNum + offset * 7);
								case "day" : 
										return new Date(yearNum, monthNum , dayNum + offset);
								default :
										return null;
						}
				}
		};
}();
