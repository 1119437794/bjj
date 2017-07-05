/*
 * @component 收藏夹
 * @author yxc
 * */

import React, { Component }from "react"

import { Link }from "react-router"
import { observer } from "mobx-react"
import { observable, transaction} from "mobx"

import "./style.scss"
import TabsBar from "./TabsBar"
import DrawDownBox from '../common/drawDownBox'
import PageComponent from "../../PageComponent/PageComponent"
import { ajax, getPercentage } from "../../../common/plugins"
import DetailsPopup from "../common/detailsPopup"
import popupStore from "../../../stores/yq/popupStore"
import popupStore2 from "../../../stores/yxc/popupStore"

@observer
class Favorites extends Component {

    // 当前选项卡下标
    curTabIndex = 0

    // 被勾选的记录的数据库id
    selectedRecordsIndex = []

    // 针对收藏信息 公司数据类型
    followTypeIndex = 0
    followTypeFullName = "诉讼信息"

    /*
    * @property { Array } tableHeaders 收藏夹所有表头信息
    *
    * notice：每一个元素如下
    *                   {
    *                     key -- 对应返回数据的字段
    *                     text -- 对应表头标题内容
    *                     width -- 对应标题所占的宽度
    *                   }
    * */
    tableHeaders = [

        // 查询记录表格的头部
        [
            {
                key: "checkbox",
                text: "",
                width: getPercentage(1 / 12)
            },
            {
                key: "companyName",
                text: "公司名称",
                width: getPercentage(3 / 12)
            },
            {
                key: "relatedTotal",
                text: "关联总数",
                width: getPercentage(1 / 12)
            },
            {
                key: "directRelated",
                text: "一度关联",
                width: getPercentage(1 / 12)
            },
            {
                key: "directInvestment",
                text: "直接投资",
                width: getPercentage(1 / 12)
            },
            {
                key: "stockholderInvestment",
                text: "股东投资",
                width: getPercentage(1 / 12)
            },
            {
                key: "lawsuitAmount",
                text: "诉讼记录",
                width: getPercentage(1 / 12)
            },
            {
                key: "level",
                text: "评级",
                width: getPercentage(1 / 12)
            },
            {
                key: "accessTime",
                text: "查询时间",
                width: getPercentage(2 / 12)
            }
        ],

        // 收藏公司表格的头部
        [
            {
                key: "checkbox",
                text: "",
                width: getPercentage(1 / 12)
            },
            {
                key: "companyName",
                text: "公司名称",
                width: getPercentage(3 / 12)
            },
            {
                key: "relatedTotal",
                text: "关联总数",
                width: getPercentage(1 / 12)
            },
            {
                key: "directRelated",
                text: "一度关联",
                width: getPercentage(1 / 12)
            },
            {
                key: "directInvestment",
                text: "直接投资",
                width: getPercentage(1 / 12)
            },
            {
                key: "stockholderInvestment",
                text: "股东投资",
                width: getPercentage(1 / 12)
            },
            {
                key: "lawsuitAmount",
                text: "诉讼记录",
                width: getPercentage(1 / 12)
            },
            {
                key: "level",
                text: "评级",
                width: getPercentage(1 / 12)
            },
            {
                key: "followTime",
                text: "收藏时间",
                width: getPercentage(2 / 12)
            }
        ],

        // 收藏信息表格的头部
        [
            [
                {
                    key: "checkbox",
                    text: "",
                    width: getPercentage(0.5 / 11)
                },
                {
                    key: "followTypeFullName",
                    text: "",
                    width: getPercentage(1 /11)
                },
                {
                    key: "companyName",
                    text: "关联公司",
                    width: getPercentage(2 / 11)
                },
                {
                    key: "changeDate",
                    text: "变更日期",
                    width: getPercentage(1 /11)
                },
                {
                    key: "changeItems",
                    text: "变更事项",
                    width: getPercentage(1.5 /11)
                },
                {
                    key: "contentBeforeChange",
                    text: "变更前",
                    width: getPercentage(2 /11)
                },
                {
                    key: "contentAfterChange",
                    text: "变更后",
                    width: getPercentage(2 /11)
                },
                {
                    key: "followTime",
                    text: "收藏时间",
                    width: getPercentage(1 /11)
                }
            ],
            [
                {
                    key: "checkbox",
                    text: "",
                    width: getPercentage(125 / 1356)
                },
                {
                    key: "followTypeFullName",
                    text: "",
                    width: getPercentage(123 / 1356)
                },
                {
                    key: "companyName",
                    text: "当事人",
                    width: getPercentage(246 / 1356)
                },
                {
                    key: "pubdate",
                    text: "发布时间",
                    width: getPercentage(123 / 1356)
                },
                {
                    key: "region",
                    text: "地区",
                    width: getPercentage(123 / 1356)
                },
                {
                    key: "details",
                    text: "详情",
                    width: getPercentage(493 / 1356)
                },
                {
                    key: "followTime",
                    text: "收藏时间",
                    width: getPercentage(123 / 1356)
                }
            ],
            [
                {
                    key: "checkbox",
                    text: "",
                    width: getPercentage(0.5/7)
                },
                {
                    key: "followTypeFullName",
                    text: "",
                    width: getPercentage(0.5/7)
                },
                {
                    key: "companyName",
                    text: "关联公司",
                    width: getPercentage(1/7)
                },
                {
                    key: "sentenceDate",
                    text: "判决日期",
                    width: getPercentage(1/7)
                },
                {
                    key: "identity",
                    text: "身份",
                    width: getPercentage(1/7)
                },
                {
                    key: "details",
                    text: "详情",
                    width: getPercentage(2/7)
                },
                {
                    key: "followTime",
                    text: "收藏时间",
                    width: getPercentage(1/7)
                }
            ],
            [
                {
                    key: "checkbox",
                    text: "",
                    width: getPercentage(74 / 1356)
                },
                {
                    key: "followTypeFullName",
                    text: "",
                    width: getPercentage(107 / 1356)
                },
                {
                    key: "companyName",
                    text: "关联公司",
                    width: getPercentage(239 / 1356)
                },
                {
                    key: "caseCreateTime",
                    text: "立案日期",
                    width: getPercentage(118 / 1356)
                },
                {
                    key: "caseCode",
                    text: "案号",
                    width: getPercentage(51 /  1356)
                },
                {
                    key: "exeCode",
                    text: "执行依据文号",
                    width: getPercentage(282 / 1356)
                },
                {
                    key: "execCourtName",
                    text: "执行法院",
                    width: getPercentage(202 / 1356)
                },
                {
                    key: "performDegree",
                    text: "被执行人履行情况",
                    width: getPercentage(164 / 1356)
                },
                {
                    key: "followTime",
                    text: "收藏时间",
                    width: getPercentage(119 / 1356)
                }
            ],
            [
                {
                    key: "checkbox",
                    text: "",
                    width: getPercentage(0.5 / 13.5)
                },
                {
                    key: "followTypeFullName",
                    text: "",
                    width: getPercentage(1 / 13.5)
                },
                {
                    key: "companyName",
                    text: "相关公司",
                    width: getPercentage(1.5 / 13.5)
                },
                {
                    key: "rankDate",
                    text: "列入日期",
                    width: getPercentage(1 / 13.5)
                },
                {
                    key: "punishOrg",
                    text: "做出决定机关",
                    width: getPercentage(1.5 / 13.5)
                },
                {
                    key: "busexcepList",
                    text: "列入经营异常名录原因",
                    width: getPercentage(2.5 / 13.5)
                },
                {
                    key: "removeDate",
                    text: "移出日期",
                    width: getPercentage(1.5 / 13.5)
                },
                {
                    key: "removeBusexcepList",
                    text: "移出经营异常名录原因",
                    width: getPercentage(2.5 / 13.5)
                },
                {
                    key: "followTime",
                    text: "收藏时间",
                    width: getPercentage(1.5 / 13.5)
                }
            ],
            [
                {
                    key: "checkbox",
                    text: "",
                    width: getPercentage(74 / 1356)
                },
                {
                    key: "followTypeFullName",
                    text: "",
                    width: getPercentage(129 / 1356)
                },
                {
                    key: "companyName",
                    text: "企业名称",
                    width: getPercentage(206 / 1356)
                },
                {
                    key: "orgName",
                    text: "分支机构名称",
                    width: getPercentage(303 / 1356)
                },
                {
                    key: "establishDate",
                    text: "成立时间",
                    width: getPercentage(121 / 1356)
                },
                {
                    key: "orgName",
                    text: "登记机关",
                    width: getPercentage(304 / 1356)
                },
                {
                    key: "followTime",
                    text: "收藏时间",
                    width: getPercentage(219 / 1356)
                }
            ]
        ]
    ]

