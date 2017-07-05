/*
* @component 对公司添加关注
* @author yxc
*
* 巨能坑：就是我们在别的文件中定义的组件，在本页面使用时，会存在@observable属性干扰问题
* 在此，我使用observable包裹，以及使用set/get方法操作该值，就不会存在干扰的问题！！！
* */

import { observable } from "mobx"
import { observer } from "mobx-react"
import React, { Component } from "react"
import {ajax} from "../../common/plugins"

@observer
class CompanyConcernBar extends Component {

    /*
    * @property {String} [concernStatus=''] 公司的关注状态
    * 根据公司的关注状态切换className
    * */
    concernStatus = observable('')

    // 点击关注公司后返回关注id 用于取消关注
    favoriteId = ""

    render(){
        return (
            <div className="company-concern-bar">
                {
                    this.concernStatus.get() == "concerned" ? "取消收藏：" : "添加收藏："
                }
                <span className={this.concernStatus.get()} onClick={ () => this.handleOffConcernStatus()}></span>
            </div>
        )
    }

    // 点击切换关注与未关注
    handleOffConcernStatus(){
        if(this.concernStatus.get() == 'concerned'){
            ajax({
                type: 'POST',
                url: '/favorite/del',
                data: {
                    token: sessionStorage.token,
                    ids: this.props.companyId,
                    followAbleTypeString: this.props.followType
                },
                success: ()=>{
                    this.concernStatus.set('unconcerned');
                }
            })
        }else {
            ajax({
                type: 'POST',
                url: '/favorite/',
                data: {
                    followType: "COMPANY",
                    token: sessionStorage.token,
                    followedId: this.props.companyId
                },
                success: (data)=>{
                    this.favoriteId = data.id;
                    this.concernStatus.set('concerned');
                }
            })
        }
    }

    componentDidMount(){
        this.concernStatus.set(this.props.status);
    }

    componentWillReceiveProps(nextProps){

        if(nextProps != this.props){
            this.concernStatus.set(nextProps.status);
        }
    }
}

export default CompanyConcernBar;