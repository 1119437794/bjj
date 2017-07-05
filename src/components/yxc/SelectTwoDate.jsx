/*
* @component：日期选择控件
* @author: yxc
* */

import React, { Component } from "react"
import { observer } from "mobx-react"
import { observable, autorun, computed} from "mobx"
import selectDateStore from "../../stores/yxc/selectDateStore"

/*
* @class 选择单个日期
* @property {Number} year
* @property {Number} month
* @property {Number} day
* @property {Array}  days 二维数组，存储一个月的天数，6行7列
* @property {Array}  monthsDaysNum 存储12个月每月拥有的天数
* @property {String} [dateListShow='none'] 控制日期列表的显示隐藏
* @method {Function} getMonthDays 获取指定月份的天数信息
* @method {Function} selectDay 点击选择日期列表的某一天
* @method {Function} monthAndDayFormatter 月份以及天数格式化处理，保证始终占位两个
* */
@observer class SelectOneDate extends Component {

    @observable year
    @observable month
    @observable day
    @observable days = [[], [], [], [], [], []]
    monthsDaysNum = [
        31, 28, 31, 30,
        31, 30, 31, 31,
        30, 31, 30, 31
    ]

    @observable dateListShow = 'none'
    @observable tdSelected = 0

    dateId = ''

    // 默认第一次不显示日期
    // 产品巨坑
    isFirstDate = true

    /*
    * 根据月份获取本月的天数列表
    * */
    getMonthDays(){

        /*
        * 1.获取该月第一天是星期几
        *   以便控制 属性days数组 的第一行元素从第几个位置存储有效值
        * */
        let monthFirstDay = new Date(`${this.year}/${this.month}/01`);
        let monthFirstWeekday = monthFirstDay.getDay();

        /*
         *  2.获取该月 能有多少天
         *  2.1 判断闰年 能被4整除且不能被100整除 || 能被100整除且能被400整除
         *      以便修改 属性monthsDaysNum数组下标为1的元素的值
         * */
        if( (this.year % 4 === 0 && this.year % 100 !== 0) || (this.year % 100 === 0 && this.year % 400 === 0) ) {
            this.monthsDaysNum[1] = 29;
        }else {
            this.monthsDaysNum[1] = 28;
        }

        /*
        * 3.获取指定月份拥有的天数
        * 以便控制 第5步 循环
        * */
        let monthDays = this.monthsDaysNum[this.month-1];

        /*
        * 4.日期计数器
        * 暂存 存入days数组元素值
        * */
        let dayCounter = 0;

        /*
        * 5.6行7列 将指定月的天数数值通过循环存入days数组
        *   每次循环时，先清零
        * */
        this.days = [[], [], [], [], [], []];

        // 5.1 若是用户选择的天数，在切换月份时，注意判断下，该月是否有这一天
        (+this.day > monthDays) && (this.day = monthDays);

        for(let row=0;row<6;row++){
            for(let col=0;col<7;col++){

                /*
                * 当是第一行时 判断 下星期几
                * 以决定 从第几个位置开始存储有效值
                * */
                if(!row && col < monthFirstWeekday){
                    this.days[row].push('');
                }else {
                    // 其余都是累加存入数组
                    dayCounter ++;
                    if(dayCounter <= monthDays){
                        /*
                        * 若是当前日期 该天数需要默认选中
                        * 这里 通过数组形式存储 标志这个位置的元素 是当前日期
                        * */
                        if(dayCounter == +this.day){
                            this.tdSelected = dayCounter;
                            this.days[row].push(dayCounter);
                        }else {
                            this.days[row].push(dayCounter);
                        }
                    }else {
                        this.days[row].push('');
                    }
                }
            }
        }

        /*
        * 6.判断days最后一行是否意义
        *   若是没有意义，就没必要在日期列表显示一个空行
        * */
        if(this.days[5][0] == ''){
            this.days.pop();
        }
    }

    /*
    * 点击选择某一天
    * */
    selectDay(e){

        let curSelectedDay = e.target.textContent;

        // 选择某一天
        this.tdSelected = curSelectedDay;

        // 更改显示日期
        this.day = this.monthAndDayFormatter(curSelectedDay);

        // 隐藏日历
        this.dateListShow = 'none';

        //
        this.setSelectDateStore();

        this.isFirstDate = false;
    }

    /*
    * 点击选择上一月
    * */
    selectPrevMonth(){

        let curMonth = +this.month;

        // 若当前月是一月，那选择前一个月就是去年的12月
        if(curMonth == 1){
            this.month = 12;
            this.year = this.year - 1;
        }else {
            this.month = this.monthAndDayFormatter(curMonth - 1);
        }

        // 重新获取当月天数
        this.getMonthDays();

        this.setSelectDateStore();
    }

    /*
    * 点击选择下一月
    * */
    selectNextMonth(){

        let curMonth = +this.month;

        // 若当前是12月份，后一个月就是明年的一月
        if(curMonth == 12){
            this.month = '01';
            this.year = this.year + 1;
        }else {
            this.month = this.monthAndDayFormatter(curMonth + 1);
        }

        //重新获取当月天数
        this.getMonthDays();

        this.setSelectDateStore();
    }

