/*
 * @component LoaderComponent load组件
 * @Function 用户请求数据予以友好提示
 *
 * @props { String } className 根据className展示LoaderComponent @required
 * @props { String } loaderErrorMsg 加载出错提示消息 @required
 * @props { Function } callback 点击关闭加载弹框 @required
 *
 * @author yxc
 * @QQ 1119437794
 * */

import React, { Component }from "react"
import "./LoaderComponent.scss"

class LoaderComponent extends Component {

    // 内部状态管理
    state = {
        className : ""
    }

    // timer 用于清除定时器
    timer = null

    render(){
        return (
            <div className={`loader-component ${this.state.className}`}>

                {/* 加载错误提示 */}
                <div className="loaded-error-notice">
                    <img src="/imgs/loader-error-smile.png" alt=""/>
                    <div>{ this.props.loaderErrorMsg }</div>
                    <span className="loader-component-close" onClick={() => this.props.callback()}></span>
                </div>

            </div>
        )
    }

    componentWillReceiveProps(nextProps){

        let className = nextProps.className;

        // 延迟500ms显示loader
        if( className == "loadering" ){
            this.timer = setTimeout(() => {
                this.setState({
                    className: className
                });
            }, 500);

        }else {
            clearTimeout(this.timer);
            this.setState({
                className: className
            })
        }
    }

    componentWillUnmount(){
        clearTimeout(this.timer);
    }
}

export default LoaderComponent;