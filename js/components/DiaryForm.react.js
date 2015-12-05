var React = require('react');
var ReactPropTypes = React.PropTypes;
var jQuery = require('jquery');
var d3Util = require('../util');

var DiaryForm = React.createClass({
		propTypes: {
				url: React.PropTypes.string,
				user: React.PropTypes.string,
				id: React.PropTypes.string,
		},

		getDefaultProps: function() {

		},

		getInitialState: function() {
				return {
						id: 'dairy_form-1',
						goals: [],
						evaluates: [], 
						comments: [],
						tdate: new Date()
				};
		},

		hasElement : function(array) {
				if (Array.isArray(array) && array.length > 0) {
						return true;
				} else {
						return false;
				}
		},

		getGoalAndUpdate: function(goalType, tdate) {
				jQuery.get("goal" + "/" + this.props.user + "/" + goalType + "/" + d3Util.formatDate(tdate, goalType), {}, function(data) {
						if(this.hasElement(data)) {
							this.setState({
								goals : [data[0].goal1, data[0].goal2, data[0].goal3]
							});
						} else {
							this.setState({
								goals : []
							});
						}
				}.bind(this));
		},

		getDiaryAndUpdate: function(goalType, tdate) {
				jQuery.get("diary" + "/" + this.props.user + "/" + d3Util.formatDate(tdate, goalType), {}, function(data) {
						if (this.hasElement(data)) {
								this.setState({
										evaluates : data[0].evaluates,
										comments : data[0].comments
								});
						} else {
								this.setState({
										evaluates : [1, 1, 1],
										comments: ["", "", ""]
								});
						}
				}.bind(this));
		},

		componentDidMount: function() {
				this.getGoalAndUpdate("month", this.state.tdate);
				this.getDiaryAndUpdate("day", this.state.tdate);
		},

		handleSubmit : function() {
			var data = {
					user : this.props.user,
					date : d3Util.formatDate(this.state.tdate, "day"),
					evaluates : [0,1,2].map(function(val) { return React.findDOMNode(this.refs["evaluate_" + val]).value;}.bind(this)),
					comments : [0,1,2].map(function(val) { return React.findDOMNode(this.refs["comment_" + val]).value;}.bind(this)),
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

		handleReset : function() {

		},

		handleDateChange: function(event) {
			var tdate = d3Util.parseToDate(event.target.value, "day");
			this.setState({
					tdate: tdate
			});

			this.getGoalAndUpdate("month", tdate);
			this.getDiaryAndUpdate("day", tdate);
		},

		render: function() {
				// Set variable to access in each map method.(Do not use this keyword in map method)
				return <div> 
							<div className="input-group">
								<span className="input-group-addon">Date</span>
								<input id="diary_form_tdate" className="form-control" name="date" type="date" value={d3Util.formatDate(this.state.tdate, "day")} onChange={this.handleDateChange} />
							</div>
							<div className="row"></div>
							{this.state.goals.map(function(val,ind) {
								return <div className="panel panel-default">
										<div className="panel-heading form-inline">
											<label className="panel-title">{val}</label>
									   		<select className="form-control" ref={"evaluate_" + ind} value={this.state.evaluates[ind]}>
													{[1,2,3,4,5].map(function(num) {
															return <option value={num}>{num}</option>;
													})}
											</select>
										</div>
										<div className="panel-body">
									   		<textarea className="form-control" rows="3" type="text" ref={"comment_" + ind} value={this.state.comments[ind]} />
										</div>
								 	  </div>
							 }.bind(this))
							}
							<button className="btn btn-primary" onClick={this.handleSubmit}>Submit</button>
							<button className="btn btn-default" onClick={this.handleReset}>Cancel</button>	
					 </div>;
		}
});

module.exports = DiaryForm;
