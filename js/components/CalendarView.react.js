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

		render: function() {
				return <div>
						<div className="form-inline">
							<div className="form-group">
								<input className="form-control" type="month" value={d3Util.month_format(this.state.tdate)} onChange={this.handleDateChange}></input>
								<button className="btn btn-danger" onClick={this.handleRemove}>Remove</button>
								<button className="btn btn-danger" onClick={this.handleRemoveAll}>RemoveAll</button>
							</div>
						</div>
						<div id={this.props.rootSelector}></div>
					   </div>;
		},

		componentDidMount: function() {
				var thisProps = this.props;
				var thisState = this.state;
				var color = d3.scale.quantize()
						.domain([1, 5])
						.range(d3.range(9).map(function(d) { return "q" + d + "-9"; }));

				var d3CalendarMonthRect = function(selector,sDate, eDate, cellsize) {
						var svg = d3Util.buildCalendarSvg(selector,sDate, eDate, cellsize);
						var weekTitle = d3Util.buildWeekTitle(svg, cellsize);
						var dayGroup = d3Util.buildDayGroup(svg);
						var rect = d3Util.buildRect(dayGroup, cellsize); 
						var daytext = d3Util.buildDayText(dayGroup, cellsize);
						var tooltipRect = d3Util.buildToolTip(rect, "click", function(d) {
								var props = {};
								props.url = "/diary";
								props.user = "kusahana";
								props.evals = [ {name: "goal1" , label: "goal1"}, {name: "goal2", label:"goal2"}];
								props.comments = [ {name: "comments", label: "comments"}, {name: "comments2", label: "comments2"}];
								props.name = "DiaryForm";
								props.tdate = d;
								var dataset = d3.json(thisProps.url + "/" + thisProps.user + "/" + d, function(error, json) { 
										if ( null != error) {
												console.log(error);
												return;
										}
										console.log(json);
										return json;});
								console.log(dataset);
								var dForm = React.render(
												<DiaryForm {...props} />
												,document.getElementById('diary-view'));
						});
						
						rect.on("mouseover", function(d) {
							var className = d3.select(this).attr("class");
							d3.select(this).attr("class",className.replace("day-off", "day-on"));
						});

						rect.on("mouseout", function(d) {
							var className = d3.select(this).attr("class");
							d3.select(this).attr("class",className.replace("day-on", "day-off"));
						});
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
