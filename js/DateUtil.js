var d3 = require('d3');

module.exports = function() {
		// Date Format variables
		var dayOfWeek = d3.time.format("%w"),
			dayOfMonth = d3.time.format("%d"), 
			weekOfYear = d3.time.format("%U"),
			weekOfMonth =  function(date) {
					var thisYear = parseInt(yearFormat(date)),
					thisMonth = parseInt(monthOfYear(date));
					return parseInt(weekOfYear(date)) - parseInt(weekOfYear(new Date(thisYear,thisMonth-1,1))) + 1;
			},
			monthOfYear = d3.time.format("%m"), //Note Janually is 1
			yearFormat = d3.time.format("%Y"),
			dayFormat = d3.time.format("%Y-%m-%d"),
			monthFormat= d3.time.format("%Y-%m"),
			weekFormat= d3.time.format("%Y-W%U"),
			FORMAT_TYPES = ["year", "month", "week", "day"],
			VIEW_FORMAT_TYPES = ["year", "month", "week", "day"];

		var FORMAT_FUNC_MAP = {
				"year" : yearFormat,
				"month" : monthFormat,
				"week" : weekFormat,
				"day" : dayFormat
		},
		VIEW_FORMAT_FUNC_MAP = {
				"month" : monthFormat,
				"week" : function(date) { return monthFormat(date) + "-Week " + weekOfMonth(date);},
				"day" : dayFormat
		};

		return {
				dayOfWeek : dayOfWeek,
				dayOfMonth : dayOfMonth,
				monthOfYear: monthOfYear,
				fullYear: yearFormat,
				weekOfMonth: weekOfMonth,
				parse : function(date, formatType) {
					var formatObj = FORMAT_FUNC_MAP[formatType];
					return formatObj ? formatObj.parse(date) : null;
				},
				format : function(date, formatType) { 
					// It's hard to judge date object so judging by having getFullYear method or not	
					if (-1 === FORMAT_TYPES.indexOf(formatType)) {
							throw new Error("argument 'formatType' must be one of " + FORMAT_TYPES);
					}
					var formatObj = FORMAT_FUNC_MAP[formatType];
					return formatObj ? formatObj(date) : null;
				},
				viewFormat: function(date, formatType) {
					if (-1 === VIEW_FORMAT_TYPES.indexOf(formatType)) {
							throw new Error("argument 'formatType' must be one of " + VIEW_FORMAT_TYPES);
					}
					var formatObj = VIEW_FORMAT_FUNC_MAP[formatType];
					return formatObj ? formatObj(date) : null;
				},
				nextMonthFirstDate: function(date) { return new Date(yearFormat(date), parseInt(monthOfYear(date)) - 1 + 1, 1);},
				thisMonthFirstDate: function(date) { return new Date(yearFormat(date), parseInt(monthOfYear(date)) - 1, 1);},
				offsetDate: function(date, formatType, offset) {
						if (-1 === FORMAT_TYPES.indexOf(formatType)) {
								throw new Error("argument 'formatType' must be one of " + FORMAT_TYPES);
						}
						var yearNum = parseInt(yearFormat(date)),
							monthNum = parseInt(monthOfYear(date)) - 1,
							dayNum = parseInt(dayOfMonth(date));
						switch (formatType)  {
								case "year" :
										return new Date(yearNum + offset, monthNum, dayNum);
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
