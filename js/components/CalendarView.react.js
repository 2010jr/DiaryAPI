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

		handleChangeDate : function(offset) {
				var monthOfYear = this.state.tdate.getMonth(),
					year = this.state.tdate.getFullYear();
				var newDate = new Date(year,monthOfYear + offset, 1);
				this.setState({
						tdate: newDate,
				});
		},

		render: function() {
				that = this;
				return <div>
						<div className="center-block">
							<div className="col-md-2"/>
							<button type="button" className="btn btn-link" onClick={that.handleChangeDate.bind(that,-1)}>
								<span className="glyphicon glyphicon-chevron-left" aria-hidden="true"/>
							</button>
							<button type="button" className="btn btn-link" onClick={that.handleChangeDate.bind(that,1)}>
								<span className="glyphicon glyphicon-chevron-right" aria-hidden="true"/>
							</button>
						</div>
						<div ref="calendar"></div>
					   </div>;
		},

		getDiaryAndUpdate : function(tDate) {
				var sDate = DateUtil.thisMonthFirstDate(tDate),
					eDate = DateUtil.nextMonthFirstDate(tDate);
				console.log("getDiaryAndUpdate is invoked");
				ReactDOM.unmountComponentAtNode(this.refs.calendar);
				var transferProps = {
						tdate : this.state.tdate,
						changePage: this.props.changePage 
				};
		   		ReactDOM.render(<Calendar {...transferProps} />, this.refs.calendar);
		},

		componentDidMount: function() {
				this.getDiaryAndUpdate(this.state.tdate);
		},

		componentDidUpdate: function() {
				this.getDiaryAndUpdate(this.state.tdate);
		},
});

module.exports = CalendarView;
