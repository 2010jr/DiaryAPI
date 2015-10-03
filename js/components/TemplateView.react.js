var React = require('react');
var ReactPropTypes = React.PropTypes;
var jQuery = require('jquery');

var TemplateView = React.createClass({
		propTypes: { 
				url: React.PropTypes.string,
				user: React.PropTypes.string,
				template: React.PropTypes.string
		},

		getDefaultProps: function() {
				return {
				};
		},
		
		getInitialState: function() {
			 	return {
					templateName: "Template",
					evaluates: [],
					comments: []
				};
		},

		handleAddElement: function(elementName,event) {
				//Add element
				console.log("element name : " + elementName);
				var newState = {},
				    elements = this.state[elementName],
					textValue = React.findDOMNode(this.refs[elementName]).value;

				console.log("text value : " + textValue); 
				console.log("element");
				console.log(elements);
				elements.push(textValue);
				newState[elementName] = elements;
				this.setState(newState);
		},

		handleDelElement: function(elementInd, elementName, event) {
				//Add element
				console.log("event name : " + elementName);
				console.log("elementInd : " + elementInd);
				var newState = {},
				    elements = this.state[elementName];

				elements.splice(elementInd, 1);
				newState[elementName] = elements;
				this.setState(newState);
		},

		handleSubmit: function() {
				var dataSet = {
						templateName : React.findDOMNode(this.refs.templateName).value,
						evaluates : this.state.evaluates,
						comments : this.state.comments,
						user: this.props.user
				};
				console.log(dataSet);
				jQuery.ajax({
						type: "POST",
						url: this.props.url,
						data: (dataSet),
						success: function(data) {
								console.log("success ajax!! Data is " + data);
						},
						error : function(data) {
								console.log("error ajax!! data is " + data);
						}
				});
		},	

		componentDidMount: function() {
				var requestData = {
						user: this.props.user,
						templateName : this.props.template
				};
				var thisComp = this;	

				jQuery.get(this.props.url + "/" + this.props.user, requestData, function(data) {
						data.forEach(function(val) {
								console.log(val);
								var evaluates = val["evaluates[]"],
									comments = val["comments[]"];

								thisComp.setState({
										templateName: val.templateName,
										evaluates: Array.isArray(evaluates) ? evaluates : [evaluates],
										comments: Array.isArray(comments) ? comments: [comments]
								});
						});
				});
		},

		render: function() {
				console.log("present state");
				console.log(this.state);
				var evaluates = this.state.evaluates,
					comments = this.state.comments,
					handleAddElement = this.handleAddElement,
					handleDelElement = this.handleDelElement;

				var groupElements = [
			   		{
						labelName: "Evaluate",
						dataName: "evaluates",
						element: this.state.evaluates
					},
					{
						labelName: "Comment",
						dataName: "comments",
						element: this.state.comments
					}
				];

				return	<div className="row">
							<div className="from-group">
								<label>Template Name</label>
								<input className="form-control" defaultValue={this.state.templateName} ref="templateName"></input>
							</div>
							{groupElements.map(function(data) {
									return <div className="form-group">
										 	<label>{data.labelName}</label>
												<div className="input-group">
													<input className="form-control" type="text" aria-label="..." ref={data.dataName}></input>
													<div className="input-group-btn">
														<button type="button" className="btn btn-primary" aria-label="left align" onClick={handleAddElement.bind(this,data.dataName)}>
															<span className="glyphicon glyphicon-plus" aria-hidden="true">
															</span>
														</button>
													</div>
												</div>
												<div className="list-group">
													<ul>
													{data.element.map(function(val,ind) {
														console.log("val : " + val);
													    console.log("ind : " + ind);	
														return	<div className="input-group">
																	<li className="list-group-item">{val}</li>
																	<span className="input-group-btn">
																		<button className="btn btn-danger" type="button" arial-label="left align" onClick={handleDelElement.bind(this, ind, data.dataName)}>
																			<span className="glyphicon glyphicon-remove-circle" aria-hidden="true"></span>
																		</button>
																	</span>
																</div>;
													})}
													</ul>
												</div>
										</div>;
								})}
								<div className="form-group">
									<button className="btn btn-primary" onClick={this.handleSubmit}>Save</button>
									<button className="btn btn-default">Reset</button>
								</div>
						</div>;
		}
});

module.exports = TemplateView;

