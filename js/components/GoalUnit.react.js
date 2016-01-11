var React = require('react');
var ReactDOM = require('react-dom');
var d3 = require('d3');
var d3Util = require('../util');

var GoalUnit = React.createClass({
		propTypes: {
				goalType: React.PropTypes.string.isRequired,
				parentGoalId : React.PropTypes.string.isRequired,
				tdate: React.PropTypes.object,
		},	

		getDefaultProps: function() {
				return {
						goalType: "month",
						tdate : new Date(),
						parentGoalId: "test1",
				}
		},

		getInitialState: function() {
				return {
						goal: "",
						relatedGoals : [],
						isCollapseDown: false,
				}
		},
		
		render: function() {
				return <div>
						<div className="form-inline">
							<label className="label-control">{d3Util.formatDate(this.props.tdate, this.props.goalType)}</label>	
							<input className="form-control" value={this.state.goal} onChange={this.handleGoalInput}></input>
							<button type="button" className="btn btn-default" onClick={this.handleCollapse}> 
									<span className={this.state.isCollapseDown ? "glyphicon glyphicon-collapse-down" : "glyphicon glyphicon-collapse-up"}></span>
							</button>
						</div>
						<div>
							{this.showUpRelatedGoals(this.state.isCollapseDown, this.state.relatedGoals)}	
						</div>
						</div>;
		},

		componentDidMount: function() {
				this.fetchGoalAndUpdate(this.props.goalType, this.props.tdate, this.props.parentGoalId);
		},

		fetchGoalAndUpdate: function(goalType, tdate, parentGoalId) {
			var reqUrl = "/goal/" + goalType + "?parent=" + parentGoalId; 
			d3.json(reqUrl, function(error, json) {
				if(error) {
					console.log(error);
					return;
				}
				var goal = json.find(function(val) {
					if(d3Util.date_format(tdate) === val.date) {
						return val.goal;
					}
				});
				this.setState({
						goal: goal,
						relatedGoals: json,
				});	
			}.bind(this));
		},

		handleCollapse: function() {
			this.setState({
					isCollapseDown: !this.state.isCollapseDown,
			});
		},

		showUpRelatedGoals: function(isCollapseDown, relatedGoals) {
			if (isCollapseDown) {
					return relatedGoals.map(function(val, ind){
						 return <div className="form-inline" key={"relatedGoals_" + ind}>
								 <label className="label-control">{d3Util.formatDate(d3Util.parseToDate(val.date), val.type)}</label>	
								 <div className="form-control">{val.goal}</div>
							    </div>;
				    });
			}
		},

		handleGoalInput: function(e) {
			this.setState({
					goal : e.target.value,
			});
		},
});	

module.exports = GoalUnit;
