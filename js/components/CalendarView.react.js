var React = require('react');
var ReactDOM = require('react-dom');
var ReactPropTypes = React.PropTypes;
var D3Util = require('../D3Util');
var DateUtil = require("../DateUtil");
var d3 = require('d3');
var Calendar = require('./Calendar.react.js');

var CalendarView = React.createClass({
		propTypes: { 
				changePage: React.PropTypes.func
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
				var changedDate = DateUtil.parse(event.target.value,"day");
				this.setState({
						tdate: changedDate, 
				});
				this.getDiaryAndUpdate(changedDate);
		},

		render: function() {
				return <div ref="calendar"></div>;
		},

		getDiaryAndUpdate : function(tDate) {
				var sDate = DateUtil.thisMonthFirstDate(tDate),
					eDate = DateUtil.nextMonthFirstDate(tDate);
				var reqUrl = "diary/?" + "type[$eq]=day" + "&date[$gte]=" + DateUtil.format(sDate,"day") + "&date[$lt]=" + DateUtil.format(eDate,"day");

				d3.json(reqUrl, function(error, json) { 
					if ( null != error) {
							console.log(error);
							return;
					}	
					ReactDOM.unmountComponentAtNode(this.refs.calendar);
					var transferProps = {
							tdate : this.state.tdate,
							dataSet : json,
							changePage: this.props.changePage 
					};
		    		ReactDOM.render(<Calendar {...transferProps} />, this.refs.calendar);
				}.bind(this));
		},
		
		componentDidMount: function() {
				this.getDiaryAndUpdate(this.state.tdate);
		},
});

module.exports = CalendarView;
