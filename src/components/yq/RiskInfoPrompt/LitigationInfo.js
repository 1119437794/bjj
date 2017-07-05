/**
 * 诉讼信息
 */
import React, { Component }from "react"
import { observer }from "mobx-react"
import { observable,autorun } from 'mobx';
import {Link} from 'react-router'
import DrawDownBox from '../common/drawDownBox'
import PagingComponent from '../common/pagingComponent'
import DetailsPopup from '../common/detailsPopup'
import {ajax,getPercentage} from '../../../common/plugins'
import favAndDelfav from '../common/favAndDelfav'
import popupStore from '../../../stores/yq/popupStore'
import readMsg from '../common/readMsg'
import newMsgStore from '../../../stores/yq/newMsgStore'
import setReadedStatus from "../common/setReadedStatus"

import exportExcelStore from "../../../stores/yq/exportExcelStore"
import BeijingOrnot from "../../BeijingOrnot/BeijingOrnot"

@observer class LitigationInfo extends Component {	
	@observable state = {
		// isShowDetails:false,
		lists:"",
		pages:"",
		total:"",
		newProps:"",
		checkNum:0,
		selectedCompany:[]
	}
	@observable requestData = {
		pageNum:"",
		pageSize:10
	}
	@observable alertData = {
		title:"",
		content:"",
		casecode:"",
		childTitle:""
	}
	componentWillMount(){
		// autorun(()=>{
		// 	this.queryData()
		// })
	}
	componentWillReceiveProps(nextProps){
		if(this.props.paramObj.startTime!=nextProps.paramObj.startTime || this.props.paramObj.endTime!=nextProps.paramObj.endTime || this.props.paramObj.keyword!=nextProps.paramObj.keyword){
			if(this.props.paramObj.keyword!=nextProps.paramObj.keyword){
				this.requestData.pageNum = 1;
			}
			this.newProps = nextProps;
			this.queryData();
		}
	}
	changeFollow(id,isFav,ev){//收藏，取消收藏

		if($(ev.target).hasClass("favorited")){

			// 取消关注 有 关注id
			favAndDelfav(id.id, true, 'SSXX', $(ev.target));
		} else {

			// 加关注 返回关注id
			favAndDelfav(id, false, 'SSXX', $(ev.target));
		}
	}
	showDetails(title,content,casecode,childTitle){//点击详情显示细节
		this.alertData.title=title;
		this.alertData.content=content;
		this.alertData.casecode=casecode;
		this.alertData.childTitle=childTitle
		popupStore.setDisplay('block')
	}
	
	queryData(bjOrNot){//查询接口数据
		let _this = this;

		if(bjOrNot === undefined ){
			bjOrNot = this.bjOrNot === undefined ? {} : this.bjOrNot;
		}
		this.bjOrNot = bjOrNot;

		let ajaxData = Object.assign({}, {
			dateRangeBegin:this.newProps ? this.newProps.paramObj.startTime :this.props.paramObj.startTime,//起始时间
			dateRangeEnd:this.newProps ? this.newProps.paramObj.endTime :this.props.paramObj.endTime,//结束时间
			keyword:this.newProps ? this.newProps.paramObj.keyword :this.props.paramObj.keyword,//公司名称关键字
			pageNum:this.requestData.pageNum,//页码
			pageSize:this.requestData.pageSize,//每页记录数
			token:sessionStorage.token
		}, this.bjOrNot);

		ajax({
			url:"/riskinfo/lawsuitInfoList",
			type:"GET",
			data:ajaxData,
			success: (data)=>{

				exportExcelStore.setData(Object.assign({}, ajaxData, {url: "/riskinfo/lawsuitInfoListExp"}));

				_this.state.lists = data.list;
				_this.state.pages = data.pages;
				_this.state.total = data.total;
			}
		})
	}
	choiceItems(val){//显示条数
		this.requestData.pageSize = +val.slice(0, -1)
		this.requestData.pageNum = 1;
		this.queryData();
        $("input[type=checkbox]")[0].checked=false;//单选框设为未选状态
        this.allQuery();
	}
	choicePages(val){//页码
		if(this.requestData.pageNum == +val){
			return;
		}
		this.requestData.pageNum = +val
		this.queryData()
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
		$.when(readMsg(this.state.selectedCompany.join(','),7)).done(()=>{
			this.queryData();
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
						this.queryData(type);
						this.state.selectedCompany = [];
						$("input[type=checkbox]")[0].checked=false;//单选框设为未选状态
						this.allQuery();
					}}
				/>
			{
				this.state.lists && this.state.lists.length==0?<div className="no-data">未根据关键字搜索到相应企业！</div>:
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
							<th style={{width:getPercentage(1/10)}}>判决时间</th>
							<th style={{width:getPercentage(1/10)}}>身份</th>
							<th style={{width:getPercentage(4/10)}}>详情</th>
							<th style={{width:getPercentage(1/10)}} className="fav">收藏</th>
						</tr>
						{
							this.state.lists ? this.state.lists.map((item,index)=>{

								var isBold = item.read ? 'normal':'bold';

								return (
								<tr key={index} style={{fontWeight:isBold}}>
									<td className="check-box"><input onClick={this.singleBox.bind(this)} type="checkbox" value={item.id} /></td>
									<td>{(this.requestData.pageNum-1)*this.requestData.pageSize+index+1}</td>
									<td><a onClick={() => {setReadedStatus(item.id, 7, item.companyId)}} style={{cursor: "pointer"}}>{item.companyName || '-'}</a></td>
									<td>{item.sentenceDate.slice(0,10) || '-'}</td>
									<td>{item.identity==1 ? '原告':'被告'}</td>
									<td><span className="details" onClick={this.showDetails.bind(this,item.title,item.main,item.casecode,item.docType)}>{(item.title + '(' + item.main + ')').length>30 ? (item.title + '(' + item.main + ')').slice(0, 30)+'...':(item.title + '(' + item.main + ')')}</span></td>
									{/* 使用key 强制render */}
									<td key={item.id} className={item.favorite ? "has-favorite favorited" :"has-favorite"} onClick={this.changeFollow.bind(this, item, item.favorite)}></td>
								</tr>
								)
							}):<tr></tr>
						}
						
						
						</tbody>
					</table>
					<div className="choice-item">
						<DrawDownBox  type="select1" showData= {lists} realData= {lists} borderStyle="gray" callback={this.choiceItems.bind(this)}/>
						<span className="item-num">共<span className="red">{this.state.total}</span>条</span>
					</div>
					<div className="choice-page">
						<PagingComponent totalNum={this.state.pages} callback={this.choicePages.bind(this)}/>
					</div>
				</div>
			}				
				<DetailsPopup
					title={this.alertData.title}
					content={this.alertData.content}
					casecode = {this.alertData.casecode}
					childTitle={this.alertData.childTitle} />
				
			</div>)
	}
}
export default LitigationInfo;