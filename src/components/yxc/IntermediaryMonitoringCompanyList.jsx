/*
* @component CompanyList 根据中介监测,搜索出的公司列表
* @author yxc
* */

import { Link }from "react-router"
import { observer }from "mobx-react"
import React, { Component } from "react"
import { observable, observe, transaction} from "mobx"
import { ajax } from "../../common/plugins"
import CompanyNameBar from "./CompanyNameBar"
import CompanyRatingBar from "./CompanyRatingBar"
import CompanyConcernBar from "./CompanyConcernBar"
import PageComponent from "../PageComponent/PageComponent"
import CompanyRelatedPartyBar from "./CompanyRelatedPartyBar"
import LoaderComponent from "../LoaderComponent/LoaderComponent"


@observer class CompanyList extends Component {

    /*
    * @property { Aarry } [data=[]] 用于搜索结果列表展示
    * */
    @observable data = {list: []}

    /*
    * @property {Number} [curPageNum=1] 当前页码
    * 根据页码变化，重新请求数据
    * */
    @observable curPageNum = 1

    /*
    * @property {Boolean} [isShowLoader=""] 显示隐藏loader
    * 默认不显示
    * */
    isShowLoader = observable("")

    /*
    * @property { String } [loaderErrorMsg=""] 请求出错消息提示
    * */
    loaderErrorMsg = observable("")

    /*
    * @property {Boolean} [hasSearchData=false] 搜索结果是否为空，默认是有搜索结果的
    * */
    hasSearchData = observable(false)

    /*
    * 注销observe
    * 注意在mobx中，用autorun，或是observe函数，必须手动销毁
    * */
    disposeObserve = null

    /*
    * @method getCompanySearchData 获取根据公司名关键词搜索出的公司列表
    * */
    getCompanySearchData(){

        // 显示loader
        this.isShowLoader.set("loadering");

        ajax({
            type: 'GET',
            url: '/companySearch',
            data: {
                pageNum: this.curPageNum,
                token: sessionStorage.token,
                companyName: this.props.params.companyName
            },
            success: (data) => {
                // 异步操作 较少render
                transaction(() => {
                    this.data = data;
                    this.isShowLoader.set(""); // 请求完毕 隐藏loading
                    this.data.list.length ? this.hasSearchData.set(false) : this.hasSearchData.set(true);
                })

            },
            error: (msg) => {
                this.loaderErrorMsg.set(msg);
                this.isShowLoader.set("loaded-error"); // 请求失败，提示用户
            }
        })
    }

    componentWillMount(){

        // 搜索结果数据请求
        this.getCompanySearchData();

        this.disposeObserve = observe(this, "curPageNum", () => {
            this.getCompanySearchData();
        })
    }

    render(){

        return (
            <div style={{paddingBottom: 20}}>

                <ul className="company-list">
                    {
                        this.data.list.map((item, index) => {

                            // 点击公司名称或点击查看按钮，可以查看公司详情
                            let detailInfoUrl = `/intermediaryMonitoring/companyinfo/${item.id}`;
                            return (
                                <li className="company-list-item" key={index}>
                                    <div>
                                        <CompanyNameBar toUrl={detailInfoUrl} status={item.enterpriseStatus} companyName={item.companyName}/>
                                        <div className="company-corporation">法定代表人：<span>{item.frname || "-"}</span></div>
                                        <div className="company-capital">注册资本：<span>{item.regcap || "-"}</span></div>
                                        <div className="company-reg-time">注册时间：<span>{item.establishDate || "-"}</span></div>
                                        <div className="company-address">企业地址：<span>{item.address || "-"}</span></div>
                                    </div>
                                    <div><CompanyRatingBar>{item.level || "-"}</CompanyRatingBar></div>
                                    <div><CompanyRelatedPartyBar>{item.relateNum}</CompanyRelatedPartyBar></div>
                                    <div>
                                        <CompanyConcernBar
                                            companyId={item.id}
                                            followType={item.followAbleTypeString}
                                            status={item.favorite ? "concerned" : "unconcerned"}/></div>
                                    <div><Link className="btn" to={detailInfoUrl}>查看详情</Link></div>
                                </li>
                            )
                        })
                    }
                    {
                        this.hasSearchData.get() && <li className="no-list-notice">根据关键字未搜索到相关企业</li>
                    }
                </ul>
                {
                    this.data.list.length ?
                        <div className="clearfix company-list-page">
                            <div className="fl" style={{fontSize:"14px", color:"#333"}}>
                                一共为您找到
                                <span style={{color:"#f98625",fontWeight:"bold"}}>{this.data.total}</span>
                                家符合条件的企业
                            </div>
                            <PageComponent
                                curPageNum={this.curPageNum}
                                pagesTotal={this.data.pages}
                                callback={(pageNum) => this.curPageNum = pageNum} />
                        </div>
                        : null
                }
            </div>
        )
    }

    // 用户搜索关键词的变化需要重新获取数据
    // todo 这里误导了我对路由的认识
    componentWillReceiveProps(nextProps){

        let curCompanyName = this.props.params.companyName;
        let nextCompanyName = nextProps.params.companyName;
        if(curCompanyName != nextCompanyName){
            this.props.params.companyName = nextCompanyName;

            // 当前页码为1，表示通过手动调用发起更新
            if(this.curPageNum == 1){
                this.getCompanySearchData();
            }else {
                this.curPageNum = 1;
            }
        }
    }

    componentWillUnmount(){
        this.disposeObserve();
    }
}

export default CompanyList;