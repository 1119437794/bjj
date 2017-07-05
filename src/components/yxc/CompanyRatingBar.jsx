/*
* @component 公司评级 组件
* @author yxc
* */

import React, { Component } from "react"

class CompanyRatingBar extends Component {

    render(){

        let level = this.props.children;
        let spanClassName = '';

        switch (level){
            case 'A':
                spanClassName = 'level-A';break;
            case 'B':
                spanClassName = 'level-B';break;
            case 'C':
                spanClassName = 'level-C';break;
            case 'D':
                spanClassName = 'level-D';break;
        }

        return (
            <div className="company-rating-bar">
                评级：<span className={spanClassName}>{ level }</span>
            </div>
        )
    }
}

export default CompanyRatingBar;