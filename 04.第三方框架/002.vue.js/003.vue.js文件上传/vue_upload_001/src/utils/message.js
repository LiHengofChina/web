import { Message } from 'element-ui'
 
// 提示封装 type 提示类型， msg 提示信息，duration 持续时间
export function message(type, msg, duration) {
	 Message({
		 message: msg || 'success',
		 type: type || 'success',
		 duration: duration || 5 * 1000
	 })
}
 
// 带删除键提示，duration 为 0 时，不会自动消失
// 提示封装 type 提示类型， msg 提示信息，duration 持续时间
export function messageShowClose(type, msg, duration) {
	 Message({
		 message: msg || 'success',
		 type: type || 'success',
		 duration: duration || 0,
		 showClose: true
	 })
}