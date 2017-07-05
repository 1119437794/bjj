/**
 * 风险信息提示平台
 */
import React, { Component }from "react"
import { observer}from "mobx-react"
import { observable, observe} from 'mobx';
import OptionBtn from '../common/optionBtn'
import SelectTwoDate from '../../yxc/SelectTwoDate'
import BusinessChangeInfo from './BusinessChangeInfo'//工商变更信息
import AdminSanction from './AdminSanction'//工商变更信息
import LitigationInfo from './LitigationInfo'//诉讼信息
import DishonestPeople from './DishonestPeople'//失信人信息
import OperatingAnomalies from './OperatingAnomalies'//经营异常
import NewBranch from './NewBranch'//新增分支机构
import LicenceTimeRemind from './LicenceTimeRemind'//许可证期限提醒
import PublicOpinion from './PublicOpinion'//舆情信息
import selectDate from '../../../stores/yxc/selectDateStore.js'//日期选项
import {standardTimeToDate, ajax} from '../../../common/plugins'
import newMsgStore from '../../../stores/yq/newMsgStore'
import exportExcelStore from "../../../stores/yq/exportExcelStore"

@observer class RiskInfoPrompt extends Component {

	@observable state = {
		pageNum:1,
		isViewArr:[]
	};
	@observable paramObj = {
		startTime:null,
		endTime:null,
		keyword:(this.refs && this.refs.theInput) ? this.refs.theInput.value : null
	}

	disposeObserve = null

	componentWillMount(){

		// 页面加载，默认查询所有未读消息
		newMsgStore.queryData();

		/*
		 * 监听到store里bussinessChangeItem发生变化
		 * 重新请求未读消息接口
		 * 销毁observe 避免干扰
		 * */
		this.disposeObserve = observe(newMsgStore, "bussinessChangeItem", () => {

			newMsgStore.queryData({
				keyword : this.refs.theInput.value.trim(),
				changeItems: newMsgStore.bussinessChangeItem,

				startTime : standardTimeToDate(selectDate.date1_value),
				endTime : standardTimeToDate(selectDate.date2_value)
			});
		});
	}
	componentDidMount(){
		$(".option-btn").first().addClass('active')
	}
	componentWillUnmount(){
		this.state.pageNum=1;//每次切换回来，还是显示第一个页面
		this.disposeObserve();
	}	
	
	switchPage(param,ev){
		if(!$(ev.target).hasClass('option-btn')){
			return;
		}
		$(".option-btn").removeClass('active');
		$(ev.target).addClass('active');
		this.state.pageNum = param;
	}
	/*点击查询按钮*/
	queryCompany(){
		this.paramObj = {
			startTime : standardTimeToDate(selectDate.date1_value),
			endTime : standardTimeToDate(selectDate.date2_value),
			keyword : this.refs.theInput.value.trim()
		}

		// 重新获取未读消息数量
		newMsgStore.queryData({
			keyword: this.paramObj.keyword,
			changeItems: newMsgStore.bussinessChangeItem,
			dateRangeBegin: this.paramObj.startTime,
			dateRangeEnd: this.paramObj.endTime,
		});

		//this.paramObj.keyword = "";
		//this.refs["theInput"].value = "";
	}
	// 点击回车搜索
    handleKeyDown(e){
        if(e.keyCode == 13){
            this.queryCompany();
        }
    }


    /*
    * @method expotExcel 导出excel
    * */
	expotExcel(){
		//console.log(exportExcelStore);

	}

	render(){

		let activePage;
		switch(this.state.pageNum){
			case 1:
				activePage = <BusinessChangeInfo paramObj={this.paramObj} />
				break;
			case 2:
				activePage = <AdminSanction paramObj={this.paramObj}/>
				break;
			case 3:
				activePage = <LitigationInfo paramObj={this.paramObj}/>
				break;
			case 4:
				activePage = <DishonestPeople paramObj={this.paramObj} />
				break;
			case 5:
				activePage = <OperatingAnomalies paramObj={this.paramObj}/>
				break;
			case 6:
				activePage = <NewBranch paramObj={this.paramObj} />
				break;
			case 7:
				activePage = <LicenceTimeRemind paramObj={this.paramObj} />
				break;
			case 8:
				activePage = <PublicOpinion paramObj={this.paramObj}/>
				break;
		}

		let exportExcelStoreData = exportExcelStore.data;
		let exportExcelUrl = exportExcelStoreData.url + "?";
		delete exportExcelStoreData.url;
		for(let i in exportExcelStoreData){
			exportExcelUrl += `${i}=${exportExcelStoreData[i] || ""}&`
		}

		exportExcelUrl = exportExcelUrl.slice(0, -1);

		return (
			<div id="risk-info-prompt">
				<div className="top-search">
					<span className="date-filter">时间筛选</span>
					<SelectTwoDate />
					<div className="search-out-box fl">
						<input type="text" ref="theInput" placeholder="请输入查找风险信息的企业名称或企业关键字" onKeyDown={(e) => this.handleKeyDown(e)} maxLength="20" />
						<div className="search-btn" onClick={this.queryCompany.bind(this)}>查询</div>
					</div>

					<a
						className="top-search__excel"
						href={exportExcelUrl}
						target="_blank"
						download={exportExcelUrl}
					>导出excel</a>
				</div>
				<div className="option-group">
					<OptionBtn clickFun={this.switchPage.bind(this,1)} pictureUrl="/imgs/favorite-lab1.png" newMsg={newMsgStore.viewMsgArr[0]}>工商变更信息</OptionBtn>
					<OptionBtn clickFun={this.switchPage.bind(this,2)} pictureUrl="/imgs/admin-penalty.png" newMsg={newMsgStore.viewMsgArr[1]}>行政处罚信息</OptionBtn>
					<OptionBtn clickFun={this.switchPage.bind(this,3)} pictureUrl="/imgs/litigation-record.png" newMsg={newMsgStore.viewMsgArr[2]}>诉讼信息</OptionBtn>
					<OptionBtn clickFun={this.switchPage.bind(this,4)} pictureUrl="/imgs/dishonesty.png" newMsg={newMsgStore.viewMsgArr[3]}>失信人信息</OptionBtn>
					<OptionBtn clickFun={this.switchPage.bind(this,5)} pictureUrl="/imgs/abnormal-operation.png" newMsg={newMsgStore.viewMsgArr[4]}>经营异常信息</OptionBtn>
					<OptionBtn clickFun={this.switchPage.bind(this,6)} pictureUrl="/imgs/agency.png" newMsg={newMsgStore.viewMsgArr[5]}>新增分支机构</OptionBtn>
					{
						sessionStorage.areaName === "上海" ? null :
							<OptionBtn clickFun={this.switchPage.bind(this,7)} pictureUrl="/imgs/licence.png" newMsg={newMsgStore.viewMsgArr[6]}>许可证期限提醒</OptionBtn>
					}
					<OptionBtn clickFun={this.switchPage.bind(this,8)} pictureUrl="/imgs/company-info.png" newMsg={newMsgStore.viewMsgArr[7]}>舆情信息</OptionBtn>
				</div>
				{activePage}
			</div>
		)
	}
}
export default RiskInfoPrompt