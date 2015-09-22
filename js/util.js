var d3 = require('d3');
var d3Util = function() {
		return {
				day : d3.time.format("%w"), // day of the week
				day_of_month : d3.time.format("%e"), // day of the month
				day_of_year : d3.time.format("%j"),
				week : d3.time.format("%U"), // week number of the year
				month : d3.time.format("%m"), // month number
				year : d3.time.format("%Y"),
				date_format : d3.time.format("%Y-%m-%d")
		}
}();

module.exports = d3Util;

