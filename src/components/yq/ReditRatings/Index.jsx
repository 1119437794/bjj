/**
 * 企业信用评级
 */
import React, { Component }from "react"
import { observer }from "mobx-react"
import { observable,autorun, transaction} from 'mobx';
import { Link} from "react-router"
import PagingComponent from '../common/pagingComponent'
import DrawDownBox from '../common/drawDownBox'
import ClassificationChart from './ClassificationChart'
import AreaChart from './AreaChart'
import {ajax,getPercentage} from '../../../common/plugins'
// var _autorun;
@observer class ReditRatings extends Component {

	componentWillMount() {
		this.getAreaList();
	}
	_autorun = null;
	@observable state = {//请求参数
		orderBy:'desc',//排序方式
		pageNum:1,//页码
		areaCode:'',//区域名称
		level:'',//级别
		pageSize:10//每页记录数
	}
	@observable backData = {//返回的参数
		areaList:'',//区域列表
		pages:'',//企业名单总页数
		total:'',//企业名单总记录数
		lists:''//企业名单返回列表
	}
	componentDidMount(){
			this._autorun = autorun(() => {
				if(this.state){
					this.getCompangList();
				}
			})
	}
	componentWillUnmount(){		
		// console.log(_autorun);
		this._autorun();
	}
	/*
	 * 获取区域列表
	 */
	getAreaList(){
		let _this = this;
		ajax({
			url:"/areas",
			type:"GET",
			data:{
				token:sessionStorage.token
			},
			success(data){
				_this.backData.areaList = data;
			}
		})
	}
	/*
	 *获取企业名单
	 */
	getCompangList(){
		let _this = this;
		if(!this.state.pageNum){
			return;
		}
		ajax({
			url:'/creditCompanies',
			type:"GET",			
			data:{
				areaCode:this.state.areaCode,
				level:this.state.level,
				orderBy:this.state.orderBy,
				pageNum:this.state.pageNum,
				pageSize:this.state.pageSize,
				token:sessionStorage.token
			},
			success(data){
				_this.backData.lists = data.list;
				_this.backData.pages = +data.pages;
				_this.backData.total = data.total;
			}
		})
	}
	/*
	 *选择等级
	 */
	choiceLeave(ev){
		if(ev.target.textContent=="全部"){
			this.state.level = ""
		} else {
			this.state.level = ev.target.textContent;
		}		
	}
	/*
	 * 选择区域
	 */
	choiceArea(areaCode,ev){
		$('.area-name').removeClass('active');
		$(ev.target).addClass('active');
		this.state.areaCode = areaCode;
	}
	/*
	 *选择排列方式
	 */
	choiceOrderType(val){
		if(val=='风险指数从高到低排列'){
			this.state.orderBy='desc'
		} else {
			this.state.orderBy='asc'
		}
	}
	/*
	 *选择第几页
	 */
	choicePageNum(val){
		this.state.pageNum = +val;
	}
	/*
	 *选择显示条数
	 */
	choiceItem(val){
		switch (val){
			case '10条':
				this.state.pageSize = 10;
				break;
			case '20条':
				this.state.pageSize = 20;
				break;
			case '30条':
				this.state.pageSize = 30;
				break;
			default:
				break;
		}

	}
	render(){
		let riskInedxList = ['风险指数从高到低排列','风险指数从低到高排列'];
		let pageItems = ['10条','20条','30条'];
		return (<div id="redit-ratings">
					<div className="title">北京地区企业信用评级概况</div>
					<div className="choice-level">
						<span className="label-name">等级：</span>
						<span onClick={this.choiceLeave.bind(this)} className= {this.state.level=='' ? 'leave-name active' :'leave-name'}>全部</span><span onClick={this.choiceLeave.bind(this)} className= {this.state.level=='A' ? 'leave-name active' :'leave-name'}>A</span><span onClick={this.choiceLeave.bind(this)} className={this.state.level=='B' ? 'leave-name active' :'leave-name'}>B</span><span onClick={this.choiceLeave.bind(this)} className={this.state.level=='C' ? 'leave-name active' :'leave-name'}>C</span><span onClick={this.choiceLeave.bind(this)} className={this.state.level=='D' ? 'leave-name active' :'leave-name'}>D</span>
					</div>
					<div className="choice-area">
						<span className="label-name">区域：</span>
						<span onClick={this.choiceArea.bind(this,'')} className='area-name active'>全部</span>
						{
							this.backData.areaList && this.backData.areaList.map(function(item,index){
								return <span key={index} onClick={this.choiceArea.bind(this,item.areaCode)} className={index==0?'area-name':'area-name'}>{item.areaName}</span>
							}.bind(this))
						}
					</div>
					<div className="company-name">
						<div className="company-name-label">企业名单</div>
						<div className="risk-selection">
							<DrawDownBox showData={riskInedxList} realData={riskInedxList} callback={this.choiceOrderType.bind(this)} type="select2" borderStyle="gray" />
						</div>
					</div>
					<div className="company-list-table">
						<div className="content-list">
							<table className="table">
								<tbody>
									<tr>
										<th style={{width:getPercentage(0.5/10)}}>序号</th>
										<th style={{width:getPercentage(4/10)}}>公司名称</th>
										<th style={{width:getPercentage(2/10)}}>BBD风险指数</th>
										<th style={{width:getPercentage(2/10)}}>操作</th></tr>
									{
										this.backData.lists ? this.backData.lists.map((item,index)=>{
										return (<tr key={index}>
												<td>{(this.state.pageNum-1)*this.state.pageSize+index+1}</td>
												<td>{item.companyName}{item.favoriteId?<img className="is-favorite" src="/imgs/five-star1.png" />:''}</td>
												<td>{item.staticRiskIndex.toFixed(1)}</td>
												<td className="show-more"><Link to={{ pathname:"/intermediaryMonitoring/companyinfo/" + item.id}}>更多</Link></td></tr>)
									}):<tr></tr>
									}
								</tbody>
							</table>
						</div>
						<div className="choice-item">
							<DrawDownBox showData={pageItems} realData={pageItems} type="select1" borderStyle="gray" callback={this.choiceItem.bind(this)} />
							<span className="item-num">共<span className="red">{this.backData.total}</span>条</span>
						</div>
						<div className="choice-page">
						{
							this.backData.pages>1 ? <PagingComponent totalNum={this.backData.pages} callback={this.choicePageNum.bind(this)} /> : ''
						}
						</div>
					</div>
					<div className="clearfix chart-box">
						<ClassificationChart /><AreaChart />
					</div>
				</div>)
	}
}
export default ReditRatings