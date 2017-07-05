/*
* 中介监测平台
* */
import React, { Component } from "react"

class IntermediaryMonitoring extends Component {
    render(){
        return (
            <div>
                { this.props.children }
            </div>
        )
    }
}

export default IntermediaryMonitoring;