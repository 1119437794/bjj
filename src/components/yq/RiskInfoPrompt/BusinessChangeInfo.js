/**
 * 工商变更信息
 */
import React, { Component }from "react"
import { observer }from "mobx-react"
import { observable,autorun } from 'mobx';
import {Link} from 'react-router'
import DrawDownBox from '../common/drawDownBox'
import PagingComponent from '../common/pagingComponent'
import {ajax,getPercentage} from '../../../common/plugins'
import FloatBox from '../common/floatBox'
import favAndDelfav from '../common/favAndDelfav'
import readMsg from '../common/readMsg'
import newMsgStore from '../../../stores/yq/newMsgStore'
import setReadedStatus from "../common/setReadedStatus"
import BeijingOrnot from "../../BeijingOrnot/BeijingOrnot"

// 导出数据
import exportExcelStore from "../../../stores/yq/exportExcelStore"


@observer class BusinessChangeInfo extends Component {
	@observable requestData = {
		pageNum:"",
		pageSize:10,
		changeItems:null
	}
	@observable state = {
		lists:"",//数据列表
		pages:"",//总页数
		total:"",//总记录数
		newProps:"",//保证每次修改的props传进来都能获取到最新的数据
		checkNum:0,//已选个数
		selectedCompany:[]//已选择的ids,用来标为已读
	}		
	componentWillReceiveProps(nextProps){//确保三个参数传进来只请求一次数据
		if(this.props.paramObj.startTime!=nextProps.paramObj.startTime || this.props.paramObj.endTime!=nextProps.paramObj.endTime || this.props.paramObj.keyword!=nextProps.paramObj.keyword){

			if(this.props.paramObj.keyword!=nextProps.paramObj.keyword){
				this.requestData.pageNum = 1;
			}
			this.newProps = nextProps;
			this.queryData();
		}
	}
	componentDidMount(){
		autorun(()=>{
			if(this.state.lists){
				$(".change-content").hover(function(){//文字展示不完的浮框展示
					$(this).children().show()
				},function(){
					$(this).children().hide()
				})				
			}
		})
		
	}
	changeFollow(id,isFav,ev){//收藏，取消收藏

		if($(ev.target).hasClass("favorited")){

			// 取消关注 有 关注id
			favAndDelfav(id.id, true, 'GSBJ', $(ev.target));
		} else {

			// 加关注 返回关注id
			favAndDelfav(id, false, 'GSBJ', $(ev.target));
		}
	}
	queryData(bjOrNot){//请求数据

		if(bjOrNot === undefined ){
			bjOrNot = this.bjOrNot === undefined ? {} : this.bjOrNot;
		}
		this.bjOrNot = bjOrNot;

		let ajaxData = Object.assign({}, {
			changeItems:this.requestData.changeItems,
			dateRangeBegin:this.newProps ? this.newProps.paramObj.startTime :this.props.paramObj.startTime,//起始时间，保证每次都是最新的props
			dateRangeEnd:this.newProps ? this.newProps.paramObj.endTime :this.props.paramObj.endTime,//结束时间
			keyword:this.newProps ? this.newProps.paramObj.keyword :this.props.paramObj.keyword,//公司名称关键字
			pageNum:this.requestData.pageNum,//页码
			pageSize:this.requestData.pageSize,//每页记录数
			token:sessionStorage.token
		}, this.bjOrNot);

		ajax({
			url:"/riskinfo/registrationChangeList",
			data: ajaxData,
			success: (data)=>{

				exportExcelStore.setData(Object.assign({}, ajaxData, {url: "/riskinfo/registrationChangeListExp"}));

				this.state.lists = data.list;
				this.state.pages = data.pages;
				this.state.total = data.total;
			}
		})

	}
	flip(val){//选择第几页
		if(this.requestData.pageNum==val){
			return;
		}
		this.requestData.pageNum = +val;
		this.queryData();
		$("input[type=checkbox]")[0].checked=false;//单选框设为未选状态
		this.allQuery();
	}
	choiceItems(val){//选择一页显示多少条
		this.requestData.pageSize = val;
		this.requestData.pageNum = 1;
		this.queryData();
		$("input[type=checkbox]")[0].checked=false;//单选框设为未选状态
		this.allQuery();
	}
	screeningConditions(val){//筛选条件的选择
		if(val=='全部'){
			this.requestData.changeItems=null;			
		} else {
			this.requestData.changeItems = val;
		}

		/*
		* 通知到store里bussinessChangeItem发生变化
		* 重新请求未读消息接口
		* */
		newMsgStore.setBussinessChangeItem(this.requestData.changeItems);

		this.requestData.pageNum = 1;
		this.requestData.pageSize = 10;
		this.queryData();
		$("input[type=checkbox]")[0].checked=false;//取消所有选择
		this.allQuery()//同上	
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
		if(!$(ev.target).hasClass('btn-active')){//如果未选择任何数据，不作处理
			return;
		}
		$.when(readMsg(this.state.selectedCompany.join(','),1)).done(()=>{//当设为已读的接口请求数据请求成功，做以下处理
			this.queryData();//重新获取列表数据
			$("input[type=checkbox]")[0].checked=false;//取消所有选择
			this.allQuery()//同上			
			newMsgStore.queryData();//刷新新消息提示
		})		
		
	}

