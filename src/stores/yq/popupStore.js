/**
 * 弹框控件
 */
import { action,observable } from 'mobx';

class PopupView {		
	@action setDisplay(val){
		this.display = val;
	}
	@observable display = 'none'
	
}

const popupView = new PopupView();

export default popupView;