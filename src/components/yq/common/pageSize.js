/**
 *每页记录数
 *@param callback(Function) 选择条数之后执行的函数，返回选择值
 *@param lists(Array) 可选列表
 *@param size(number) 总共有多少条
 */
import React, { Component }from "react"
import DrawDownBox from './drawDownBox'
class PageSize extends Component {
	render(){
		return (
			<div className="choice-item">
				<DrawDownBox  type="select1" callback={this.props.callback} lists= {this.props.lists} borderStyle="gray"/>
				<span className="item-num">共<span className="red">{this.props.size}</span>条</span>
			</div>
		)
	}

}
export default PageSize