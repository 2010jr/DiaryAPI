var React = require('react');
var ReactDOM = require('react-dom');

var DiaryUnit = React.createClass({
		propTypes: {
				goal: React.PropTypes.string,
				comment: React.PropTypes.string,
				textRow: React.PropTypes.number,
		},
		
		getDefaultProps: function() {
				return {
						textRow: 3,
				}
		},

		render: function() {
				return <div className="diary-unit">
						<div className="diary-header">
							{this.props.goal}
						</div>
						<div className="diary-content">
							<textarea className="form-control" rows={this.props.textRow} type="text" defaultValue={this.props.comment} ref="comment"/>
						</div>
						</div>;
		},
		
		getComment: function(){
				return this.refs.comment.value;
		},
});

module.exports = DiaryUnit;

