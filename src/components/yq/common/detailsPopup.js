/**
 *@component 详情信息弹框
 *@param {Function} closeDetails 控制关闭
 *@param {string} 	title
 *@param {string } 	childTitle 	(可选)
 *@param { string } casecode 	[description] 案号 (可选)
 *@param {string} 	content
 *@param {string} 	pubdate 	发布时间 (可选)
 *
 */
import React, { Component }from "react"
import { observer }from "mobx-react"
import { observable} from 'mobx';
import popupStore from '../../../stores/yq/popupStore'
@observer class DetailsPopup extends Component {
	
	closePopup(){//关闭弹框
		popupStore.setDisplay('none')
	}
	render(){
		return (
			<div className="details-popup" style={{display : popupStore.display}}>
				<div className="details-content clearfix">
					<div className="close-box" onClick={this.closePopup.bind(this)}>×</div>
					<div className="details-title">{this.props.title}</div>
					{
						this.props.childTitle ? <div className="child-title">{this.props.childTitle}</div> :''
					}					
					{
						this.props.casecode ? <div className="casecode">{this.props.casecode}</div>:''
					}
					{
						this.props.pubdate ? <div className="public-time">发布时间：{this.props.pubdate}</div> :''
					}
					
					<div className="details-article">{this.props.content}</div>
				</div>
			</div>
		)
	}
}
export default DetailsPopup