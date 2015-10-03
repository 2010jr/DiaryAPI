var React = require('react');

window.React = require('react');
var DiaryForm = require('./components/DiaryForm.react');
var CalendarView = require('./components/CalendarView.react');
var GoalView = require('./components/GoalView.react');
var TemplateView = require('./components/TemplateView.react');

var props = {};
props.url = "/diary";
props.user = "kusahana";
props.evals = [ {name: "goal1" , label: "goal1"}, {name: "goal2", label:"goal2"}];
props.comments = [ {name: "comments", label: "comments"}, {name: "comments2", label: "comments2"}];

var calendarView = React.render(
				<CalendarView {...props} />
				, document.getElementById("calendar-month-view"));

var goalView = React.render(
				<GoalView {...{user: "kusahana", url:"/goal"}} />
				, document.getElementById("goal-view"));

var diaryView = React.render(
				<DiaryForm {...props} />
				, document.getElementById("diary-view"));

var templateView = React.render(
				<TemplateView {...{user: "kusahana", url:"/template", template: "Template"}} />
				, document.getElementById("template-view"));

