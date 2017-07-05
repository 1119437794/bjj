/*
* @component IntermediaryMonitoringCompanyInfo 中介监测-企业信息展示
* @author yxc
* */

import { observable, autorun, toJS, whyRun, transaction, when, observe} from "mobx"
import { observer } from "mobx-react"
import React, { Component } from "react"
import CompanyNameBar from "./CompanyNameBar"
import CompanyRatingBar from "./CompanyRatingBar"
import CompanyRelatedPartyBar from "./CompanyRelatedPartyBar"
import CompanyConcernBar from "./CompanyConcernBar"
import { ajax, getPercentage, clickOtherClose} from "../../common/plugins"
import DrawDownBox from "../../components/yq/common/drawDownBox"
import companyDetailInfoStore from "../../stores/yxc/companyDetailInfoStore"
import DetailsPopup from "../../components/yq/common/detailsPopup"
import popupStore from "../../stores/yq/popupStore"
import popupStore2 from "../../stores/yxc/popupStore"
import companyIndustryStore from "../../stores/yxc/companyIndustryStore"
import PageComponent from "../PageComponent/PageComponent"

// 企业信息-背景调查
@observer
class CompanyBgInfo extends Component {

    // 背景调查信息tabs
    companyBgInfoTabs = [
        "关联信息",
        "工商变更",
        "裁判文书",
        "失信信息",
        "法院公告",
        "被执行人",
        "经营异常",
        "招聘信息",
        "舆情信息",
        "行政处罚"
    ]

    /*
     * @property {Array} companyBgInfoHeaderData 背景调查信息表头
     * 关联方信息有两个表，所以用一个二维数组存储数据
     * */
    companyBgInfoHeaderData = [
        [
            {
                "title": "一度关联企业",
                "url": "/company/oneRelatedCompany",
                "data": [
                    {
                        width: getPercentage(2/7),
                        key: "companyName",
                        text: "企业名称",
                    },
                    {
                        width: getPercentage(1/7),
                        key: "frname",
                        text: "法定代表人",
                    },
                    {
                        width: getPercentage(1/7),
                        key: "establishDate",
                        text: "注册时间",
                    },
                    {
                        width: getPercentage(2/7),
                        key: "address",
                        text: "注册地址",
                    },
                    {
                        width: getPercentage(1/7),
                        key: "companyIndustry",
                        text: "所属行业",
                    }
                ]
            },
            {
                "title": "一度关联自然人",
                "url": "/company/oneRelatedPersons",
                "data": [
                    {
                        width: getPercentage(1/4),
                        key: "naturalName",
                        text: "企业关联人",
                    },
                    {
                        width: getPercentage(2/4),
                        key: "relations",
                        text: "关联企业名称",
                    },
                    {
                        width: getPercentage(1/4),
                        key: "relations",
                        text: "投资或任职关系",
                    }
                ]
            }
        ],
        [
            {
                "title": "工商变更信息",
                "url": "/registrationChangeList",
                "data": [
                    {
                        width: getPercentage(1 / 7),
                        key: "ID",
                        text: "序号"
                    },
                    {
                        width: getPercentage(1 / 7),
                        key: "changeItems",
                        text: "变更事项"
                    },
                    {
                        width: getPercentage(1 / 7),
                        key: "changeDate",
                        text: "变更日期"
                    },
                    {
                        width: getPercentage(2 / 7),
                        key: "contentBeforeChange",
                        text: "变更前"
                    },
                    {
                        width: getPercentage(2 / 7),
                        key: "contentAfterChange",
                        text: "变更后"
                    }
                ]
            }
        ],
        [
            {
                "title": "法院判决",
                "url": "/companyJudgments",
                "data": [
                    {
                        width: getPercentage(1 / 9),
                        key: "ID",
                        text: "序号"
                    },
                    {
                        width: getPercentage(2 / 9),
                        key: "actionCause",
                        text: "案由"
                    },
                    {
                        width: getPercentage(1 / 9),
                        key: "sentenceDate",
                        text: "审判时间"
                    },
                    {
                        width: getPercentage(1 / 9),
                        key: "litigantType",
                        text: "当事人类型"
                    },
                    {
                        width: getPercentage(3 / 9),
                        key: "caseoutCome",
                        text: "判决结果"
                    },
                    {
                        width: getPercentage(1 / 9),
                        key: "Operation",
                        text: "操作"
                    }
                ]
            }
        ],
        [
            {
                "title": "失信人被执行人",
                "url": '/companyDishonesty',
                "data": [
                    {
                        width: getPercentage(1 / 8),
                        key: "ID",
                        text: "序号"
                    },
                    {
                        width: getPercentage(2 / 8),
                        key: "caseCode",
                        text: "案号"
                    },
                    {
                        width: getPercentage(2 / 8),
                        key: "execCourtName",
                        text: "执行法院"
                    },
                    {
                        width: getPercentage(2 / 8),
                        key: "exeCode",
                        text: "执行依据文号"
                    },
                    {
                        width: getPercentage(1 / 8),
                        key: "caseCreateTime",
                        text: "发布时间"
                    }
                ]
            }
        ],
        [
            {
                "title": "法院公告",
                "url": '/companyCourtNotice',
                "data": [
                    {
                        width: getPercentage(1/11),
                        key: "ID",
                        text: "序号"
                    },
                    {
                        width: getPercentage(2/11),
                        key: "noticePeople",
                        text: "公告人"
                    },
                    {
                        width: getPercentage(5/11),
                        key: "noticeContent",
                        text: "公告内容"
                    },
                    {
                        width: getPercentage(2/11),
                        key: "noticeType",
                        text: "公告类型"
                    },
                    {
                        width: getPercentage(1/11),
                        key: "noticeTime",
                        text: "公告时间"
                    }
                ]
            }
        ],
        [
            {
                "title": "被执行人",
                "url": "/companySubjected",
                "data": [
                    {
                        width: getPercentage(1/8),
                        key: "ID",
                        text: "序号",
                    },
                    {
                        width: getPercentage(2/8),
                        key: "caseCode",
                        text: "案号",
                    },
                    {
                        width: getPercentage(2/8),
                        key: "execCourtName",
                        text: "执行法院",
                    },
                    {
                        width: getPercentage(2/8),
                        key: "execCourtName",
                        text: "执行依据文号",
                    },
                    {
                        width: getPercentage(1/8),
                        key: "caseCreateTime",
                        text: "发布时间",
                    }
                ]
            }
        ],
        [
            {
                "title": "经营异常信息",
                "url": "/businessAnomalyList",
                "data": [
                    {
                        width: getPercentage(1 / 11),
                        key: "ID",
                        text: "序号"
                    },
                    {
                        width: getPercentage(2 / 11),
                        key: "companyName",
                        text: "相关公司"
                    },
                    {
                        width: getPercentage(1 / 11),
                        key: "rankDate",
                        text: "列入日期"
                    },
                    {
                        width: getPercentage(2 / 11),
                        key: "punishOrg",
                        text: "作出决定机关"
                    },
                    {
                        width: getPercentage(2 / 11),
                        key: "busexcepList",
                        text: "列入经营异常名录原因"
                    },
                    {
                        width: getPercentage(1 / 11),
                        key: "removeDate",
                        text: "移出日期"
                    },
                    {
                        width: getPercentage(2 / 11),
                        key: "removeBusexcepList",
                        text: "移出经营异常名录原因"
                    }
                ]
            }
        ],
        [
            {
                "title": "招聘信息",
                "url": '/companyRecruit',
                "data": [
                    {
                        width: getPercentage(1/9),
                        key: "ID",
                        text: "序号"
                    },
                    {
                        width: getPercentage(2/9),
                        key: "jobTitle",
                        text: "职位"
                    },
                    {
                        width: getPercentage(1/9),
                        key: "salary",
                        text: "薪资"
                    },
                    {
                        width: getPercentage(1/9),
                        key: "serviceYear",
                        text: "经验"
                    },
                    {
                        width: getPercentage(2/9),
                        key: "location",
                        text: "地点"
                    },
                    {
                        width: getPercentage(1/9),
                        key: "educationRequired",
                        text: "学历"
                    },
                    {
                        width: getPercentage(1/9),
                        key: "pubdate",
                        text: "发布日期"
                    }
                ]
            }
        ],
        [
            {
                "title": "舆情信息",
                "url": "/riskinfo/opinionInfoList",
                "data": [
                    {
                        width: getPercentage(1 / 8),
                        key: "ID",
                        text: "序号"
                    },
                    {
                        width: getPercentage(4 / 8),
                        key: "opinionInfoTitle",
                        text: "标题"
                    },
                    {
                        width: getPercentage(2 / 8),
                        key: "source",
                        text: "信息来源"
                    },
                    {
                        width: getPercentage(1 / 8),
                        key: "pubdate",
                        text: "发布时间"
                    }
                ]
            }
        ],
        [
            {
                "title": "行政处罚信息",
                "url": '/riskinfo/punishList',
                "data": [
                    {
                        width: getPercentage(1/10),
                        key: "ID",
                        text: "序号"
                    },
                    {
                        width: getPercentage(3/10),
                        key: "litigant",
                        text: "当事人"
                    },
                    {
                        width: getPercentage(1/10),
                        key: "pubdate",
                        text: "发布时间"
                    },
                    {
                        width: getPercentage(1/10),
                        key: "region",
                        text: "地区"
                    },
                    {
                        width: getPercentage(4/10),
                        key: "main",
                        text: "详情"
                    }
                ]
            }
        ]
    ]

