var React = require('react');
var ReactPropTypes = React.PropTypes;
var d3Util = require('../util');
var d3 = require('d3');
var DiaryForm = require('./DiaryForm.react');

var CalendarView = React.createClass({
		propTypes: { 
				url: React.PropTypes.string.isRequired,
				user: React.PropTypes.string.isRequired,
				rootSelector: React.PropTypes.string.isRequired
		},

		getDefaultProps: function() {
				return {
						rootSelector: "CalendarView" 
				}
		},

		getInitialState: function() {
				return {
						tdate: new Date(),
						valtype: "",
						cellsize: 50,
						goals: ["Goal1", "Goal2", "Goal3"],
						activeGoal : "Goal1",
				};
		},

		handleDateChange: function(event) {
				this.setState({
						tdate: d3Util.month_format.parse(event.target.value)
				});
		},

		handleRemove: function(event) {
				console.log("test");
		},

		handleRemoveAll: function(event) {
				console.log("test");
		},

		handleChangeGoal: function(ind) {
				this.setState({
						activeGoal: this.state.goals[ind]
				});
		},

		render: function() {
				return <div>
						<div className="form-tabs">
						<div className="form-group">
						<input className="form-control" type="month" value={d3Util.month_format(this.state.tdate)} onChange={this.handleDateChange}></input>
						<ul className="nav nav-pills nav-stacked">
						{this.state.goals.map(function(val, ind) {
																		 if (this.state.activeGoal === val) {
																				 return <li role="presentation" className="active" ><a ref="#" onClick={this.handleChangeGoal.bind(null, ind)}>{"Goal" + (ind+1) + ":"+ val}</a></li>;
																		 } else {
																				 return <li role="presentation"><a ref="#" onClick={this.handleChangeGoal.bind(null, ind)}>{"Goal" + (ind+1) + ":" + val}</a></li>;
																		 }
																 }.bind(this))
						}
				</ul>
						</div>
						</div>
						<div id={this.props.rootSelector}></div>
						</div>;
		},

		componentWillMount: function() {
				d3.json("goal" + "/" + this.props.user + "/" + "month" + "/" + d3Util.formatDate(this.state.tdate, "month"),function(error, json) {
						if (null != error) {
								console.log(error);
								return;
						}
						if (json.length > 0) {
								this.setState({
										goals: [json[0].goal1, json[0].goal2, json[0].goal3],
										activeGoal : json[0].goal1
								});
						}
				}.bind(this));

		},

		componentDidMount: function() {
				var thisProps = this.props;
				var thisState = this.state;

				var color = d3.scale.quantize()
						.domain([1, 5])
						.range(d3.range(9).map(function(d) { return "q" + d + "-9"; }));

				var formatText = function(data) {
						return "<p>" + data.date + "</p>" + "<p>Evaluate : " + data.eval1 + "</p>" + "<p>Comment : " + data.comments + "</p>";
				};

				var d3CalendarMonthRect = function(selector,sDate, eDate, cellsize) {
						var svg = d3Util.buildCalendarSvg(selector,sDate, eDate, cellsize);
						var weekTitle = d3Util.buildWeekTitle(svg, cellsize);
						var dayGroup = d3Util.buildDayGroup(svg);
						var rect = d3Util.buildRect(dayGroup, cellsize); 
						var daytext = d3Util.buildDayText(dayGroup, cellsize);
						var tooltip = d3Util.buildToolTip(selector, "tooltip");

						var reqUrl = thisProps.url + "/" + thisProps.user + "?" + "date[$gte]=" + sDate + "&date[$lt]=" + eDate; 
						var	dataSet = d3.json(reqUrl, function(error, json) { 
								if ( null != error) {
										console.log(error);
										return;
								}	
								var data = d3.nest()
										.key(function(d) { return d.date;})
										.map(json);

								rect.filter(function(d) { return d in data;})
										.attr("class", function(d) { return "day-off " + color(data[d][0]["eval1"]);})
										.select("title");

								rect.on("mouseover", function(d) {
										var className = d3.select(this).attr("class");
										d3.select(this).attr("class",className.replace("day-off", "day-on"));

										if (data[d]) {
												tooltip.style("visibility", "visible");
												tooltip.transition()
														.duration(100)
														.style("opacity", .9);
												tooltip.html(formatText(data[d][0]))
														.style("left", (d3.event.pageX) + 30 + "px")
														.style("top", (d3.event.pageY) + "px");
										}
								});

								rect.on("mouseout", function(d) {
										var className = d3.select(this).attr("class");
										d3.select(this).attr("class",className.replace("day-on", "day-off"));

										tooltip.transition()
												.duration(100)
												.style("opacity", 0);

										$("tooltip").empty();
								});
						});
				};
				var sDate = d3Util.date_format(d3Util.nextMonthFirstDate(this.state.tdate));
				var eDate = d3Util.date_format(d3Util.thisMonthFirstDate(this.state.tdate));
				d3CalendarMonthRect("#" + this.props.rootSelector,sDate, eDate,this.state.cellsize);
		},

		componentDidUpdate: function() {
				d3.select("#" + this.props.rootSelector).selectAll("svg").selectAll("g").remove();
				d3.select("#" + this.props.rootSelector).selectAll("svg").remove();
				this.componentDidMount();
		}
});

module.exports = CalendarView;
