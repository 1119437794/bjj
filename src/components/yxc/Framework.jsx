/*
* 框架组件 针对本次UI 头部 以及 主体内容宽度固定
* */

import React, { Component } from "react"
import { Link, IndexLink } from "react-router"
import { observable } from "mobx"
import { observer } from "mobx-react"
import HeaderTop from "./HeaderTop"
import { auto } from "../../common/plugins"

import "./style.scss"
import '../yq/common/style.scss';
import '../yq/Favorites/style.scss'//收藏页
import '../yq/ReditRatings/style.scss'//企业信用评级平台
import '../yq/RiskInfoPrompt/style.scss'//风险信息提示平台
import LoaderComponent from "../LoaderComponent/LoaderComponent"
import loaderStore from "../../stores/yxc/loaderStore"

@observer
class Framework extends Component {

    // 适配处理 1366-1920
     @observable clientWidth = 1400;

    render(){

        return(
            <div>
                {/*网站头部*/}
                <div id="header">
                    <HeaderTop pathname={this.props.location.pathname}></HeaderTop>
                    <ul className="header-tab">
                        <li> <Link to="/"> 首页 </Link></li>
                        <li> <Link to="/intermediaryMonitoring" activeClassName="active"> 保险中介风险查询平台 </Link></li>
                        <li> <Link to="/RiskInfoPrompt" activeClassName="active"> 风险信息提示平台 </Link></li>
                        {/*<li> <Link to="/ReditRatings" activeClassName="active"> 企业信用评级平台 </Link></li>*/}
                    </ul>
                </div>
                {/*网站主体*/}
                <div id="main">
                    <div className="main-content" style={{width: this.clientWidth}}>
                        { this.props.children }
                    </div>
                </div>

                {/*网站loader*/}
                <LoaderComponent
                    className={loaderStore.className}
                    loaderErrorMsg={loaderStore.loaderErrorMsg}
                    callback={() => loaderStore.setClassName("")}
                />
            </div>
        )
    }

    componentDidMount(){

        /*
        * 检测浏览器分辨率
        * 适应处理
        * */
        this.clientWidth = auto();
    }
}

export default Framework;
