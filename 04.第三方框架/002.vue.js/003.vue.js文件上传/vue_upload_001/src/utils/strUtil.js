// 字符串相关工具类
// 数组根据分隔符重组为字符串
export function strRebuild(arr, split) {
	 if (arr === undefined || arr === null || !(arr instanceof Array) || arr.length === 0) {
		 return ''
	 }
	 if (split === undefined || split === null) {
	 	split = '，'
	 }
	 var str = ''
	 arr.forEach((v, i) => {
		 if (i === arr.length - 1) {
		 	str = str + v
		 } else {
		 	str = str + v + split
		 }
	 })
	 return str
}
 
// 截取最后一个特定字符后面的字符串
export function lastSubstring(str, split) {
	 if (str === undefined || str === null || split === undefined || split === null) {
	 	return ''
	 }
	 return str.substring(str.lastIndexOf(split) + 1)
}