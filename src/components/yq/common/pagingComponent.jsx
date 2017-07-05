/**
 *@component 分页组件
 *@author yq
 *@param {Number} totalNum(頁數)
 *@param {Function} callback  点击页码的操作
 */
import React, { Component }from "react"
import { observer }from "mobx-react"
import { observable,autorun } from 'mobx';
const LIHEIGHT = -38;//控件按钮高度
import pagingComponentStore from '../../../stores/yq/pagingComponentStore'

//传入totalNum
@observer class PagingComponent extends Component {

	state = observable({
		pageList:"",
		activePage:"",
		lieNum:0,
		prevLieNum:"",
		totalNum:0
	})

	componentDidMount(){
		this.numList()
	}

	componentWillReceiveProps(nextProps) {

	    if(this.props.totalNum!=nextProps.totalNum || this.props.forceUpdatePage != nextProps.forceUpdatePage){

	    	this.numList(1, nextProps.totalNum);
	    }
	}
	nextPage(){//下一页
		if(this.props.totalNum != this.state.activePage){
			this.numList(+this.state.activePage+1)
		}
	}

	prevPage(){//上一页
		if(this.state.activePage != 1){
			this.numList(+this.state.activePage-1)
		}
	}

	switchPage(e){//点击数字
		this.numList(e.target.textContent);
	}

	// 输入页码跳转
	jump(){
		if(!this.refs.inputNum.value || +this.refs.inputNum.value > +this.props.totalNum || !/^[1-9]\d*$/.test(this.refs.inputNum.value)){
			return;
		}
		this.numList(this.refs.inputNum.value)
	}

	flip(curNum){//页码翻页
		var flipNum = parseInt(curNum/5);

		// 若不幸有其他人维护此代码，别怪我这样写，因为我也是接手的二手代码
		// 表示没看懂这句话
		// 大兄弟，你还是辞职吧？！
		// 大兄弟，你还是辞职吧？！
		if(curNum % 5!=0){
			this.state.lieNum = flipNum;

		} else if(curNum % 5==0){
			this.state.lieNum = flipNum -1;

		} else if(this.state.prevLieNum%5==1){
			this.state.lieNum = flipNum-1;
		}
		this.state.prevLieNum = curNum;
	}

	numList(activeNum=1,newProps = this.props.totalNum){//重新渲染li		
		let arrList=[];
		for(let i=0;i<newProps;i++){
			if(activeNum==i+1){
				arrList.push(<li key={i} className="num-page curr-page">{i+1}</li>)
			} else {
				arrList.push(<li key={i} onClick={this.switchPage.bind(this)} className="num-page">{i+1}</li>)
			}
		}
		this.flip(activeNum);
		this.state.pageList = arrList;
		this.state.activePage = activeNum;
		
		// console.log(this.state);
		// this.state.activePage.set(activeNum);
		// pagingComponentStore.setPageNumber(activeNum);
		// debugger;
		this.props.callback && this.props.callback(activeNum);//翻页回调
	}
	render(){
		if(this.props.totalNum <=1 ){
			return (<div></div>)
		} else {
			return (
			<div className="paging-component clearfix">
				<div className="prev-page btn" onClick={this.prevPage.bind(this)}>上一页</div>
				<div className="list-out-box">
					<ul style={{marginTop:LIHEIGHT*this.state.lieNum+'px'}} className="clearfix">
						{this.state.pageList}
					</ul>
				</div>
				<div className="next-page btn" onClick={this.nextPage.bind(this)}>下一页</div>
				<span className="total-page">共<span>{this.props.totalNum}</span>页 </span>
				<span>第</span>
				<input ref="inputNum" type="text" maxLength="4"/>
				<span>页</span>
				<div className="btn" onClick={this.jump.bind(this)}>跳转</div>
			</div>
			)
		}
		
	}
}
export  default PagingComponent;