var React = require('react');
var ReactPropTypes = React.PropTypes;
var jQuery = require('jquery');
var d3Util = require('../util');

var DiaryForm = React.createClass({
		propTypes: {
				url: React.PropTypes.string
		},

		getDefaultProps: function() {

		},

		getInitialState: function() {
				return {
					 	alerts : [],
						goals: [],
						evaluates: [], 
						comments: [],
						freeComments: [''],
						tdate: new Date()
				};
		},

		handleChangeForm: function(name,e) {
				var change = {};
				if (name && this.state[name]) {
						change[name] = this.state[name];
				}
				if (e.target.name) {
						change[name][e.target.name] = e.target.value;
				} else {
						change[name] = e.target.value;
				}
				this.setState(change);
		},

		hasElement : function(array) {
				if (Array.isArray(array) && array.length > 0) {
						return true;
				} else {
						return false;
				}
		},

		getGoalAndUpdate: function(goalType, tdate) {
				jQuery.get("goal" + "/" + goalType + "/" + d3Util.formatDate(tdate, goalType), {}, function(data) {
						if(this.hasElement(data)) {
							this.setState({
								goals : [data[0].goal1, data[0].goal2, data[0].goal3],
							});
						} else {
							this.setState({
								goals : []
							});
						}
				}.bind(this));
		},

		getDiaryAndUpdate: function(goalType, tdate) {
				jQuery.get("diary" + "/" + d3Util.formatDate(tdate, goalType), {}, function(data) {
						if (this.hasElement(data)) {
								this.setState({
										evaluates : data[0].evaluates ? data[0].evaluates : [],
										comments : data[0].comments ? data[0].comments : [],
										freeComments: data[0].freeComments ? data[0].freeComments : []
								});
						} else {
								this.setState({
										evaluates : [1,1,1],
										comments: ['','',''],
										freeComments: ['']
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
					date : d3Util.formatDate(this.state.tdate, "day"),
					evaluates : this.state.evaluates, 
					comments : this.state.comments, 
					freeComments : this.state.freeComments
			};	

			console.log(data);
			
			d3.json(this.props.url)
					.header("Content-Type", "application/json")
					.post(JSON.stringify(data), function(error, json) {
							if (null != error) {
									console.log(error);
									this.setState({
											alerts : ["Fail to submit"]
									});
									return;
							}
							console.log(json);
							
							this.setState({
									alerts : ["Succeed to submit"]
							});
							return;
					}.bind(this));	
		},

		handleReset : function() {

		},

		handleDateChange: function(event) {
			var tdate = d3Util.parseToDate(event.target.value, "day");
			this.setState({
					tdate: tdate,
					alerts: []
			});

			this.getGoalAndUpdate("month", tdate);
			this.getDiaryAndUpdate("day", tdate);
		},

		render: function() {
				// Set variable to access in each map method.(Do not use this keyword in map method)
				return <div> 
							{this.state.alerts.map(function(val) {
								return <div className="alert alert-success" role="alert">{val}</div>;
							 })
							}
							<div className="input-group">
								<span className="input-group-addon">Date</span>
								<input id="diary_form_tdate" className="form-control" name="date" type="date" value={d3Util.formatDate(this.state.tdate, "day")} onChange={this.handleDateChange} />
							</div>
							<div className="row"></div>
							{this.state.goals.map(function(val,ind) {
								return <div className="panel panel-default">
										<div className="panel-heading form-inline">
											<label className="panel-title">{val}</label>
									   		<select className="form-control" value={this.state.evaluates[ind]} name={ind} onChange={this.handleChangeForm.bind(this, "evaluates")}>
													{['',1,2,3,4,5].map(function(num) {
															return <option value={num}>{num}</option>;
													})}
											</select>
										</div>
										<div className="panel-body">
									   		<textarea className="form-control" rows="3" type="text" name={ind} value={this.state.comments[ind]} onChange={this.handleChangeForm.bind(this, "comments")}/>
										</div>
								 	  </div>
							 }.bind(this))
							}
							{this.state.freeComments.map(function(val,ind) {
								return <div className="panel panel-default">
										<div className="panel-heading form-inline">
											<label className="panel-title">Free Comments</label>
										</div>
										<div className="panel-body">
									   		<textarea className="form-control" rows="5" type="text" name={ind} value={val} onChange={this.handleChangeForm.bind(this, "freeComments")} />
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
