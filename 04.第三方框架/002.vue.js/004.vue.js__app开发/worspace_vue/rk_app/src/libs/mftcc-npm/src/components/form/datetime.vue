<template>
  <el-date-picker
    v-if="datePickerShow"
    :ref="props.fieldName"
    v-model="compValue"
    :format="
      compValue ===
      dateFormat(
        new Date('9999/12/31'),
        isEmpty(props.dateFormat.valueFormat)
          ? 'yyyyMMdd HH:mm:ss'
          : props.dateFormat.valueFormat
      )
        ? '长期'
        : isEmpty(props.dateFormat.format)
        ? 'yyyy-MM-dd HH:mm:ss'
        : props.dateFormat.format
    "
    :value-format="
      isEmpty(props.dateFormat.valueFormat)
        ? 'yyyyMMdd'
        : props.dateFormat.valueFormat
    "
    :type="props.dateType"
    :placeholder="isEmpty(props.placeholder) ? '' : props.placeholder"
    :disabled="isEmpty(props.disabled) ? false : props.disabled"
    :readonly="isEmpty(props.readOnly) ? false : props.readOnly"
    :class="{ readonly: isEmpty(props.readOnly) ? false : props.readOnly }"
    :picker-options="
      !isEmpty(props.dateOption) ? createPickerOptions(props.dateOption) : {}
    "
    v-on="event"
  ></el-date-picker>
</template>
<script>
import formUtil from "../../utils/formUtil";
export default {
  data() {
    return {
      dateFormat: formUtil.dateFormat,
      datePickerShow: true,
      isEmpty: formUtil.isEmpty
    };
  },
  computed: {
    compValue: {
      get() {
        return this.value;
      },
      set(val) {
        if (this.props.pkType === "table") {
          this.$emit("returnBack", val);
        } else if (!this.props.disabled && !this.props.readOnly) {
          this.$emit("returnBack", val);
        }
      }
    }
  },
  model: {
    prop: "value", //值可以随意命名
    event: "returnBack" //方法也可以随意命名
  },
  props: {
    value: {},
    event: Object,
    props: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  /* watch: {
      "props.isMultiDate": {
        handler(val, oldVal) {
          if (val) {
            this.props.dateType = "dates";
            // this.datePickerShow = false;
            // this.$nextTick(() => {
            //   this.datePickerShow = true;
            // });
          }
        },
        deep: true,
        immediate: true,
      },
    }, */
  created() {
    if (!this.props.dateFormat) {
      this.props.dateFormat = {};
    }
    if (!this.props.dateType) {
      this.props.dateType = "datetime";
    }
    // this.datePickerShow = true;
  },
  /* watch: {
      "props.dateOption.isLong": {
        handler(val, oldVal) {
          this.datePickerShow = false;
          this.$nextTick(() => {
            this.datePickerShow = true;
          });
        },
        deep: true,
        immediate: true
      }
    }, */
  methods: {
    createPickerOptions(dateOption) {
      let pickerOptions = {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          }
        ]
      };
      if (dateOption.isLong === true) {
        pickerOptions.shortcuts.push({
          text: "长期",
          onClick(picker) {
            picker.$emit("pick", new Date("9999/12/31"));
          }
        });
      }
      // if (dateOption.start || dateOption.end) {
      //   pickerOptions.disabledDate = (time) => {
      //     let flag = true;
      //     if (dateOption.start) {
      //       let startData = formUtil.formatDate(dateOption.start, "yyyyMMdd");
      //       flag = startData.getTime() > time.getTime();
      //     }
      //     if (dateOption.end) {
      //       let endData = formUtil.formatDate(dateOption.end, "yyyyMMdd");
      //       flag = flag || time.getTime() > endData.getTime();
      //     }
      //     return flag;
      //   };
      // }
      if (
        dateOption.bigDate ||
        dateOption.smallDate ||
        dateOption.defaultSmall ||
        dateOption.defaultBig
      ) {
        let date = this.dateFormat(new Date(), "yyyyMMdd");
        pickerOptions.disabledDate = time => {
          let flag = true;
          //默认设置最小时间
          if (dateOption.defaultSmall) {
            let smallDate = formUtil.formatDate(date, "yyyyMMdd");
            flag = smallDate.getTime() > time.getTime();
          } else {
            //手动选择最小时间
            if (dateOption.smallDate) {
              let smallDate = formUtil.formatDate(
                dateOption.smallDate,
                "yyyyMMdd"
              );
              flag = smallDate.getTime() > time.getTime();
            }
          }
          //默认设置最大时间 分为俩种情况 一种有最小时间or默认最小时间 另一种只设置最大时间
          if (dateOption.defaultBig) {
            if (dateOption.smallDate || dateOption.defaultSmall) {
              let bigDate = formUtil.formatDate(date, "yyyyMMdd");
              if (bigDate) {
                flag = flag || time.getTime() > bigDate.getTime();
              }
            } else {
              let bigDate = formUtil.formatDate(date, "yyyyMMdd");
              if (bigDate) {
                flag = time.getTime() > bigDate.getTime();
              }
            }
          } else {
            //手动选择最大时间
            if (
              (dateOption.bigDate && dateOption.smallDate) ||
              dateOption.defaultSmall
            ) {
              let bigDate = formUtil.formatDate(dateOption.bigDate, "yyyyMMdd");
              if (bigDate) {
                flag = flag || time.getTime() > bigDate.getTime();
              }
            } else {
              let bigDate = formUtil.formatDate(dateOption.bigDate, "yyyyMMdd");
              if (bigDate) {
                flag = time.getTime() > bigDate.getTime();
              }
            }
          }
          return flag;
        };
      }
      return pickerOptions;
    },
    timeFormat(date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var h = date.getHours();
      h = h < 10 ? "0" + h : h;
      var minute = date.getMinutes();
      minute = minute < 10 ? "0" + minute : minute;
      var second = date.getSeconds();
      second = second < 10 ? "0" + second : second;
      return y + m + d;
    }
  }
};
</script>
