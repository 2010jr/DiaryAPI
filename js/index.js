var React = require('react');

window.React = require('react');
var DiaryForm = require('./components/DiaryForm.react');
var CalendarView = require('./components/CalendarView.react');

var props = {};
props.url = "http://192.168.33.13:3000/diary";
props.user = "kusahana";
props.evals = [ {name: "goal1" , label: "goal1"}, {name: "goal2", label:"goal2"}];
props.comments = [ {name: "comments", label: "comments"}, {name: "comments2", label: "comments2"}];
props.name = "DiaryForm";
props.tdate = "2015-09-13";

var dForm = React.render(
				<DiaryForm {...props} />
				, document.body);

var calendarView = React.render(
				<CalendarView />
				, document.body);
