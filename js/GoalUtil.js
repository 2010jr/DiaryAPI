var DateUtil = require("./DateUtil");

module.exports = function() {
		return {
				getHigherGoalType : function(goalType) {
						var higherGoalTypes = ["year", "month", "week", "day"].filter(function(val, ind, array) {
								return goalType === array[ind + 1];
						});
						return higherGoalTypes.length > 0 ? higherGoalTypes[0] : null;
				},

				getLowerGoalType : function(goalType) {
						return ["year", "month", "week", "day"].find(function(val, ind, array) {
								return goalType === array[ind - 1];
						});
				},

				assignGoalId : function(goalType, date, index) {
						return goalType + "_" + DateUtil.format(date, goalType) + "_" + index;
				}
		};
}();
