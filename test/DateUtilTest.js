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
					  chai.expect(dateUtil.parse("2016-W01","week")).to.deep.equal(new Date(2016,0,3));
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

 });


