var React = require('react');

window.React = require('react');
var DiaryForm = require('./components/DiaryForm.react');
var CalendarView = require('./components/CalendarView.react');
var GoalView = require('./components/GoalView.react');
var TemplateView = require('./components/TemplateView.react');

var props = {};
props.url = "/diary";
props.user = "kusahana";

document.getElementById("nav-menu-diary").onclick = function() {
		React.render(
						<DiaryForm {...props} />
						, document.getElementById("container-view")
		);
		return false;
};

document.getElementById("nav-menu-calendar").onclick = function() {
		React.render(
						<CalendarView {...props} />
						, document.getElementById("container-view")
		);
		return false;
};

document.getElementById("nav-menu-goal").onclick = function() {
		React.render(
						<GoalView {...{user: "kusahana", url:"/goal"}} />
						, document.getElementById("container-view")
					);
		return false;
};

