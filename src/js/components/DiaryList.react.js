var React = require('react');

var DiaryList = React.createClass({
		propTypes: {
				diary: React.PropTypes.shape({
						rate: React.PropTypes.string,
						goalComments: React.PropTypes.array,
						freeComments: React.PropTypes.array,
						date: React.PropTypes.string,
						type: React.PropTypes.string
				}),
		},

		render: function() {
				return	<li className="list-group-item">
						 <div className="diary_list_sub">
							 <p>{this.props.diary.date}</p>
							 <p>{"rate:" + this.props.diary.rate}</p>
							</div>
							<div className="diary_list_cont">
							<table> 
							<tbody>
							{this.props.diary.goalComments.map(function(val) {
																	  return <tr key={val.goal}>
																			  <td><b>{val.goal}</b></td> 
																			  <td>{val.comment}</td>
																			  </tr>;
						  })}
							{this.props.diary.freeComments.map(function(val) {
															  return <tr key={val.name}>
																	  <td><b>{val.name}</b></td> 
																	  <td>{val.comment}</td>
																	  </tr>;
						  })}
						 </tbody>
						</table>
						</div>
						</li>
		},
});

module.exports = DiaryList;

