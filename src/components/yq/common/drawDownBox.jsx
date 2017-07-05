/**
 * @component 下拉框组件
 *
 * @props {Arrary} showData 下拉列表项展示数据
 * @props {Arrary} realData 下拉列表项传送给后台的真实数据
 *
 * @props {String} type 下拉框背景颜色,白色背景type="select1",蓝色背景type="select2"
 * @props {String} borderStyle 下拉框边框颜色,蓝色borderStyle="blue",灰色为"gray"（蓝色没有border-redus）
 * @props {Function} callback 下拉框选项值变化时回调
 */
import React, { Component } from "react"

class DrawDownBox extends Component {

	render(){
		let selectStyle ="select-box ";
		let type = this.props.type=="select1" ? "select1 " : "select2 ";
		let borderStyle = this.props.borderStyle=="blue" ? "blue-border " : "gray-border ";

		// 日期数据版本
		let showData = this.props.showData;
		let realData = this.props.realData;

		// 外界改变当前选中的值
		let currentVal = this.props.current;
		let props = {
			onChange: (e) => this.props.callback(e.target.value),
			className: selectStyle + type + borderStyle
		};

		if(currentVal){
			props = {
				value: currentVal,
				onChange: (e) => this.props.callback(e.target.value),
				className: selectStyle + type + borderStyle
			}
		};

		return (
			<div className="select-out-box">
				<select { ...props } >
					{
						showData.map(function(item,index){
							{/* 加上默认值 */}
							return <option key={index} value={realData[index]}>{item}</option>
						}.bind(this))
					}
				</select>
			</div>
		)
	}
}

export default DrawDownBox