/*
 * @component PageComponent 分页组件
 * @Function 上下页选择
 *           某一页选择
 *           输入页码跳转
 *
 * @props { Number } curPageNum 组件当前页码 @required
 * @props { Number } pagesTotal 总共有多少页码 @required
 * @props { Function } callback 组件回调函数 @required
 * @props { Number } showPages 一次只显示多少页码供用户点击
 *
 * @author yxc
 * @QQ 1119437794
 * */

import React, { Component }from "react"
import "./PageComponent.scss"

class PageComponent extends Component {

    /*
     * @property { Object } inputPageNumDom 输入页码框的dom对象，
     * 避免重复获取
     * */
    inputPageNumDom = null

    /*
    * @property { Number } [showPages=5] 可以显示多少个页码
    * 避免重复判断
    * */
    showPages = 5

    /*
     * @method { Function } selectPageNum 点击选择页码
     * @param { Number } curPageNum 当前页码
     * @param { Number } nextPageNum 新页码
     * @return { Number } 用户输入的页码
     * */
    selectPageNum(curPageNum, nextPageNum){

        let tmpPageNum = curPageNum;
        // 若是点击的上一页 或 下一页，需要特殊处理
        if (nextPageNum == "上一页"){
            tmpPageNum --;

        }else if(nextPageNum == "下一页"){
            tmpPageNum ++;

        }else {
            tmpPageNum = nextPageNum;
        }

        return tmpPageNum;
    }

    /*
     * @method { Function } getPagesList 获取页码列表
     * @param { Number } curPageNum 当前页码
     * @param { Number } showPages 当前组件显示多少页码
     * @param { Number } pagesTotal 总的页码数
     * @return { Array } pagesList 页码列表
     * */
    getPagesList(curPageNum, showPages, pagesTotal){

        // 没有传入总共页码数 或 总共页码数小于1，就没必要显示页码
        if(pagesTotal <= 1 || !pagesTotal) return [];

        // 始终保持当前页码位于中间位置
        let pagesList = []; // 页码列表

        /*
        * 针对供用户选择的页码数 大于总的后台返回的页码
        * 那就只显示，1 - pagesTotal
        * */
        if(showPages > pagesTotal){
            for(let i = 1; i <= pagesTotal; i++){
                pagesList.push(i);
            }

        }else {
            let leftPageNum = Math.floor(showPages / 2); // 当前页码左边应该有多少页码
            let rightPageNum = Math.ceil(showPages / 2); // 当前页码右边应该有多少页码

            // 左边不足的页码数
            let leftShortPageNum = leftPageNum - curPageNum + 1;
            leftShortPageNum = leftShortPageNum > 0 ? leftShortPageNum : 0;

            // 右边不足的页码数
            let tmpRightMaxPageNum = curPageNum + rightPageNum; // 临时获取当前页码右边可能的最大页码
            let rightShortPageNum = pagesTotal - tmpRightMaxPageNum;
            rightShortPageNum = rightShortPageNum > 0 ? 0 : -(rightShortPageNum);

            // 获取当前页码的左边页码
            if(!leftShortPageNum){
                // 左边有足够的页码，并注意将右边不足的页码在左边补足
                let leftStartPageNum = curPageNum - leftPageNum - rightShortPageNum;
                leftStartPageNum = leftStartPageNum > 0 ? leftStartPageNum : 1;

                for (let i = leftStartPageNum; i<= curPageNum; i++){
                    pagesList.push(i);
                }
            }else {
                // 左边没有足够的页码
                for (let i = 1; i <= curPageNum; i++){
                    pagesList.push(i);
                }
            }

            // 获取当前页码的右边页码
            if(!rightShortPageNum){
                // 右边有足够的页码，并注意将左边不足的页码在右边补足
                for (let i = curPageNum + 1; i< curPageNum + leftShortPageNum + rightPageNum; i++){
                    pagesList.push(i);
                }
            }else {
                // 右边没有足够的页码
                for (let i = curPageNum + 1; i <= pagesTotal; i++){
                    pagesList.push(i);
                }
            }

        }

        // 当前不为第一页，那就应该有上一页页码， 同理下一页
        if(curPageNum != 1){
            pagesList.unshift("上一页");
        }
        if(curPageNum != pagesTotal){
            pagesList.push("下一页");
        }

        return pagesList;
    }

