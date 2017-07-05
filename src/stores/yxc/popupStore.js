/**
 * 弹框控件的store数据
 */
import { action,observable } from 'mobx';

class PopupStore {

	@observable detailsPopup = {}
	@action setDetailsPopup(data){
		this.detailsPopup = data;
	}
}

const popupStore = new PopupStore();

export default popupStore;