import { getParameter, sync } from "../axios";
import config from "@config/index";

let productName = config.productName;

const cache = {};
setInterval(() => {
  //5分钟清理一次缓存
  for (let key of Object.keys(cache)) {
    delete cache[key];
  }
}, 1000 * 60 * 5);
// 获取字典项
const getParmDic = function (keyArray, callback) {
  let parmDic = {};
  for (let i in keyArray) {
    parmDic[keyArray[i]] = [];
  }
  let data = {
    parmKeys: JSON.stringify(keyArray)
  };
  let name = "mftcc-sys-server";
  if (window.$servers && window.$servers.sys) {
    name = window.$servers.sys;
  }
  if (productName == "mftcc-flowable-web") {
    name = "mftcc-flowable-server";
  }
  let url = "/" + name + "/sys/sysParmKey/getParmDic";
  if (cache[url + JSON.stringify(keyArray)]) {
    if (isFunction(callback)) {
      callback(cache[url + JSON.stringify(keyArray)]);
    }
    return;
  }
  getParameter(
    url,
    data,
    true,
    res => {
      if (res.code == 0) {
        parmDic = res.data;
        cache[url + JSON.stringify(keyArray)] = res.data;
      } else {
        console.error(res.message);
      }
      if (isFunction(callback)) {
        callback(parmDic);
      }
    },
    error => {
      console.error(error);
      if (isFunction(callback)) {
        callback(parmDic);
      }
    }
  );
};

// 获取字典项
const getParmDicSync = async function (keyArray, callback) {
  let parmDic = {};
  for (let i in keyArray) {
    parmDic[keyArray[i]] = [];
  }
  let data = {
    parmKeys: JSON.stringify(keyArray)
  };
  let name = "mftcc-sys-server";
  if (window.$servers && window.$servers.sys) {
    name = window.$servers.sys;
  }
  if (productName == "mftcc-flowable-web") {
    name = "mftcc-flowable-server";
  }
  let url = "/" + name + "/sys/sysParmKey/getParmDic";
  if (cache[url + JSON.stringify(keyArray)]) {
    return cache[url + JSON.stringify(keyArray)];
  }
  let res = await sync.getParameter(url, data, true);
  if (res.code == 0) {
    parmDic = res.data;
    cache[url + JSON.stringify(keyArray)] = res.data;
  } else {
    console.error(res.message);
  }
  return parmDic;
};
/* 解析字段 */
const parsFieldName = function (value, formData, route) {
  var reg = /^\${.*}$/;
  if (reg.test(value) == true) {
    let parm = value.replace(/^(\s|\${)+|(\s|})+$/g, "");
    value = formData[parm];
    if (route) {
      if (value === undefined || value === "") {
        value = route.query[parm];
      }
      if (value === undefined || value === "") {
        value = route.params[parm];
      }
    }
  }
  return value;
}

const isEmpty = function (params) {
  if (
    params === undefined ||
    params === null ||
    params === "" ||
    params === false
  ) {
    return true;
  } else {
    return false;
  }
};

const parentVmExist = function (parentVm, method) {
  if (!method) {
    return false;
  }
  let vm;
  if (!isEmpty(parentVm)) {
    if (isEmpty(parentVm["parentVm"])) {
      vm = parentVm;
    } else {
      vm = parentVm["parentVm"];
    }
    if (!isEmpty(vm["_self"])) {
      if (isFunction(vm["_self"][method])) {
        return true;
      } else {
        console.error(method + "函数不存在");
        return false;
      }
    } else {
      console.error("parentVm配置错误");
      return false;
    }
  } else {
    console.error("parentVm未配置");
    return false;
  }
};

const isFunction = function (params) {
  if (typeof params === "function") {
    return true;
  } else {
    return false;
  }
};

const setgetCursorPsn = function (domObj, position) {
  if (domObj.setSelectionRange) {
    domObj.focus();
    domObj.setSelectionRange(position, position);
  } else if (domObj.createTextRange) {
    var range = domObj.createTextRange();
    range.collapse(true);
    range.moveEnd('character', position);
    range.moveStart('character', position);
    range.select();
  }
};

const getOstr = function (inObject, position) {
  var sumOstr = 0;
  var inStr = inObject.value;
  if (inStr.length > 0) {
    var lStr = inStr.substring(0, position);
    for (var i = 0; i < lStr.length; i++) {
      var v = lStr.charAt(i);
      if (isNaN(v)) {
        sumOstr++;
      }
    }
  }
  return sumOstr;
};

