/**
 * Created by Administrator on 2016/9/9 0009.
 */
/*
* @store 公司基本信息中的公共信息
* @author yxc
* */

import { action, observable } from 'mobx';

class CompanyDetailInfoStore {

    /*
    * @property headerData 公司基本信息中的头部公共信息
    * */
    @observable headerData = {}
    @action setHeaderData(data){
        this.headerData = data;
    }

    /*
    * @property updateData 公司基本信息中的变更信息
    * 用于在背景调查显示工商变更
    * */
    @observable updateData = {}
    @action setUpdateData(data){
        this.updateData = data;
    }

    /*
    * @property companyId 公司ID
    * 根据这个ID获取公司详情
    * */
    @observable companyId = 0
    @action setCompanyId(id){
        this.companyId = id;
    }
}

const companyDetailInfoStore = new CompanyDetailInfoStore();

export default companyDetailInfoStore;