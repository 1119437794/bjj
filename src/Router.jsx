/*
* 路由表
* */

import Framework from "./components/yxc/Framework"
import React, { Component } from "react"
import { Router, Route, IndexRoute, hashHistory} from 'react-router';
import { useStrict } from 'mobx';


/*登录*/
import Login from './components/yq/LoginAndMain/Index';
/*首页*/
import MainPage from './components/yq/LoginAndMain/Main';
//   =========== 中介监测 begin ==========
import IntermediaryMonitoring from "./components/yxc/IntermediaryMonitoring"
import IntermediaryMonitoringCompanyList from "./components/yxc/IntermediaryMonitoringCompanyList"
import IntermediaryMonitoringIndex from "./components/yxc/IntermediaryMonitoringIndex"
import IntermediaryMonitoringCompanyInfo from "./components/yxc/IntermediaryMonitoringCompanyInfo"
//   =========== 中介监测 end ==========

/*收藏信息*/
import  FavoritesMainPage from "./components/yq/Favorites/Index"
/*企业信用评级*/
import ReditRatings from "./components/yq/ReditRatings/Index"
/*风险信息提示平台*/
import RiskInfoPrompt from './components/yq/RiskInfoPrompt/Index'

import Test from './components/Test/Test'

//useStrict(true);

class Routers extends Component {

	// 入口判断是否登录
	onEnter(){
		!sessionStorage.token && (window.location.hash = "/login");
	}

    render(){

        return (
            <Router history={ hashHistory }>
			    <Route path="/">
			        <IndexRoute onEnter={() => this.onEnter()} component={MainPage} />

	                <Route path="/login" component={Login}></Route>

	                <Route onEnter={() => this.onEnter()} path="/mainPage" component={MainPage} ></Route>

	                <Route onEnter={() => this.onEnter()} component={Framework} >

	                    <Route path="/intermediaryMonitoring" component={IntermediaryMonitoring}>

	                        <IndexRoute component={IntermediaryMonitoringIndex} />

	                        <Route path="companylist/:companyName" component={IntermediaryMonitoringCompanyList} />

	                        <Route path="companyinfo/:companyId" component={IntermediaryMonitoringCompanyInfo} />

	                    </Route>

	                    <Route path="/FavoritesMainPage" component={FavoritesMainPage}></Route>

			            <Route path="/ReditRatings" component={ReditRatings}></Route>

				        <Route path="/RiskInfoPrompt" component={RiskInfoPrompt}></Route>
	                </Route>

                    <Route path="/test" component={Test}></Route>
		        </Route>
            </Router>
        )
    }

    // 监听页面路由变化 自动
    componentDidMount(){

        hashHistory.listen(function () {
    		// window.location.reload();
		})
	}
}

export default Routers;