    // 当前表头数据
    curTableHeader = []

    @observable state = {

        allChecked: false, // 是否全选
        orderBy: "desc", // 排序方式
        selectedNum: 0, // 选中多少条记录

        curPageNum: 1, // 当前页码
        curPageSize: 10, // 每页显示多少条记录

        tableBody: [[]], // table主体数据
        pagesTotal: 0, // 总共多少页
        recordsTotal: 0, //总共多少条记录

        // 弹窗信息
        detailsPopup: {},

        // 是否显示表头
        isShowTableHeader: true,

        // 针对收藏信息 类型切换全名
        followType : "GSBJ"
    }

    /*
    * @method selectOneItem 勾选或取消勾选单条记录
    * @param item  某条数据
    * @param checkboxFieldIndex  某条数据
    * @param itemId 该条记录数据库id
    * */
    selectOneItem(item, checkboxFieldIndex, itemId){

        let tmpItemVal = item[checkboxFieldIndex].checkbox;
        let selectedNum = this.state.selectedNum;

        if(tmpItemVal){
            // 取消勾选
            selectedNum -- ;
            item[checkboxFieldIndex].checkbox = false;
            let itemIdIndex = this.selectedRecordsIndex.findIndex((value) => {
                return value == itemId;
            });
            this.selectedRecordsIndex.splice(itemIdIndex, 1);

        }else {

            // 勾选
            selectedNum ++;
            item[checkboxFieldIndex].checkbox = true;
            this.selectedRecordsIndex.push(itemId);
        }

        transaction(() => {
            this.state.allChecked = false;
            this.state.selectedNum = selectedNum;
        })
    }

