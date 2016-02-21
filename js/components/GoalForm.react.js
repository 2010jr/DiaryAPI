var React = require('react');
var ReactDOM = require('react-dom');
var GoalUtil = require('../GoalUtil');
var DateUtil = require('../DateUtil');
var AjaxUtil = require('../AjaxUtil');
var GoalUnit = require('./GoalUnit.react');
var Modal = require('./Modal.react');

var GoalForm = React.createClass({
		propTypes: {
				goalType: React.PropTypes.string.isRequired,
				tdate: React.PropTypes.object,
				changePage: React.PropTypes.func.isRequired,
		},

		getDefaultProps: function() {
				return {
						tdate: new Date()
				}
		},

		getDefaultGoalList : function() {
				return [1,2,3].map(function(val){
						return { _id: GoalUtil.assignGoalId(this.props.goalType, this.props.tdate, val),
								type: this.props.goalType,
								date: DateUtil.format(this.props.tdate, this.props.goalType),
								goal: ""
						};
				}.bind(this));
		},

		getInitialState: function() {
				return {
						goalList : []
				};
		},

		createMsgAfterSubmitProp : function() {
				var _this = this;
				return {
						message : "目標設定が完了しました",
						linksToAct: [
						{
								name : "日記を書きますか？",
								func : function() { 
										_this.props.changePage("Diary", _this.props.goalType, _this.props.tdate);
								}
						}
						]
				};
		},

		handleSubmit: function() {
			var dataSet = this.pickUpGoals().map(function(val) {
					delete val.parent;
					return val;
			});

			AjaxUtil.postGoal(dataSet, function(error, json) {
					if (error) {
							console.log(error);
					} else {
							this.setState({
									msgProps : this.createMsgAfterSubmitProp()
							});
					}
			}.bind(this));
		},

		buildGoalForm : function() {
				return <div> 
				{this.state.goalList.map(function(val, index) {
																	  return <GoalUnit ref={"goal" + index} higherGoal={val.parent} thisGoal={val} key={index}/>;
															  })
				}
				<div className="form-group">
						<button className="btn btn-success" name="Submit" onClick={this.handleSubmit}>Submit</button>
						</div>
						</div>;
		},

		buildMsg: function() {
				if(this.state.msgProps) {
						return <Modal {...this.state.msgProps} />;
				}
		},

		render: function() {
				return <div>
				{this.buildGoalForm()}
				{this.buildMsg()}
				</div>;
		},

		componentDidMount: function() {
				this.getGoalAndUpdate(this.props.goalType, this.props.tdate);
		},

		getGoalAndUpdate: function(goalType, tdate) {
				AjaxUtil.getGoals(goalType, tdate, null, function(error, json) {
						if (null != error) {
								return;
						}
						var goalList = json.length === 0 ? this.getDefaultGoalList() : json,
							higherGoalType = GoalUtil.getHigherGoalType(goalType);
						if (higherGoalType) {
								AjaxUtil.getGoals(higherGoalType, tdate, null, function(hError, hJson) {
										if (null != hError) {
												console.log(error);
												return;
										}
										goalList = goalList.map(function(val,ind) {
												if (val.parentId) {
														var parentList = hJson.filter(function(hVal) {
																return val.parentId === hVal._id;
														});
														if (parentList.length > 0) {
																val.parent = parentList[0];
																val.parentId = parentList[0]._id;
														}	
												} else {
													if(hJson && hJson[ind]) {
															val.parent = hJson[ind];
															val.parentId = hJson[ind]._id;
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
		}
});

module.exports = GoalForm;
