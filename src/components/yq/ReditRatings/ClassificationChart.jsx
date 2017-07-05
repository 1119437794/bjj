/**
 * 北京保险中介机构分级趋势图
 */
import React, { Component }from "react"
import {ajax} from '../../../common/plugins'
import { observer }from "mobx-react"
import { observable} from 'mobx';
@observer class ClassificationChart extends Component {
	@observable state = {
		allData:'',
		dateArr:[]
	}
	componentWillMount(){
		let _this = this;

		// x 轴显示12个月份
		let curDate = new Date();
		let curYear = curDate.getFullYear();
		let curMonth = curDate.getMonth() + 1;

		if(curMonth < 12){

			// 还需要另加的去年月份个数 leftMonths
			let leftMonths = 12 -curMonth;
			for(let i = leftMonths - 1; i >=0; i--){
				this.state.dateArr.push((curYear-1) + "-" + (12 - i));
			}
		}

		for(let i = 1; i <= curMonth; i++){
			this.state.dateArr.push(curYear + "-" + i);
		}

		ajax({
			url:"/levelStatistic",
			data:{
				token:sessionStorage.token
			},
			type:'GET',
			success(data){
				_this.state.allData = data;
				_this.drawEcharts();
			}
		})
	}

	drawEcharts(){
		let classificationChart = echarts.init(document.getElementById("classification-chart"));
		let _this = this;
		classificationChart.setOption({
				title: {
					text: '北京保险中介机构分级趋势图',
					textStyle:{
						color:'#4c4c4c',
						fontWeight:'normal',
						fontSize:16
					},
					left:15,
					top:20
				},

				legend: {
					data:['A级','B级','C级','D级'],
					right:'5%',
					top:20
				},

				tooltip: {
					trigger: 'axis'
				},

				grid: {
					left: '3%',
					right: '5%',
					bottom: '3%',
					top:'15%',
					containLabel: true,
					show:true,
					borderColor:'#d9d9d9'
				},
				xAxis: {
					type: 'category',

					boundaryGap: false,
					splitNumber:12,
					axisTick:{
						show:false
					},
					splitLine:{
						show:true
					},
					axisLine:{
						lineStyle:{
							color:'#e8e8e8'
						}
					},
					axisLabel:{
						textStyle:{
							color:'#4c4c4c'
						}
					},
						data: _this.state.dateArr
				},
				yAxis: {
					type: 'value',
					splitNumber:10,
					name:'企业数量',
					nameTextStyle:{
						color:'#333'
					},
					axisTick:{
						show:false
					},
					axisLine:{
						lineStyle:{
							color:'#e8e8e8'
						}
					},
					axisLabel:{
						textStyle:{
							color:'#4c4c4c'
						}
					},
				},
				series: [
					{
						name:'A级',
						type:'line',
						data:_this.state.allData.A
					},
					{
						name:'B级',
						type:'line',
						data:_this.state.allData.B
					},
					{
						name:'C级',
						type:'line',
						data:_this.state.allData.C
					},
					{
						name:'D级',
						type:'line',
						data:_this.state.allData.D
					}
				],
			color:['#ff0000','#2a7bea', '#5cb85c', '#f98625']
		})
		window.allEcharts.push(classificationChart)
	}
	render(){
		return (
			<div id="classification-chart"></div>
		)
	}
}
export default ClassificationChart