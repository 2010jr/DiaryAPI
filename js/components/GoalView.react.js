var React = require('react');
var d3Util = require('../util');
var d3 = require('d3');

var GoalView = React.createClass({
		propTypes: {
				url: React.PropTypes.string.isRequired,
				goalTypes: React.PropTypes.arrayOf,
				goalTemplates: React.PropTypes.arrayOf
		},
		
		getDefaultProps: function() {
				return {
						goalTypes: ["year", "month", "week", "day", "other"],
						goalTemplates: ["goal1", "goal2", "goal3", "otherComments"]
				}
		},

		getInitialState: function() {
				return {
						tdate: new Date(),
						goalType: "month",
						alerts: []
				}
		},

		handleSubmit: function() {
			var data = { 
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
								this.setState({
										alerts: ["Fail to submit"]
								});
								return;
						}
						console.log(json);
						this.setState({
								alerts: ["Succeed to submit"]
						});
						return;
				}.bind(this));
		},

		handleReset: function() {

		},
		
		handleGoalTypeChange: function(event) {
			this.setState({
					goalType: event.target.value,
					alerts: []
			});
		},

		handleDateChange: function(event) {
			var tdate = d3Util.parseToDate(event.target.value, this.state.goalType);
			this.setState({
					tdate: tdate,
					alerts: []
			});
		},

		render: function() {
				return  <div> 
							{this.state.alerts.map(function(val) {
								return <div className="alert alert-success" role="alert">{val}</div>;
							 })
							}
						<div className="form-inline">
						<div className="form-group">
							<input type={this.state.goalType === "other" ? "day" : this.state.goalType} className="form-control" value={d3Util.formatDate(this.state.tdate, this.state.goalType)} onChange={this.handleDateChange}></input>
							<label>Habit Type</label>
							<select className="form-control" value={this.state.goalType} onChange={this.handleGoalTypeChange}>
							{this.props.goalTypes.map(function(val) {
										return <option value={val}>{val}</option>;
								})
							};
							</select>
						</div>
					 </div>
					 <div className="form-group">
						<label>Habit1</label>
						<input type="text" className="form-control" ref="goal1"></input>
						<label>Habit2</label>
						<input type="text" className="form-control" ref="goal2"></input>
						<label>Habit3</label>
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
				var props = this.props;
				d3.json(this.props.url + "/" + this.state.goalType + "/" + d3Util.formatDate(this.state.tdate, this.state.goalType), function(error, json) {
						var data = {};
						if (null != error) {
								console.log(error);
								return;
						}
						if (json.length > 0) {
							data = json[0];	
						}
						// Set Data to form value
						props.goalTemplates.forEach(function(prop) {
								if (data.hasOwnProperty(prop)) {
									   React.findDOMNode(refs[prop]).value = data[prop];
								} else {
									   React.findDOMNode(refs[prop]).value = ""; 
								}
						});
				});	   
		},

		componentDidUpdate: function() {
				this.componentDidMount();
		}
});

module.exports = GoalView;
