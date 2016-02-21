var React = require("react");
var ReactDOM = require("react-dom");
var ReactCSSTransitionGroup = require("react-addons-css-transition-group"); 

var Modal = React.createClass({
		propTypes: {
				message: React.PropTypes.string.isRequired,
				linksToAct: React.PropTypes.arrayOf(React.PropTypes.shape({
						name: React.PropTypes.string.isRequired,
						func: React.PropTypes.func.isRequired
				})).isRequired
		},

		getInitialState: function() {
				return {
						isActive : true 
				};
		},


		handleLinkClick: function(event) {
				this.setState({
						isActive: false,
						funcAfterLeave: this.props.linksToAct[event.target.name].func
				});
		},

		buildModalContent: function() { 
				if(this.state.isActive) {
					return <div className={"modal-wrapper"} key="content">
						<div className="modal-cont">
						<p>{this.props.message}</p>
						{this.props.linksToAct.map(function(val, ind) {
							  return <a name={ind} onClick={this.handleLinkClick} key={"link_" + ind}>{val.name}</a>;
						 }.bind(this)
						)
						}
						</div>
						</div>;
				} else {
						return null;
				}
		},

		render: function() {
				return <ReactCSSTransitionGroup transitionAppear={true} transitionLeave={true} transitionName="modal" transitionAppearTimeout={500} transitionEnterTimeout={500} transitionLeaveTimeout={300}>
				{this.buildModalContent()}
						</ReactCSSTransitionGroup>;
		},

		componentDidUpdate: function() {
				// This is ugree solution to enable animation
				setTimeout(this.state.funcAfterLeave,300);
		}
});

module.exports = Modal;
