/**
 * 许可证期限提醒
 */
import React, { Component }from "react"
import { observer }from "mobx-react"
import { observable,autorun } from 'mobx';
import {Link} from 'react-router'
import DrawDownBox from '../common/drawDownBox'
import PagingComponent from '../common/pagingComponent'
import {ajax,standardTimeToDate,getPercentage} from '../../../common/plugins'
import setReadedStatus from "../common/setReadedStatus"

import exportExcelStore from "../../../stores/yq/exportExcelStore"
import BeijingOrnot from "../../BeijingOrnot/BeijingOrnot"

@observer class LicenceTimeRemind extends Component {

	@observable state = {
		lists:"",
		pages:"",
		total:"",		
		newProps:""
	}

	@observable requestData = {
		pageNum:"",
		pageSize:10
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

	componentDidMount(){
		let _this = this;
		$(".filter-label").on('click',function(){
			$(".filter-label").removeClass('filter-active');			
			$(this).addClass('filter-active');
		})
	}

	queryData(bjOrNot){//查询接口数据

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
			orderBy:'expireDate',
			descAsc:"asc",
			token:sessionStorage.token
		}, this.bjOrNot);

		ajax({
			url: "/riskinfo/licenceExpireList",
			type: "GET",
			data: ajaxData,
			success: (data)=>{

				exportExcelStore.setData(Object.assign({}, ajaxData, {url: "/riskinfo/licenceExpireListExp"}));

				this.state.lists = data.list;
				this.state.pages = data.pages;
				this.state.total = data.total;				
			}
		})
	}
	dateToDay(date){//计算间隔时间

		let newDay = (new Date(date.replace(/-/g,"/")).getTime() - new  Date().getTime())/(24*60*60*1000);
		return parseInt(newDay+1);
	}
	choiceItems(val){//选择一页显示多少条
		this.requestData.pageSize = +val.slice(0, -1);
		this.requestData.pageNum = 1;
		this.queryData();
	}
	choicePages(val){//选择页码
		if(this.requestData.pageNum ==val){
			return;
		}
		this.requestData.pageNum = +val
		this.queryData();
	}
	render(){
		let lists=['10条','20条','30条']
		let dateArr=[]
		return (
			<div className="content-body">
				<BeijingOrnot
					showTabIndexArr={[0,1,2]}
					callback={(type) => {
						this.queryData(type);
						this.state.selectedCompany = [];
						this.allQuery();
					}}
				/>
			{
				this.state.lists && this.state.lists.length==0 ? <div className="no-data">未根据关键字搜索到相应企业！</div>:
				<div>
					<table className="table">
						<tbody>
						<tr className="table-title">
							<th style={{width:getPercentage(1/10)}}>序号</th>
							<th style={{width:getPercentage(2/10)}}>企业名称</th>
							<th style={{width:getPercentage(1/10)}}>注册时间</th>
							<th style={{width:getPercentage(1/10)}}>法定代表人</th>
							<th style={{width:getPercentage(1/10)}}>注册资本</th>
							<th style={{width:getPercentage(2/10)}}>登记机关</th>
							<th style={{width:getPercentage(1/10)}}>到期天数</th>
							<th style={{width:getPercentage(1/10)}}>到期时间</th>							
						</tr>
						{
							this.state.lists ? this.state.lists.map((item,index)=>{								
								dateArr.push(this.dateToDay(item.expireDate) || '')
								return (
									<tr key={index}>
										<td>{(this.requestData.pageNum-1)*this.requestData.pageSize+index+1}</td>
										<td><a style={{cursor: "pointer"}} href={`#/intermediaryMonitoring/companyinfo/${item.companyId}`}>{item.companyName || '-'}</a></td>
										<td>{item.establishDate || '-'}</td>
										<td>{item.frname || '-'}</td>
										<td>{item.regcap || '-'}</td>
										<td>{item.regorg || '-'}</td>
										<td>{dateArr[index]<0 ? -dateArr[index]+'(已到期天数)' : dateArr[index] || '0'}</td>
										<td>{item.expireDate || '-'}</td>
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
						<PagingComponent totalNum = {this.state.pages} callback={this.choicePages.bind(this)}/>
					</div>
				</div>
			}	
			</div>)
	}
}
export default LicenceTimeRemind;