    /*
     * @method selectAllItem 勾选或取消勾选全选
     * */
    selectAllItem(checkboxFieldIndex, idFieldIndex){

        let tableBody = this.state.tableBody;
        let tmpAllCheckedVal = this.state.allChecked;

        // 勾选全选 或 取消勾选全选
        for(let i=0,len=tableBody.length; i<len; i++){

            if(tmpAllCheckedVal){
                // 取消全选
                tableBody[i][checkboxFieldIndex].checkbox = false;
                this.selectedRecordsIndex.splice(i, 1);

            }else {

                //勾选全选
                tableBody[i][checkboxFieldIndex].checkbox = true;
                this.selectedRecordsIndex.push(tableBody[i][idFieldIndex].id);
            }
        }

        transaction(() => {
            this.state.tableBody = tableBody;
            if(tmpAllCheckedVal) {
                // 取消全选
                this.state.selectedNum = 0;
                this.state.allChecked = false;

            }else {

                // 勾选全选
                this.state.allChecked = true;
                this.state.selectedNum = this.state.tableBody.length;
            }
        });
    }

    /*
    * @method handClickDel 点击删除勾选的记录
    * */
    handClickDel(){

        let delSelectedRecord = [
            {
                url: "/favorite/his/del",
                data: {
                    token: sessionStorage.token,
                    hisIds: this.selectedRecordsIndex.join(",")
                }
            },
            {
                url: "/favorite/del",
                data: {
                    token: sessionStorage.token,
                    followAbleTypeString: "COMPANY",
                    ids: this.selectedRecordsIndex.join(",")
                }
            },
            {
                url: "/favorite/del",
                data: {
                    token: sessionStorage.token,
                    followAbleTypeString: this.state.followType,
                    ids: this.selectedRecordsIndex.join(",")
                }
            }];

        let delSelectedRecordItem = delSelectedRecord[this.curTabIndex];

        ajax({
            type: 'POST',
            url: delSelectedRecordItem.url,
            data: delSelectedRecordItem.data,
            success: () => {

                // 清空selectedRecordsIndex
                this.state.curPageNum = 1;
                this.state.selectedNum = 0;
                this.state.allChecked = false;
                this.selectedRecordsIndex = [];

                // 重新获取数据
                this.getTableBodyData();
            }
        })
    }

