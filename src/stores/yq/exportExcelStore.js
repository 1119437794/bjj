/**
 * Created by Administrator on 2016/10/20 0020.
 */
/*
* @class ExportExcelStore 用于存储导出excel时
* */

import { observable, action } from 'mobx';

class ExportExcelStore {

    @observable data = {}
    @action setData(data){
        this.data = data;
    }
}

const exportExcelStore = new ExportExcelStore();
export default exportExcelStore;