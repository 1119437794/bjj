/**
 * Created by Administrator on 2016/9/5 0005.
 */

import { action, observable } from 'mobx';

class SelectDateStore {

    // 时间区间的两个时间
    @observable date1 = new Date()
    @observable date1_value = null
    @observable date2 = new Date()
    @observable date2_value = null

    @observable curClickedDateId = ''
    /*
    * 设置时间
    * @param {String} spaceName 组件的命名空间
    * @param {String} value 时间值
    * */
    @action setDate(spaceName, value){
        this[`date${spaceName}_value`] = value;
    }
}

const selectDateStore = new SelectDateStore();

export default selectDateStore;