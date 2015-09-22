var React = require('react');
var ReactPropTypes = React.PropTypes;

var DiaryForm = React.createClass({
		propTypes: {
				url: React.PropTypes.string,
				user: React.PropTypes.string,
				id: React.PropTypes.string,
				name: React.PropTypes.string.isRequired,
				evals: React.PropTypes.arrayOf(React.PropTypes.shape( {
						name: React.PropTypes.string.isRequired
				})),
				comments: React.PropTypes.arrayOf(React.PropTypes.shape( {
						name: React.PropTypes.string.isRequired
				})),
				tdate: React.PropTypes.string
		},

		getDefaultProps: function() {
				return {
						name: "DiaryForm"
				};
		},

		getInitialState: function() {
				return {
						id: 'dairy_form-1',
						evalRates: this.props.evals.map(function(x,ind) { return { 
								id: 'dairy_form_eval-' + ind,
					   	};}),
						commentTexts: this.props.comments.map(function(x,ind) { return { 
								id: 'dairy_form_comment-' + ind,
						};})
				};
		},

		onClickSubmit: function(e) {
				console.log(JSON.stringify(submitData));
		},

		onClickCancel: function(e) {
				console.log("onClick Cancel Called");
		},

		render: function() {
				// Set variable to access in each map method.(Do not use this keyword in map method)
				var propsEvals = this.props.evals;
				var propsComments = this.props.comments; 
				var reactVal = this;
				return <form action={this.props.url} method="post">
							<input type="hidden" name="user" value={this.props.user}/>
							<label htmlFor="diary_form_tdate">
								date
								<input id="diary_form_tdate" className="form-control" name="date" type="date" value={this.props.tdate} />
							</label>
							{ this.state.evalRates.map(function(val,ind) {
								return <div className="form-group">
										<label htmlFor={val.id}>
									   		{propsEvals[ind].name}
									   		<input id={val.id} className="form-control" type="text" ref={val.id} name={propsEvals[ind].name}/> 
									   </label>
									   </div>;
							 })
							}
							{ this.state.commentTexts.map(function(val,ind) {
								return <div className="form-group">
										<label htmlFor={val.id}>
									   	{propsComments[ind].name}
									   	<textarea id={val.id} className="form-control" type="text" ref={val.id} name={propsComments[ind].name}/> 
									   </label>
									   </div>;
							 })
							}
							<button type="submit" className="btn btn-primary" onClick={this.onClickSubmit}>Submit</button>
							<button type="submit" className="btn btn-default" onClick={this.onClickCancel}>Cancel</button>	
			          </form>;
		}
});

module.exports = DiaryForm;
