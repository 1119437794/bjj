/**
 * 阅读新消息
 */
import {ajax} from '../../../common/plugins';
function readMsg(dataIds,riskType){
	ajax({
		url:"/riskinfo/read",
		data:{
			dataIds,
			riskType,
			token:sessionStorage.token
		},
		success:(data)=>{
		}

	})

}
export default readMsg;