var React = require('react');
var DateUtil = require("../DateUtil");
var AjaxUtil = require("../AjaxUtil");

var GoalView = React.createClass({
		propTypes: {
				tdate : React.PropTypes.object.isRequired,
				goalType : React.PropTypes.string.isRequired,
				title : React.PropTypes.string.isRequired
		},

		getInitialState: function() {
				return {
						goals: [],
				}
		},
		
		render: function() {
			return <div>
					<div className="form-inline">
						<h3> {this.props.title} </h3>
						<div className="form-group">
							<input disabled type={this.props.goalType} className="form-control" value={DateUtil.format(this.props.tdate, this.props.goalType)}></input>
							<label>Goal Type</label>
							<div disabled className="form-control">
						   		{this.props.goalType}
							</div>
						</div>
					</div>
					 <div className="form-group">
					 {this.state.goals.map(function(val,ind) {
						return <div>
							   	<label>{"Goal" + (ind + 1)}</label>
								<input disabled type="text" className="form-control" value={val}></input>
							   </div>;	
					  })
					 }
					 </div>
				   </div>;
		},

		componentDidMount: function() {
				var refs = this.refs;
				AjaxUtil.getGoals(this.props.goalType, this.props.tdate, function(error, json) {
						var goals = [];
						if (null != error) {
								console.log(error);
								return;
						}
						if (json.length > 0) {
								goals = json[0].goals;
						}
						this.setState({
								goals: goals,
						});
				}.bind(this));	   
		},
});

module.exports = GoalView;
