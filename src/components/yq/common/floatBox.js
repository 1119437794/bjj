/**
 * 浮框展示
 */
import React, { Component }from "react"
class FloatBox extends Component {
	close(){//关闭弹框
		$(".float-box").hide()
	}
	render(){
		return (
			<div className="float-box">
				<span className="close" onClick={this.close.bind(this)}>×</span>
				<span className="content">{this.props.children}</span>				
			</div>
			)
	}
}
export default FloatBox