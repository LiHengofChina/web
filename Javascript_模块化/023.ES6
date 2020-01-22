
通常情况下，export输出的变量就是本来的名字，
但是可以使用as关键字重命名。
//========================================================= as 暴露: 示例1
//========================================================= as 暴露: 示例1
//===========导出 	
//===========导出 	
var a=1;var b=2;var c=3;
export {a as default} 
			// 就是将a变成了默认暴露
			//只导出一个
//===========导入
//===========导入
import  aaaaa from './es6.js' 
	//一旦是默认暴露就可以自由命名


//========================================================= as 暴露: 示例2
//========================================================= as 暴露: 示例2
//===========导出
//===========导出
var a=1;
var b=2;
var c=3;
export {a as default,b,c}
//===========导入
//===========导入
import  aaaaa,{b,c} from './es6.js'


//========================================================= as 暴露: 示例3
//========================================================= as 暴露: 示例3

//===========导出
//===========导出
function v1() { ... }
function v2() { ... }
export {
  v1 as streamV1,
  v2 as streamV2, 				 //v2重命名，导出了两次
  v2 as streamLatestVersion		 //v2重命名，导出了两次
};


//========================================================= as 引入 : 示例3
//========================================================= as 引入 : 示例3
//===========导出 
//===========导出
var a=1;
var b=2;
var c=3;
export {a,b,c}
//===========导入
//===========导入
import * as obj from './es6.js'  
	//注意此处没有{}  
	//在全部数据都导入obj的时候 
	//也就是使用通配符（*）的时候
	//将全部数据引入 obj 对象	
import {a as obj}  from './es6.js'
	//将 a 属性引入 obj

	
//========================================================= 整体加载	
//========================================================= 整体加载
	
// circle.js
export function area(radius) {
	return Math.PI * radius * radius;
}
export function circumference(radius) {
	return 2 * Math.PI * radius;
}

// main.js
import { area, circumference } from './circle';
console.log('圆面积：' + area(4));
console.log('圆周长：' + circumference(14));


import * as circle from './circle';
console.log('圆面积：' + circle.area(4));
console.log('圆周长：' + circle.circumference(14));

 https://www.jianshu.com/p/ad427d8879cb

