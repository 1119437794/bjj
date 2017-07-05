/**
 * 登录界面
 */

import "./style.scss"
import React, { Component }from "react"
import { Link,History } from "react-router"
import { observer }from "mobx-react"
import { observable } from 'mobx';
import {ajax} from '../../../common/plugins'


@observer class Login extends Component {
	@observable state = {
		windowHeight:"",
		errorMsg:""
	}

	componentWillMount(){//全屏展示
		this.state.windowHeight= $(window).height()
	}

	componentDidMount() {//全屏展示
		window.scrollTo(0, 0);
		$(window).resize(function (event) {
			this.state.windowHeight= $(window).height()
		}.bind(this));
	}

	inputFocus(el){
		$(el.target).addClass('input-focus');
	}

	inputBlur(el){
		$(el.target).removeClass('input-focus');
	}

	login(){
		ajax({
			type: "POST",
			url: "/login",
			data: {
				account: this.refs.account.value,
				password: this.refs.password.value
			},
			success(data){
				let tmpAreaName = (data.areaName || "").replace("市", "");

				sessionStorage.token = data.accessToken;
				sessionStorage.account = data.account;
				sessionStorage.areaName = tmpAreaName;

				window.location.hash='/';
				document.title = `${tmpAreaName}保监局风险监测预警平台`;
			},
			error: (msg) => {
				this.state.errorMsg = msg
			}
		})

	}
	handleKeyDown(e){
        if(e.keyCode == 13){
            this.login();
        }
    }
	render(){
		return (
			<div id="login" style = {{height:this.state.windowHeight+'px'}}>
				<div className="content">
					<div><img src="/imgs/login-logo.png"/></div>
					<div>保险中介大数据监测平台</div>
					<div className="input-box">
						<input
							ref="account"
							maxLength="20"
							className="user"
							onFocus={this.inputFocus}
							onBlur={this.inputBlur}
							type="text"
							placeholder="账号"
						/>
					</div>
					<div className="input-box">
						<input
							ref="password"
							maxLength="20"
							className="pwd"
							onKeyDown={(e) => this.handleKeyDown(e)}
							onFocus={this.inputFocus}
							onBlur={this.inputBlur}
							type="password"
							placeholder="密码"
						/></div>
					<div className="error-msg">{this.state.errorMsg && '* '+this.state.errorMsg}</div>
					<div><div onClick={this.login.bind(this)} className="login-btn">登录</div></div>
				</div>

				<div className="login-anti-fraud"></div>
			</div>
	)
	}
}
export default Login;