var React = require('react');
var ReactDOM = require('react-dom');
var d3Util = require('../util');
var d3 = require('d3');
var GoalView = require('./GoalView.react');

var GoalFormView = React.createClass({
		propTypes: {
				url: React.PropTypes.string.isRequired,
				goalTypes: React.PropTypes.array,
				goalTemplates: React.PropTypes.array
		},
		
		getDefaultProps: function() {
				return {
						goalTypes: ["year", "month", "week", "day"],
						goalTemplates: ["goal1", "goal2", "goal3"]
				}
		},

		getInitialState: function() {
				return {
						tdate: new Date(),
						goalType: "month",
						goals: [],
						alerts: []
				}
		},

		handleSubmit: function() {
			var data = { 
			    type: this.state.goalType,
				date: d3Util.formatDate(this.state.tdate, this.state.goalType),
				goals: this.state.goals,
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
			console.log("handleGoalTypeChange invoked");
			this.getGoalAndUpdate(event.target.value, this.state.tdate);
			this.setState({
					goalType: event.target.value,
					alerts: []
			});
		},

		handleDateChange: function(event) {
			console.log("handleDateChange invoked");
			var tdate = d3Util.parseToDate(event.target.value, this.state.goalType);
			this.getGoalAndUpdate(this.state.goalType, tdate);
			this.setState({
					tdate: tdate,
					alerts: []
			});
		},

		handleGoalChange: function(event, ind) {
			var goals = this.state.goals;
			goals[event.target.name] = event.target.value;
				
			this.setState({
					goals: goals,
			});
		},

		render: function() {
				return  <div> 
							<h3>Current Goal</h3>
							{this.state.alerts.map(function(val,ind) {
								return <div className="alert alert-success" role="alert" key={"alert" + ind} >{val}</div>;
							 })
							}
						<div className="form-inline">
						<div className="form-group">
							<input type={this.state.goalType} className="form-control" value={d3Util.formatDate(this.state.tdate, this.state.goalType)} onChange={this.handleDateChange}></input>
							<label>Goal Type</label>
							<select className="form-control" value={this.state.goalType} onChange={this.handleGoalTypeChange}>
							{this.props.goalTypes.map(function(val,ind) {
										return <option value={val} key={"goaloption" + ind}>{val}</option>;
								})
							}
							</select>
						</div>
					 </div>
					 <div className="form-group">
					 {this.state.goals.map(function(val,ind) {
						return <div key={"goal" + ind}>
							   	<label>{"Goal" + (ind + 1)}</label>
								<input type="text" className="form-control" value={val} name={ind} onChange={this.handleGoalChange}></input>
							   </div>;	
					  }.bind(this))
					 }
					 </div>
					 <div className="form-group">
					 	<button className="btn btn-primary" name="Submit" onClick={this.handleSubmit}>Submit</button>
						<button className="btn btn-default" name="Reset" onClick={this.handleReset}>Reset</button>
					 </div>
					 <div id="previous-goal">
					 </div>
					 <div id="higher-goal">
					 </div>
				   </div>;
		},

		getGoalAndUpdate: function(goalType, tdate) {
				d3.json("/goal/" + goalType + "/" + d3Util.formatDate(tdate, goalType), function(error, json) {
						var goals = ["","",""];
						if (null != error) {
								console.log(error);
								return;
						}
						if (json.length > 0) {
								if (json[0].goals) {
										goals = json[0].goals;
								} else {
										goals = [json[0].goal1, json[0].goal2, json[0].goal3];
								}
						}
						this.setState({
								goals : goals,
						});
				}.bind(this));	   
		},

		componentDidMount: function() {
				var previousDate = d3Util.offsetByFormatType(this.state.tdate, this.state.goalType, -1),
					higherGoalType = d3Util.getHigherGoalType(this.state.goalType);
				this.getGoalAndUpdate(this.state.goalType, this.state.tdate);

				ReactDOM.render(
						<GoalView tdate={previousDate} goalType={this.state.goalType} title={"Previous Goal"} />
						, document.getElementById("previous-goal"));

				ReactDOM.render(
						<GoalView tdate={this.state.tdate} goalType={higherGoalType} title={"Higher Goal"} />
						, document.getElementById("higher-goal"));
		},
});

module.exports = GoalFormView;