const getCursorPsn = function (inObject) {
  var position = 0;
  var domObj = inObject;
  if (document.selection) {
    //for IE
    domObj.focus();
    var sel = document.selection.createRange();
    sel.moveStart("character", -domObj.value.length);

    position = sel.text.length;
  } else if (domObj.selectionStart || domObj.selectionStart == "0") {
    position = domObj.selectionStart;
  }
  return position;
};

const toMoney = function (event) {
  if (event) {
    let inObject = event.target;
    //全角转半角
    var inStr = inObject.value;
    inObject.value = ToCDB(inStr);

    //获取光标位置
    var position = getCursorPsn(inObject);
    //获取光标前非数字个数
    var sumOstr = getOstr(inObject, position);

    inStr = inObject.value;

    inStr = delcommafy(inStr);

    inStr = moneyCheck(inStr);
    // if (isNaN(inStr)) {
    // let flag = true;
    // while(flag){
    //   inStr = inStr.substring(0,inStr.length-1);
    //   if (!isNaN(inStr)){
    //     flag = false;
    //   }
    // }
    // }

    var i,
      charValue,
      outStr,
      id = 0,
      fs = 0;
    //var fsInStr ="";

    for (i = 0; i < inStr.length; i++) {
      charValue = inStr.charAt(i);
      //alert("charValue:"+charValue+":"+i+":"+inStr.length);
      if (
        isNaN(parseInt(charValue, 10)) &&
        charValue != "." &&
        charValue != "," &&
        charValue != "-"
      ) {
        if (fs == 1)
          inObject.value =
            "-" + inStr.substring(0, i) + inStr.substring(i + 1, inStr.length);
        else
          inObject.value =
            inStr.substring(0, i) + inStr.substring(i + 1, inStr.length);
        return;
      }
      if (i > 0 && charValue == "-") {
        if (fs == 1)
          inObject.value =
            "-" + inStr.substring(0, i) + inStr.substring(i + 1, inStr.length);
        else
          inObject.value =
            inStr.substring(0, i) + inStr.substring(i + 1, inStr.length);
        return;
      }
      if (i == 0 && charValue == "-") {
        fs = 1;
        inStr = inStr.substr(1, inStr.length);
        i = -1;
      }
      if (charValue != "0") {
        id = 1;
      }

      if (id == 0 && i == 1 && charValue == "0") {
        inStr = inStr.substr(1, inStr.length - 1);
        i = 0;
      }
    }

    var valueArr;

    valueArr = inStr.split(".");

    if (valueArr.length > 2) {
      inObject.focus();
      inObject.select();
      return;
    }

    var dotStr, dotValue;

    if (valueArr.length == 2) {
      dotValue = valueArr[1];
      if (dotValue.length == 0) {
        dotStr = "";
      } else {
        if (dotValue.length == 1) dotStr = dotValue + "";
        else dotStr = dotValue.substring(0, dotValue.length);
      }
    }

    var intArr;

    intArr = valueArr[0].split(",");

    var intValue = "";

    for (i = 0; i < intArr.length; i++) {
      intValue += intArr[i];
    }
    var intStr = "";

    if (
      intValue.length > 1 &&
      intValue.charAt(0) == "0" &&
      intValue.charAt(1) != "."
    ) {
      intValue = intValue.substr(1, intValue.length - 1);
    }

    while (intValue.length > 3) {
      intStr =
        "," + intValue.substring(intValue.length - 3, intValue.length) + intStr;
      intValue = intValue.substring(0, intValue.length - 3);
    }
    intStr = intValue + intStr;

    if (dotStr == null) outStr = intStr;
    else outStr = intStr + "." + dotStr;

    if (fs == 1) {
      outStr = "-" + outStr;
    }

    inObject.value = outStr;

    var esumOstr = getOstr(inObject, position);

    //设置光标位置
    position = position + (esumOstr - sumOstr);
    setgetCursorPsn(inObject, position);
    return inObject.value;
  }
  return;
};

//全角转半角
const ToCDB = function (str) {
  var tmp = "";
  for (var i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 65248 && str.charCodeAt(i) < 65375) {
      tmp += String.fromCharCode(str.charCodeAt(i) - 65248);
    } else {
      tmp += String.fromCharCode(str.charCodeAt(i));
    }
  }
  return tmp;
};

