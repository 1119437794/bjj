/**
 * 失信人信息
 */
import React, { Component }from "react"
import { observer }from "mobx-react"
import { observable,autorun } from 'mobx';
import {Link} from 'react-router'
import DrawDownBox from '../common/drawDownBox'
import PagingComponent from '../common/pagingComponent'
import {ajax,getPercentage} from '../../../common/plugins'
import favAndDelfav from '../common/favAndDelfav'
import readMsg from '../common/readMsg'
import newMsgStore from '../../../stores/yq/newMsgStore'
import setReadedStatus from "../common/setReadedStatus"

import exportExcelStore from "../../../stores/yq/exportExcelStore"
import BeijingOrnot from "../../BeijingOrnot/BeijingOrnot"

@observer class DishonestPeople extends Component {
	@observable state = {
		isShowDetails:false,
		pageNum:"",//页码
		pageSize:10,//每页显示量
		newProps:"",
		checkNum:0,
		selectedCompany:[]
	}
	@observable requestData = {
		total:"",//总记录数
		pages:"",//总页数
		backList:""//返回列表
		
	}
	
	componentWillReceiveProps(nextProps){
		if(this.props.paramObj.startTime!=nextProps.paramObj.startTime || this.props.paramObj.endTime!=nextProps.paramObj.endTime || this.props.paramObj.keyword!=nextProps.paramObj.keyword){

			if(this.props.paramObj.keyword!=nextProps.paramObj.keyword){
				this.state.pageNum = 1;
			}

			this.newProps = nextProps;
			this.queryListData();
		}
	}	

	queryListData(bjOrNot){//请求列表数据
		let _this = this;
		if(bjOrNot === undefined ){
			bjOrNot = this.bjOrNot === undefined ? {} : this.bjOrNot;
		}
		this.bjOrNot = bjOrNot;

		let ajaxData = Object.assign({}, {
			dateRangeBegin:this.newProps ? this.newProps.paramObj.startTime :this.props.paramObj.startTime,//起始时间
			dateRangeEnd:this.newProps ? this.newProps.paramObj.endTime :this.props.paramObj.endTime,//结束时间
			keyword:this.newProps ? this.newProps.paramObj.keyword :this.props.paramObj.keyword,//公司名称关键字
			pageNum:this.state.pageNum,
			pageSize:this.state.pageSize,
			token:sessionStorage.token
		}, this.bjOrNot);

		ajax({
			url:"/riskinfo/dishonestyList",
			data:ajaxData,
			success: (data)=>{

				exportExcelStore.setData(Object.assign({}, ajaxData, {url: "/riskinfo/dishonestyListExp"}));

				_this.requestData.total = data.total;
				_this.requestData.pages = data.pages;
				_this.requestData.backList = data.list;
			}

		})
	}