    /*
    * @method getTableBodyData 获取table渲染数据
    * */
    getTableBodyData(){

        // 分别对应查询记录，收藏公司，收藏信息的请求地址和参数
        let tableBodyDataAjaxHeader = [
            {
                url: "/favorite/his",
                data: {
                    token:sessionStorage.token,
                    orderBy:this.state.orderBy,
                    pageNum:this.state.curPageNum,
                    pageSize:this.state.curPageSize
                }
            },
            {
                url: "/favorite/",
                data: {
                    followType:'COMPANY',
                    token:sessionStorage.token,
                    orderBy:this.state.orderBy,
                    pageNum:this.state.curPageNum,
                    pageSize:this.state.curPageSize
                }
            },
            {
                url: "/favorite/",
                data: {
                    token:sessionStorage.token,
                    orderBy:this.state.orderBy,
                    pageNum:this.state.curPageNum,
                    pageSize:this.state.curPageSize,
                    followType: this.state.followType
                }
            }
        ];
        let tableBodyDataAjaxHeaderItem = tableBodyDataAjaxHeader[this.curTabIndex];

        ajax({
            type: 'GET',
            url: tableBodyDataAjaxHeaderItem.url,
            data: tableBodyDataAjaxHeaderItem.data,

            success: (data) => {
                transaction(() => {

                    // 部分状态重置
                    this.state.selectedNum = 0;
                    this.state.allChecked = false;
                    this.selectedRecordsIndex = [];

                    this.state.pagesTotal = data.pages;
                    this.state.recordsTotal = data.total;

                    this.state.isShowTableHeader = data.list.length ? true : false;
                    this.state.tableBody = this.getFormattedData(data.list);
                })
            }
        });
    }

    /*
    * @method getFormattedData 格式化处理数据
    * @param { Array } data 需要格式化的数据
    * @return { Array } 返回格式化后的数据
    * notice: 返回的数据说明
    *           [
    *               {id: 100},
    *               {companyId: 200},
    *               {checkbox: false},
    *               {followTypeFullName: this.followTypeFullName} // 只有收藏信息表格才有这个字段
    *               .
    *               .
    *               .
    *           ]
    *
    * */
    getFormattedData(data){

        let tmpKey = "";
        let tmpRowArr = [];

        // 获取表头部信息
        let curTabIndex = this.curTabIndex;
        this.curTableHeader = curTabIndex == 2 ?　this.tableHeaders[curTabIndex][this.followTypeIndex] : this.tableHeaders[curTabIndex];

        for(let i=0,len=data.length; i<len; i++){

            let tmpColArr = [];
            for(let j in this.curTableHeader){

                tmpKey = this.curTableHeader[j].key;

                switch (true){

                    // 添加勾选框
                    case tmpKey == "checkbox":
                        tmpColArr.push({checkbox: false}); break;

                    // 针对收藏信息 类型切换
                    case tmpKey == "followTypeFullName":
                        tmpColArr.push({followTypeFullName: this.followTypeFullName}); break;

                    // 针对详情字段数据截取
                    case tmpKey == "details":
                        let tmpMain = data[i].main;
                        tmpMain = tmpMain.length > 30 ? tmpMain.substr(0, 30)+"..." : tmpMain;
                        tmpColArr.push({details: tmpMain});break;

                    // 针对身份的判断处理
                    case tmpKey == "identity":
                        tmpColArr.push({identity: data[i].identity ? "原告" : "被告"});break;

                    default:
                        let tmpObj = {};
                        tmpObj[tmpKey] = data[i][tmpKey];
                        tmpColArr.push(tmpObj);break;
                }
            }

            // 公司id
            tmpColArr.unshift({companyId: data[i].companyId});
            // 记录id 有关注id 就先使用关注id，这表示收藏公司或收藏信息数据
            tmpColArr.unshift({id: data[i].followedId || data[i].id});

            tmpRowArr.push(tmpColArr);
        }

        // 设置详情弹窗信息
        popupStore2.setDetailsPopup(data);

        return tmpRowArr;
    }

    /*
    * @method showDetailsPopup 显示详情弹框
    * */
    showDetailsPopup(index){
        let curDetailsPopup = popupStore2.detailsPopup[index];
        popupStore.setDisplay("block");
        this.state.detailsPopup = curDetailsPopup;
    }

    componentWillMount(){
        this.getTableBodyData();
    }