    // 背景信息下的所有tab选项卡的数据记录条数
    // 这里主要借助 observe 来观察这个值是否获取完毕
    @observable recordsNumList = {}

    // 内部状态管理
    @observable state = {

        // 背景信息下的所有tab选项卡的数据记录条数
        recordsNumList: null,

        /*
         * @property {Array} companyBgInfoBodyData 背景调查信息表主体数据渲染
         * 关联方信息有两个表，所以用一个二维数组存储数据
         * */
        companyBgInfoBodyData: [[], []],

        /*
         * @property {Number} [companyBgInfoTabIndex=0] 背景调查信息tabs下标
         * 用于点击切换当前选项卡
         * */
        companyBgInfoTabIndex: 0,

        /*
        * @property { Boolean } [tab1hasSearchData=true] 默认是有搜索结果的
        * @property { Boolean } [tab2hasSearchData=true] 默认是有搜索结果的
        * */
        tab1hasSearchData: true,
        tab2hasSearchData: true,

        /*
        * @property { Number } tab1CurPageNum tab1当前页码
        * @property { Number } tab2CurPageNum tab2当前页码
        * */
        tab1CurPageNum: 1,
        tab2CurPageNum: 1,

        /*
        * @property { Number } tab1PagesTotal tab1总共多少页码
        * @property { Number } tab2PagesTotal tab2总共多少页码
        * */
        tab1PagesTotal: 0,
        tab2PagesTotal: 0,

        /*
        * @property { Number } tab1RowsTotal tab1总共多少条记录
        * @property { Number } tab2RowsTotal tab2总共多少条记录
        * */
        tab1RowsTotal: 0,
        tab2RowsTotal: 0,
    }

    /*
    * @property { Function } getDataByUrl 针对切换选项卡时，数据的ajax请求
    * @param { Number } [index=0] 根据当前选项卡下标对应的头部信息数组companyBgInfoHeaderData的下标
    * */
    getDataByUrl(index=0){

        // 根据当前选项卡以及传入的下标index获取请求路径
        let HeaderDataByTabIndex = this.companyBgInfoHeaderData[this.state.companyBgInfoTabIndex];
        let headerDataByIndex = HeaderDataByTabIndex[index];
        let ajaxUrl = headerDataByIndex.url;

        ajax({
            type: 'GET',
            url: ajaxUrl,
            data: {
                token: sessionStorage.token,
                companyId: companyDetailInfoStore.companyId,
                pageNum: this.state[`tab${index + 1}CurPageNum`]
            },
            success: (data)=>{

                let dataList = data.list;
                this.state[`tab${index + 1}RowsTotal`] = data.total;
                this.state[`tab${index + 1}PagesTotal`] = data.pages;
                this.state[`tab${index + 1}hasSearchData`] = data.total ? true : false;

                // 格式化返回的数据，由对象处理成数组
                this.getFormattedData(dataList, headerDataByIndex, index);

                // 针对裁判文书 行政处罚信息 的弹窗详情
                if(headerDataByIndex.title == "法院判决" || headerDataByIndex.title == "行政处罚信息"){ popupStore2.setDetailsPopup(dataList); }
            }
        })
    }

    /*
    * @property getFormattedData 数据格式化处理，将对象处理成数组
    * @param data 需要格式化的数据
    * @param headerData 数据key
    * @param index 存储到companyBgInfoBodyData指定的下标index元素里
    * */
    getFormattedData(data, headerData, index){

        let tmpKey = ''; // 暂存每次遍历的key
        let tmpVal = ''; // 暂存每次遍历的value
        let tmpDataArr = []; // 暂存每行数据
        let tmpBodyDataArr = []; // 暂存表格主体数据
        let curHeaderData = headerData.data; // 表头栏目

        for(let i in data){

            tmpDataArr = [];

            for(let j in curHeaderData){

                // 根据该项目，其中序号【ID】，操作【Operation】字段是不能通过返回数据获取的
                tmpKey = curHeaderData[j].key;
                tmpVal = data[i][tmpKey];

                switch (tmpKey){

                    case "ID":
                        tmpDataArr.push(+i + 1 + (this.state[`tab${index+1}CurPageNum`] - 1)*10); break;

                    case "Operation":
                        tmpDataArr.push("点击查看详情"); break;

                    case "companyIndustry":
                        tmpDataArr.push(companyIndustryStore.companyIndustry[tmpVal]); break;

                    case "opinionInfoTitle":
                        tmpDataArr.push(data[i].title +"bbdUrl" + data[i].bbdUrl); break;

                    default:
                        tmpDataArr.push(tmpVal); break;
                }
            }

            tmpBodyDataArr.push(tmpDataArr);
        }

        this.state.companyBgInfoBodyData[index] = tmpBodyDataArr;
    }

