// 字符串相关工具类
// 数组根据分隔符重组为字符串
/**
 * 工具模块
 * 将数据的字符串使用 指定 符号分隔
 * 
 */
export function strRebuildBySplit(arr, split) {
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
	 });
	 return str
}
 
// 截取最后一个特定字符后面的字符串
export function lastSubstring(str, split) {
	 if (str === undefined || str === null || split === undefined || split === null) {
	 	return ''
	 }
	 return str.substring(str.lastIndexOf(split) + 1)
}