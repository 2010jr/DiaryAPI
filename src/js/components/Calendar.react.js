var React = require('react');
var ReactPropTypes = React.PropTypes;
var D3Util = require('../D3Util');
var DateUtil= require('../DateUtil');
var AjaxUtil = require('../AjaxUtil');
var d3 = require('d3');

var Calendar = React.createClass({
		propTypes: {
				tdate : React.PropTypes.object,
				changePage : React.PropTypes.func
		},

		getDefaultProps: function() {
				return {
						tdate : new Date(),
				}
		},

		render : function() {
			return <div>
					<div id="Calendar"></div>
				   </div>;
		},

		componentDidMount: function() {
			var sDate = DateUtil.thisMonthFirstDate(this.props.tdate),
				eDate = DateUtil.nextMonthFirstDate(this.props.tdate),
				changePageFunc = this.props.changePage;

			this.buildCalendarFrame("#Calendar", sDate, eDate, 50);
			["month", "week", "day"].forEach(function(goalType) {
					var query = "&date[$gte]=" + DateUtil.format(sDate,goalType)+ "&date[$lt]=" + DateUtil.format(eDate,goalType);
					AjaxUtil.getDiaries(goalType, null, query, function(error,json) {
							D3Util.coloringRectByDiaries(json, new Date(), goalType, changePageFunc);
					});
			});
		},

		buildCalendarFrame : function(selector,sDate, eDate, cellsize) {
				var svg = D3Util.buildCalendarSvg(selector,sDate, eDate, cellsize);
				var dayGroup = D3Util.buildDayGroup(svg, cellsize);
				var weekTitle = D3Util.buildWeekTitle(svg, cellsize);
				var weekRect = D3Util.buildWeekRect(svg, sDate, eDate, cellsize);
				var monthTitle = D3Util.buildMonthTitle(svg, cellsize);
				var tooltip = D3Util.buildToolTip(selector, "tooltip");
		},

		componentWillUnmount : function() {
			d3.select("#Calendar").selectAll("svg").selectAll("g").remove();
			d3.select("#Calendar").selectAll("svg").remove();
		},
});

module.exports = Calendar;
