var React = require('react');

window.React = require('react');
var DiaryForm = require('./components/DiaryForm.react');
var CalendarView = require('./components/CalendarView.react');
var GoalView = require('./components/GoalView.react');

var props = {};
props.url = "/diary";
props.user = "kusahana";

var calendarView = React.render(
				<CalendarView {...props} />
				, document.getElementById("calendar-month-view"));

var goalView = React.render(
				<GoalView {...{user: "kusahana", url:"/goal"}} />
				, document.getElementById("goal-view"));

