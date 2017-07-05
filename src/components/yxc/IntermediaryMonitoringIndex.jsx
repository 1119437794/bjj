/*
* @component: 中介监测平台首页
* @author: yxc
* */

import React, { Component } from "react"
import { observer }from "mobx-react"
import { observable, when, transaction } from 'mobx';
import { Link }from "react-router"

import SearchBox from "./SearchBox"
import DrawDownBox from "../yq/common/drawDownBox"
import PageComponent from "../PageComponent/PageComponent"

import { ajax, getPercentage} from "../../common/plugins"

@observer
class IntermediaryMonitoring extends Component {

    render(){
        return (
            <div className="intermediary-monitoring">
                <img className="intermediary-monitoring-icon" src="/imgs/intermediary-monitoring-icon.png" alt=""/>
                <h2 className="intermediary-monitoring-title">保险中介监测平台</h2>
                <SearchBox></SearchBox>

                {/* 中介监测 三个echarts图表区域*/}
                <div className="zjjc__echarts">
                    <QyFzMap />
                    <JgDqFb />
                    <JqFjQs />
                </div>

                {/* 中介监测 信用评级列表 */}
                <QyXyPj />
            </div>
        )
    }
}

/*
* @class QyFzMap 北京地区企业分支机构地图
* */
@observer
class QyFzMap extends Component {

    /*
     * @property state
     * 主要用于，用户悬停地图上时，信息的显示以及控制弹框的移动
     * */
    @observable state = {
        cityName: '', // 北京城区名
        companyNums: 0, // 某城区拥有的企业数量

        // 弹框信息
        dialogLeft: 0,
        dialogTop: 0,
        dialogShow: false,
    }

    /*
     * @property dialogHeight 详情弹框高度
     * @property dialogContainerHeight 详情弹框容器高度
     * 主要用于，用户移动弹框时，保证始终在可视范围内！
     * */
    dialogHeight = 262
    dialogContainerHeight = 860

    /*
     * @property mapConfig 北京地图的配置信息
     * 主要用于保存ajax返回的配置信息，避免重复请求
     * */
    @observable mapConfig = null

    /*
     * @property mapEchartsContainer 北京绘制地图的echarts对象
     * 避免重复获取
     * */
    mapEchartsObj = null

    /*
     * @property pieEchartsObj 绘制详情的饼状图
     * */
    pieEchartsObj = null

    /*
     * 存储企业法人和分支机构分布信息
     * 避免重复获取
     * */
    @observable branchOrgData = []
    @observable enterLegalData = []

    /*
     * 当前选中的选项卡
     * */
    tabs = ["企业法人", "分支机构"]
    @observable curTabIndex = ''

    /*
     * branchOrgVisualMapMax 企业法人地图数据最大值
     * enterLegalVisualMapMax 分支机构地图数据最大值
     * */
    branchOrgVisualMapMax = 0
    enterLegalVisualMapMax = 0

    // 注销 when
    disposeWhen = null

    componentWillMount(){

        // 获取地图配置信息
        let mapUrl = "";
        switch (sessionStorage.areaName) {
            case "北京":
                mapUrl = "/datas/beijing.json"; break;

            case "上海":
                mapUrl = "/datas/shanghai.json"; break;

            default:
                mapUrl = "/datas/beijing.json"; break;
        }

        $.getJSON(mapUrl, (res) => {
            this.mapConfig = res;
        })

        // 获取企业法人和分支机构的分布信息
        ajax({
            type: 'GET',
            url: '/companyHot/data',
            data: { token: sessionStorage.token},
            success: (data) => {
                let branchOrg = data.BRANCH_ORG;
                let enterLegal = data.ENTER_LEGAL;

                /*
                 * TODO 竟然用户通过返回按钮返回上一页时 不是重新加载该组件
                 * 以至于此处必须重置
                 * */
                this.branchOrgData = [];
                let tmpBranchOrgData = [];
                this.enterLegalData = [];
                let tmpEnterLegalData = [];
                let branchOrgValArr = [];
                let enterLegalValArr = [];

                for(let i in branchOrg){
                    tmpBranchOrgData.push({
                        name: branchOrg[i].areaName,
                        value: branchOrg[i].totalNum,
                        levelPercents: branchOrg[i].levelPercents
                    });
                    branchOrgValArr.push(branchOrg[i].totalNum);
                }
                for(let i in enterLegal){
                    tmpEnterLegalData.push({
                        name: enterLegal[i].areaName,
                        value: enterLegal[i].totalNum,
                        levelPercents: enterLegal[i].levelPercents
                    });
                    enterLegalValArr.push(enterLegal[i].totalNum);
                }

                this.branchOrgVisualMapMax = Math.max.apply(null, branchOrgValArr);
                this.enterLegalVisualMapMax = Math.max.apply(null, enterLegalValArr);

                this.branchOrgData = tmpBranchOrgData;
                this.enterLegalData = tmpEnterLegalData;
            }
        })
    }

