var React = require('react');
var d3Util = require('../util');
var d3 = require('d3');

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
							<input disabled type={this.props.goalType} className="form-control" value={d3Util.formatDate(this.props.tdate, this.props.goalType)}></input>
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
				var props = this.props;
				d3.json("/goal/" + this.props.goalType + "/" + d3Util.formatDate(this.props.tdate, this.props.goalType), function(error, json) {
						var goals = [];
						if (null != error) {
								console.log(error);
								return;
						}
						if (json.length > 0) {
							if (json.goals) {
								goals = json[0].goals;
							} else {
								goals = [json[0].goal1, json[0].goal2, json[0].goal3];
							}
						}
						this.setState({
								goals: goals,
						});
				}.bind(this));	   
		},
});

module.exports = GoalView;
