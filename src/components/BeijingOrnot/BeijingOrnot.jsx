
import React, { Component } from "react"
import "./BeijingOrnot.scss"

class BeijingOrnot extends Component {

    state = {
        curTabIndex: 0
    }

    tabs = [
        "全部",
        "京中介股东",
        "京中介",
        "京中介在京分支",
        "京中介外地分支",
        "外地中介京分支",
    ]

    // tabs传给后台的对应参数
    tabsParams = [

        {
        },

        {
            companyLocation: "local",
            companyType: "shareholder"
        },

        {
            companyLocation: "local",
            companyType: "agency"
        },

        {
            companyLocation: "local",
            parentLocation: "local",
            companyType: "branch"
        },

        {
            companyLocation: "local",
            branchLocation: "nonlocal",
            companyType: "agency"
        },

        {
            companyLocation: "local",
            parentLocation: "nonlocal",
            companyType: "branch"
        }
    ]

    componentWillMount(){
        switch (sessionStorage.areaName) {
            case "上海":
                // map 方法只会返回一个新数组
                this.tabs = this.tabs.map(item => {
                    return item.replace(/京/g, "沪");;
                });
                break;

            default:
                break;
        }
    }

    render(){

        let showTabIndexArr = this.props.showTabIndexArr;
        return (
            <ul className="bjornot__root">
                {
                    this.tabs.map((item, index) => {

                        if(!showTabIndexArr.includes(index)) return null;

                        return (
                            <li
                                key={index}
                                className={index == this.state.curTabIndex ? "bjornot__item bjornot__item--active" : "bjornot__item"}
                                onClick={()=>{

                                    this.setState({
                                        curTabIndex: index
                                    });

                                    this.props.callback(this.tabsParams[index]);
                                }}
                            >
                                {item}
                            </li>
                        )
                    })
                }
            </ul>
        )
    }
}


export default BeijingOrnot;
