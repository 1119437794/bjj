/**
 * 北京保险中介机构地区分布图
 */
import React, { Component }from "react"
import {ajax} from '../../../common/plugins'
import { observer }from "mobx-react"
import { observable} from 'mobx';
@observer class AreaChart extends Component {
	@observable state = {
		areaNameArr:[],
		valArr:[]
	}

	componentWillMount(){
		let _this = this;
		ajax({
			url:"/areaCompanyCounts",
			type:"GET",
			data:{
				token:sessionStorage.token
			},
			success(data){
				data && data.map((item) => {
					_this.state.areaNameArr.push(item.areaName);
					_this.state.valArr.push(item.totalNum);
				})
				_this.drawEcharts()
			}
		})
	}

	drawEcharts(){
		// console.log(this.state.areaNameArr);
		// console.log(this.state.valArr);
		var areaChart = echarts.init(document.getElementById("area-chart"));
		var _this = this;
		var myImg = new Image();
		myImg.onload = function(){
			console.log(myImg);
			areaChart.setOption({
				title: {
					text: '北京保险中介机构地区分布图',
					textStyle:{
						color:'#4c4c4c',
						fontWeight:'normal',
						fontSize:16
					},
					left:15,
					top:20
				},
				tooltip: {
					formatter:function(data){
						return data.name+':'+data.value
					}
				},
				grid: {
					left: '3%',
					right: '10%',
					bottom: '3%',
					top:'15%',
					containLabel: true
				},
				xAxis: {
					type: 'value',	
					name:'企业数量',
					nameTextStyle:{
						color:'#333'
					},				
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
				},
				yAxis: {
					type: 'category',
					name:'地区',
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
					data:_this.state.areaNameArr
				},
				series: [
					{
						type: 'bar',
						barWidth:12,
						data: _this.state.valArr,
						itemStyle:{
							normal:{
								color:{
									image:myImg,
									repeat:'repeat-y'
								}
							}
						}

					}
				],

				//color:[new echarts.graphic.LinearGradient(0, 0.2, 0.9,1, [{
				//	offset: 0,
				//	color: '#00cbff'
				//}, {
				//	offset: 0.8,
				//	color: '#0023ff'
				//},{
				//	offset: 1,
				//	color: '#ee00ff'
				//}])]

			})
			window.allEcharts.push(areaChart);

		}
		myImg.src = '/imgs/charts-bar.png';


	}
	render(){
		return (
				<div id="area-chart"></div>
				)
	}
}
export default AreaChart