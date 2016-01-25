var React = require('react');
var ReactDOM = require('react-dom');
var d3Util = require('../util');
var d3 = require('d3');
var GoalView = require('./GoalView.react');
var GoalUnit = require('./GoalUnit.react');

var GoalForm = React.createClass({
		propTypes: {
				goalType: React.PropTypes.string.isRequired,
				tdate: React.PropTypes.object,
		},

		getDefaultProps: function() {
				return {
						tdate: new Date(),
				}
		},

		getDefaultGoalList : function() {
				return [1,2,3].map(function(val){
						return { _id: d3Util.assignGoalId(this.props.goalType, this.props.tdate, val),
								type: this.props.goalType,
								date: d3Util.formatDate(this.props.tdate, this.props.goalType),
								goal: "",
						};
				}.bind(this));
		},

		getInitialState: function() {
				return {
						goalList : [],
				}
		},

		handleSubmit: function() {
			var dataSet = this.pickUpGoals().map(function(val) {
					delete val.parent;
					return val;
			});

			d3.json("/goal")
				.header("Content-Type", "application/json")
				.post(JSON.stringify(dataSet), function(error, json) {
						if (null != error) {
								console.log(error);
								return;
						}
						return;
				}.bind(this));
		},

		handleReset: function() {
			this.setState({
					goalList : this.getDefaultGoalList(), 
			});
			this.getGoalAndUpdate(this.props.goalType, this.props.tdate);
		},

		render: function() {
				console.log("render invoked");
				return  <div> 
					 {this.state.goalList.map(function(val, index) {
					 	return <GoalUnit ref={"goal" + index} higherGoal={val.parent} thisGoal={val} key={index}/>;
					   })
					 }
					 <div className="form-group">
					 	<button className="btn btn-primary" name="Submit" onClick={this.handleSubmit}>Submit</button>
						<button className="btn btn-default" name="Reset" onClick={this.handleReset}>Reset</button>
					 </div>
				   </div>;
		},

		componentDidMount: function() {
				console.log("componentDidMount invoked");
				this.getGoalAndUpdate(this.props.goalType, this.props.tdate);
		},

		getGoalAndUpdate: function(goalType, tdate) {
				d3.json("/goal/" + goalType + "/" + d3Util.formatDate(tdate, goalType), function(error, json) {
						if (null != error) {
								console.log(error);
								return;
						}
						var goalList = this.getDefaultGoalList(); 
						if (json.length > 0) {
								goalList = json;
						}
						var higherGoalType = d3Util.getHigherGoalType(goalType);
						if (higherGoalType) {
								d3.json("/goal/" + higherGoalType + "/" + d3Util.formatDate(tdate, higherGoalType), function(higherError, higherJson) {
										if (null != error) {
												console.log(error);
												return;
										}
										goalList = goalList.map(function(val,ind) {
												if (val.parentId) {
														var parentList = higherJson.filter(function(hVal) {
																return val.parentId === hVal._id;
														});
														if (parentList.length > 0) {
																val.parent = parentList[0];
																val.parentId = parentList[0]._id;
														}	
												} else {
													if(higherJson && higherJson[ind]) {
															val.parent = higherJson[ind];
															val.parentId = higherJson[ind]._id;
													}
												};
												return val;	
										});
										this.setState({
												goalList : goalList
										});
								}.bind(this));
						} else {
								if (json.length > 0) {
										this.setState({
												goalList : json,
										});
								}
						}
				}.bind(this));	   
		},

		pickUpGoals: function() {
			return this.state.goalList.map(function(val,index) {
					var goalUnit = this.refs["goal" + index];
					val.goal = goalUnit.getGoalValue();
					return val;
				}.bind(this));
		},
});

module.exports = GoalForm;
