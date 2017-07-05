/**
 * 新消息通知，修改数据重新请求数据
 */
import { observable,action } from 'mobx';
import {ajax} from '../../common/plugins'

class refreshMsg {
	@observable viewMsgArr = ['','','','','','','','']
    @action setViewMsg(data){
        this.viewMsgArr = data;
    }

    /*
     changeItems	工商变更的变更项	string
	 dateRangeBegin	时间范围起始时间	string	yyyy-MM-dd
	 dateRangeEnd	时间范围结束时间	string	yyyy-MM-dd
	 keyword	公司名称关键字	string
	 token
    */
	queryData(option={}){
		let isViewArr=['','','','','','','','']
		// isViewArr.length=8;
		ajax({
			url:"/riskinfo/countNotice",
			data:{
				keyword: option.keyword || "",
				token:sessionStorage.token,
				changeItems: option.changeItems || "",

				dateRangeBegin: option.dateRangeBegin || "",
				dateRangeEnd: option.dateRangeEnd || ""
			},
			type:"GET",
			success:(data)=>{
				data.map((item,index)=>{
					switch(item.riskType){
						case 1://变更
						isViewArr[0]=item.count>99 ? '99...':item.count
						break;
						case 2://舆情
						isViewArr[7]=item.count>99 ? '99...':item.count
						break;
						case 3://行政处罚
						isViewArr[1]=item.count>99 ? '99...':item.count
						break;
						case 4://失信人
						isViewArr[3]=item.count>99 ? '99...':item.count
						break;
						case 5://分支机构
						isViewArr[5]=item.count>99 ? '99...':item.count
						break;
						case 6://经营异常
						isViewArr[4]=item.count>99 ? '99...':item.count
						break;
						case 7://诉讼信息
						isViewArr[2]=item.count>99 ? '99...':item.count
						break;
					}
				})		
				this.viewMsgArr=isViewArr		
			}			
		})	
	}

	/*
	* 工商变更信息下拉选项，默认是全部
	* */
	@observable bussinessChangeItem = null
	@action setBussinessChangeItem(val){
		this.bussinessChangeItem = val;
	}
	
}

const newMsg = new refreshMsg();

export default newMsg;