/*
只能输入数字和小数点；
小数点只能有1个
第一位不能是小数点
第一位如果输入0，且第二位不是小数点，则去掉第一位的0
*/
const moneyCheck = function (num) {
  var str = num;
  var len1 = str.substr(0, 1);
  var len2 = str.substr(1, 1);
  //如果第一位是0，第二位不是点，就用数字把点替换掉
  if (str.length > 1 && len1 == 0 && len2 != ".") {
    str = str.substr(1, 1);
  }
  //第一位不能是.
  if (len1 == ".") {
    str = "";
  }
  //限制只能输入一个小数点
  if (str.indexOf(".") != -1) {
    var str_ = str.substr(str.indexOf(".") + 1);
    if (str_.indexOf(".") != -1) {
      str = str.substr(0, str.indexOf(".") + str_.indexOf(".") + 1);
    }
  }
  //正则替换，保留数字和小数点
  str = str.replace(/[^\d^\.]+/g, "");
  //如果需要保留小数点后两位，则用下面公式
  // str = str.replace(/\.\d\d$/,'')
  return str;
};

//去除千分位中的‘，’
const delcommafy = function (num) {
  if (!num) return num;
  num = num.toString();
  num = num.replace(/,/gi, "");
  return num;
};

/**
 * @description 格式化金额
 * @param number：要格式化的数字
 * @param decimals：保留几位小数 默认2位
 * @param decPoint：小数点符号 默认.
 * @param thousandsSep：千分位符号 默认为,
 */
const formatMoney = (
  number,
  decimals = 2,
  decPoint = ".",
  thousandsSep = ","
) => {
  if (Number(number) < 0.01 && Number(number) > 0) {
    return number;
  }
  number = (number + "").replace(/[^0-9+-Ee.]/g, "");
  let n = !isFinite(+number) ? 0 : +number;
  let prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
  let sep = typeof thousandsSep === "undefined" ? "," : thousandsSep;
  let dec = typeof decPoint === "undefined" ? "." : decPoint;
  let s = "";
  let toFixedFix = function (n, prec) {
    let k = Math.pow(10, prec);
    return "" + Math.round(numMulti(n, k)) / k;
  };
  s = (prec ? toFixedFix(n, prec) : "" + Math.round(n)).split(".");
  let re = /(-?\d+)(\d{3})/;
  while (re.test(s[0])) {
    s[0] = s[0].replace(re, "$1" + sep + "$2");
  }
  if ((s[1] || "").length < prec) {
    s[1] = s[1] || "";
    s[1] += new Array(prec - s[1].length + 1).join("0");
  }
  return s.join(dec);
};

//去除首尾空格
const func_uior_trim = function (str) {
  var result = "";
  if (str != null) {
    result = str.replace(/^\s|\s$/g, "");
  }
  return result;
};

