var React = require('react');
var ReactDOM = require('react-dom');
var PageView = require("./components/PageView.react");

//It is only debugging in brower
window.React = require('react');

var container = document.getElementById("container-view");
Array.prototype.forEach.call(document.getElementById("nav-menu").getElementsByClassName("dropdown-menu"), function(val) {
		val.onclick = function(event) {
				ReactDOM.unmountComponentAtNode(container);
				var pageTypeAndGoalType = event.target.name.split(":");
				var props = {
						defaultPageType : pageTypeAndGoalType[0], 
						defaultGoalType : pageTypeAndGoalType[1] 
				};
				ReactDOM.render(<PageView { ...props} />, container); 
				return false;
		};
});