    render(){

        // 排序下拉框
        let orderDrawDownBoxShowData = this.curTabIndex ? ["收藏时间 ↑", "收藏时间 ↓"] : ["查询时间 ↑", "查询时间 ↓"];

        // 收藏信息类型筛选下拉框
        let filterDrawDownBoxShowData = [
            "工商变更信息",
            "行政处罚信息",
            "诉讼记录",
            "失信人信息",
            "经营异常信息",
            "新增分支机构"];
        let filterDrawDownBoxRealData = [
            'GSBJ',
            'XZCF',
            'SSXX',
            'SXRXX',
            'JYYC',
            'FZJG'];

        // 记录id, 勾选框字段的下标值
        let idFieldIndex = 0;
        let checkboxFieldIndex = 0;

        return (
            <div className="favorite-comp">

                {/* tab 选项卡 */}
                <TabsBar
                    tabs={["查询记录", "收藏公司", "收藏信息"]}
                    callback={(tabIndex) => {

                        transaction(() => {
                            this.followTypeIndex = 0;
                            this.state.orderBy = "desc";
                            this.state.curPageNum = 1;
                            this.state.curPageSize = 10;
                            this.curTabIndex = tabIndex;
                            this.state.followType = "GSBJ";
                            this.followTypeFullName = "工商变更信息";
                            this.getTableBodyData();
                        })
                    }}
                />

                {/* 收藏夹内容主体 */}
                <div className="favorite-comp-main">

                    {/* 主体的头部 */}
                    <div className="favorite-comp-main-head">

                        {/* 全选 */}
                        <label htmlFor="favorite-comp-main-head-check">
                            <input
                                type="checkbox"
                                checked={ this.state.allChecked }
                                id="favorite-comp-main-head-check"
                                onChange={() => this.selectAllItem(checkboxFieldIndex, idFieldIndex)}
                            />
                            全选
                        </label>

                        {/* 已选 */}
                        <div>已选<span className="favorite-comp-main-head-count">{this.state.selectedNum}</span>家</div>

                        {/* 勾选删除按钮 */}
                        <div>
                            <button
                                onClick={() => this.handClickDel()}
                                disabled={this.state.selectedNum ? "" : "disabled"}
                                className={ this.state.selectedNum ? "favorite-comp-main-head-del active":"favorite-comp-main-head-del"}>
                                删除
                            </button>
                        </div>

                        {/* 排序方式*/}
                        <div>
                            排序
                            <DrawDownBox
                                type="select1"
                                borderStyle="blue"
                                showData={orderDrawDownBoxShowData}
                                realData={["asc", "desc"]}
                                current={this.state.orderBy}
                                callback={(orderBy) => {

                                    transaction(() => {
                                        this.state.curPageNum = 1;
                                        this.state.orderBy = orderBy;
                                        this.getTableBodyData();
                                    })
                                }}
                            />
                        </div>

                        {/* 筛选 */}

                        <div className="favorite-comp-main-head-filter" style={{display: this.curTabIndex != 2 ? "none" : "block"}}>
                            筛选
                            <DrawDownBox
                                type="select1"
                                borderStyle="blue"
                                showData={filterDrawDownBoxShowData}
                                realData={filterDrawDownBoxRealData}
                                current={this.state.followType}
                                callback={(followType) => {

                                    transaction(() => {
                                        this.state.followType = followType;
                                        this.followTypeIndex = filterDrawDownBoxRealData.findIndex((value)=> {
                                            return value == followType;
                                        });

                                        this.followTypeFullName = filterDrawDownBoxShowData[this.followTypeIndex];
                                        this.state.curPageNum = 1;
                                        this.state.curPageSize = 10;

                                        this.getTableBodyData();
                                    })
                                }}
                            />
                            {/*<button onClick={()=> {
                                this.state.curPageNum = 1;
                                this.state.curPageSize = 10;
                                this.getTableBodyData();
                            }}>确定</button>*/}
                        </div>
                    </div>

                    {
                        // 这个时候不能用display来实现显示隐藏 只能渲染与不渲染来实现 这应该是table惹的祸

                        this.state.isShowTableHeader
                            ?
                            <div>

                                {/* 主体的数据表格 */}
                                <table className="table">
                                    <tbody>

                                    <tr className="table-head">
                                        {
                                            this.curTableHeader.map((item, index) => {
                                                return (
                                                    <td
                                                        key={index}
                                                        width={item.width}
                                                    >{item.text}</td>
                                                )
                                            })
                                        }
                                    </tr>

                                    {
                                        this.state.tableBody.map((itemRow, indexRow) => {

                                            let id = 0;
                                            let companyId = 0;

                                            return (
                                                <tr key={indexRow}>
                                                    {

                                                        itemRow.map((itemCol, indexCol) => {

                                                            let itemColKey = Object.keys(itemCol)[0];
                                                            let itemColVal = itemCol[itemColKey];

                                                            switch (true){

                                                                // 记录id
                                                                case itemColKey == "id":
                                                                    id = itemColVal;
                                                                    idFieldIndex = indexCol;
                                                                    break;

                                                                // 公司id
                                                                case itemColKey == "companyId":
                                                                    companyId = itemColVal;
                                                                    break;

                                                                // 这是一个勾选框
                                                                case itemColKey == "checkbox":
                                                                    checkboxFieldIndex = indexCol;
                                                                    return (
                                                                        <td key={indexCol} >
                                                                            <input type="checkbox"
                                                                                   checked={itemColVal}
                                                                                   onChange={() => this.selectOneItem(itemRow, indexCol, id)}
                                                                            />
                                                                        </td>
                                                                    );

                                                                // 这是收藏信息类型
                                                                case itemColKey == "followTypeFullName":
                                                                    return <td key={indexCol} >{this.followTypeFullName}</td>;

                                                                // 针对查询记录 和 收藏公司 ，点击公司名跳转
                                                                case itemColKey == "companyName":
                                                                    return (
                                                                        <td key={indexCol}>
                                                                            <Link to={`/intermediaryMonitoring/companyinfo/${companyId}`}>
                                                                                {itemColVal}
                                                                            </Link>
                                                                        </td>
                                                                    );

                                                                // 这是评级数据
                                                                case itemColKey == "level":
                                                                    return <td key={indexCol} className={`level-${itemColVal}`}>{itemColVal}</td>;

                                                                // 这是时间数据
                                                                case /Time$/.test(itemColKey):
                                                                    return <td key={indexCol}>{itemColVal && itemColVal.substr(0, 10)}</td>;

                                                                // 这是详情
                                                                case itemColKey == "details":
                                                                    return (
                                                                        <td key={indexCol}
                                                                            className="hover-underline"
                                                                            onClick={() => this.showDetailsPopup(indexRow)}
                                                                        >{itemColVal || "-"}</td>
                                                                    )

                                                                default:
                                                                    return (
                                                                        <td key={indexCol}>
                                                                            <div style={{maxHeight: "330px", overflowX: "hidden"}}>{itemColVal || "-"}</div>
                                                                        </td>
                                                                    )
                                                            }
                                                        })
                                                    }
                                                </tr>
                                            )
                                        })
                                    }
                                    </tbody>
                                </table>

                                <div className="favorite-comp-main-foot">

                                    <DrawDownBox
                                        type="select1"
                                        borderStyle="blue"
                                        showData={["10条", "20条", "30条"]}
                                        realData={["10", "20", "30"]}
                                        current={this.state.curPageSize}
                                        callback={(pageSize) => {
                                            this.state.curPageSize = pageSize;
                                            this.state.curPageNum = 1;
                                            this.getTableBodyData();
                                        }}
                                    />

                                    <div className="favorite-comp-main-foot-count">共<span>{this.state.recordsTotal}</span>条</div>

                                    {/* 页码组件 */}
                                    <PageComponent
                                        showPages={5}
                                        pagesTotal={this.state.pagesTotal}
                                        curPageNum={ this.state.curPageNum}
                                        callback={(pageNum) => { this.state.curPageNum = pageNum; this.getTableBodyData();}}
                                    />
                                </div>
                            </div>

                            :

                        /* 没有数据提醒 */
                        <h3 className="favorite-comp-main-notice">暂无数据</h3>
                    }
                </div>

                {/* 详情弹框 */}
                <DetailsPopup
                    title={this.state.detailsPopup.title}
                    content={this.state.detailsPopup.main}
                    casecode={this.state.detailsPopup.casecode}
                    childTitle={this.state.detailsPopup.docType}
                    pubdate={this.state.detailsPopup.pubdate}
                />
            </div>
        )
    }
}

export default Favorites;