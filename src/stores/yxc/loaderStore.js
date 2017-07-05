/**
 * Created by Administrator on 2016/10/24 0024.
 */
import { action,observable } from 'mobx';

class LoaderStore {

    @observable loaderErrorMsg = ""
    @action setLoaderErrorMsg(val){
        this.loaderErrorMsg = val;
    }

    @observable className = ""
    @action setClassName(val){

        if(this.className == val) return;
        this.className = val;
    }
}

const loaderStore = new LoaderStore();
export default loaderStore;