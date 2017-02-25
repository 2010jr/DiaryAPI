var assert = require('assert');
var chai = require('chai');
var ajaxUtil = require('../js/AjaxUtil');

describe("AjaxUtil", function() {
		describe("buildURL", function() {
				it("return url to search diary at specified month", function() {
						chai.expect(ajaxUtil.buildURL("diary","month",new Date(2017,0,1))).to.deep.equal(
												"/diary/month/2017-01");
				});

				it("return url to search every diaries", function() {
						chai.expect(ajaxUtil.buildURL("diary","month")).to.deep.equal("/diary/month");
				});

				it("return url to search goal with other query", function() {
						chai.expect(ajaxUtil.buildURL("diary","month", null, "type[$eq]=day&date[$gte]=2017-01-01")).to.deep.equal(
										"/diary/month?type[$eq]=day&date[$gte]=2017-01-01");
				});
		});
});
