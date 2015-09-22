var React = require('react');
var ReactPropTypes = React.PropTypes;
var d3Util = require('../util');
var d3 = require('d3');
var DiaryForm = require('./DiaryForm.react');

var CalendarView = React.createClass({
		getDefaultProps: function() {
				return {
				};
		},

	    getInitialState: function() {
				return {
						tdate: new Date(),
						valtype: ""
				};
		},

		render: function() {
				return <div id="selector"> </div>;
				
		},

		componentDidMount: function() {
				var d3CalendarMonthRect = function(selector,sdate, edate, cellsize) {
				var width = cellsize * 7; 
				var height = cellsize * (6 + 1); //including month title
				var svg = d3.select(selector).selectAll("svg")
						.data(d3.time.months(d3Util.date_format.parse(sdate), d3Util.date_format.parse(edate)))
						.enter().append("svg")
						.attr("width", width)
						.attr("height", height)
						.attr("class", "RdYlGn")
						.append("g");

				var dayGroup = svg.selectAll("g")
						.data(function(d) { 
							var next_month = parseInt(d3Util.month(d)) + 1;
							var next_year = next_month > 12 ? parseInt(d3Util.year(d)) + 1 : parseInt(d3Util.year(d));
							next_month = next_month % 13;
							return d3.time.days(d, new Date(next_year, next_month -1, 1));
						})
				.enter().append("g");

				var rect = dayGroup 
						.append("rect")
						.attr("class", "day")
						.attr("width", cellsize)
						.attr("height", cellsize)
						.attr("x", function(d) {
								return parseInt(d3Util.day(d)) * cellsize; 
						})
						.attr("y", function(d) { 
								var year = parseInt(d3Util.year(d)),
									month = parseInt(d3Util.month(d));
								var week_diff = parseInt(d3Util.week(d)) - parseInt(d3Util.week(new Date(year,month-1,1)));
								return cellsize + (week_diff*cellsize); 
						})
						.datum(d3Util.date_format);

				var daytext = dayGroup 
						.append("text")
						.attr("x", function(d) {
								return parseInt(d3Util.day(d)) * cellsize + cellsize * 0.3;
						})
						.attr("y", function(d) { 
								var year = parseInt(d3Util.year(d)),
									month = parseInt(d3Util.month(d));
								var week_diff = parseInt(d3Util.week(d)) - parseInt(d3Util.week(new Date(year,month-1,1)));
								return cellsize + week_diff * cellsize + cellsize * 0.6; 
						})
						.attr("class", "day-title")
								.text( function(d) { return d3Util.day_of_month(d)});

				var month_titles = svg  // Jan, Feb, Mar and the whatnot
						.append("text")
						.attr("width",cellsize)
						.attr("height", cellsize)
						.attr("x", 0) 
						.attr("y", cellsize * 0.5)
						.attr("class", "month-title")
						.text(function(d) { return d3Util.year(d) + "/" + d3Util.month(d)});
				
				// ToolTip
				rect.on("click", function(d) {
						var props = {};
						props.url = "http://192.168.33.13:3000/diary";
						props.user = "kusahana";
						props.evals = [ {name: "goal1" , label: "goal1"}, {name: "goal2", label:"goal2"}];
						props.comments = [ {name: "comments", label: "comments"}, {name: "comments2", label: "comments2"}];
						props.name = "DiaryForm";
						props.tdate = d;
						var dForm = React.render(
										<DiaryForm {...props} />
										,document.getElementById('diary-space'));
				});
				};
			
				var sDate = d3Util.date_format(new Date(d3Util.year(this.state.tdate), parseInt(d3Util.month(this.state.tdate)) - 1, 1));
				var eDate = d3Util.date_format(new Date(d3Util.year(this.state.tdate), parseInt(d3Util.month(this.state.tdate)) - 1 + 1, 1));
				d3CalendarMonthRect("#selector",sDate, eDate,50);
		}
});

module.exports = CalendarView;
