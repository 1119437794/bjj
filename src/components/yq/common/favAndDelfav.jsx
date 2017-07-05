/**
 * 关注，取消关注的操作(只针对单个关注)
 * @param  {[type]}  id    [description]
 * @param  {Boolean} isDel [description]
 * @param  {type} type 关注对象的类型("COMPANY","GSBJ","XZCF","SSXX","SXRXX","JYYC")
 */
import {ajax} from '../../../common/plugins';
// import favStore from '../../../stores/yq/favStore';
function favAndDelfav(id,isDel,type = "COMPANY",$el){
	// let favId;
	if(isDel){//取消关注
		let followIds = [];
		followIds.push(id)
		ajax({
			url:"/favorite/del",
			type:"POST",
			data:{
				ids:followIds.join(','),
				token:sessionStorage.token,
				followAbleTypeString: type
			},
			success(){
				$el.removeClass('favorited')
				// favStore.setfavId("")
			}
		})
	} else {//添加关注
		ajax({
			url:"/favorite/",
			type:"POST",
			data:{
				followType:type,
				followedId:id.id,
				token:sessionStorage.token
			},
			success(data){
				id.favoriteId = data.id;
				$el.addClass('favorited');
			}
		})		
	}

}
export default favAndDelfav;