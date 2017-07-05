/**
 *@component 有背景的按钮
 *@param {String} pictureUrl 左边图标
 *@param {String} children 文字作为children传入
 *@param {number} newMsg 消息提示个数
 *@param {Function} clickFun 点击按钮的回调
 */
import React, { Component }from "react"
class OptionBtn extends Component {
	render(){
		return (
			<div onClick={this.props.clickFun} style={{background:'#cfd7e0 url("'+this.props.pictureUrl+'") 10% 50% no-repeat'}} className="option-btn">
				{this.props.children}
				{!this.props.newMsg || this.props.newMsg=='0' ? '':<div className="new-msg">{this.props.newMsg}</div>}
			</div>
		)
	}

}
export default OptionBtn