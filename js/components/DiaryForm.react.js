var React = require('react');
var ReactDOM = require('react-dom');
var DateUtil = require('../DateUtil');
var AjaxUtil = require('../AjaxUtil');
var DiaryUnit = require('./DiaryUnit.react');
var Modal = require('./Modal.react');

var DiaryForm = React.createClass({
		propTypes: {
				goalType: React.PropTypes.string.isRequired,
				tdate: React.PropTypes.object,
				changePage: React.PropTypes.func
		},

		getDefaultProps: function() {
				return {
						tdate: new Date()
				};
		},

		getInitialState: function() {
				return {
						goalComments: [],
						freeComments: [],
					    isReadyToShowForm: false
				};
		},

		render: function() {
				return <div>
							{this.buildDiaryForm()}
							{this.buildMsg()}
					   </div>;
		},

		componentDidMount: function() {
				AjaxUtil.getDiaries(this.props.goalType, this.props.tdate, null, this.initDiaryByDiary);
		},

		createReTryMsgProp : function(message) {
				var _this = this;
				return {
						message : "エラー 原因 : " + message + " もう一度試してもらえますか？",
						linksToAct: [{
								name : "元の画面に戻ります",
								func : function() { _this.setState({ msgProps : null}); }
						}]
				};
		},

		createSetGoalMsgProp : function() {
				var _this = this;
				return {
						message : "目標が未設定です。日記を書くために目標設定を行いましょう",
						linksToAct: [{
								name : "目標設定しますか？",
								func : function() { 
										_this.props.changePage("Goal", _this.props.goalType, _this.props.tdate);
								}
						}]
				};
		},

		createMsgAfterSubmitProp : function() {
				var nextDate = DateUtil.offsetDate(this.props.tdate, this.props.goalType, 1),
					_this = this;
				return {
						message : "日記登録が完了しました",
						linksToAct: [
						{
								name : "明日の目標を変更しますか？",
								func : function() { 
										_this.props.changePage("Goal", _this.props.goalType, nextDate);
								}
						},
						{
								name: "明日も同じ目標にしますか？",
								func : function() {
										var data = _this.generateSubmitData(nextDate);	
										_this.setState({ msgProps : null});
										console.log(data);
										AjaxUtil.postDiary(data, function(error, json) {});
								}
						}
						]
				};
		},

		initDiaryByGoal: function(error, json) {
				if(json && json.length > 0) {
						var goalSummaries = json.map(function(val) {
								return {
										goalId : val._id,
										goal: val.goal,
										comment : ''
								};
						});
						this.setState({
								goalComments: goalSummaries,
								freeComments: [{
										name: "自由メモ",
										comment: ""
								}],
								rate: '',
								isReadyToShowForm: true
						});
				} else {
						this.setState({
								msgProps : this.createSetGoalMsgProp(),
						});
				}
		},

		initDiaryByDiary: function(error, json) {
				if (json && json.length > 0) {
						this.setState({
								goalComments: json[0].goalComments,
								freeComments: json[0].freeComments,
								rate: json[0].rate,
								isReadyToShowForm: true,
								msg: null
						});
				} else {
						AjaxUtil.getGoals(this.props.goalType, this.props.tdate, null, this.initDiaryByGoal);
				}
		},

		generateSubmitData: function(tdate) {
			var goalComments = this.state.goalComments.map(function(val,ind) { 
					val.comment = this.refs[this.assignId(val.goal,ind)].getComment(); 
					return val;
			}.bind(this));
			var freeComments = this.state.freeComments.map(function(val,ind) { 
					val.comment = this.refs[this.assignId(val.name,ind)].getComment(); 
					return val;
			}.bind(this));

			var data = {
					date : DateUtil.format(tdate, this.props.goalType),
					rate: this.refs.rate.value, 
					goalComments : goalComments,
					freeComments : freeComments,
					type: this.props.goalType
			};	
			return data;
		},

		handleSubmit : function() {
			var data = this.generateSubmitData(this.props.tdate),
				_this = this;
			AjaxUtil.postDiary(data, 
							function(error, json) { 
									_this.setState({ 
											msgProps: _this.createMsgAfterSubmitProp(),
									});
							}
			);
		},

		assignId: function(goal, ind) {
			return goal + "_" + ind;
		},

		buildDiaryForm: function() {
				if(!this.state.isReadyToShowForm) return;
				return <div>
						{this.buildRate(this.props.goalType,this.props.tdate, this.state.rate)}
						{this.state.goalComments.map(function(val,ind) {
							var id = this.assignId(val.goal,ind);
							return <DiaryUnit goal={val.goal} comment={val.comment} textRow={2} ref={id} key={id}/>;
						}.bind(this))
						}
						{this.state.freeComments.map(function(val,ind) {
							var id = this.assignId(val.name,ind);
							return <DiaryUnit goal={val.name} comment={val.comment} ref={id} key={id}/>;
						 }.bind(this))
						}
						<button className="btn btn-success" onClick={this.handleSubmit}>Save</button>
					   </div>;		
		},

		buildRate: function(goalType,tdate,rate) {
			return <div className="form-inline">
					<label>{DateUtil.viewFormat(tdate, goalType)}</label>
					<select defaultValue={rate} className="form-control" ref="rate">
						{['',1,2,3,4,5].map(function(val) {
										return <option value={val} key={val}>{val}</option>;
														   }
										)
						}
					</select>
					</div>;
		},

		buildMsg: function() {
				if(this.state.msgProps) {
						return <Modal {...this.state.msgProps} />;
				}
		}
});

module.exports = DiaryForm;
