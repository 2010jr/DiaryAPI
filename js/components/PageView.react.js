var React = require("react");
var ReactDOM = require("react-dom");
var DiaryForm = require("./DiaryForm.react");
var GoalForm = require("./GoalForm.react");
var CalendarView = require('./CalendarView.react');
var DiarySummary = require('./DiarySummary.react');

var PageView = React.createClass({
		statics: {
				PAGE_REACT_MAP : {
						"Diary" : DiaryForm ,
						"Goal" : GoalForm ,
						"Calendar" : CalendarView ,
						"List" : DiarySummary 
				}
		},

		propTypes: {
				defaultPageType: React.PropTypes.oneOf(["Diary","Goal","List","Calendar"]).isRequired,
				defaultGoalType: React.PropTypes.string.isRequired
		},
		
		getInitialState: function() {
				return {
						tdate: new Date(),
						pageType: this.props.defaultPageType,
						goalType: this.props.defaultGoalType
				};
		},

		render: function() {
				return <div ref="container"></div>;
		},

		componentDidMount: function() {
				var props = { tdate: this.state.tdate, 
							  goalType: this.state.goalType,
							  changePage: this.changePage
				};
				var viewElement = React.createElement(PageView.PAGE_REACT_MAP[this.state.pageType], props);
				ReactDOM.render(viewElement, this.refs.container);
		},

		componentDidUpdate: function() {
				ReactDOM.unmountComponentAtNode(this.refs.container);
				this.componentDidMount();
		},

		changePage : function(pageType, goalType, date) {
				if (!goalType) {
						goalType = this.state.goalType;
				}
				if (!date) {
						date = this.state.tdate;
				}

				this.setState({
						pageType : pageType,
						tdate: date,
						goalType: goalType,
				});
		},
});

module.exports = PageView;
