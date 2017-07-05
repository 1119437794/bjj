/*
* @component 搜索框【用于页面导航以及中介监测首页】
* @author yxc
* */

import React, { Component } from "react"
import { observable } from "mobx"
import { observer }from "mobx-react"
import { hashHistory } from "react-router"

@observer
class SearchBox extends Component {

    searchText = observable('') // 搜索输入框的
    inputErr = observable(false) // 搜索输入框错误提醒

    timer = null // setTimeout定时器返回值 用于模拟输入框错误消息提醒

    render(){

        // 针对新加的导航搜索
        let className = this.props.className;

        return (
            <div className={className || "search-box"}>
                <div className="search-input">
                    <input type="text"
                           placeholder="请输入企业名称或企业关键字"
                           value={this.searchText.get()}
                           onChange={(e) => this.handleChange(e)}
                           className={this.inputErr.get() ? "error" : ""}
                           onKeyDown={(e) => this.handleKeyDown(e)}
                    />
                    <button onClick={() => this.handleClickSearch()}></button>
                </div>
            </div>
        )
    }

    // 点击搜索
    handleClickSearch(){

        this.inputErr.set(false);
        clearTimeout(this.timer);
        let searchText = this.searchText.get().trim();

        if(searchText){
            hashHistory.push(`/intermediaryMonitoring/companylist/${searchText}`);
            this.searchText.set('');
        }else {
            this.timer = setTimeout(()=>{
                this.inputErr.set(true);
            }, 0)
        }
    }

    // 监听用户输入 并更改searchText值
    handleChange(e){
        this.searchText.set(e.target.value);
    }

    // 点击回车搜索
    handleKeyDown(e){
        if(e.keyCode == 13){
            this.handleClickSearch();
        }
    }
}

export default SearchBox;