    /*
    * 设置两个日历组件，到底是谁被点击了，以便做判断
    * 并将每一次的日期或是月份选择后的日期存储到store中，便于别的组件获取
    * TODO 根据后台格式返回出去
    * */

    setSelectDateStore(){
        selectDateStore.curClickedDateId = this.dateId;
        selectDateStore[`${this.dateId}_value`] = new Date(this.dateYMD);
    }

    /*
    * @param {Number} num 月份值或是天数值
    * @return {String} 返回格式化后的值
    * */
    monthAndDayFormatter(num){
        return num < 10 ? '0' + num : num;
    }

    /*
    * 点击日期控件,显示日历，获取日期列表以展示出来
    * */
    showDateList(){
        this.getMonthDays();
        this.dateListShow = 'block';
    }

    /*
    * 清除选择的日期
    * */
    clearSelectedDate(){
        selectDateStore.curClickedDateId = this.dateId;
        selectDateStore[`${this.dateId}_value`] = null;
    }

    // 年/月/日
    @computed get dateYMD(){
        console.log('this.year', this.year)
        return this.year + '/' + this.month + '/' + this.day;
    }

    render(){

        return (
            <div className={`date-control date-control-${this.dateId}`}>

                {/* 显示日期 */}
                <span onClick={() => this.showDateList() }>{ !this.isFirstDate && selectDateStore[`${this.dateId}_value`] ? this.dateYMD : null}</span>

                <table className="date-list" style={{display: this.dateListShow}}>
                    <tbody>
                        <tr>
                            <td >&nbsp;</td>
                            <td className="pointer" onClick={()=>this.selectPrevMonth()}>&lt;</td>
                            <td colSpan="3">
                                <span className="year pointer">{this.year}</span>
                                /
                                <span className="month pointer">{this.month}</span>
                            </td>
                            <td className="pointer" onClick={()=>this.selectNextMonth()}>&gt;</td>

                            {/* 增加清除功能 */}
                            <td className="pointer" onClick={() => {this.clearSelectedDate()}}>清除</td>
                        </tr>
                        <tr className="date-list-week">
                            <td>日</td>
                            <td>一</td>
                            <td>二</td>
                            <td>三</td>
                            <td>四</td>
                            <td>五</td>
                            <td>六</td>
                        </tr>

                        {/* 日期天数选择 */}
                        {
                            this.days.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        {
                                            item.map((item, index) => {

                                                {/*当天日期默认选中状态*/}
                                                if(item == this.tdSelected){

                                                    return (
                                                        <td key={index} className={'selectable-td selected-td'} onClick={(e) => this.selectDay(e)}>
                                                            {item}
                                                        </td>
                                                    )
                                                }else {

                                                    if(item != ''){
                                                        {/* 只有具备selectable-td类的才可以点击*/}
                                                        return (
                                                            <td key={index} className='selectable-td' onClick={(e) => this.selectDay(e)}>
                                                                {item}
                                                            </td>
                                                        )
                                                    }else {

                                                        return (
                                                            <td key={index}>
                                                                {item}
                                                            </td>
                                                        )
                                                    }
                                                }
                                            })
                                        }
                                    </tr>
                                )
                            })
                        }

                    </tbody>
                </table>
            </div>
        )
    }

    componentDidMount(){

        /*
        * 初始化年月日
        * 由于组件通信，这些初始数据必须与store直接联系
        * */
        this.dateId = `date${this.props.date}`;
        autorun(()=>{
            let curDate = selectDateStore[this.dateId];
            this.year = curDate.getFullYear();
            this.month = this.monthAndDayFormatter(curDate.getMonth() + 1);
            this.day = this.monthAndDayFormatter(curDate.getDate());
        })

        // 点击除开日历外的地方,隐藏日历
        let _this = this;
        $(document).click(function (e) {
            let len = $(e.target).closest(`.date-control-${_this.dateId}`).length;
            if(!len){
                _this.dateListShow = 'none';
            }
        })
    }
}


/*
 * @class 选择两个日期
 * */
@observer class SelectTwoDate extends Component {

    constructor(){
        super();

        autorun(()=> {            
            let date1 = selectDateStore.date1_value ? selectDateStore.date1_value.getTime() : selectDateStore.date1.getTime();
            let date2 = selectDateStore.date2_value ? selectDateStore.date2_value.getTime() : selectDateStore.date2.getTime();;
            if( selectDateStore.curClickedDateId == 'date1' && (date1 > date2) ){

                selectDateStore.date2 = selectDateStore.date1_value;
                selectDateStore.date2_value = selectDateStore.date1_value;

            }else if(selectDateStore.curClickedDateId == 'date2' && (date1 > date2) ){

                selectDateStore.date1 = selectDateStore.date2_value;
                selectDateStore.date1_value = selectDateStore.date2_value;

            }
        })
    }

    render(){
        return (
            <div className="two-date-control">
                <SelectOneDate date="1"></SelectOneDate>
                <SelectOneDate date="2"></SelectOneDate>
            </div>
        )
    }
}

export default SelectTwoDate;
