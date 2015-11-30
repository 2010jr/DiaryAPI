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
						evaluates: [], 
						tdate: new Date()
				};
		},

		componentDidMount: function() {
				jQuery.get("goal" + "/" + this.props.user + "/" + "month" + "/" + d3Util.formatDate(this.state.tdate, "month"), {}, function(data) {
						if (Array.isArray(data) && data.length > 0) {
							this.setState({
								evaluates : [data[0].goal1, data[0].goal2, data[0].goal3]
							});
						}
				}.bind(this)
			);

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
					.post(JSON.strigify(data), function(error, json) {
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

		render: function() {
				this.state.evaluates.map(function(val,ind) {
								console.log("value in evaluates");
								console.log(val);
				});
				// Set variable to access in each map method.(Do not use this keyword in map method)
				return <div className="row">
							<div className="input-group">
								<span className="input-group-addon">Date</span>
								<input id="diary_form_tdate" className="form-control" name="date" type="date" value={d3Util.formatDate(this.state.tdate, "day") } />
							</div>
							<div className="row"></div>
							{this.state.evaluates.map(function(val,ind) {
								console.log("value in evaluates");
								console.log(val);
								return <div className="panel panel-default">
										<div className="panel-heading form-inline">
											<label className="panel-title">{val}</label>
									   		<select className="form-control" ref={"evaluate_" + ind}>
													{[1,2,3,4,5].map(function(num) {
															return <option value={num}>{num}</option>;
													})}
											</select>
										</div>
										<div className="panel-body">
									   		<textarea className="form-control" rows="3" type="text" ref={"comment_" + ind}/> 
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
