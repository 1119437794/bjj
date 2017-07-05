/**
 * Created by Administrator on 2016/8/30 0030.
 */
/*
* @plugin 公用插件
* @author yxc
* */

import loaderStore from "../stores/yxc/loaderStore"

/*
* 选项卡切换 -- deprecated
* $obj 所有选项卡的jq对象 object
* */
export function tab($obj) {
    $obj.click(function (e) {
        $obj.removeClass("active");
        $(e.target).addClass("active");
    })
}

/*
* 本项目 1920 下 1400的主体内容宽度
* 在屏幕小于 1400 时 采用100%的宽度
* */
export function auto() {

    let clientWidth = document.body.clientWidth;

    if(clientWidth > 1400){
        return 1400;
    }else {
        return "98%";
    }
}

/*
* @method ajax 对jq的ajax封装 应对线上线下环境
* @param { Object } option 请求参数
* */

let flag = window.location.hostname === "127.0.0.1" || window.location.hostname ===  "localhost";
let preUrl = flag ? "http://10.10.20.132" : "";
export function ajax(option) {

    // 显示loader
    // 只要有请求错误 就不能调用setClassName
    if(loaderStore.className != "loaded-error") {
        loaderStore.setClassName("loadering");
    }

    $.ajax({

        type: option.type,
        url: preUrl + option.url,
        data: option.data,
        dataType: 'JSON',
        cache: true,

        success: (res) => {

            let status = res.status;

            switch (status){
                case 200:
                    // 隐藏loader
                    if(loaderStore.className != "loaded-error") {
                        loaderStore.setClassName("");
                    }
                    option.success(res.data);
                    break;

                case 403:
                    window.location.hash = '/Login';
                    break;

                default:
                    // loader错误提醒
                    option.error && option.error(res.message);
                    loaderStore.setClassName("loaded-error");
                    loaderStore.setLoaderErrorMsg("服务器繁忙，请稍后重试");
                    break;
            }
        },

        error:() => {
            loaderStore.setClassName("loaded-error");
            loaderStore.setLoaderErrorMsg("网络错误");
        }
    });
}

/*
* @method getPercentage 获取百分数 针对表格布局时，占比自动计算
* @param { Number } value 需要格式成百分数的值
* */
export function getPercentage(value) { return value * 100 +"%"; }

/*
* @method clickOtherClose 点击其他区域关闭指定的dom
* @param { Object }   targetDom 需要关闭的dom
* @param { Function } callback  回调函数
* todo 被阻止冒泡的情况
* */
export function clickOtherClose(targetDom, callback){

    let isInnerTargetDom = false;

    // 检测 表示target是否位于targetDom内
    targetDom.addEventListener("click", () => { isInnerTargetDom = true; })

    document.body.addEventListener("click", (e) => {
        isInnerTargetDom ? (isInnerTargetDom = false) : callback();

        // todo 针对存在阻止冒泡的情况，使用递归判断
        // let tmpTarget = e.target;
        // for(let i=0 ; 1; i++){
        //
        //     if(!tmpTarget){
        //         callback();break;
        //
        //     }else {
        //         if(targetDom == tmpTarget){
        //             break;
        //         }else {
        //             tmpTarget = tmpTarget.parentNode;
        //         }
        //     }
        // }
    });
}


/**
 * 标准时间转化成yyyy-mm-dd格式
 * @param 标准时间
 * @author yq
 */
export function standardTimeToDate(standardTime){
    let newDate = standardTime && standardTime.toLocaleDateString().replace(/\//g, "-")
    return newDate;
}


