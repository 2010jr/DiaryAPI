var React = require('react');
var ReactDOM = require('react-dom');

var Message = React.createClass({
		propTypes: {
				message: React.PropTypes.string.isRequired,
				type: React.PropTypes.oneOf(['success','info','warning','danger']).isRequired,
		},

		getDefaultProps : function() {
				return {
				}
		},

		render: function() {
				return <div className={"alert alert-" + this.props.type} key={this.state.message} ref="message">{this.props.message}</div>;
		},
});

module.exports = Message;

