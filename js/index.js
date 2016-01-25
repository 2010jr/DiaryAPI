var React = require('react');
var ReactDOM = require('react-dom');

var d3 = require('d3');
window.React = require('react');
var DiaryForm = require('./components/DiaryForm.react');
var CalendarView = require('./components/CalendarView.react');
var GoalForm = require('./components/GoalForm.react');
var GoalUnit = require('./components/GoalUnit.react');
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

document.getElementById("nav-menu-goal").onclick = function(event) {
		console.log(event.target.name);
		var container = document.getElementById("container-view");
		ReactDOM.unmountComponentAtNode(container);
		ReactDOM.render(
						<GoalForm goalType={event.target.name} />
						, container 
					   );
		return false;
};
