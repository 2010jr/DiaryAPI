var React = require('react');
var d3 = require('d3');
var jQuery = require('jquery');
var DiaryList = require('./DiaryList.react');
var DateUtil = require('../DateUtil');

var DiarySummary = React.createClass({
		propTypes: {
				goalType: React.PropTypes.oneOf(['month','week','day']).isRequired,
				sDate: React.PropTypes.object,
				eDate: React.PropTypes.object,
		},

		getDefaultProps: function() {
				return {
						sDate: new Date(),
						eDate: new Date(),
				};
		},

		getInitialState: function() {
				return {
						diaries: [],
				};
		},
	
		render: function() {
				return <ul className="list-group">
						{this.state.diaries.map(function(val){
							return <DiaryList key={val.date} diary={val} />;
						 })}
					   </ul>;
		},

		componentDidMount: function() {
				this.initDiaries(this.props.goalType, this.props.sDate, this.props.eDate);
		},

		initDiaries: function(goalType, sDate, eDate) {
				var sDateFormatted = DateUtil.format(sDate, goalType),
					eDateFormatted = DateUtil.format(eDate, goalType);

				var reqUrl = "/diary/?" + "type[$eq]=" + goalType + "&date[$gte]=" + sDateFormatted + "&date[$lte]=" + eDateFormatted;
				d3.json(reqUrl, function(error, json) {
						if (null != error) {
								console.log(error);
								return;
						}
						console.log(json);
						this.setState({
								diaries: json,
						});
				}.bind(this));
		},
});

module.exports = DiarySummary;