	// 收藏，取消收藏
	changeFollow(id,isFav,ev){//收藏，取消收藏

		if($(ev.target).hasClass("favorited")){

			// 取消关注 有 关注id
			favAndDelfav(id.id, true, 'SXRXX', $(ev.target));
		} else {

			// 加关注 返回关注id
			favAndDelfav(id, false, 'SXRXX', $(ev.target));
		}
	}	
	showDetails(){//点击详情显示细节
		this.state.isShowDetails = true;
	}
	hideDetails(){
		this.state.isShowDetails=false;
	}
	choicePage(val){//选择第几页
		if(this.state.pageNum == +val){
			return;
		}
		this.state.pageNum = +val;
		this.queryListData();
		$("input[type=checkbox]")[0].checked=false;//单选框设为未选状态
		this.allQuery();
	}
	choiceItem(val){//选择页面显示条数		
		this.state.pageSize = +val.slice(0,-1);
		this.state.pageNum = 1;
		this.queryListData();
		$("input[type=checkbox]")[0].checked=false;//单选框设为未选状态
		this.allQuery();
		
	}
	singleBox(ev){//单选
		if(ev.target.checked){
			this.state.checkNum = this.state.checkNum+1;
			this.state.selectedCompany.push(ev.target.value);

		} else {
			$(".select-all").find("input").prop("checked", false);
			this.state.checkNum = this.state.checkNum-1;
			this.state.selectedCompany.remove(ev.target.value);
		}
	}
	allQuery(){//选择全部
		if($("input[type=checkbox]")[0].checked){//点击按钮返回所有个数
			this.state.checkNum = $("input[type=checkbox]").length-1
		} else {
			this.state.checkNum = 0
		}
		$("input[type=checkbox]").map(function(index,item){//分别对单选框做处理
			if(index!=0){
				if($("input[type=checkbox]")[0].checked){
					item.checked=true;
					this.state.selectedCompany.push(item.value);
				} else {
					this.state.selectedCompany.remove(item.value);
					item.checked=false;
				}
			}
		}.bind(this))
	}
	setRead(ev){//标为已读		
		if(!$(ev.target).hasClass('btn-active')){
			return;
		}
		$.when(readMsg(this.state.selectedCompany.join(','),4)).done(()=>{
			this.queryListData();
			$("input[type=checkbox]")[0].checked=false;//取消所有选择
			this.allQuery()
			newMsgStore.queryData();
		})		
		
	}
	render(){
		let lists=['10条','20条','30条']
		return (
			<div className="content-body">
				<BeijingOrnot
					showTabIndexArr={[0,1,2,3,5]}
					callback={(type) => {
						this.queryListData(type);
						this.state.selectedCompany = [];
						$("input[type=checkbox]")[0].checked=false;//单选框设为未选状态
						this.allQuery();
					}}
				/>
			{
				this.requestData.backList && this.requestData.backList.length==0?<div className="no-data">未根据关键字搜索到相应企业！</div>:
				<div>
					<div className="header clearfix">
						<div className="bolder select-all"><input type="checkbox" value="n" onClick={this.allQuery.bind(this)} />全选</div>
						<div className="bolder">已选<span className="red">{this.state.checkNum}</span>条</div>							
						<div className="btn-box"><span className={this.state.checkNum==0 ? 'btn' : 'btn btn-active'} onClick={this.setRead.bind(this)}>标为已读</span></div>
					</div>
					<table className="table">
						<tbody>
						<tr className="table-title">
							<th style={{width:getPercentage(0.5/10)}}></th>
							<th style={{width:getPercentage(0.5/10)}}>序号</th>
							<th style={{width:getPercentage(2/10)}}>企业名称</th>
							<th style={{width:getPercentage(1/10)}}>立案时间</th>
							<th style={{width:getPercentage(0.5/10)}}>案号</th>
							<th style={{width:getPercentage(1.5/10)}}>执行依据文号</th>
							<th style={{width:getPercentage(1.5/10)}}>执行法院</th>
							<th style={{width:getPercentage(1/10)}}>被执行人履行情况</th>
							<th style={{width:getPercentage(0.5/10)}} className="fav">收藏</th>
						</tr>
						{
							this.requestData.backList ? this.requestData.backList.map((item,index) => {

								var isBold = item.read ? 'normal':'bold';
								return (
									<tr key={index} style={{fontWeight:isBold}}>
										<td className="check-box"><input onClick={this.singleBox.bind(this)} type="checkbox" value={item.id} /></td>
										<td>{(this.state.pageNum-1)*this.state.pageSize+index+1}</td>
										<td><a onClick={() => {setReadedStatus(item.id, 4, item.companyId)}} style={{cursor: "pointer"}}>{item.companyName || '-'}</a></td>
										<td>{item.caseCreateTime || '-'}</td>
										<td>{item.casecode || '-'}</td>
										<td>{item.exeCode || '-'}</td>
										<td>{item.execCourtName || '-'}</td>
										<td>{item.performDegree || '-'}</td>
										{/* 使用key 强制render */}
										<td key={item.id} className={item.favorite ? "has-favorite favorited" :"has-favorite"} onClick={this.changeFollow.bind(this, item, item.favorite)}></td>
									</tr>
								)
							}) : null
						}					
						
						</tbody>
					</table>
					<div className="choice-item">
						<DrawDownBox  type="select1" showData= {lists} realData= {lists} borderStyle="gray" callback = {this.choiceItem.bind(this)}/>
						<span className="item-num">共<span className="red">{this.requestData.total}</span>条</span>
					</div>
					<div className="choice-page">
						<PagingComponent totalNum={this.requestData.pages} callback={this.choicePage.bind(this)} />
					</div>
				</div>
			}
				
			</div>)
	}
}
export default DishonestPeople;