const validateInt = function (rule, value, callback) {
  if (value) {
    var reg = /^-?[0-9]*$/; //此写法允许首字符为0
    if (!reg.test(value)) {
      callback(new Error("内容不是整数!"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

//通过身份证号计算校验位的数值
const GetIdVerifyBit = function (id) {
  var result;
  var nNum = eval(
    id.charAt(0) * 7 +
    id.charAt(1) * 9 +
    id.charAt(2) * 10 +
    id.charAt(3) * 5 +
    id.charAt(4) * 8 +
    id.charAt(5) * 4 +
    id.charAt(6) * 2 +
    id.charAt(7) * 1 +
    id.charAt(8) * 6 +
    id.charAt(9) * 3 +
    id.charAt(10) * 7 +
    id.charAt(11) * 9 +
    id.charAt(12) * 10 +
    id.charAt(13) * 5 +
    id.charAt(14) * 8 +
    id.charAt(15) * 4 +
    id.charAt(16) * 2
  );
  nNum = nNum % 11;
  switch (nNum) {
    case 0:
      result = "1";
      break;
    case 1:
      result = "0";
      break;
    case 2:
      result = "X";
      break;
    case 3:
      result = "9";
      break;
    case 4:
      result = "8";
      break;
    case 5:
      result = "7";
      break;
    case 6:
      result = "6";
      break;
    case 7:
      result = "5";
      break;
    case 8:
      result = "4";
      break;
    case 9:
      result = "3";
      break;
    case 10:
      result = "2";
      break;
  }
  //document.write(result);
  return result;
};

const validateIdNo = function (rule, value, callback) {
  if (!value) {
    callback();
  }
  /*
   * 检查身份证号函数
   * 返回值为true是身份证号符合规则 为false身份证号不符合规则
   */
  var id = value;
  var id_length = id.length;
  if (id_length != 15 && id_length != 18) {
    callback(new Error("身份证号长度应为15位或18位！"));
  }

  if (id_length == 15) {
    var re = /^\d{15}$/;
    if (!re.test(id)) {
      callback(new Error("15位身份证号必须为数字"));
    }
    let yyyy = "19" + id.substring(6, 8);
    let mm = id.substring(8, 10);
    let dd = id.substring(10, 12);

    if (mm > 12 || mm <= 0) {
      callback(new Error("输入身份证号,月份非法！"));
    }

    if (dd > 31 || dd <= 0) {
      callback(new Error("输入身份证号,日期非法！"));
    }
  } else if (id_length == 18) {
    var re = /^\d{17}[\dXx]$/;
    if (!re.test(id)) {
      callback(new Error("身份证前17位必须为数字,第18位为数字或X"));
    }

    let yyyy = id.substring(6, 10);

    if (yyyy > new Date().getFullYear() || yyyy < 1800) {
      callback(new Error("输入身份证号,年度非法！"));
    }

    let mm = id.substring(10, 12);
    if (mm > 12 || mm <= 0) {
      callback(new Error("输入身份证号,月份非法！"));
    }

    let dd = id.substring(12, 14);
    if (dd > 31 || dd <= 0) {
      callback(new Error("输入身份证号,日期非法！"));
    }

    if (id.charAt(17) == "x" || id.charAt(17) == "X") {
      if ("x" != GetIdVerifyBit(id) && "X" != GetIdVerifyBit(id)) {
        callback(new Error("身份证校验错误，请检查最后一位！"));
      }
    } else {
      if (id.charAt(17) != GetIdVerifyBit(id)) {
        callback(new Error("身份证校验错误，请检查最后一位！"));
      }
    }
  }
  callback();
};

const validateLong = function (rule, value, callback) {
  if (value) {
    var reg = /^-?[1-9]\d*|0$/;
    if (!reg.test(value)) {
      callback(new Error("内容不是长整数!"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

const validateNumber = function (rule, value, callback) {
  if (value) {
    value = delcommafy(value);
    var reg = /^-?([1-9]\d*|[1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$/;
    if (!reg.test(value)) {
      callback(new Error("内容不是数字!"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

const validateDate = function (rule, value, callback) { };

const validateFloat = function (rule, value, callback) {
  if (value) {
    var reg = /^[1-9]\d*|[1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0$/;
    if (!reg.test(value)) {
      callback(new Error("内容不是数字(正数)!"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

const validateBoolean = function (rule, value, callback) {
  if (value) {
    if (value != "true" && value != "false") {
      callback(new Error("内容不是布尔值!"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

const validateMoney = function (rule, value, callback) {
  if (!value) {
    callback();
  }
  value = delcommafy(value);
  var reg = /^-?([1-9]\d*|[1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$/;
  //var reg=/^([+-]?)((\d{1,3}(,\d{3})*)|(\d+))(\.\d*)?$/;
  if (!reg.test(value)) {
    if (!value) {
      callback();
    } else {
      callback(new Error("内容不是金额类型!"));
    }
  } else {
    //为金额型输入框末尾添加.00
    var strPoints = (value + "").split("."); //判断字符串包含几个小数点符号
    if (strPoints.length == 2) {
      if (strPoints[1].length > 2) {
        callback(new Error("金额类型只保留2位小数点!"));
      } else {
        callback();
      }
    } else if (strPoints.length == 1) {
      callback();
    } else {
      callback(new Error("内容不是金额类型!"));
    }
  }
};

//用于时时验证数据类型
const func_uior_valTypeImm = function (el, type) {
  let str = el.target.value || "";
  if (str != undefined) {
    if (type != "undefined" && func_uior_trim(type) != "") {
      if (type == "int") {
        if (str == "") {
          //el.target.value = "0";
        } else {
          //var reg=/^-?[1-9]\d*|0$/;
          var reg = /^-?[0-9]*$/; //此写法允许首字符为0
          if (!reg.test(str)) {
            el.currentTarget.focus();
            el.currentTarget.select();
          }
        }
      } else if (type == "long") {
        if (str == "") {
          //el.target.value = "0";
        } else {
          var reg = /^-?[1-9]\d*|0$/;
          if (!reg.test(str)) {
            el.currentTarget.focus();
            el.currentTarget.select();
          }
        }
      } else if (
        type == "double(2)" ||
        type == "double(4)" ||
        type == "double(6)" ||
        type == "money(fen)" ||
        type == "money(jiao)" ||
        // type == "money(wan)" ||
        // type == "money(yi)" ||
        type == "percentile" ||
        type === "thousand" ||
        type == "tenThousand"
      ) {
        if (str == "") {
          //el.target.value = "0.00";
        } else {
          var reg = /^-?([1-9]\d*|[1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$/;
          if (!reg.test(str)) {
            el.currentTarget.focus();
            el.currentTarget.select();
          }
        }
      } else if (type == "float") {
        if (str == "") {
          //el.target.value = "0.00";
        } else {
          var reg = /^[1-9]\d*|[1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0$/;
          if (!reg.test(str)) {
            el.currentTarget.focus();
            el.currentTarget.select();
          }
        }
      } else if (type == "boolean") {
        if (str != "") {
          if (str != "true" && str != "false") {
            el.currentTarget.focus();
            el.currentTarget.select();
          }
        }
      } else if (type === "money(yuan)") {
        var reg = /^([+-]?)((\d{1,3}(,\d{3})*)|(\d+))(\.\d*)?$/;
        if (!reg.test(str)) {
          if (str == "") {
            //el.target.value = "0.00";
          } else {
            el.currentTarget.focus();
            el.currentTarget.select();
          }
        } else {
          //为金额型输入框末尾添加.00
          var strPoints = str.split("."); //判断字符串包含几个小数点符号
          if (strPoints.length == 2) {
            if (strPoints[1].length == 0) {
              el.target.value = strPoints[0] + ".00";
            } else if (strPoints[1].length == 1) {
              el.target.value = str + "0";
            } else if (strPoints[1].length > 2) {
              el.currentTarget.focus();
              el.currentTarget.select();
            }
          } else if (strPoints.length == 1) {
            el.target.value = str + ".00";
          } else {
            el.currentTarget.focus();
            el.currentTarget.select();
          }
        }
      }
    }
  }
};

const bigAmt = function (n = 0) {
  n = (n + "").replace(/,/g, "");
  try {
    n = Number(n);
    if (n == 0) {
      return "";
    }
  } catch (error) {
    return "";
  }
  var fraction = ["角", "分"];
  var digit = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
  var unit = [
    ["元", "万", "亿"],
    ["", "拾", "佰", "仟"]
  ];
  var head = n < 0 ? "欠" : "";
  n = Math.abs(n);
  var s = "";
  for (var i = 0; i < fraction.length; i++) {
    s += (
      digit[Math.floor(floatMultiply(floatMultiply(n, 10), Math.pow(10, i))) % 10] + fraction[i]
    ).replace(/零./, "");
  }
  s = s || "整";
  n = Math.floor(n);
  for (var i = 0; i < unit[0].length && n > 0; i++) {
    var p = "";
    for (var j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p;
      n = Math.floor(n / 10);
    }
    s = p.replace(/(零.)*零$/, "").replace(/^$/, "零") + unit[0][i] + s;
  }
  return (
    head +
    s
      .replace(/(零.)*零元/, "元")
      .replace(/(零.)+/g, "零")
      .replace(/^整$/, "零元整")
  );
};
function floatMultiply(arg1, arg2) {
  if (arg1 == null || arg2 == null) {
    return null;
  }
  var n1, n2;
  var r1, r2; // 小数位数
  try {
    r1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }
  n1 = Number(arg1.toString().replace(".", ""));
  n2 = Number(arg2.toString().replace(".", ""));
  return n1 * n2 / Math.pow(10, r1 + r2);
}
const evalFunc = function () {
  try {
    var func = "arguments[0]" + "(";
    for (let i = 1; i < arguments.length; i++) {
      if (i !== arguments.length - 1) {
        func += "arguments[" + i + "],";
      } else {
        func += "arguments[" + i + "]";
      }
    }
    func += ")";
    return eval(func);
  } catch (error) {
    throw new Error("执行失败:" + error);
  }
};

//数据脱敏
const desensitization = function (value, dese) {
  let type = dese.desensitization;
  if (type === "idNo") {
    value = value.replace(/^(.{4})(?:\d+)(.{3})$/, "$1***********$2");
  } else if (type === "mobile") {
    value = value.replace(/^(.{3})(?:\d+)(.{4})$/, "$1****$2");
  } else if (type === "bankNo") {
    let len = value.length;
    let pat = "$1";
    for (let i = 0; i < len - 8; i++) {
      pat += "*";
    }
    pat += "$2";
    value = value.replace(/^(.{4})(?:\d+)(.{4})$/, pat);
  } else if (type === "normal") {
    let len = value.length;
    let pat = "$1";
    for (let i = 0; i < len - 6; i++) {
      pat += "*";
    }
    pat += "$2";
    value = value.replace(/^(.{3})(?:\w+)(.{3})$/, pat);
  } else if (type === "custom") {
    let front = dese.front || 0;
    let after = dese.after || 0;
    let len = value.length;
    let num = Number(front) + Number(after);
    if (num < len) {
      let pat = "$1";
      for (let i = 0; i < len - num; i++) {
        pat += "*";
      }
      pat += "$2";
      var re = new RegExp("^(.{" + front + "})(?:\\w+)(.{" + after + "})$");
      value = value.replace(re, pat);
    }
  }
  return value;
};

/**
 * 加法运算，避免数据相加小数点后产生多位数和计算精度损失。
 *
 * @param num1加数1 | num2加数2
 */
function numAdd(num1, num2) {
  if (isEmpty(num1)) {
    num1 = 0;
  }
  if (isEmpty(num2)) {
    num2 = 0;
  }
  var baseNum, baseNum1, baseNum2;
  try {
    baseNum1 = num1.toString().split(".")[1].length;
  } catch (e) {
    baseNum1 = 0;
  }
  try {
    baseNum2 = num2.toString().split(".")[1].length;
  } catch (e) {
    baseNum2 = 0;
  }
  baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
  return (num1 * baseNum + num2 * baseNum) / baseNum;
}

/**
 * 加法运算，避免数据相减小数点后产生多位数和计算精度损失。
 *
 * @param num1被减数 | num2减数
 */
function numSub(num1, num2) {
  if (isEmpty(num1)) {
    num1 = 0;
  }
  if (isEmpty(num2)) {
    num2 = 0;
  }
  var baseNum, baseNum1, baseNum2;
  var precision; // 精度
  try {
    baseNum1 = num1.toString().split(".")[1].length;
  } catch (e) {
    baseNum1 = 0;
  }
  try {
    baseNum2 = num2.toString().split(".")[1].length;
  } catch (e) {
    baseNum2 = 0;
  }
  baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
  precision = baseNum1 >= baseNum2 ? baseNum1 : baseNum2;
  return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision);
}

/**
 * 乘法运算，避免数据相乘小数点后产生多位数和计算精度损失。
 *
 * @param num1被乘数 | num2乘数
 */
function numMulti(num1, num2) {
  if (isEmpty(num1)) {
    num1 = 0;
  }
  if (isEmpty(num2)) {
    num2 = 0;
  }
  var baseNum = 0;
  try {
    baseNum += num1.toString().split(".")[1].length;
  } catch (e) { }
  try {
    baseNum += num2.toString().split(".")[1].length;
  } catch (e) { }
  return (
    (Number(num1.toString().replace(".", "")) *
      Number(num2.toString().replace(".", ""))) /
    Math.pow(10, baseNum)
  );
}

/**
 * 除法运算，避免数据相除小数点后产生多位数和计算精度损失。
 *
 * @param num1被除数 | num2除数
 */
function numDiv(num1, num2) {
  if (isEmpty(num1)) {
    num1 = 0;
  }
  if (isEmpty(num2)) {
    num2 = 0;
  }
  var baseNum1 = 0,
    baseNum2 = 0;
  var baseNum3, baseNum4;
  try {
    baseNum1 = num1.toString().split(".")[1].length;
  } catch (e) {
    baseNum1 = 0;
  }
  try {
    baseNum2 = num2.toString().split(".")[1].length;
  } catch (e) {
    baseNum2 = 0;
  }
  baseNum3 = Number(num1.toString().replace(".", ""));
  baseNum4 = Number(num2.toString().replace(".", ""));
  return (baseNum3 / baseNum4) * Math.pow(10, baseNum2 - baseNum1);
}

const formatDate = function (str, fmt) {
  if (!str) {
    return str;
  }
  var date;
  if (fmt == "yyyyMMdd") {
    date = new Date(
      str.substring(0, 4) +
      "/" +
      str.substring(4, 6) +
      "/" +
      str.substring(6, 8)
    );
  } else if (fmt == "yyyyMM") {
    date = new Date(str.substring(0, 4) + "/" + str.substring(4, 6));
  } else if (fmt == "yyyy-MM-dd") {
    date = new Date(str.replace(/-/g, "/"));
  } else if (fmt == "yyyy/MM/dd") {
    date = new Date(str);
  } else if (fmt == "yyyy年MM月dd日") {
    date = new Date(
      str
        .replace(/年/g, "/")
        .replace(/月/g, "/")
        .replace(/日/g, "")
    );
  } else if (fmt == "yyyyMMdd HH:mm:ss") {
    date = new Date(
      str.substring(0, 4) +
      "/" +
      str.substring(4, 6) +
      "/" +
      str.substring(6, 17)
    );
  } else if (fmt == "yyyy-MM-dd HH:mm:ss") {
    date = new Date(str.replace(/-/g, "/"));
  } else if (fmt == "yyyy/MM/dd HH:mm:ss") {
    date = new Date(str);
  } else if (fmt == "yyyy年MM月dd日 HH:mm:ss") {
    date = new Date(
      str
        .replace(/年/g, "/")
        .replace(/月/g, "/")
        .replace(/日/g, "")
    );
  } else {
    date = new Date(str.replace(/-/g, "/"));
  }
  if (date instanceof Date && !isNaN(date.getTime())) {
    return date;
  } else {
    date = new Date(str);
    if (isNaN(date)) {
      return str;
    } else {
      return date;
    }
  }
};

function dateFormat(date, fmt) {
  if (date instanceof Date && !isNaN(date.getTime())) {
    let ret;
    const opt = {
      "y+": date.getFullYear().toString(), // 年
      "M+": (date.getMonth() + 1).toString(), // 月
      "d+": date.getDate().toString(), // 日
      "H+": date.getHours().toString(), // 时
      "m+": date.getMinutes().toString(), // 分
      "s+": date.getSeconds().toString() // 秒
      // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
      ret = new RegExp("(" + k + ")").exec(fmt);
      if (ret) {
        fmt = fmt.replace(
          ret[1],
          ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
        );
      }
    }
    return fmt;
  } else {
    return date;
  }
}

function doExpression(s, r = new Set()) {
  let i = s.indexOf("${");
  let ii = s.indexOf("}");
  if (i >= 0 && ii > i) {
    let key = s.substring(i + 2, ii);
    r.add(key);
    r = doExpression(s.substr(ii + 1), r);
  }
  return r;
}

function getFormProfilePath() {
  let path = window.config.form_profile_path;
  return path;
}
function converUrl(url) {
  if (url) {
    let urlArr = url.split("/");
    let serverName = urlArr[0];
    if (!serverName) {
      urlArr.splice(0, 1);
      serverName = urlArr[0];
    }
    if (serverName.startsWith("mftcc-")) {
      let serverType = serverName.split("-")[1];
      if (window.$servers && window.$servers[serverType]) {
        urlArr.splice(0, 1);
        url = window.$servers[serverType] + "/" + urlArr.join("/");
      }
    }
  }
  return url;
}

export default {
  getParmDic,
  getParmDicSync,
  isEmpty,
  isFunction,
  delcommafy,
  toMoney,
  func_uior_valTypeImm,
  bigAmt,
  validateInt,
  validateLong,
  validateNumber,
  validateDate,
  validateFloat,
  validateBoolean,
  validateMoney,
  validateIdNo,
  formatMoney,
  evalFunc,
  numAdd,
  numSub,
  numMulti,
  numDiv,
  parentVmExist,
  desensitization,
  formatDate,
  dateFormat,
  doExpression,
  getFormProfilePath,
  converUrl,
  parsFieldName
};
