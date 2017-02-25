var assert = require('assert');
var chai = require('chai');
var dateUtil = require('../js/DateUtil');

describe("DateUtil", function() {
	   describe("parse", function() {
			   it("return year first date when goal type is year", function() {
					   chai.expect(dateUtil.parse("2016","year")).to.deep.equal(new Date(2016,0,1));
			   });

			   it("return month first date when goal type is month", function() {
					  chai.expect(dateUtil.parse("2016-02","month")).to.deep.equal(new Date(2016,1,1));
			   });
			   
			   it("return week first date when goal type is month", function() {
					  chai.expect(dateUtil.parse("2016-W00","week")).to.deep.equal(new Date(2016,0,3));
			   });

			   it("return specified date when goal type is date", function() {
					  chai.expect(dateUtil.parse("2016-02-02","day")).to.deep.equal(new Date(2016,1,2));
			   });
	   });

	   describe("format", function() {
			   it("return year string when goal type is year", function() {
					   chai.expect(dateUtil.format(new Date(2016,0,1),"year")).to.deep.equal("2016");
			   });

			   it("return month string when goal type is month", function() {
					  chai.expect(dateUtil.format(new Date(2016,1,1),"month")).to.deep.equal("2016-02");
			   });

			   it("return week string when goal type is week", function() {
					  chai.expect(dateUtil.format(new Date(2016,1,1),"week")).to.deep.equal("2016-W05");
			   });

			   it("return date string when goal type is date", function() {
					  chai.expect(dateUtil.format(new Date(2016,1,2),"day")).to.deep.equal("2016-02-02");
			   });
	   });

	   describe("dayOfWeek", function() {
			   it("return 0 then given date is Sunday", function() {
					  chai.expect(dateUtil.dayOfWeek(new Date(2016,0,31))).to.deep.equal("0");
			   });
			   it("return 2 then given date is Thuesday", function() {
					  chai.expect(dateUtil.dayOfWeek(new Date(2016,1,2))).to.deep.equal("2");
			   });
			   it("return 6 then given date is Saturday", function() {
					  chai.expect(dateUtil.dayOfWeek(new Date(2016,1,6))).to.deep.equal("6");
			   });
	   }); 

	   describe("sunday", function() {
			   it("return Sunday when next Monday in current month is given", function() {
					   chai.expect(dateUtil.sunday(new Date(2016,1,8))).to.deep.equal(new Date(2016,1,7));
			   });

			   it("return Sunday when next Saturday in current month is given", function() {
					   chai.expect(dateUtil.sunday(new Date(2016,1,13))).to.deep.equal(new Date(2016,1,7));
			   });

			   it("return same day when Sunday is given", function() {
					   chai.expect(dateUtil.sunday(new Date(2016,1,7))).to.deep.equal(new Date(2016,1,7));
			   });

			   it("return Sunday even when next Monday in next month is given", function() {
					   chai.expect(dateUtil.sunday(new Date(2016,1,1))).to.deep.equal(new Date(2016,0,31));
			   });

			   it("return Sunday even when next weekway in next year is given", function() {
					   chai.expect(dateUtil.sunday(new Date(2016,0,1))).to.deep.equal(new Date(2015,11,27));
			   });
	   });

	   describe("offsetDate", function() {
			   it("return next year when formatType is year and offset is 1 ", function() {
					   chai.expect(dateUtil.offsetDate(new Date(2016,1,8), "year", 1)).to.deep.equal(new Date(2017,1,8));
			   });

			   it("return previous year when formatType is year and offset is -1 ", function() {
					   chai.expect(dateUtil.offsetDate(new Date(2016,1,8), "year", -1)).to.deep.equal(new Date(2015,1,8));
			   });

			   it("return same year when formatType is year and offset is 0 ", function() {
					   chai.expect(dateUtil.offsetDate(new Date(2016,1,8), "year", 0)).to.deep.equal(new Date(2016,1,8));
			   });

			   it("return next month when formatType is month and offset is 1 ", function() {
					   chai.expect(dateUtil.offsetDate(new Date(2016,1,8), "month", 1)).to.deep.equal(new Date(2016,2,8));
			   });

			   it("return next month when formatType is month and offset is 13 and over next year ", function() {
					   chai.expect(dateUtil.offsetDate(new Date(2016,1,8), "month", 13)).to.deep.equal(new Date(2017,2,8));
			   });

			   it("return previous month when formatType is month and offset is -1 ", function() {
					   chai.expect(dateUtil.offsetDate(new Date(2016,1,8), "month", -1)).to.deep.equal(new Date(2016,0,8));
			   });

			   it("return previous month when formatType is month and offset is -13 and over previous year", function() {
					   chai.expect(dateUtil.offsetDate(new Date(2016,1,8), "month", -13)).to.deep.equal(new Date(2015,0,8));
			   });

			   it("return same month when formatType is month and offset is 0 ", function() {
					   chai.expect(dateUtil.offsetDate(new Date(2016,1,8), "month", 0)).to.deep.equal(new Date(2016,1,8));
			   });

			   it("return next week when formatType is week and offset is 1 ", function() {
					   chai.expect(dateUtil.offsetDate(new Date(2016,1,8), "week", 1)).to.deep.equal(new Date(2016,1,15));
			   });

			   it("return next week when formatType is week and offset is 4 and over next month", function() {
					   chai.expect(dateUtil.offsetDate(new Date(2016,1,8), "week", 4)).to.deep.equal(new Date(2016,2,7));
			   });

			   it("return previous week when formatType is week and offset is -1 ", function() {
					   chai.expect(dateUtil.offsetDate(new Date(2016,1,8), "week", -1)).to.deep.equal(new Date(2016,1,1));
			   });

			   it("return previous week when formatType is week and offset is -4 and over previous year", function() {
					   chai.expect(dateUtil.offsetDate(new Date(2016,1,8), "week", -4)).to.deep.equal(new Date(2016,0,11));
			   });

			   it("return same week when formatType is week and offset is 0 ", function() {
					   chai.expect(dateUtil.offsetDate(new Date(2016,1,8), "week", 0)).to.deep.equal(new Date(2016,1,8));
			   });
	   });

 });


