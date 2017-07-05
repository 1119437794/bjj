/*
 * @component 选项卡切换
 * @author yxc
 *
 * @prop { Array }      tabs tab选项卡的标题
 * @prop { Function }   callback 回调函数，参数为当前选显卡的下标
 * */

import React, { Component }from "react"

class TabsBar extends Component {

    state = {
        curTabIndex: 0
    }

    /*
    * @method { Function } handleClick tab点击切换
    * */
    handleClick(index){
        this.setState({
            curTabIndex: index
        });
        this.props.callback(index);
    }

    render(){

        let tabs = this.props.tabs;

        return (
            <ul className="tabs">
                {
                    tabs.map((item, index) => {
                        return (
                            /* 背景的设置通过css来 */
                            <li
                                key={index}
                                className={this.state.curTabIndex == index ? "active" : ""}
                                onClick={() => this.handleClick(index)}
                            >{item}</li>
                        )
                    })
                }
            </ul>
        )
    }
}

export default TabsBar;