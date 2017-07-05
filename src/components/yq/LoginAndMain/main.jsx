/**
 * Created by Administrator on 2016/8/30 0030.
 */
/**
 *首页
 */
import "./style.scss"
import React, { Component }from "react"
import { Link} from "react-router"
import { observer }from "mobx-react"
import { observable } from 'mobx';
import HeaderTop from '../../yxc/HeaderTop'

@observer class Main extends Component {
	@observable state = {
		windowHeight:"100%"
	}
	componentWillMount(){//全屏展示
		//this.state.windowHeight= $(window).height()
	}
	componentDidMount() {//全屏展示
		window.scrollTo(0, 0);
		$(window).resize(function (event) {
			//this.state.windowHeight= $(window).height()
		}.bind(this));
	}
	inputFocus(el){
		$(el.target).addClass('input-focus');
	}
	inputBlur(el){
		$(el.target).removeClass('input-focus');
	}
	componentDidMount(){
		var beforeSrc,$img,$span;
		$(`.list div`).hover(function($this){//更换图片和背景！！
			$span = $($this.target).find('span');
			$span.addClass('text-hover');
			$img = $($this.target).find('img');//缓存图片路径
			beforeSrc = $img.attr('src');//缓存hover之前的图片路径
			$img.attr("src",beforeSrc.replace('1',''));
			$($this.target).css('background','url("/imgs/circle-hover.png") no-repeat')
		},function($this){
			$span.removeClass('text-hover');
			$img.attr("src",beforeSrc);
			$($this.target).css('background','url("/imgs/circle.png") no-repeat')
		})
	}
	render(){
		return (
			<div id={"main-page"} style = {{height:this.state.windowHeight+'px'}}>
				<HeaderTop></HeaderTop>
				<div className={"content"}>
					<div><img src="/imgs/login-logo.png" /></div>
					<div className={"title"}>{sessionStorage.areaName}保险中介大数据风险监测平台</div>
					<div className={"list"}>
						<Link to="/intermediaryMonitoring">
							<div><img src="/imgs/jianguan-icon1.png" /><span>保险中介风险查询平台</span></div>
						</Link>
						<Link to="/RiskInfoPrompt">
							<div><img src="/imgs/fengxian-icon1.png"/><span>风险信息提示平台</span></div>
						</Link>
						{/*<Link to="/ReditRatings"><div><img src="/imgs/xinyong-icon1.png" /><span>企业信用评级平台</span></div></Link>*/}
					</div>
					<div className={"main-anti-fraud"}></div>
				</div>
			</div>
		)
	}
}
export default Main;