    componentDidMount(){

        // 默认选中第一个选项卡
        this.curTabIndex = this.tabs[0];

        // 北京绘制地图的echarts对象
        this.mapEchartsObj = echarts.init(document.getElementById("intermediary-monitoring-graph"));

        // 绘制详情的饼状图
        this.pieEchartsObj = echarts.init(document.getElementById("intermediary-monitoring-detail-graph"));

        this.disposeWhen = when(
            () => {
                return this.mapConfig && this.enterLegalData.length;
            },
            () => {
                // 注册地图配置信息
                echarts.registerMap(name, this.mapConfig);
                // 绘制北京地图，默认渲染的是企业法人
                this.bjEchartInit(this.enterLegalData, this.enterLegalVisualMapMax);
            });

        /*
         * 监听鼠标位置移动
         * 使得 悬停某个城区时该区域之上显示详情弹框
         * */
        this.moveByMouse();
    }

    render(){
        return (
            <div className="intermediary-monitoring-graphs">
                <ul className="intermediary-monitoring-graphs-tab">
                    {
                        this.tabs.map((item, index) => {
                            return (
                                <li key={index} className={this.curTabIndex == item ? "active" : ''} onClick={(e)=>this.handleClickTab(e)}>{item}</li>
                            )
                        })
                    }
                </ul>
                <div id="intermediary-monitoring-graph"></div>
                <div
                    className={this.state.dialogShow ? "intermediary-monitoring-graph-detail":"intermediary-monitoring-graph-detail"}
                    style={{
                        top: this.state.dialogTop,
                        left: this.state.dialogLeft,
                        visibility: this.state.dialogShow ? "visible" : "hidden"
                    }}
                >
                    <h2>{ this.state.cityName }</h2>
                    <h3>企业数量：<span>{ this.state.companyNums }</span></h3>
                    <h3>评级分布：</h3>
                    <div id="intermediary-monitoring-detail-graph"></div>
                </div>
            </div>
        )
    }

    componentWillUnmount(){
        // 手动释放
        this.mapConfig = null;
        this.enterLegalData = [];
    }

    /*
     * @method bjEchartInit 渲染北京地图
     * @param  {Object}  data   echarts的map渲染数据，来自于ajax返回的数据内容
     * @param {Number} visualMapMax echarts的map的数据范围最大值
     * */
    bjEchartInit(data, visualMapMax){

        this.mapEchartsObj.setOption({
            title: {
                text: '企\n业\n数\n量',
                right: 20,
                bottom: 24,
                textStyle: {
                    fontSize: 14,
                    fontWeight: "normal"
                }
            },
            backgroundColor: '#fff',
            visualMap: {
                min: 0,
                max: 180,
                right: "5.6%",
                top: 'bottom',
                text: ["高", "低"],
                hoverLink: false,
                inRange: {
                    symbolSize: [10, 70],
                    color: ["#009bff", "#9309da"]
                },
                textStyle: {
                    fontSize: 14
                }
            },
            series: [
                {
                    type: 'map',
                    mapType: name,
                    data: data,
                    label: {
                        emphasis: {
                            textStyle: {
                                color: '#fff'
                            }
                        }
                    }
                }
            ]
        });

        // 监听鼠标在地图上悬停情况 并及时更新弹框详情信息
        this.mapEchartsObj.on("mouseover", (data) => {

            this.state.dialogShow = true;
            this.state.cityName = data.name;
            this.state.companyNums = data.value;

            // 绘制城区详情饼状图
            this.bjCityEchartInit(data.data.levelPercents);
        })

        // 离开地图区域，弹框消失
        this.mapEchartsObj.on("mouseout", () => {
            this.state.dialogShow = false;
        })


        // 存入全局对象里 以便销毁
        window.allEcharts.push(this.mapEchartsObj);
    }

