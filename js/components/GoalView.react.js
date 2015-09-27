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
				date: d3Util.formatDate(this.state.tdate, this.state.goalType),
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
		
		handleGoalTypeChange: function(event) {
			this.setState({
					goalType: event.target.value
			});
		},

		render: function() {
				return <div className="row"> 
						<div className="form-inline">
						<div className="form-group">
							<label>Date</label>
							<input type={this.state.goalType === "other" ? "day" : this.state.goalType} className="form-control" value={d3Util.formatDate(this.state.tdate, this.state.goalType)}></input>
							<label>Goal Type</label>
							<select className="form-control" value={this.state.goalType} onChange={this.handleGoalTypeChange}>
							{this.props.goalTypes.map(function(val) {
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
		},

		componentDidMount: function() {
				var refs = this.refs;
				d3.json(this.props.url + "/" + this.props.user + "/" + this.state.goalType + "/" + d3Util.formatDate(this.state.tdate, this.state.goalType), function(error, json) {
						if (null != error) {
								console.log(error);
								return;
						}
						console.log(json);
						// Set Data to form value
						["goal1", "goal2", "goal3", "otherComments"].forEach(function(prop) {
								React.findDOMNode(refs[prop]).value = null != json[0][prop] ? json[0][prop] : "";
						});
				});	   
		},
});

module.exports = GoalView;