    componentWillMount(){

        // 获取背景信息下的所有tab选项卡的数据记录条数
        let recordsNumList = {};
        let companyBgInfoHeaderData = this.companyBgInfoHeaderData;

        for(let i=0;i<companyBgInfoHeaderData.length;i++){

            ajax({
                type: 'GET',
                url: companyBgInfoHeaderData[i][0].url,
                data: {
                    token: sessionStorage.token,
                    companyId: companyDetailInfoStore.companyId,
                    pageNum: 1
                },

                success: (data) => {
                    recordsNumList[i + ""] = data.total;
                    this.recordsNumList = Object.assign({} , this.recordsNumList, recordsNumList)
                }
            })
        }

        ajax({
            type: 'GET',
            url: companyBgInfoHeaderData[0][1].url,
            data: {
                token: sessionStorage.token,
                companyId: companyDetailInfoStore.companyId,
                pageNum: 1
            },

            success: (data) => {
                recordsNumList["0"] += data.total;
                this.recordsNumList = Object.assign({} , this.recordsNumList, recordsNumList)
            }
        });

        // 使用 Object.assign 才能促使监听有效
        // todo
        observe(this, "recordsNumList", (newValue) =>{

            if(Object.keys(newValue).length == 10){
                this.state.recordsNumList = newValue;
            }
        })

        // 初次渲染
        this.getDataByUrl();
        this.getDataByUrl(1);

        // 用 observe 精准控制
        observe(this, "state", (newValue, oldValue) => {

            let newCompanyBgInfoTabIndex =  newValue.companyBgInfoTabIndex;
            let oldCompanyBgInfoTabIndex =  oldValue.companyBgInfoTabIndex;

            let newTab1CurPageNum =  newValue.tab1CurPageNum;
            let oldTab1CurPageNum =  oldValue.tab1CurPageNum;

            let newTab2CurPageNum =  newValue.tab2CurPageNum;
            let oldTab2CurPageNum =  oldValue.tab2CurPageNum;



            switch (true) {

                case newCompanyBgInfoTabIndex != oldCompanyBgInfoTabIndex :

                    this.state.tab1CurPageNum = 1;
                    this.state.tab2CurPageNum = 1;
                    this.state.companyBgInfoBodyData = [[], []];

                    if(!newCompanyBgInfoTabIndex){
                        this.getDataByUrl();
                        this.getDataByUrl(1);

                    }else {
                        this.getDataByUrl();

                    }; break;

                case newTab1CurPageNum != oldTab1CurPageNum :
                    this.state.companyBgInfoBodyData[0] = [];
                    this.getDataByUrl(); break;

                case newTab2CurPageNum != oldTab2CurPageNum :
                    this.state.companyBgInfoBodyData[1] = [];
                    this.getDataByUrl(1); break;
            }
        })
    }

    render(){

        // 当前选项卡下的表头信息
        let HeaderDataByTabIndex = this.companyBgInfoHeaderData[this.state.companyBgInfoTabIndex];

        // 当前选项卡下的表主体数据
        let tab1headerDataByIndex = HeaderDataByTabIndex[0];
        let tab2headerDataByIndex = HeaderDataByTabIndex[1] || null;
        let tab1bodyDataByIndex = this.state.companyBgInfoBodyData[0];
        let tab2bodyDataByIndex = this.state.companyBgInfoBodyData[1] || null;
        let tab1RowsTotal = this.state.tab1RowsTotal;
        let tab2RowsTotal = this.state.tab2RowsTotal;
        let tab1HasSearchData = this.state.tab1hasSearchData;
        let tab2HasSearchData = this.state.tab2hasSearchData;
        let recordsNumList = this.state.recordsNumList;

        return (
            <div className="company-bg-info">

                {/* 表格tabs */}
                <ul className="company-bg-info-tab">
                    {
                        this.companyBgInfoTabs.map((item, index)=>{

                            let recordsNum = this.recordsNumList[index];

                            recordsNum = recordsNum ? recordsNum : 0;
                            if(recordsNum > 99) recordsNum = "99...";

                            return (
                                <li key={index}
                                    onClick={() => this.setState({companyBgInfoTabIndex: index})}
                                    className={this.state.companyBgInfoTabIndex == index ? "active" : ""}
                                >
                                    {item}
                                    <span>{ recordsNum }</span>
                                </li>
                            )
                        })
                    }
                </ul>

                {/* 表格主体 */}
                <CompanyBgInfoTable
                    headerData={ tab1headerDataByIndex }
                    bodyData={ tab1bodyDataByIndex }
                    rowsCount={ tab1RowsTotal }
                    curPageNum={this.state.tab1CurPageNum}
                    pagesTotal={this.state.tab1PagesTotal}
                    callback={ pageNum => this.setState({tab1CurPageNum: pageNum}) }
                    hasSearchData={ tab1HasSearchData }/>

                <CompanyBgInfoTable
                    headerData={ tab2headerDataByIndex }
                    bodyData={ tab2bodyDataByIndex }
                    rowsCount={ tab2RowsTotal }
                    curPageNum={this.state.tab2CurPageNum}
                    pagesTotal={this.state.tab2PagesTotal}
                    callback={ pageNum => this.setState({tab2CurPageNum: pageNum}) }
                    hasSearchData={ tab2HasSearchData }/>

                {/*<div className="loader" style={{display: this.isShowLoader.get()}}></div>*/}
            </div>
        )
    }
}
// 企业信息-背景调查-表格
@observer
class CompanyBgInfoTable extends Component {

    @observable detailsPopup = {
        title: "",
        content: "",
        casecode: "",
        childTitle: "",
    }