    /*
     * 绘制北京各个城区的企业详情信息echarts
     * @param {Object} data 等级及各占比信息
     * */
    bjCityEchartInit(data){

        let color = ''; // 饼状图四个等级颜色
        let pieData = []; // 饼状图渲染数据

        for(let i in data){

            switch (i){
                case 'A':
                    color = '#00b8ee'; break;
                case 'B':
                    color = '#73D528'; break;
                case 'C':
                    color = '#F88625'; break;
                case 'D':
                    color = '#FE0000'; break;
            }

            pieData.push({
                value: data[i],
                name: `${i}级`,
                itemStyle: {
                    normal: {
                        color: color
                    }
                }
            })
        }

        this.pieEchartsObj.setOption({
            series : [
                //两组相同数据重叠实现
                {
                    name: '访问来源',
                    type: 'pie',
                    radius : '80%',
                    center: ['50%', '50%'],
                    data:pieData,
                    label: {
                        normal: {
                            position: 'inside',
                            textStyle: {
                                color: '#fff',
                                fontSize: 14
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    }
                },
                {
                    name: '访问来源',
                    type: 'pie',
                    radius : '80%',
                    center: ['50%', '50%'],
                    data: pieData,
                    label: {
                        normal: {
                            textStyle: {
                                color: '#333',
                                fontSize: 14
                            },
                            formatter: '{d}%',
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false,
                            length:  4,
                            length2: 4,
                            length3: 4,
                            length4: 4,
                        }
                    },
                }
            ]
        });
        // window.allEcharts.push(this.pieEchartsObj);
    }

    /*
     * 控制弹框的移动
     * 根据鼠标移动改变详情弹框的left与top值
     * */
    moveByMouse(){

        $('#intermediary-monitoring-graph').on('mousemove', (e) => {

            let dialogNextHeight = e.offsetY + 100; // 弹框下一个位置的top值
            let moveAreaHeight = this.dialogContainerHeight - this.dialogHeight; // 可移动 且 不被遮挡的区域的高度

            /*if(dialogNextHeight > moveAreaHeight){
                dialogNextHeight = moveAreaHeight;
            }*/

            this.state.dialogLeft = e.offsetX + 40 + 'px';
            this.state.dialogTop = dialogNextHeight + 'px';
        })
    }

    // 鼠标点击切换tab以及更新地图渲染
    handleClickTab(e){

        let text = e.target.textContent;
        this.curTabIndex = text;

        if(text == this.tabs[0]){
            this.bjEchartInit(this.enterLegalData, this.enterLegalVisualMapMax);
        }else {
            this.bjEchartInit(this.branchOrgData, this.branchOrgVisualMapMax);
        }
    }
}

/*
* @class JgDqFb 机构地区分布
* */
@observer
class JgDqFb extends Component {

    render(){
        return (
            <div className="JgDqFb__root" id="JgDqFb__root"></div>
        )
    }

    componentDidMount(){

        let jgDqFbRootEchart = echarts.init(document.querySelector("#JgDqFb__root"));

        ajax({
            type:"GET",
            url:"/areaCompanyCounts",
            data:{ token:sessionStorage.token },

            success: (data) => {

                let areaNameArr = [];
                let areaValArr = [];

                data.map((item) => {
                    areaNameArr.push(item.areaName);
                    areaValArr.push(item.totalNum);
                })

                let barBgImg = new Image();
                barBgImg.onload = function () {
                    jgDqFbRootEchart.setOption({

                        title: {
                            text: `${sessionStorage.areaName}保险中介机构地区分布图`,
                            textStyle:{
                                color:'#4c4c4c',
                                fontWeight:'normal',
                                fontSize:16
                            },
                            left:15,
                            top:13
                        },

                        tooltip: {
                            formatter:function(data){
                                return data.name+':'+data.value
                            }
                        },

                        grid: {
                            left: '3%',
                            right: '10%',
                            bottom: '3%',
                            top:'15%',
                            containLabel: true
                        },

                        backgroundColor: '#fff',

                        xAxis: {
                            type: 'value',
                            //name:'企业数量',
                            nameTextStyle:{
                                color:'#333'
                            },
                            axisTick:{
                                show:false
                            },
                            splitLine:{
                                show:true
                            },
                            axisLine:{
                                lineStyle:{
                                    color:'#e8e8e8'
                                }
                            },
                            axisLabel:{
                                textStyle:{
                                    color:'#4c4c4c'
                                }
                            },
                        },

                        yAxis: {
                            type: 'category',
                            //name:'地区',
                            nameTextStyle:{
                                color:'#333'
                            },
                            axisTick:{
                                show:false
                            },
                            axisLine:{
                                lineStyle:{
                                    color:'#e8e8e8'
                                }
                            },
                            axisLabel:{
                                textStyle:{
                                    color:'#4c4c4c'
                                }
                            },
                            data: areaNameArr
                        },

                        series: [
                            {
                                type: 'bar',
                                barWidth:12,
                                data: areaValArr,
                                itemStyle:{
                                    normal:{
                                        color:{
                                            image:barBgImg,
                                            repeat:'repeat-y'
                                        }
                                    }
                                }

                            }
                        ]
                    });
                };
                barBgImg.src = '/imgs/charts-bar.png';
            }
        })
    }
}

/*
* @class JqFjQs 机构分级趋势
* */
@observer
class JqFjQs extends Component {

    render(){
        return (
            <div className="JqFjQs__root" id="JqFjQs__root"></div>
        )
    }

    componentDidMount(){

        let jqFjQsRootEchart = echarts.init(document.getElementById("JqFjQs__root"));

        ajax({
            type: 'GET',
            url: "/levelStatistic",
            data: { token:sessionStorage.token },

            success: (data) => {
                //_this.state.allData = data;

                let xAxisMonthData = [];
                let monthLen = data.A.length;

                // x 轴显示monthLen个月份
                let curDate = new Date();
                let curYear = curDate.getFullYear();
                let curMonth = curDate.getMonth() + 1;

                if(curMonth < monthLen){
                    // 还需要另加去年月份个数 leftMonths

                    let leftMonths = monthLen -curMonth;
                    for(let i = leftMonths - 1; i >=0; i--){
                        xAxisMonthData.push((curYear-1) + "-" + (12 - i));
                    }
                }

                for(let i = 1; i <= curMonth; i++){
                    xAxisMonthData.push(curYear + "-" + i);
                }

                jqFjQsRootEchart.setOption({

                    title: {
                        text: `${sessionStorage.areaName}保险中介机构分级趋势图`,
                        textStyle:{
                            color:'#4c4c4c',
                            fontWeight:'normal',
                            fontSize:16
                        },
                        left:15,
                        top:20
                    },

                    legend: {
                        data:['A级','B级','C级','D级'],
                        right:'5%',
                        top:20
                    },

                    tooltip: {
                        trigger: 'axis'
                    },

                    grid: {
                        left: '3%',
                        //right: '5%',
                        bottom: '7%',
                        top:'17%',
                        containLabel: true,
                        show:true,
                        borderColor:'#d9d9d9'
                    },

                    backgroundColor: '#fff',

                    xAxis: {
                        type: 'category',

                        boundaryGap: false,
                        splitNumber:12,
                        axisTick:{
                            show:false
                        },
                        splitLine:{
                            show:true
                        },
                        axisLine:{
                            lineStyle:{
                                color:'#e8e8e8'
                            }
                        },
                        axisLabel:{
                            textStyle:{
                                color:'#4c4c4c'
                            }
                        },
                        data: xAxisMonthData
                    },

                    yAxis: {
                        type: 'value',
                        splitNumber:10,
                        //name:'企业数量',
                        nameTextStyle:{
                            color:'#333'
                        },
                        axisTick:{
                            show:false
                        },
                        axisLine:{
                            lineStyle:{
                                color:'#e8e8e8'
                            }
                        },
                        axisLabel:{
                            textStyle:{
                                color:'#4c4c4c'
                            }
                        },
                    },

                    series: [
                        {
                            name:'A级',
                            type:'line',
                            data: data.A
                        },
                        {
                            name:'B级',
                            type:'line',
                            data: data.B
                        },
                        {
                            name:'C级',
                            type:'line',
                            data: data.C
                        },
                        {
                            name:'D级',
                            type:'line',
                            data: data.D
                        }
                    ],

                    color:['#ff0000','#2a7bea', '#5cb85c', '#f98625']
                })
            }
        });
    }
}

/*
 * @class QyXyPj 企业信用评级tab切换组件
 * */
class QyXyPjTab extends Component {

    state = {
        curTabIndex: 0
    }

    render(){

        let tabs = this.props.tabs;
        let callback = this.props.callback

        return (
            <ul className="QyXyPjTab__root">
                {
                    tabs.map((item, index) => {

                        let className = "QyXyPjTab__item ";
                        className += index == this.state.curTabIndex ? "QyXyPjTab__item--active " : " ";

                        if(/[ABCD]/.test(item)) {
                            className += `QyXyPjTab__item--${item}`;
                        }

                        return (
                            <li
                                key={index}
                                className={className}
                                onClick={
                                    () => {
                                        this.setState({curTabIndex: index});
                                        callback(index);
                                    }
                                }
                            >{item}</li>
                        )
                    })
                }
            </ul>
        )
    }
}

/*
 * @class QyXyPj 企业信用评级
 * */
@observer
class QyXyPj extends Component {

    @observable state = {
        curLevel: "",
        curArea: "",
        curOrderType: "desc",
        levelNameList: ["全部", "A", "B", "C", "D"],
        levelCodeList: ["", "A", "B", "C", "D"],
        areaNameList: [],
        areaCodeList: [],

        tableData: [],
        curPageNum: 1,
        curPageSize: 10,
        curPagesTotal: 0,
        curRecordTotal: 0
    }

    /*
    * @method 获取企业评级数据
    * */
    getCreditCompanies(){

        ajax({
            type:"GET",
            url:'/creditCompanies',
            data:{
                token:sessionStorage.token,
                level:this.state.curLevel,
                areaId:this.state.curArea,
                orderBy:this.state.curOrderType,
                pageNum:this.state.curPageNum,
                pageSize:this.state.curPageSize
            },

            success: (data) => {
                this.state.tableData = data.list;
                this.state.curPagesTotal = data.pages;
                this.state.curRecordTotal = data.total;
            }
        })
    }

    componentWillMount(){

        // 获取北京市城区
        // 用于切换显示指定城区的数据
        ajax({
            type:"GET",
            url:"/areas",
            data:{ token:sessionStorage.token },

            success: (data) => {
                let tmpAreaNameList = [];
                let tmpAreaCodeList = [];

                data.map((item) => {
                    tmpAreaNameList.push(item.name);
                    tmpAreaCodeList.push(item.areaId);
                });

                tmpAreaNameList.unshift("全部");
                tmpAreaCodeList.unshift("");

                transaction(() => {
                    this.state.areaNameList = tmpAreaNameList;
                    this.state.areaCodeList = tmpAreaCodeList;
                })
            }
        });

        this.getCreditCompanies();
    }

    render(){
        return (
            <div className="QyXyPj__root">
                <h2 className="QyXyPj__title">{sessionStorage.areaName}地区企业信用评级概况</h2>

                <div className="QyXyPj__level">
                    <div className="QyXyPj__levelTitle">等级：</div>
                    <QyXyPjTab
                        tabs={ this.state.levelNameList}
                        callback={(index) => {
                            transaction(() => {
                                this.state.curLevel = this.state.levelCodeList[index];
                                this.state.curPageNum = 1;
                                this.getCreditCompanies();
                            })
                        }}
                    />
                </div>

                <div className="QyXyPj__dashed"></div>

                <div className="QyXyPj__area">
                    <div className="QyXyPj__areaTitle">区域：</div>
                    <QyXyPjTab
                        tabs= { this.state.areaNameList }
                        callback={(index) => {
                            transaction(() => {
                                this.state.curArea = this.state.areaCodeList[index];
                                this.state.curPageNum = 1;
                                this.getCreditCompanies();
                            })
                        }}
                    />
                </div>

                {/* 企业名单 */}
                <div className="QyXyPj__qymd">

                    <div className="QyXyPj__qymdHead">
                        <h2 className="QyXyPj__qymdHeadTitle">
                            企业名单
                        </h2>

                        <DrawDownBox
                            type="select2"
                            borderStyle="gray"
                            showData={['风险指数从高到低排列','风险指数从低到高排列']}
                            realData={['desc','asc']}
                            callback={(orderType) => {
                                this.state.curOrderType = orderType;
                                this.getCreditCompanies();
                            }}
                        />
                    </div>

                    <div className="QyXyPj__qymdBody">
                        <table className="table">
                            <tbody>
                            <tr className="table-head">
                                <td width={getPercentage(40 / 1363)}></td>
                                <td width={getPercentage(213 / 1363)}>序号</td>
                                <td width={getPercentage(213 / 1363)}>公司评级</td>
                                <td width={getPercentage(616 / 1363)}>公司名称</td>
                                <td width={getPercentage(213 / 1363)}>BBD风险指数</td>
                                <td width={getPercentage(67 / 1363)}>操作</td>
                            </tr>

                            {
                                this.state.tableData.map((item, index) => {

                                    return (
                                        <tr key={index}>
                                            <td></td>
                                            <td>{(this.state.curPageNum-1) * this.state.curPageSize + index + 1}</td>
                                            <td className={`QyXyPj__qymdBodyLevel${item.level}`}>{item.level}</td>
                                            <td>
                                                {item.companyName}
                                                <span className={item.favoriteId && "QyXyPj__qymd--favorite"}></span>
                                            </td>
                                            <td style={{fontWeight: "bold"}}>{item.staticRiskIndex.toFixed(1)}</td>
                                            <td>
                                                <Link to={`/intermediaryMonitoring/companyinfo/${item.id}`}>更多</Link>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        </table>
                    </div>

                    <div className="QyXyPj__qymdFoot">

                        <DrawDownBox
                            type="select1"
                            borderStyle="gray"
                            showData={["10条", "20条", "30条"]}
                            realData={[10, 20, 30]}
                            callback={(pageSize) => {
                                transaction(() => {
                                    this.state.curPageNum = 1;
                                    this.state.curPageSize = pageSize;
                                    this.getCreditCompanies();
                                })
                            }} />

                        <div className="QyXyPj__qymdTotal">
                            共
                            <span>
                                {this.state.curRecordTotal}
                            </span>
                            条
                        </div>

                        <PageComponent
                            curPageNum={this.state.curPageNum}
                            pagesTotal={this.state.curPagesTotal}
                            showPages={5}
                            callback={(pageNum) => {
                                this.state.curPageNum = pageNum;
                                this.getCreditCompanies();
                            }}
                        />
                    </div>
                </div>
            </div>
        )
    }
}


export default IntermediaryMonitoring;