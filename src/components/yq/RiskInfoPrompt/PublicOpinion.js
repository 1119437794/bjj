/**
 * 舆情信息
 */
import React, { Component }from "react"
import { observer }from "mobx-react"
import { observable,autorun } from 'mobx';
import DrawDownBox from '../common/drawDownBox'
import PagingComponent from '../common/pagingComponent'
import {ajax,getPercentage} from '../../../common/plugins'
import exportExcelStore from "../../../stores/yq/exportExcelStore"
import BeijingOrnot from "../../BeijingOrnot/BeijingOrnot"

@observer class PublicOpinion extends Component {
	@observable state = {
		lists:"",
		pages:"",
		total:"",
		newProps:""
	}
	@observable requestData = {
		pageNum:1,
		pageSize:10
	}
	componentWillMount(){
		this.queryData()
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
			url:"/riskinfo/opinionInfoList",
			type:"GET",
			data: ajaxData,
			success: (data)=>{
				exportExcelStore.setData(Object.assign({}, ajaxData, {url: "/riskinfo/opinionInfoListExp"}));

				_this.state.lists = data.list;
				_this.state.pages = data.pages;
				_this.state.total = data.total;
			}
		})
	}
	choiceItems(val){//选择显示多少条
		this.requestData.pageSize = +val.slice(0, -1)
		this.requestData.pageNum = 1;
		this.queryData();
	}
	choicePages(val){//选择页码

		if(this.requestData.pageNum == +val){
			return;
		}
		this.requestData.pageNum = +val;
		this.queryData();
		$("input[type=checkbox]")[0].checked=false;//单选框设为未选状态
		this.allQuery();
	}
	render(){

		let lists=['10条','20条','30条'];

		return (
			<div className="content-body">
				<BeijingOrnot
					showTabIndexArr={[0,1,2,3,5]}
					callback={(type) => {
						this.queryData(type);
						this.state.selectedCompany = [];
						this.allQuery();
					}}
				/>
				{
					this.state.lists && this.state.lists.length==0?<div className="no-data">未根据关键字搜索到相应企业！</div>:
					<div>
						<table className="table">
							<tbody>					
							<tr className="table-title">
								<th style={{width:getPercentage(0.5/10)}}>序号</th>
								<th style={{width:getPercentage(2.5/10)}}>标题</th>								
								<th style={{width:getPercentage(2.5/10)}}>相关企业名称</th>
								<th style={{width:getPercentage(2.5/10)}}>信息来源</th>
								<th style={{width:getPercentage(1/10)}}>发布时间</th>
							</tr>
							{
								this.state.lists ? this.state.lists.map((item,index)=>{
										var isBold = item.read ? 'normal':'bold';
										return (
										<tr key={index} style={{fontWeight:isBold}}>
											<td>{(this.requestData.pageNum-1)*this.requestData.pageSize+index+1}</td>
											<td className="info-title"><a href={item.bbdUrl} className="public-opinion-title" target="_blank">{item.title || '-'}</a></td>
											<td>{item.companyName || "-"}</td>
											<td>{item.source || "-"}</td>
											<td>{item.pubdate || '-'}</td>
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
							<PagingComponent totalNum={this.state.pages} callback={this.choicePages.bind(this)} />
						</div>
					</div>
				}
				
				
			</div>)
	}
}
export default PublicOpinion;
