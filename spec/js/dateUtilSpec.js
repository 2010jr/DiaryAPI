describe("dateUtil", function() {
	var util = require('../../js/dateUtil');

	it("dayOfWeek method should return day of week", function() {
			expect(util.dayOfWeek(new Date(2016,0,2))).toEqual('6');
			expect(util.dayOfWeek(new Date(2016,0,3))).toEqual('0');
			expect(util.dayOfWeek(new Date(2016,0,4))).toEqual('1');
	});

	it("dayOfMonth method should return day of month", function() {
			expect(util.dayOfMonth(new Date(2016,0,30))).toEqual('30');
			expect(util.dayOfMonth(new Date(2016,0,31))).toEqual('31');
			expect(util.dayOfMonth(new Date(2016,0,32))).toEqual('01');
	});

	describe("monthOfYear", function() {
		it("monthOfYear method should return month of year", function() {
			expect(util.monthOfYear(new Date(2016,11,1))).toEqual('12');
			expect(util.monthOfYear(new Date(2016,12,1))).toEqual('01');
			expect(util.monthOfYear(new Date(2016,0,1))).toEqual('01');
		});
	});

	describe("weekOfMonth", function() {
		it("should return week of month", function() {
			expect(util.weekOfMonth(new Date(2016,0,2))).toEqual(1);
			expect(util.weekOfMonth(new Date(2016,0,3))).toEqual(2);
			expect(util.weekOfMonth(new Date(2016,0,4))).toEqual(2);
			expect(util.weekOfMonth(new Date(2016,0,31))).toEqual(6);
			expect(util.weekOfMonth(new Date(2016,0,32))).toEqual(1);
		});
	});

	describe("parse", function() {
		it("should return date object as proper format string and corresponding type[month, week, day]", function() {
			expect(util.parse("2016-01","month")).toEqual(new Date(2016,0,1));
			expect(util.parse("2016-02","month")).toEqual(new Date(2016,1,1));
			expect(util.parse("2016-W01","week")).toEqual(new Date(2016,0,3));
			expect(util.parse("2016-W02","week")).toEqual(new Date(2016,0,10));
			expect(util.parse("2016-01-01","day")).toEqual(new Date(2016,0,1));
			expect(util.parse("2016-01-02","day")).toEqual(new Date(2016,0,2));
		});

		it("should return null as invalid format string or invalid type[month, week, day]", function() {
			expect(util.parse("2016-W01","month")).toEqual(null);
			expect(util.parse("2016-01","week")).toEqual(null);
			expect(util.parse("2016-01","day")).toEqual(null);
			expect(util.parse("2016-01-01", "something")).toEqual(null);
			expect(util.parse("2o16-01-01", "")).toEqual(null);
			expect(util.parse("2o16-01-01", null)).toEqual(null);
		});
	});

	describe("format", function() {
		it("should return properly formated string as given type[month, week, day]", function() {
			expect(util.format(new Date(2016,0,1),"month")).toEqual("2016-01");
			expect(util.format(new Date(2016,1,1),"month")).toEqual("2016-02");
			expect(util.format(new Date(2016,0,3),"week")).toEqual("2016-W01");
			expect(util.format(new Date(2016,0,10),"week")).toEqual("2016-W02");
			expect(util.format(new Date(2016,0,1),"day")).toEqual("2016-01-01");
			expect(util.format(new Date(2016,0,2),"day")).toEqual("2016-01-02");
		});

		it("should throw error when arg date is null or not date object or invalid format type", function() {
			expect(function() {util.format(null,"month");}).toThrow();
			expect(function() {util.format(2016,"month");}).toThrow();
			expect(function() {util.format(new Date(2016,0,10),"something");}).toThrow();
			expect(function() {util.format(new Date(2016,0,10),"");}).toThrow();
			expect(function() {util.format(new Date(2016,0,10),null);}).toThrow();
		});
	});

	describe("nextMonthFirstDate", function() {
		it("should return first date of next month", function() {
				expect(util.nextMonthFirstDate(new Date(2016,0,2))).toEqual(new Date(2016,1,1));
		});
	});

	describe("thisMonthFirstDate", function() {
		it("should return first date of this month", function() {
				expect(util.thisMonthFirstDate(new Date(2016,0,2))).toEqual(new Date(2016,0,1));
		});
	});

	describe("offsetDate", function() {
		it("should return offsetted date", function() {
				expect(util.offsetDate(new Date(2016,0,1),"year",1)).toEqual(new Date(2017,0,1));
				expect(util.offsetDate(new Date(2016,0,1),"year",0)).toEqual(new Date(2016,0,1));
				expect(util.offsetDate(new Date(2016,0,1),"year",-1)).toEqual(new Date(2015,0,1));

				expect(util.offsetDate(new Date(2016,0,1),"month",1)).toEqual(new Date(2016,1,1));
				expect(util.offsetDate(new Date(2016,0,1),"month",0)).toEqual(new Date(2016,0,1));
				expect(util.offsetDate(new Date(2016,0,1),"month",-1)).toEqual(new Date(2015,11,1));
				expect(util.offsetDate(new Date(2016,0,30),"month",1)).toEqual(new Date(2016,1,30));
				expect(util.offsetDate(new Date(2016,2,31),"month",1)).toEqual(new Date(2016,3,31));

				expect(util.offsetDate(new Date(2016,0,1),"day",1)).toEqual(new Date(2016,0,2));
				expect(util.offsetDate(new Date(2016,0,1),"day",0)).toEqual(new Date(2016,0,1));
				expect(util.offsetDate(new Date(2016,0,1),"day",-1)).toEqual(new Date(2015,11,31));
		});
	});
});
