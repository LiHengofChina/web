const calcUtil = {
	/*
	 * 将数值四舍五入后格式化. @param num 数值(Number或者String) @param cent要保留的小数位(Number)
	 * @return 格式的字符串,如'1,234,567.45' @type String
	 * 调用：CalcUtil.FormatNumber(num,cent,isThousand)
	 */
	formatMoney(num, cent) {
		num = num.toString().replace(/\$|\\,/g, '');
		if (isNaN(num)) {// 检查传入数值为数值类型.
			num = "0";
		}
		if (isNaN(cent)) {// 确保传入小数位为数值型数值.
			cent = 0;
		}
		//var isThousand = 1;
		cent = parseInt(cent);
		cent = Math.abs(cent);// 求出小数位数,确保为正整数.
		//isThousand = parseInt(isThousand);

		var sign = (num == (num = Math.abs(num)));// 获取符号(正/负数)
		// Math.floor:返回小于等于其数值参数的最大整数
		num = Math.floor(num * Math.pow(10, cent) + 0.5000000000001);// 把指定的小数位先转换成整数.多余的小数位四舍五入.
		var cents = num % Math.pow(10, cent); // 求出小数位数值.
		num = Math.floor(num / Math.pow(10, cent)).toString();// 求出整数位数值.
		cents = cents.toString();// 把小数位转换成字符串,以便求小数位长度.
		while (cents.length < cent) {// 补足小数位到指定的位数.
			cents = "0" + cents;
		}
		// 对整数部分进行千分位格式化.
		for ( var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
			num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
		}
		return (((sign) ? '' : '-') + num + '.' + cents);
	}
};

export default calcUtil;
