var DateUtil = require("./DateUtil");
var Const = require("./Constants");

module.exports = function() {
		return {
				getHigherGoalType : function(goalType) {
						var higherGoalTypes = Const.GOAL_TYPES.filter(function(val, ind, array) {
								return goalType === array[ind + 1];
						});
						return higherGoalTypes.length > 0 ? higherGoalTypes[0] : null;
				},

				getLowerGoalType : function(goalType) {
						return Const.GOAL_TYPES.find(function(val, ind, array) {
								return goalType === array[ind - 1];
						});
				},

				assignGoalId : function(goalType, date, index) {
						return goalType + "_" + DateUtil.format(date, goalType) + "_" + index;
				}
		};
}();
