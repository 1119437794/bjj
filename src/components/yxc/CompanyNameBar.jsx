/*
* @component 公司名称 以及 状态
* @author yxc
* @author yxc
* */

import React, { Component } from "react"
import { Link }from "react-router"

class CompanyNameBar extends Component {

    render(){

        let btnClassName = 'btn out';
        let status = this.props.status;
        let toUrl = this.props.toUrl;
        let companyName = this.props.companyName;
        let expireDay = this.props.expireDay || "";

        // 许可证到期日处理下
        let expireDayStr = "";
        switch (true){
            case expireDay == "":
                expireDayStr = null; break;
            case expireDay < 0:
                expireDayStr = <span>许可证已到期 <span>{-(expireDay)}</span> 天</span>; break;
            case expireDay >= 0:
                expireDayStr = <span>距离许可证到期日 <span>{expireDay}</span> 天</span>; break;
        }

        if(status == '存续' || status == '开业' || status == '已备案') btnClassName = 'btn in';


        return (
            <div className="company-name-bar">
                {
                    toUrl ? <Link to={toUrl}>{ companyName }</Link> : <a className="disable">{companyName}</a>
                }
                {
                    status && <button className={ btnClassName }>{ status }</button>
                }
                {
                    expireDayStr
                }
            </div>
        )
    }

}

export default CompanyNameBar