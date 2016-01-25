var React = require('react');
var ReactDOM = require('react-dom');
var d3 = require('d3');
var d3Util = require('../util');

var GoalUnit = React.createClass({
		propTypes: {
				higherGoal: React.PropTypes.object,				
				thisGoal: React.PropTypes.object.isRequired,
		},	

		showUpHigherGoal: function(higherGoal) {
			if(higherGoal) {
				return <div className="form-group">
						<label>{"Goal of " + higherGoal.type}</label>
						<input className="form-control" value={higherGoal.goal} disabled/>
					   </div>;
			}
		},
		
		render: function() {
				return <div className="goal-unit">
						{this.showUpHigherGoal(this.props.higherGoal)}
						<div className="form-group has-success">
						 <label className="control-label">{"Goal of " + this.props.thisGoal.type}</label>
						 <input type="text" className="form-control" defaultValue={this.props.thisGoal.goal} ref="goal" onChange={this.handleGoal}></input>
						</div>
					   </div>;
		},

		getGoalValue: function() {
			return this.refs.goal.value;
		},

		handleGoal: function(e) {
			this.setState({
					goal: e.target.value,
			});
		}
});	

module.exports = GoalUnit;
