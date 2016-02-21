var React = require('react');
var ReactDOM = require('react-dom');
var ReactPropTypes = React.PropTypes;
var D3Util = require('../D3Util');
var DateUtil = require("../DateUtil");
var d3 = require('d3');
var Calendar = require('./Calendar.react.js');

var CalendarView = React.createClass({
		propTypes: { 
		},

		getDefaultProps: function() {
				return {
				}
		},

		getInitialState: function() {
				return {
						tdate: new Date(),
				};
		},

		handleChangeDate : function(event) {
				var changedDate = D3Util.month_format.parse(event.target.value);
				this.setState({
						tdate: changedDate, 
				});
				this.getDiaryAndUpdate(changedDate);
		},

		render: function() {
				return <div ref="calendar"></div>;
		},

		getDiaryAndUpdate : function(tDate) {
				var sDate = DateUtil.nextMonthFirstDate(tDate),
					eDate = DateUtil.thisMonthFirstDate(tDate);
				var reqUrl = "diary/?" + "type[$eq]=day" + "&date[$gte]=" + D3Util.dateFormat(sDate) + "&date[$lt]=" + D3Util.dateFormat(eDate),
					days = (365 + d3.time.dayOfYear(eDate) - d3.time.dayOfYear(sDate)) % 365;

				d3.json(reqUrl, function(error, json) { 
					if ( null != error) {
							console.log(error);
							return;
					}	
					console.log(json);
					ReactDOM.unmountComponentAtNode(this.refs.calendar);
					var transferProps = {
							tdate : this.state.tdate,
							dataSet : json,
					};
		    		ReactDOM.render(<Calendar {...transferProps} />, this.refs.calendar);
				}.bind(this));
		},
		
		componentDidMount: function() {
				this.getDiaryAndUpdate(this.state.tdate);
		},
});

module.exports = CalendarView;
