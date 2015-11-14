var React = require('react');
var ReactPropTypes = React.PropTypes;
var jQuery = require('jquery');

var DiaryForm = React.createClass({
		propTypes: {
				url: React.PropTypes.string,
				user: React.PropTypes.string,
				id: React.PropTypes.string,
				templateName: React.PropTypes.string,
				tdate: React.PropTypes.string
		},

		getDefaultProps: function() {
				return {
						templateName: ""
				};
		},

		getInitialState: function() {
				return {
						id: 'dairy_form-1',
						template: 'template',
						templateNames: [],
						evaluates: [],
						comments: [],
				};
		},

		onClickSubmit: function(e) {
				console.log(JSON.stringify(submitData));
		},

		onClickCancel: function(e) {
				console.log("onClick Cancel Called");
		},

		parseTemplateInfo: function(template) {
				return template.map(function(val) {
						var evaluates = val["evaluates[]"],
						comments = val["comments[]"];

						return {
								evaluates: Array.isArray(evaluates) ? evaluates: [evaluates],
								comments: Array.isArray(comments) ? comments: [comments]
						};
				       });
		},

		componentDidMount: function() {
			if(this.props.templateName === "" || this.props.templateName === null) {
				jQuery.get("template" + "/" + this.props.user, {}, function(data) {
						var templates = [];
						data.forEach(function(val) {
								templates.push(val.templateName);
						});
						this.setState({templateNames: templates});
				}.bind(this));
			} else {
				// Get template element
				jQuery.get("template" + "/" + this.props.user + "/" + this.props.templateName, {}, function(data) {
						this.state.evaluates = [];
						this.state.comments = [];

						data.forEach(function(val) {
								var evaluates = val["evaluates[]"],
									comments = val["comments[]"];
								
								this.setState({
										evaluates: Array.isArray(evaluates) ? evaluates: [evaluates],
										comments: Array.isArray(comments) ? comments: [comments]
								});
						}.bind(this));	
				}.bind(this));
			}
		},

		handleRemove: function(event) {

		},

		handleRemoveAll: function(event) {

		},

		handlerTemplateChange: function(event) {
			// Get template information				
			var templateName = React.findDOMNode(this.refs.templateName).value;
			console.log("templateName : " + templateName);
			jQuery.get("template" + "/" + this.props.user,{templateName: templateName}, function(data) {
				if(data.length == 0) {
						return;
				}
				var newState = this.parseTemplateInfo(data);
				console.log("new state");
				console.log(newState);
				this.setState(newState[0]);	
			}.bind(this));
		},

		buildTemplateDropDown: function(templateName, templateNames, handlerChange) {
				var options;	
				if( templateName !== "") {
					options = <option value={templateName}>{templateName}</option>;
				} else {
					options = templateNames.map(function(data) {
							return <option value={data}>{data}</option>;
					});
				}
				return <select className="form-control" ref="templateName" onChange={handlerChange}>
						{options}
					   </select>;
		},
		render: function() {
				// Set variable to access in each map method.(Do not use this keyword in map method)
				return <form action={this.props.url} method="post">
							<div className="form-inline">
								<input type="hidden" name="user" value={this.props.user}/>
								<input id="diary_form_tdate" className="form-control" name="date" type="date" value={this.props.tdate} />
								<label>Template
									{this.buildTemplateDropDown(this.props.templateName, this.state.templateNames, this.handlerTemplateChange)} 
								</label>
							</div>
							{this.state.evaluates.map(function(val,ind) {
								return <div className="form-group">
										<label>{val}
									   		<select className="form-control" ref={val}>
													{[1,2,3,4,5].map(function(num) {
															return <option value={num}>{num}</option>;
													})}
											</select>
									   	</label>
									   </div>;
							 }.bind(this))
							}
							{ this.state.comments.map(function(val,ind) {
								return <div className="form-group">
										<label>{val}
									   	<textarea className="form-control" type="text" ref={val}/> 
									   </label>
									   </div>;
							 })
							}
							<button className="btn btn-primary" onClick={this.onClickSubmit}>Submit</button>
							<button className="btn btn-default" onClick={this.onClickCancel}>Cancel</button>	
							<button className="btn btn-danger" onClick={this.handleRemove}>Remove</button>
							<button className="btn btn-danger" onClick={this.handleRemoveAll}>RemoveAll</button>	
			          </form>;
		}
});

module.exports = DiaryForm;
