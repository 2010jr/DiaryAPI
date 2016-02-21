var ajaxUtil = require("../../js/ajaxUtil");
describe("ajaxUtil spec", function() {
		describe("buildURL spec", function() {
				it("should return url according to given goalType and tdate", function() {
						expect(ajaxUtil.buildURL("goal", "month", new Date(2016,0,1))).toEqual("/goal/month/2016-01");
						expect(ajaxUtil.buildURL("goal", "day", new Date(2016,0,1))).toEqual("/goal/day/2016-01-01");
						expect(ajaxUtil.buildURL("goal", "day", new Date(2016,0,1), "type[$eq]=day")).toEqual("/goal/day/2016-01-01?type[$eq]=day");
				});

				it("should throw error when given resourceTypr or goalType are invalid", function() {
						expect(function() {ajaxUtil.buildURL("something", "month", new Date(2016,0,1));}).toThrow();
						expect(function() {ajaxUtil.buildURL(null, "month", new Date(2016,0,1));}).toThrow();
						expect(function() {ajaxUtil.buildURL("goal", "something", new Date(2016,0,1));}).toThrow();
						expect(function() {ajaxUtil.buildURL("goal", null, new Date(2016,0,1));}).toThrow();
				});
		});
});
