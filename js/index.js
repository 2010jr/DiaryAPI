var React = require('react');
var ReactDOM = require('react-dom');

window.React = require('react');
var DiaryForm = require('./components/DiaryForm.react');
var CalendarView = require('./components/CalendarView.react');
var GoalFormView = require('./components/GoalForm.react');
var TemplateView = require('./components/TemplateView.react');

var props = {};
props.url = "/diary";

document.getElementById("nav-menu-diary").onclick = function() {
		ReactDOM.render(
						<DiaryForm {...props} />
						, document.getElementById("container-view")
		);
		return false;
};

document.getElementById("nav-menu-calendar").onclick = function() {
		ReactDOM.render(
						<CalendarView {...props} />
						, document.getElementById("container-view")
		);
		return false;
};

document.getElementById("nav-menu-goal").onclick = function() {
		ReactDOM.render(
						<GoalFormView {...{url:"/goal"}} />
						, document.getElementById("container-view")
					);
		return false;
};