    /*
     * @method { Function } fixInputPageNumInRange 输入页码验证，保证必须在1和页码最大值之间
     * @param { Number } inputPageNum 用户输入的页码数
     * @param { Number } pagesTotal 总的页码数
     * @return { Number }tmpInputPageNum 修正过后的用户输入页码
     * */
    fixInputPageNumInRange(inputPageNum, pagesTotal){

        let tmpInputPageNum = "";

        if(inputPageNum !== ""){

            let inputPageNumtoNumber = +inputPageNum;

            if(inputPageNumtoNumber < 1){
                tmpInputPageNum = 1;

            }else if(inputPageNumtoNumber > pagesTotal){
                tmpInputPageNum = pagesTotal;

            }else {
                tmpInputPageNum = inputPageNumtoNumber;
            }
        }

        return tmpInputPageNum;
    }

    /*
    * @method { Function } handleKeyDown 页码输入框keydown事件
    * @param { Object } e 事件对象
    * @param { Number } inputPageNum 输入框页码值
    * @param { Function } callback 键入回车时的回调函数
    *
    * */
    handleKeyDown(e, inputPageNum, callback){

        let keyCode = e.keyCode;

        if(keyCode == 13 && inputPageNum){
            // 当用户输入enter且输入enter之前输入页码框有 有效的页码数值
            callback(inputPageNum);
            return "";

        }else {
            return (keyCode >= 48 && keyCode <= 57 || keyCode >= 96 && keyCode <= 105 || keyCode == 8) ?　true : false;
        }
    }

    componentWillMount(){

        // 获取用户需要展示的页码数，并存储起来
        this.props.showPages && (this.showPages = this.props.showPages);
    }

    render(){

        let curPageNum = this.props.curPageNum;
        let pagesTotal = this.props.pagesTotal;
        let callback = this.props.callback;

        let pagesList = this.getPagesList(+curPageNum, this.showPages, pagesTotal);
        if( !pagesList.length ) return null;

        return (
            <div className="page-component">

                {/* 当前页分页页码显示 */}
                <ul className="page-component-pages">
                    {
                        pagesList.map((item, index) => {

                            let className = "";
                            if(item == "上一页" || item == "下一页"){
                                className = "prev-next";

                            }else if (curPageNum == item){
                                className = "active";
                            }

                            return (
                                <li
                                    key={ index }
                                    className={ className }
                                    onClick={ () => callback(this.selectPageNum(curPageNum, item))}
                                >{ item }</li>
                            );
                        })
                    }
                </ul>

                {/* 后台返回有多少页数据 */}
                <div className="page-component-total">共{ pagesTotal }页</div>

                {/* 当前页输入页码跳转 */}
                <div className="page-component-input-to">
                    <div>
                        {/* 控制输入 */}
                        第<input type="text" ref="inputPageNum" onChange={() => {
                            this.inputPageNumDom.value = this.fixInputPageNumInRange(this.inputPageNumDom.value, pagesTotal);
                        }}/>页
                    </div>
                    <button onClick={() => {
                        if(!this.inputPageNumDom.value) return ;
                        callback(this.inputPageNumDom.value);
                        this.inputPageNumDom.value = ""}}>跳转</button>
                </div>
            </div>
        );
    }

    componentDidMount(){

        this.inputPageNumDom = this.refs.inputPageNum; // 存储输入页码框dom

        /*
         * 监听用户输入是否为数字
         * todo 此处必须通过这样方式处理
         * 注 因为没有页码时，获取的inputPageNumDom为null
         * */
        if( this.inputPageNumDom ){

            this.inputPageNumDom.onkeydown = (e) => {

                let returnVal = this.handleKeyDown(e, this.inputPageNumDom.value, this.props.callback);

                if( returnVal === ""){
                    this.inputPageNumDom.value = returnVal;

                }else {
                    return returnVal;
                }
            }
        }
    }

    shouldComponentUpdate(nextProps){

        // 优化处理
        // todo 针对callback 难道每次都不一样
        return nextProps != this.props && nextProps.pagesTotal == this.props.pagesTotal && nextProps.curPageNum == this.props.curPageNum ? false :true
    }

    componentDidUpdate(){

        // 针对在componentDidMount时，没有获取到inputPageNumDom，再次获取
        if(this.refs.inputPageNum && this.inputPageNumDom != this.refs.inputPageNum){

            this.inputPageNumDom = this.refs.inputPageNum;

            this.inputPageNumDom.onkeydown = (e) => {
                let returnVal = this.handleKeyDown(e, this.inputPageNumDom.value, this.props.callback);

                if( returnVal === ""){
                    this.inputPageNumDom.value = returnVal;

                }else {
                    return returnVal;
                }
            }
        }
    }
}

export default PageComponent;