var React = require('react');
var d3Util = require('../util');
var d3 = require('d3');

var GoalView = React.createClass({
		propTypes: {
				url: React.PropTypes.string.isRequired,
				user: React.PropTypes.string.isRequired,
				goalTypes: React.PropTypes.arrayOf
		},
		
		getDefaultProps: function() {
				return {
						goalTypes: ["year", "month", "week", "day", "other"]
				}
		},

		getInitialState: function() {
				return {
						tdate: new Date(),
						goalType: "month"
				}
		},

		handleSubmit: function() {
			var data = { 
				user: this.props.user,
			    type: this.state.goalType,
				date: d3Util.date_format(this.state.tdate),
				goal1: React.findDOMNode(this.refs.goal1).value,
				goal2: React.findDOMNode(this.refs.goal2).value,
				goal3: React.findDOMNode(this.refs.goal3).value,
				otherComments: React.findDOMNode(this.refs.otherComments).value
			};
			d3.json(this.props.url)
				.header("Content-Type", "application/json")
				.post(JSON.stringify(data), function(error, json) {
						if (null != error) {
								console.log(error);
								return;
						}
						console.log(json);
						return;
				});
		},

		handleReset: function() {

		},

		render: function() {
				var goalTypes = this.props.goalTypes;
				var goalType = this.state.goalType;
				var dataSet = d3.json(this.props.url + "/" + this.props.user + "/" + goalType + "/" + d3Util.date_format(this.state.tdate), function(error, json) {
						if (null != error) {
								console.log(error);
								return;
						}
					   	return json;
				});	   
				console.log(dataSet);
				return <div className="row"> 
						<div className="form-inline">
						<div className="form-group">
							<label>Goal Type</label>
							<select className="form-control" value={goalType}>
							{goalTypes.map(function(val) {
										return <option value={val}>{val}</option>
								})
							};
							</select>
						</div>
					 </div>
					 <div className="form-group">
						<label>Goal1</label>
						<input type="text" className="form-control" ref="goal1"></input>
						<label>Goal2</label>
						<input type="text" className="form-control" ref="goal2"></input>
						<label>Goal3</label>
						<input type="text" className="form-control" ref="goal3"></input>
					 </div>
					 <div className="form-group">
					 	<label>Other comments</label>
					 	<textarea className="form-control" row="10" ref="otherComments"></textarea>
					 </div>
					 <div className="form-group">
					 	<button className="btn btn-primary" name="Submit" onClick={this.handleSubmit}>Submit</button>
						<button className="btn btn-default" name="Reset" onClick={this.handleReset}>Reset</button>
					 </div>
					</div>;
		}
});

module.exports = GoalView;


