var React = require("react");
var ReactDOM = require("react-dom");
var DiaryForm = require("./DiaryForm.react");
var GoalForm = require("./GoalForm.react");
var CalendarView = require('./CalendarView.react');
var DateUtil = require("../DateUtil");
var DiarySummary = require('./DiarySummary.react');

var PageView = React.createClass({
  statics: {
    PAGE_REACT_MAP : {
      "Diary" : DiaryForm ,
      "Goal" : GoalForm ,
      "Calendar" : CalendarView ,
    }
  },

  propTypes: {
    defaultPageType: React.PropTypes.oneOf(["Diary","Goal","Calendar"]).isRequired,
    defaultGoalType: React.PropTypes.string.isRequired
  },
  
  getInitialState: function() {
    return {
      tdate: new Date(),
      pageType: this.props.defaultPageType,
      goalType: this.props.defaultGoalType
    };
  },

  goToPrevDate: function () {
	 var prevDate = DateUtil.offsetDate(this.state.tdate, this.state.goalType, -1);
	 this.setState({
			 tdate : prevDate
	 });
  },

  goToNextDate: function () {
	 var nextDate = DateUtil.offsetDate(this.state.tdate, this.state.goalType, 1);
	 this.setState({
    	 tdate: nextDate 
	 });
  },

  buildHeader: function () {
    return <nav aria-label="...">
      <ul className="pager">
      <li><a onClick={this.goToPrevDate}><span aria-hidden="true">&larr;</span></a></li>
      <li>{DateUtil.format(this.state.tdate, this.state.goalType)}</li>
      <li><a onClick={this.goToNextDate}><span aria-hidden="true">&rarr;</span></a></li>
      </ul>
      </nav>;
  },

  render: function() {
    return <div>
      <div ref="header">{this.buildHeader()}</div>
      <div ref="container"/>
      </div>;
  },

  componentDidMount: function() {
    var props = { 
		tdate: this.state.tdate, 
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

  changePage: function(pageType, goalType, date) {
	console.log("Change page is invoked");
    if (!goalType) {
      goalType = this.state.goalType;
    }
    if (!date) {
      date = this.state.tdate;
    }

    this.setState({
      pageType: pageType,
      tdate: date,
      goalType: goalType,
    });
  },
});

module.exports = PageView;
