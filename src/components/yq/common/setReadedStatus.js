/**
 * Created by Administrator on 2016/9/27 0027.
 */
/*
* @function setReadedStatus 点击未读消息，将未读状态设置为已读状态并跳转相应链接
* @param dataIds 未读消息id
* @param riskType 1：注册变更，2：舆情 3：行政处罚 4：失信人信息 5：分支机构 6：经营异常 7：诉讼信息
* @param companyId 公司id
* @author yxc
* */

import { ajax } from "../../../common/plugins"

const setReadedStatus = function (dataIds, riskType, companyId){

    ajax({
        type: 'GET',
        url: "/riskinfo/read",
        data: {
            riskType: riskType,
            dataIds: dataIds + "",
            token: sessionStorage.token
        },
        success: () => {
            window.location.hash = `/intermediaryMonitoring/companyinfo/${companyId}`;
        }
    })
}

export default setReadedStatus;