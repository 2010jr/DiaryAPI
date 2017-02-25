var d3 = require("d3");
var DateUtil = require("./DateUtil");
var Const = require("./Constants");

module.exports = function() {
		var RESOURCE_TYPES = ["diary","goal"],
			GOAL_TYPES = Const.GOAL_TYPES;

		var funcGetBase = function (url, callback) {
				d3.json(url, function(error, json) {
						callback(error, json);
				});
		},
		funcPostBase = function (url, data, callback){
				d3.json(url)
						.header("Content-Type", "application/json")
						.post(JSON.stringify(data), function(error, json) {
								callback(error, json);
						});
		},	

		buildURL = function(resourceType, goalType, tdate, otherQuery) {
				if (-1 === RESOURCE_TYPES.indexOf(resourceType)) {
						throw new Error("argument 'resourceType' must be one of " + RESOURCE_TYPES);
				}
				if (-1 === GOAL_TYPES.indexOf(goalType)) {
						throw new Error("argument 'goalType' must be one of " + GOAL_TYPES);
				}
				var url = "/" + resourceType + "/" + goalType;
			    if(tdate) {
					url	+= "/" + DateUtil.format(tdate,goalType);
				}
				if(otherQuery) {
						url += "?" + otherQuery;
				}
				return url;
		};

		return {
				buildURL: buildURL,
				get : funcGetBase, 
				post : funcPostBase,
				getGoals : function(goalType, tdate, otherQuery, callback) {
						funcGetBase(buildURL("goal", goalType, tdate, otherQuery), callback);		
				},
				postGoal : function(data, callback) {
						funcPostBase("/goal", data, callback);
				},
				getDiaries : function(goalType, tdate, otherQuery, callback) {
						funcGetBase(buildURL("diary", goalType, tdate, otherQuery), callback);		
				},
				postDiary : function(data, callback) {
						funcPostBase("/diary", data, callback);		
				}
		};
}();
