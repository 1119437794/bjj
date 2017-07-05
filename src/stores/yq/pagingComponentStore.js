/**
 * 分页控件返回数据
 */
import { action } from 'mobx';

class pagingComponentStore {

	pageNumber = '';
	@action setPageNumber(value){
		this.pageNumber = value;
	}
}

const pagingComponent = new pagingComponentStore();

export default pagingComponent;