    render(){

        let headerData = this.props.headerData;
        let bodyData = this.props.bodyData;
        let bodyDataLen = bodyData.length;

        if(!headerData) return null;

        return (
            <div className="clearfix" style={{marginTop: this.props.marginTop}}>

                <table className="table">
                        <tbody>
                            <tr className="company-bg-info-tab-notice">
                                <td colSpan="8">{headerData.title}：</td>
                            </tr>
                            <tr className={ bodyDataLen ? "table-head " : "hide" }>
                                {
                                    headerData.data.map((item, index)=>{
                                        return(
                                            <td width={item.width} key={index}>{item.text}</td>
                                        )
                                    })
                                }
                            </tr>
                            {
                                bodyData.map((itemRow, indexRow)=> {

                                    return (
                                        <tr key={indexRow}>
                                            {
                                                itemRow.map((item, index)=>{

                                                    switch (true){

                                                        /* 针对点击查看详情单元格 需要加上 .company-bg-info-lookup */
                                                        case item == "点击查看详情":
                                                            return ( <td key={index} className="company-bg-info-lookup" onClick={() => this.showDetailsPopup(indexRow)}>{item}</td> );

                                                        /* 针对关联信息 */
                                                        case item && "object" == typeof item:
                                                            let tmpItem = toJS(item);

                                                            if(index == 2){
                                                                return null;
                                                            }

                                                            return (<td
                                                                key={index} colSpan="2" >
                                                                <ul style={{maxHeight: "330px", overflowX: "hidden"}}>
                                                                    {
                                                                        tmpItem.map((item, index) => {

                                                                            return (
                                                                                <li key={index} style={{position: "relative"}}>
                                                                                    <span>{item.companyName}</span>
                                                                                    <span style={{position: "absolute", left: "680px"}}>{item.relation || "-"}</span>
                                                                                </li>
                                                                            )
                                                                        })
                                                                    }
                                                                </ul>
                                                            </td>);

                                                        // 针对行政处罚详情
                                                        case headerData.data[index].text == "详情":

                                                            item = item.length > 30 ? item.substr(0, 30) + "..." : item;
                                                            return (<td key={index} className="companyBgInfo__xzcf" onClick={() => this.showDetailsPopup(indexRow)}>{item}</td> );

                                                        // 针对行政处罚详情
                                                        case headerData.data[index].text == "标题":

                                                            let itemInfo = item.split("bbdUrl");

                                                            return (
                                                                <td key={index} >
                                                                    <a
                                                                        href={itemInfo[1]}
                                                                        target="_blank"
                                                                        className="companyBgInfo__yqxxTitle"
                                                                    >{itemInfo[0]}</a>
                                                                </td> );

                                                        default:
                                                            return (
                                                                <td key={index}>
                                                                    <div style={{maxHeight: "330px", overflowX: "hidden"}}> {item || "-"}</div>
                                                                </td> );
                                                    }
                                                })
                                            }
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                 </table>

                <div className={bodyDataLen ? "company-bg-info-records-num" : "hide"}>
                    共<span>{this.props.rowsCount}</span>条
                </div>
                <div className="company-bg-info-page clearfix">

                    <PageComponent
                        curPageNum={this.props.curPageNum}
                        pagesTotal={this.props.pagesTotal}
                        callback={this.props.callback}
                    />
                </div>

                <h2 className={this.props.hasSearchData ? "hide" : "no-list-notice"}
                    style={{
                        height: "28px",
                        fontSize: "14px",
                        lineHeight: "28px",
                        textAlign: "center"
                    }}
                >暂时未搜索到与关键字相关的数据</h2>

                {/* 弹窗 */}
                <DetailsPopup {...this.detailsPopup}/>
            </div>
        )
    }

    // 点击显示弹窗, 查看详情信息
    // 产品不说了
    showDetailsPopup(index){

        let curDetailsPopup = popupStore2.detailsPopup[index];
        popupStore.setDisplay("block");
        this.detailsPopup.title = curDetailsPopup.title;
        this.detailsPopup.content = curDetailsPopup.main;
        this.detailsPopup.pubdate = curDetailsPopup.pubdate;
        this.detailsPopup.casecode = curDetailsPopup.casecode;
        this.detailsPopup.childTitle = curDetailsPopup.actionCause;
    }
}

//企业信息-基本信息
@observer class CompanyBasicInfo extends Component {

    /*
    * @property {Object} companyDetailInfo 企业详情信息
    * */
    @observable companyDetailInfo = {
        jbxx: {},
        gdxx: [],
        baxx: []
    }

    // 控制loader显示隐藏
    isShowLoader = observable("none")

    componentWillMount(){

        // 显示loader
        this.isShowLoader.set("block");

        // 获取企业详情
        ajax({
            type: 'GET',
            url: '/companyDetailInfo',
            data: {
                token: sessionStorage.token,
                companyId: companyDetailInfoStore.companyId
            },
            success: (data)=>{

                // 设置公司详情基本信息，存储在store中，以便别的组件使用
                companyDetailInfoStore.setHeaderData(data.jbxx);
                this.companyDetailInfo = data;

                // 隐藏loader
                this.isShowLoader.set("none");
            }
        })
    }

    render(){
        let jbxx = this.companyDetailInfo.jbxx;
        return (
            <div className="company-basic-info">
                <div className="company-basic-business-info">
                    <CompanyBasicInfoHeader>工商信息</CompanyBasicInfoHeader>
                    <table className="table">
                        <tbody>
                        <tr>
                            <td width={getPercentage(100 / 1361)}></td>
                            <td width={getPercentage(271 / 1361)} className="bold">统一社会信用代码：</td>
                            <td width={getPercentage(309 / 1361)}>{jbxx.creditCode || "-"}</td>
                            <td width={getPercentage(100 / 1361)}></td>
                            <td width={getPercentage(271 / 1361)} className="bold">组织机构代码：</td>
                            <td width={getPercentage(309 / 1361)}>{jbxx.organCode || "-"}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td className="bold">注册号：</td>
                            <td>{jbxx.regno || "-"}</td>
                            <td></td>
                            <td className="bold">经营状态：</td>
                            <td>{jbxx.enterpriseStatus || "-"}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td className="bold">公司类型：</td>
                            <td>{jbxx.companyType || "-"}</td>
                            <td></td>
                            <td className="bold">成立日期：</td>
                            <td>{jbxx.establishDate || "-"}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td className="bold">法定代表人：</td>
                            <td>{jbxx.frname || "-"}</td>
                            <td></td>
                            <td className="bold">营业期限：</td>
                            <td>{jbxx.opento || "-"}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td className="bold">注册资本：</td>
                            <td>{jbxx.regcap || "-"}</td>
                            <td></td>
                            <td className="bold">发照日期：</td>
                            <td>{jbxx.openFrom || "-"}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td className="bold">登记机关：</td>
                            <td colSpan="4">{jbxx.regorg || "-"}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td className="bold">企业地址：</td>
                            <td colSpan="4">{jbxx.address || "-"}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td className="bold">经营范围：</td>
                            <td colSpan="4">
                                <div style={{maxHeight: "330px", overflowX: "hidden"}}>
                                    {jbxx.operateScope || "-"}
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <CompanyBasicInfoShareholder
                    title={"股东信息"}
                    fields={["股东姓名", "股东类型"]}
                    data={this.companyDetailInfo.gdxx}
                />
                <CompanyBasicInfoShareholder
                    title={"任职人员信息"}
                    fields={["姓名", "职务"]}
                    data={this.companyDetailInfo.baxx}
                />
                {/*<div className="loader" style={{display: this.isShowLoader.get()}}></div>*/}
            </div>
        )
    }
}
// 企业信息-基本信息-头部
class CompanyBasicInfoHeader extends  Component {
    render(){
        return (
            <h2 className="company-basic-info-header bold">{ this.props.children }</h2>
        )
    }
}
// 企业信息-基本信息 --股东信息和任职人员信息
@observer class CompanyBasicInfoShareholder extends Component {
    render(){

        // todo

        return (
            <div>
                <CompanyBasicInfoHeader> {this.props.title } </CompanyBasicInfoHeader>
                <table className="table">
                    <tbody>
                    <tr className="table-head">
                        <td width={getPercentage(100 / 1361)}></td>
                        {
                            this.props.fields.map((item, index) => {
                                return (
                                    <td width={getPercentage(1261 / (2 * 1361))} key={index}>{item}</td>
                                )
                            })
                        }
                    </tr>
                    {
                        this.props.data.map((item, index)=>{
                            return (
                                <tr key={index}>
                                    <td width={getPercentage(100 / 1361)}></td>
                                    <td>{item.shareholderName || item.name}</td>
                                    <td>{item.shareholderType || item.position}</td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>
            </div>
        )
    }
}

// 企业信息-企业风险指数
@observer
class CompanyRiskIndex extends Component {

    /*
     * @property {Arrary} [riskIndexAtlasFilter = ['一度', '二度', '三度']] 风险指数图谱筛选
     * @property {Number} [riskIndexAtlasFilterIndex = 0] 风险指数图谱筛选下标
     * */
    riskIndexAtlasFilter = ['一度', '二度', '三度']
    @observable riskIndexAtlasFilterIndex = 0

    /*
    * @property {Object} [atlasImgCompanyDetail = {}] 点击图谱上某公司获取该公司详情弹框
    * */
    @observable atlasImgCompanyDetail = {}

    // 关联图点击放大与缩小
    atlasImgScaleUp(){

        seajs.use("/libs/relativeGraph/assets/script/main/dynamic.js", function (main){
            main.zoomAdd()
        })
    }
    atlasImgScaleDown(){

        seajs.use("/libs/relativeGraph/assets/script/main/dynamic.js", function (main){
            main.zoomSub()
        })
    }

    /*
    * @property riskExceptionList 风险异常提醒列表
    * */
    @observable riskExceptionList = []
    @observable hasRiskException = true

    /*
     * @property {Number} staticRiskData 静态风险指数详情
     * */
    @observable staticRiskData = {flag: true}

    /*
    * @property staticRiskMouseoverNotice 风险指数构成提示显示与隐藏
    * */
    @observable showStaticRiskNotice = {
        display: "none",
        left: 0,
        top: 0,
        tips: ""
    }

    /*
    * @property {Number} queryStatistics 静态风险指数分类统计
    * */
    @observable queryStatistics = {flag: true}

    /*
    * @property {Arrary} staticRiskItemsDetail 静态风险指数点击展开的详情项
    * 用于控制每次点击展开显示的结构以及值
    * */
    @observable staticRiskItemsDetail = [
        [
            {
                name: "单个一度关联自然人最大控制企业数量",
                value:　"maxCompanyNum"
            },
            {
                name: "平均每位一度关联自然人控制企业数量",
                value:　"averagePersonNum"
            },
            {
                name: "核心一度关联自然人",
                value:　"oneLevelPerson"
            }
        ],
        [
            {
                name: "控股子公司自然人股东数量",
                value:　"childCompnayControlPersonNum"
            },
            {
                name: "控股子公司企业法人数量",
                value:　"childChildControlNum"
            },
            {
                name: "核心子公司",
                value:　"coreChildCompany"
            }
        ],
        [
            {
                name: "控股子公司数量",
                value:　"controlChildCompanyNum"
            },
            {
                name: "一度关联企业数量",
                value:　"oneCompanyNum"
            },
            {
                name: "控股子公司",
                value:　"controlCompany"
            }
        ],
        [
            {
                name: "三度关联自然人节点数",
                value:　"threePersonNum"
            },
            {
                name: "二度关联企业法人节点数",
                value:　"twoCompanyNum"
            },
            {
                name: "核心二度关联公司",
                value:　"coreTwoCompany"
            },
            {
                name: "投资类",
                value:　"investment"
            },
            {
                name: "咨询类",
                value:　"advisory"
            },
            {
                name: "贸易类",
                value:　"trade"
            },
            {
                name: "租赁类",
                value:　"lease"
            },
            {
                name: "保理类",
                value:　"factoring"
            },
            {
                name: "公司名单",
                value:　"companyList"
            }
        ],
        [
            {
                name: "6个月以内新成立公司数量",
                value:　"sixMonthNewCompanyNum"
            },
            {
                name: "6个月~1年以内新成立公司数量",
                value:　"toYearNewComapnyNum"
            },
            {
                name: "6个月以内新成立的公司",
                value:　"sixMonthNewCompany"
            }
        ],
        [
            {
                name: "本科人次",
                value:　"undergraduateNum"
            },
            {
                name: "硕士以上人次（包括硕士）",
                value:　"uperUndergraduateNum"
            },
            {
                name: "本科以下人次",
                value:　"followUndergraduateNum"
            },
            {
                name: "top5岗位",
                value:　"top5RecruitmentSum"
            }
        ]
    ];

    /*
    * 静态风险指数列表
    * */
    @observable staticRiskItems = [
        {
            name: '实际控制人风险',
            value:　"realControlRisk"
        },
        {
            name: '公司扩张风险',
            value:　"companyExpandRisk"
        },
        {
            name: '关联方中心集聚化风险',
            value:　"relationInRisk"
        },
        {
            name: '非法融资衍生风险',
            value:　"illegalFinancingRisk"
        },
        {
            name: '短期逐利风险',
            value:　"shortRisk"
        },
        {
            name: '人才结构风险',
            value:　"personStructureRisk"
        },
        {
            name: '资本背景风险',
            value:　"capitalBackgroundRisk"
        },
        {
            name: '关联方非法融资风险',
            value:　"relationFundraisingRisk"
        }
    ];

    /*
    * @property {Number} [staticRiskItemIndex=-1] 静态风险指数点击展开的详情项的下标位置
    * 用于控制展开与收起按钮的切换和更新弹框和趋势图的内容
    *
    * */
    @observable staticRiskItemIndex = -1

    /*
     * 静态风险列表项被点击展开按钮时
     * 切换弹框的显示隐藏
     * */
    @observable staticRiskItemDetailDialog = {
        display: 'none',
        height: 0,
        top: 0
    }

    /*
    * @property {Arrary} [queryDates=[]]  日期下拉列表项
    * @property {Arrary} [queryDataVersion=[]]  日期下拉数据版本
    * @property {String} [dateSelected=""]  日期下拉列表项的选中项
    * */
    @observable queryDates = []
    @observable queryDataVersion = []
    @observable dateSelected = ""

    // 关联图数据获取
    getQueryDynamicPicData(){
        ajax({
            type: 'GET',
            url: '/queryDynamicPicData',
            data: {
                token: sessionStorage.token,
                companyId: companyDetailInfoStore.companyId
            },
            success: (data) => {

                let _this = this;

                // 关联图渲染
                seajs.use("/libs/relativeGraph/assets/script/main/dynamic.js", function (main) {

                    var pointList = data.pointList;
                    if (pointList == null || pointList == "" || pointList == "undefined") {
                        nodes = [];
                    } else {
                        nodes = [];
                        for (var i = 0; i < pointList.length; i++) {
                            var point = pointList[i];

                            var symbol = "rect";
                            if (point.isPerson == "1") {
                                symbol = "circle";
                            }

                            var color = "#FF0000";
                            if (point.level == "1") {
                                color = "#0030AF";
                                if (point.isSonCom == "1") {
                                    color = "#FFCA00";
                                }
                            } else if (point.level == "2") {
                                color = "#36B3EB";
                            } else if (point.level == "3") {
                                color = "#C1C1C1";
                            } else {
                            }

                            nodes[i] = {
                                "addflag": "false",
                                "category": point.level,
                                "color": color,
                                "name": point.name,
                                "symbol": symbol,
                                "isGetCompany":true
                            };
                        }
                    }
                    var lineList = data.lineList;
                    if (lineList == null || lineList == "" || lineList == "undefined") {
                        links = [];
                    } else {
                        links = [];
                        for (var i = 0; i < lineList.length; i++) {
                            var line = lineList[i];
                            var lineType = "line";
                            if (line.isFullLine == "0") {
                                lineType = "dotted";
                            }
                            links[i] = {
                                "addflag": "false",
                                "guanlian": line.type,
                                "line": lineType,
                                "relatedParyName": line.relationship,
                                "source": line.orig,
                                "target": line.target
                            };
                        }
                    }

                    autorun(()=>{

                        // 每次level变化，就重新绘制
                        if(_this.riskIndexAtlasFilterIndex>= 0){

                            level = _this.riskIndexAtlasFilterIndex + 1;
                            main.reDrawCanvas();
                        }
                    })
                });
            }
        })
    }

    // 日期下拉
    getQueryDates(){
        ajax({
            type: 'GET',
            url: '/queryDates',
            data: {
                token: sessionStorage.token,
                companyId: companyDetailInfoStore.companyId
            },
            success: (data)=>{

                // 此处必须使用中间变量 tmpData 暂存日期数组
                let tmpData = [];
                let tmpData2 = [];
                for(let i in data){
                    tmpData.push(data[i].riskDate);
                    tmpData2.push(data[i].dataVersion);
                }

                transaction( ()=>{
                    this.queryDates = tmpData;
                    this.queryDataVersion = tmpData2;
                })
            }
        })
    }

    // 静态指数详情获取
    getStaticRiskData(){
        ajax({
            type: 'GET',
            url: '/staticRiskData',
            data: {
                token: sessionStorage.token,
                dataVersion: this.dateSelected,
                companyId: companyDetailInfoStore.companyId
            },
            success: (res) => {

                let nextStaticRiskIndex = +res.staticRiskIndex.toFixed(1);
                let nowStaticRiskIndex = this.staticRiskData.staticRiskIndex || 0;

                // 渲染风险指数构成echarts
                let pieData = [];
                pieData.push({
                    key: 'realControlRisk',
                    name: '实际控制人风险',
                    value: res.realControlRisk,
                    tips: res.realControlRiskTips
                });
                pieData.push({
                    key: 'personStructureRisk',
                    name: '人才结构风险',
                    value: res.personStructureRisk,
                    tips: res.personStructureRiskTips
                });
                pieData.push({
                    key: ' illegalMoneyFinancingRisk',
                    name: '资本背景风险',
                    value: res.capitalBackgroundRisk,
                    tips: res.capitalBackgroundRiskTips
                });
                pieData.push({
                    key: 'shortRisk',
                    name: '短期逐利风险',
                    value: res.shortRisk,
                });
                pieData.push({
                    key: 'illegalFinancingRisk',
                    name: '非法融资衍生风险',
                    value: res.illegalFinancingRisk,
                    tips: res.illegalFinancingRiskTips
                });
                pieData.push({
                    key: 'relationInRisk',
                    name: '中心集聚化风险',
                    value: res.relationInRisk,
                    tips: res.relationInRiskTips
                });
                pieData.push({
                    key: 'companyExpandRisk',
                    name: '公司扩张风险',
                    value: res.companyExpandRisk,
                    tips: res.companyExpandRiskTips
                });
                pieData.push({
                    key: 'relationFundraisingRisk',
                    name: '关联方非法融资风险',
                    value: res.relationFundraisingRisk,
                    tips: res.relationFundraisingRiskTips
                }); // 关联方非法融资风险

                this.compositionEchartsInit(pieData);

                transaction(() => {

                    this.staticRiskData = res;
                    this.staticRiskData.staticRiskIndex = nextStaticRiskIndex;
                    this.staticRiskData.staticRiskIndexUp = nextStaticRiskIndex - nowStaticRiskIndex;
                    this.riskExceptionList = pieData;
                    this.hasRiskException = pieData.some(function (item) {
                        return item.tips;
                    });
                })
            }
        })
    }

    componentWillMount(){

        // 关联图数据获取
        this.getQueryDynamicPicData();

        // 日期下拉
        this.getQueryDates();

        // 静态指数详情获取
        this.getStaticRiskData();

        // 静态风险指数分类统计
        ajax({
            type: 'GET',
            url: '/queryStatistics',
            data: {
                token: sessionStorage.token,
                companyId: companyDetailInfoStore.companyId
            },
            success: (res) => {
                this.queryStatistics = res;
            }
        })

        // 用户每次点击静态风险指数列表项时 渲染echarts
        autorun(()=>{

            if(this.queryStatistics.flag){
                return;
            }

            switch (this.staticRiskItemIndex){
                case 0:
                    this.staticRiskEchartsInit(this.queryStatistics[this.staticRiskItems[0].value]);
                    break;
                case 1:
                    this.staticRiskEchartsInit(this.queryStatistics[this.staticRiskItems[1].value]);
                    break;
                case 2:
                    this.staticRiskEchartsInit(this.queryStatistics[this.staticRiskItems[2].value]);
                    break;
                case 3:
                    this.staticRiskEchartsInit(this.queryStatistics[this.staticRiskItems[3].value]);
                    break;
                case 4:
                    this.staticRiskEchartsInit(this.queryStatistics[this.staticRiskItems[4].value]);
                    break;
                case 5:
                    this.staticRiskEchartsInit(this.queryStatistics[this.staticRiskItems[5].value]);
                    break;
                case 6:
                    this.staticRiskEchartsInit(this.queryStatistics[this.staticRiskItems[6].value]);
                    break;
                default:
                    this.staticRiskEchartsInit(this.queryStatistics.staticRiskIndex);
                    break;
            }
        })

        atlasImgCompanyDetailDataGet = function () {
            this.atlasImgCompanyDetail = atlasImgCompanyDetail.data;
        }.bind(this);
    }

    /*
     * 指数构成, echarts绘制
     * */
    compositionEchartsInit(pieData){

        // 饼状图每块扇形的背景颜色
        let pieItemColor = [
            {'shortRisk': '#00B8EE'},
            {'relationInRisk': '#10A8AB'},
            {'realControlRisk': '#73D528'},
            {'companyExpandRisk': '#2A7AE9'},
            {'personStructureRisk': '#FFCA00'},
            {'illegalFinancingRisk': '#8BDCC9'},
            {'illegalMoneyFinancingRisk': '#6C79D9'},
        ];

        // 生成静态指数echarts渲染数据
        let pieConfigedData = [];
        for(let i in pieData){
            let tmpVal = +pieData[i].value;

            // 为0 就不显示
            if(tmpVal){
                pieConfigedData.push({
                    value: tmpVal,
                    name: pieData[i].name,
                    tips: pieData[i].tips,
                    itemStyle: {
                        normal: {
                            color: pieItemColor[pieData[i].key]
                        }
                    }
                })
            }
        }

        this.staticRiskCompositionEchartsObj.setOption({
            series : [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius : '80%',
                    center: ['50%', '50%'],
                    data: pieConfigedData,
                    label: {
                        normal: {
                            textStyle: {
                                color: '#4c4c4c',
                                fontSize: 14
                            },
                            formatter: '{b}\n{d}%'
                        }
                    },
                    labelLine: {
                        normal: {
                            show: true
                        }
                    },
                }
            ]
        });

        this.staticRiskCompositionEchartsObj.on("mouseover", (data)=>{

            let tips = data.data.tips;
            if(tips) {
                this.showStaticRiskNotice.display = "block";
                this.showStaticRiskNotice.tips = tips;
            }
        });

        this.staticRiskCompositionEchartsObj.on("mouseout", ()=>{

            this.showStaticRiskNotice.display = "none";
        })
    }

    /*
     * 静态风险趋势echarts绘制
     * @property {Object} staticRiskTrendsEchartsObj  静态风险趋势echarts对象
     * */
    staticRiskTrendsEchartsObj = null

    staticRiskEchartsInit(lineData){

        let xAxisData = [];
        let seriesData = [[], []];

        for(let i=0,len=lineData.length;i<len;i++){

            let tmpData = lineData[i];

            xAxisData.push(tmpData.date);
            seriesData[0].push(tmpData.riskAvg);
            seriesData[1].push(tmpData.riskValue);
        }

        this.staticRiskTrendsEchartsObj.setOption({
            title: {
                text: '风险趋势',
                top: 14,
                left: 8,
                textStyle: {
                    fontSize: 14,
                    color: '#4c4c4c'
                }
            },
            legend: {
                data:['行业平均','公司'],
                right: 35,
                top: 40,
            },
            grid: {
                bottom: 40,
                height: 220,
            },
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: xAxisData
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name:'行业平均',
                    type:'line',
                    symbol: 'circle',
                    data: seriesData[0],
                    lineStyle: {
                        normal: {
                            color: '#85a0ca'
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#85a0ca',
                            borderColor: '#85a0ca'
                        }
                    }
                },
                {
                    name:'公司',
                    type:'line',
                    symbol: 'circle',
                    data: seriesData[1],
                    lineStyle: {
                        normal: {
                            color: '#f19149'
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#f19149',
                            borderColor: '#f19149'
                        }
                    }
                }
            ],
            backgroundColor: '#f7fafd',
        });
    }

    /*
     * 静态风险弹框的top值
     * 静态风险指数列表的每一个li的高度 [liHeight = 40]
     * 静态风险指数详情列表的每一个li的高度 [liHeight2 = 55]
     * 详情弹框距离 父元素顶部的基本距离 [paddingTop = 806]
     * 风险趋势图的高度 [staticRiskTrendsEchartsHeight = 328]
     * */
    liHeight = 40
    liHeight2 = 55
    paddingTop = 477
    staticRiskTrendsEchartsHeight = 328

    /*
    * @property {Number} staticRiskTrendsEchartsTop  静态风险趋势top值
    * */
    @observable staticRiskTrendsEchartsTop = 0

    /*
     * 静态风险指数列表点击展开收起按钮
     * @param {Number} index 用户当前点击的是某一个静态风险指数列表项
     * */
    handleoffFoldAndUnfold(e, index){

        let target = e.target;

        if(target.getAttribute("class") == "fold"){

            // 当前是收起 ，点击后就展开
            this.staticRiskItemIndex = index;

            // 显示弹框
            let len = this.staticRiskItemsDetail[this.staticRiskItemIndex].length; // 详情弹框有多少个列表项
            let top = (index + 1) * this.liHeight + this.paddingTop + index; // 详情弹框的top值
            let height = len * this.liHeight2 + len //详情弹框的高度值

            this.staticRiskItemDetailDialog = {
                display: 'block',
                top: top,

                /*
                * 设置当前点击的li的margin-bottom值
                * 应当包括每个li的高度以及相互之间margin-bottom值以及风险趋势图的高度
                * */
                height: height + this.staticRiskTrendsEchartsHeight + 1,
            };
            this.staticRiskTrendsEchartsTop = height + top;

        }else {
            this.staticRiskItemIndex = -1;
        }
    }

    /*
    * 用户点击查看公司详情按钮
    * 改变路径，刷新当前页面
    * 打过产品
    * 暂时废弃
    * */
    checkCompanyDetailInfo(id){
        window.location.hash = `/intermediaryMonitoring/companyinfo/${id}`;
        window.location.reload();
    }

    render(){
        let {display, left, top, tips} = this.showStaticRiskNotice;

        return (
            <div className="company-risk-index">
                {/* 关联方图谱*/}
                <div className="company-risk-index-atlas">
                    <CompanyRiskIndexHeader title="关联方图谱">
                        {/*<SearchBox></SearchBox>*/}
                    </CompanyRiskIndexHeader>
                    <div className="company-risk-index-atlas-legend">
                        <CompanyRiskIndexLegend
                            textdData={['目标公司', '子公司']}
                            className={['legend-mbgs', 'legend-mbzgs']}
                        />
                        <CompanyRiskIndexLegend
                            textdData={['一度关联公司', '一度关联自然人']}
                            className={['legend-ydglgs', 'legend-ydglzrr']}
                        />
                        <CompanyRiskIndexLegend
                            textdData={['二度关联公司', '二度关联自然人']}
                            className={['legend-edglgs', 'legend-edglzrr']}
                        />
                        <CompanyRiskIndexLegend
                            textdData={['三度关联公司', '三度关联自然人']}
                            className={['legend-sdglgs', 'legend-sdglzrr']}
                        />
                        <CompanyRiskIndexLegend
                            textdData={['投资人', '企业高管']}
                            className={['legend-tzr', 'legend-gg']}
                        />
                        <div>
                            <h2>请选择一下筛选条件</h2>
                            <ul className="clearfix">
                                {
                                    this.riskIndexAtlasFilter.map((item, index)=>{
                                        return (
                                            <li key={index}
                                                onClick={() =>this.riskIndexAtlasFilterIndex = index}
                                                className={this.riskIndexAtlasFilterIndex == index ? "active" : ""}
                                                >{item}</li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </div>

                    {/* 关联方图谱 */}
                    <div className="company-risk-index-atlas-img" >

                        {/* 修正绘制区域 */}
                        <div id="dyMapMain">
                            <div id="dyMap"></div>
                        </div>

                        {/* 风险提示 */}
                        <div className="company-risk-index-atlas__riskNotice">
                            <h2 className="company-risk-index-atlas__riskNoticeTitle">
                                风险提示
                            </h2>
                            <ul className="company-risk-index-atlas__riskNoticeList">
                                {
                                    this.riskExceptionList.map((item, index) => {
                                        let tips = item.tips;

                                        if(tips) {
                                            return (
                                                <li key={index} className="company-risk-index-atlas__riskNoticeItem">{item.tips}</li>
                                            )
                                        }else {
                                            return null;
                                        }
                                    })
                                }

                                {
                                    !this.hasRiskException && <li style={{textAlign: "center"}}>无风险提示信息</li>
                                }
                            </ul>
                        </div>

                        {/* 关联方图谱放大缩小按钮*/}
                        <div className="atlas-img-scale-btn">
                            <button className="btn" onClick={()=> this.atlasImgScaleUp()}>+</button>
                            <button className="btn" onClick={()=> this.atlasImgScaleDown()}>-</button>
                        </div>

                        {/*关联方图谱点击查看公司详情弹框*/}
                        <ul className={this.atlasImgCompanyDetail.companyName ? "atlas-img-company-detail" : "atlas-img-company-detail hide"}>
                            <li className="atlas-img-company-detail-head">
                                <span className="ellipsis" style={{width: 283}} title={this.atlasImgCompanyDetail.companyName}>{ this.atlasImgCompanyDetail.companyName}</span>
                                <span style={{
                                    top: 4,
                                    width: 33,
                                    height: 18,
                                    paddingLeft: 0,
                                    lineHeight: '18px',
                                    textAlign: 'center',
                                    position: 'relative',
                                    backgroundColor: '#fff'
                                }}>{this.atlasImgCompanyDetail.enterpriseStatus || "-"}</span>
                            </li>
                            <li>
                                <span >法人代表:</span>
                                <span className="ellipsis" title = {this.atlasImgCompanyDetail.frname}>{ this.atlasImgCompanyDetail.frname || "-"}</span>
                            </li>
                            <li>
                                <span >公司类型:</span>
                                <span className="ellipsis" title = {this.atlasImgCompanyDetail.companyType}>{ this.atlasImgCompanyDetail.companyType || "-"}</span>
                            </li>
                            <li>
                                <span >注册资本:</span>
                                <span >{ this.atlasImgCompanyDetail.regcap || "-"}</span>
                            </li>
                            <li>
                                <span >注册时间:</span>
                                <span >{ this.atlasImgCompanyDetail.establishDate || "-"}</span>
                            </li>
                            <li>
                                <span >所属行业:</span>
                                <span >{ companyIndustryStore.companyIndustry[this.atlasImgCompanyDetail.companyIndustry] || "-"}</span>
                            </li>
                            <li className={this.atlasImgCompanyDetail.anomaly || this.atlasImgCompanyDetail.monitoring ? "" : "hide"}>
                                <span className="dashed"></span>
                            </li>
                            <li className={this.atlasImgCompanyDetail.anomaly ? "" : "hide"}>
                                <span style={{color: "#ff0000", paddingLeft: 12}}>该公司已被列入经营异常名录中</span>
                            </li>
                            <li style={{paddingLeft: 11}} className={this.atlasImgCompanyDetail.id ? "" : "hide"}>

                                {/* 此处有坑 当前页面，仅仅是切换参数，是不会引起页面刷新的*/}
                                {/* todo 此处不是坑  */}
                                <button className="btn" onClick={() => {this.checkCompanyDetailInfo(this.atlasImgCompanyDetail.id)}}>查看详情</button>
                                {/*<Link className="btn" to={`/intermediaryMonitoring/companyinfo/${this.atlasImgCompanyDetail.id}`}>查看详情</Link>*/}
                            </li>
                        </ul>
                    </div>
                </div>

                {/* 静态风险指数*/}
                <div className="company-risk-index-composition">

                    {/* 静态风险指数头部*/}
                    <CompanyRiskIndexHeader title="风险指数构成" />

                    {/* 静态风险指数头部详情 */}
                    <div>

                        <div>
                            {/*日期选择下拉*/}
                            <div className="company-risk-index-composition-date">
                                <DrawDownBox
                                    type="select1"
                                    borderStyle="gray"
                                    showData={this.queryDates}
                                    realData = {this.queryDataVersion}
                                    callback={(value)=>{
                                        this.dateSelected=value;
                                        this.getStaticRiskData();
                                    }}
                                />
                            </div>

                            {/* 静态风险指数构成图表*/}
                            <div id="company-risk-index-composition-echarts"></div>

                            {/* 针对单个风险指数悬停提示 */}
                            <div className="company-risk-index-composition__notice" style={{display: display, left: left, top: top}}>
                                {tips}
                            </div>
                        </div>

                        <div className="company-static-risk-index">

                            <div >
                                <span>静态风险指数</span>
                                <span>
                                    { this.staticRiskData.staticRiskIndex}
                                    <em className={`static-risk-index-arrow${Math.sign(this.staticRiskData.staticRiskIndexUp)}`}></em>
                                </span>
                            </div>

                            {/* 静态风险趋势图表*/}
                            <div id="company-static-risk-index-echarts"
                                 style={this.staticRiskItemIndex!=-1?{position: 'absolute',top: this.staticRiskTrendsEchartsTop}:{}}></div>

                        </div>

                        {/* 实际控制人风险 */}
                        <ul className="company-controller-risk clearfix">
                            {
                                this.staticRiskItems.map((item, index) => {

                                    let className = "";
                                    // 针对资本风险，关联方非法融资风险，没有点击展开
                                    if(index != 6 && index != 7){
                                        className = index == this.staticRiskItemIndex ? "unfold" : "fold";
                                    }

                                    return (
                                        <li key={index}
                                            className= {this.staticRiskItemIndex == index ? "active" : ""}
                                            style={{marginBottom: this.staticRiskItemIndex == index ? this.staticRiskItemDetailDialog.height : 1}}>
                                            <span>{item.name}</span>
                                            <span>
                                                {/* 字符串转数值型 */}
                                                {this.staticRiskData[item.value] && (+this.staticRiskData[item.value]).toFixed(1)}
                                                <span className={className} onClick={(e)=>{this.handleoffFoldAndUnfold(e, index)}}></span>
                                            </span>
                                        </li>
                                    )
                                })
                            }
                        </ul>

                        {/* 实际控制人风险详情弹框*/}
                        <ul
                            className="company-controller-risk-detail clearfix"
                            style={{display: this.staticRiskItemDetailDialog.display, top: this.staticRiskItemDetailDialog.top}}
                        >
                            {
                                this.staticRiskItemIndex > -1 && this.staticRiskItemsDetail[this.staticRiskItemIndex].map((item, index) => {

                                    let className = "";

                                    // 判断当前显示内容是否含有 "|"
                                    let tmpValStr = this.staticRiskData[item.value];
                                    let tmpValArr = tmpValStr.split("|");
                                    let tmpValArrLen = 0;

                                    tmpValStr = tmpValArr.join("<br/>");
                                    tmpValArrLen = tmpValArr.length;

                                    // todo 用table布局才是合适的
                                    // todo 用table布局才是合适的
                                    // 根据含有的数据内容多少，调整相应样式

                                    switch (tmpValArrLen){
                                        case 1:
                                            if(tmpValStr.length > 15){
                                                className = "risk-detail-overflow-auto two-rows";
                                            }
                                            break;
                                        case 2:
                                            className = "risk-detail-overflow-auto two-rows"; break;
                                        default:
                                            className = "risk-detail-overflow-auto";
                                    }

                                    return (
                                        <li key={index}>
                                            <span className={item.name.length>12 ? "normal" : ""}>{item.name}</span>
                                            <span className={className} dangerouslySetInnerHTML={{__html: tmpValStr}}></span>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>
            </div>
        )
    }

    componentDidMount(){

        // 获取静态风险趋势echarts对象
        this.staticRiskTrendsEchartsObj = echarts.init(document.getElementById("company-static-risk-index-echarts"));

        // 获取静态风险指数构成echarts对象
        let staticRiskCompositionDom = document.getElementById("company-risk-index-composition-echarts");
        this.staticRiskCompositionEchartsObj = echarts.init(staticRiskCompositionDom);

        staticRiskCompositionDom.onmousemove = (e) => {

            this.showStaticRiskNotice.left = e.offsetX + 20;
            this.showStaticRiskNotice.top = e.offsetY + 78;
        }

        // 针对关联方图谱绘图区域外点击关闭
        let dyMapMainDom = document.querySelector("#dyMapMain");
        clickOtherClose(dyMapMainDom, () => {
            this.atlasImgCompanyDetail.companyName = "";
        });
    }

    // 用户搜索关键词的变化需要重新获取数据
    // 这里误导了我对路由的认识
    componentWillReceiveProps(nextProps){
        if(this.props != nextProps){
            this.getCompanySearchData();
        }
    }

    componentWillUnmount(){
        this.dateSelected = null;
    }
}
// 企业信息-企业风险指数-头部
class CompanyRiskIndexHeader extends Component {
    render(){
        return (
            <h2 className="company-risk-index-header">
                { this.props.title }
                { this.props.children || ''}
            </h2>
        )
    }
}
// 企业信息-企业风险指数-图例
class CompanyRiskIndexLegend extends Component {
    render(){
        return (
            <div className="company-risk-index-legend-item">
                <div>
                    <span className={this.props.className[0]}></span>
                    { this.props.textdData[0]}
                </div>
                <div>
                    <span className={this.props.className[1]}></span>
                    { this.props.textdData[1]}
                </div>
            </div>
        )
    }
}
// 企业信息-企业风险指数-搜索框
class SearchBox extends Component {
    render(){
        return (
            <div className="company-search-box">
                <input type="text"/>
                <button></button>
            </div>
        )
    }
}

@observer class IntermediaryMonitoringCompanyInfo extends  Component {

    /*
    * @property {Number} tabIndex 选项卡下标
    * @property {Array} tabs 选项卡
    * */
    @observable tabIndex = 0
    tabs = ["基本信息", "企业风险指数", "背景调查"]

    /*
    * @property {Object} Tmplate 选项卡切换时，内容模板
    * */
    @observable tmplate = null

    componentWillMount(){

        companyDetailInfoStore.setCompanyId(+this.props.params.companyId);

        autorun(()=>{
            // 根据用户选项卡切换，渲染模板内容
            switch (this.tabIndex){
                case 0:
                    this.tmplate = CompanyBasicInfo;break;
                case 1:
                    this.tmplate = CompanyRiskIndex;break;
                case 2:
                    this.tmplate = CompanyBgInfo;break;
            }
        })
    }

    render(){

        let Tmplate = this.tmplate;
        let companyRiskText = "";
        let companyRiskClassName = "";

        switch (companyDetailInfoStore.headerData.level) {

            case "A":
                companyRiskText = "低风险";
                companyRiskClassName = "company__risk--low"; break;

            case "B":
            case "C":
                companyRiskText = "一般风险";
                companyRiskClassName = "company__risk--mid"; break;

            case "D":
                companyRiskText = "高风险";
                companyRiskClassName = "company__risk--high"; break;

            default:
                break;
        }


        return (
            <div className="company-info">

                <div className="company-info-head">
                  {/*  <div>
                        <img src={companyDetailInfoStore.headerData.companyLogo || "/imgs/company-default-logo.png"} alt=""/>
                    </div>*/}
                    <div>
                        <CompanyNameBar
                            status={companyDetailInfoStore.headerData.monitoring ? "已备案" : "未备案"}
                            companyName={companyDetailInfoStore.headerData.companyName}
                            expireDay={companyDetailInfoStore.headerData.expireDay}
                        />
                        <div className="fl"><span className="bold">状态：</span>{companyDetailInfoStore.headerData.enterpriseStatus}</div>
                        <div className="fl"><span className="bold">地址：</span>{companyDetailInfoStore.headerData.address}</div>
                    </div>

                    {/* 公司风险 */}
                    <div className="company__risk">
                        <span>{companyRiskText}</span>
                        <span className={companyRiskClassName}></span>
                    </div>

                    <div>
                        <CompanyRatingBar>{companyDetailInfoStore.headerData.level || "-"}</CompanyRatingBar>
                    </div>
                    <div>
                        <CompanyRelatedPartyBar>{companyDetailInfoStore.headerData.relateNum}</CompanyRelatedPartyBar>
                    </div>
                    <div>
                        <CompanyConcernBar
                            companyId={companyDetailInfoStore.companyId}
                            followType={companyDetailInfoStore.headerData.followAbleTypeString}
                            status={companyDetailInfoStore.headerData.favorite ? "concerned" : "unconcerned"}
                        />
                    </div>
                </div>

                <ul className="company-info-tab">
                    {
                        this.tabs.map((item, index)=>{
                            return (
                                <li key={index} className={this.tabIndex == index ? "active" : ""} onClick={()=>this.tabIndex = index}>{item}</li>
                            )
                        })
                    }
                </ul>

                {/*切换展示  不能使用<{this.tmplate} />*/}
                <Tmplate/>
            </div>
        )
    }

    componentWillUnmount(){
        this.tabIndex = 0;
    }
}
export default IntermediaryMonitoringCompanyInfo;