	render(){
		let filterLists=[
		'全部','董监高备案变更','经营范围变更','法定代表人变更','注册资本变更',
		'企业地址变更','投资人（股权）变更','企业类型变更',
		'企业名称变更','认缴（实缴）资本变更','章程备案变更','其他类型变更','分支机构变更'
		];
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
			<div className="search-box">
				<DrawDownBox
					showData={filterLists}
					realData={filterLists}
					type="select1"
					borderStyle="gray"
					callback = {this.screeningConditions.bind(this)}/>
			</div>

				{
					this.state.lists && this.state.lists.length==0 ? <div className="no-data">未根据关键字搜索到相应企业!</div> :
						(
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
									<th style={{width:getPercentage(1.5/10)}}>企业名称</th>
									<th style={{width:getPercentage(1/10)}}>变更日期</th>
									<th style={{width:getPercentage(1.5/10)}}>变更事项</th>
									<th style={{width:getPercentage(1.5/10)}}>变更前</th>
									<th style={{width:getPercentage(1.5/10)}}>变更后</th>
									<th style={{width:getPercentage(0.5/10)}} className="fav">收藏</th>
								</tr>
								{
									this.state.lists ? this.state.lists.map((item,index) => {
										var isBold = item.read ? 'normal':'bold' 
										return (
										<tr key={index} style={{fontWeight:isBold}}>
											<td className="check-box">
												<input onClick={this.singleBox.bind(this)} type="checkbox" value={item.id} />
											</td>
											<td>{(this.requestData.pageNum-1)*this.requestData.pageSize+index+1}</td>
											<td>
												<a onClick={() => {setReadedStatus(item.id, 1, item.companyId)}} style={{cursor: "pointer"}}>{item.companyName || '-'}</a>
												{/*<Link to={{ pathname:"/intermediaryMonitoring/companyinfo/" + item.companyId}}>{item.companyName || '-'}</Link>*/}
											</td>
											<td>{item.changeDate || '-'}</td>
											<td>{item.changeItems || '-'}</td>
											<td className="change-content">{item.contentBeforeChange.length > 35 ? item.contentBeforeChange.slice(0, 35)+'...':item.contentBeforeChange}
											{item.contentBeforeChange.length > 35 ? <FloatBox>{item.contentBeforeChange}</FloatBox> : ''}
											</td>
											<td className="change-content">{item.contentAfterChange.length > 35 ? item.contentAfterChange.slice(0, 35)+'...':item.contentAfterChange}
											{item.contentAfterChange.length > 35 ? <FloatBox>{item.contentAfterChange}</FloatBox> : ''}
											</td>
											{/* 使用key 强制render */}
											<td key={item.id} className={item.favorite ? "has-favorite favorited" :"has-favorite"} onClick={this.changeFollow.bind(this, item, item.favorite)}></td>
										</tr>
										)
									}) : <tr></tr>
								}						
								
							</tbody>
						</table>
						<div className="choice-item">
							<DrawDownBox
								type="select1"
								showData= {lists}
								realData= {[10, 20, 30]}
								borderStyle="gray"
								current={this.requestData.pageSize}
								callback={this.choiceItems.bind(this)}
							/>
							<span className="item-num">共<span className="red">{this.state.total}</span>条</span>
						</div>
						<div className="choice-page">
							<PagingComponent totalNum={this.state.pages} callback={this.flip.bind(this)} />
						</div>
					</div>)					
				}								
			</div>)
	}
}
export default BusinessChangeInfo