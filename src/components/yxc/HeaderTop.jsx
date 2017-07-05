/*
* 网页头部第一部分 logo以及快捷入口
* */

import React, { Component }from "react"
import { Link } from "react-router"
import { observer }from "mobx-react"
import { observable } from 'mobx';
import {ajax} from '../../common/plugins'
import SearchBox from "./SearchBox"

@observer
class HeaderTop extends Component {

	// 除开以下路径请求，不显示搜索框外， 其他均默认显示
	excludeRemoveSearchBoxArr = [undefined, "/intermediaryMonitoring"];

	exit(){
		window.location.hash='/Login';
		ajax({
			type:"GET",
			url:"/logout",
			data:{
				token : sessionStorage.token,
				account : sessionStorage.account
			},
			success(){
				sessionStorage.clear();
				window.location.hash = '/Login';
				document.title = "保监局风险监测预警平台";
			}
		})
	}

    render(){

    	// 检测是否在排除的数组内
    	let pathname = this.props.pathname;
		let pathnameIndex = this.excludeRemoveSearchBoxArr.findIndex((value) => {
    		return pathname == value;
		})

        return (
            <div className="header-top">
                <Link to="/" className="header-top-logo">
					<img src="/imgs/header-logo.png" alt=""/>
					{sessionStorage.areaName}保险中介大数据风险监测平台
                </Link>
				{
					/* 等于-1表示是可以显示搜索框的 */
					/* 等于-1表示是可以显示搜索框的 */
					pathnameIndex == -1 ? <SearchBox className="header-top-search-box" /> : null
				}
				{/*<div className="header-top-search-box">
					<input type="text" placeholder="请输入企业名称进行搜索"/>
					<button></button>
				</div>*/}
                <ul className="header-top-list">
                    <li className={sessionStorage.account ? "user show" : "user hide"}>Hi,{sessionStorage.account}</li>
                    <li className="favorite"> <Link to="/FavoritesMainPage">收藏夹</Link> </li>
	                <li className="exit" onClick={this.exit.bind(this)}> 退出</li>
	            </ul>
            </div>
        )
    }
}

export default HeaderTop;