<template>
  <div>
    <div class="mftcc-form-item"
         :class="props.fieldType">
      <template v-if="props.fieldType == 'label'">
        <div v-if="designer === true ? true : props.isShow">
          <component :is="type"
                     v-model="compValue"
                     :event="event"
                     :props="props"
                     :pramDicItem="pramDicItem"
                     :designer="designer"
                     :parentVm="parentVm">
          </component>
          <slot name="widgets-tools"></slot>
        </div>
      </template>
      <div v-else-if="props.fieldType === 'empty'">
        <el-form-item class="mftcc-form-empty">
          <span slot="label">&nbsp;</span>
        </el-form-item>
      </div>
      <el-form-item v-else-if="designer === true ? true : props.isShow"
                    :label="props.label"
                    :prop="props.fieldName"
                    :required="required"
                    :class="{
          'mftcc-form-group': props.fieldType === 'group',
          'only-label': props.showContents === 2,
          'only-input': props.showContents === 3
        }">
        <div slot="label"
             v-if="props.warning && props.warnName != null">
          <span>{{ props.label }}</span>
          <mftcc-tooltip>
            <div slot="text">{{ props.warnName }}</div>
          </mftcc-tooltip>
        </div>

        <template v-if="query === 'query'">
          <component v-if="props.fieldType == 'cascader'"
                     :isQuery="true"
                     :is="type"
                     v-model="compValue"
                     :event="event"
                     :props="props"
                     :pramDicItem="pramDicItem"
                     :designer="designer"
                     :parentVm="parentVm">
          </component>
          <span v-else
                :class="{ success:dataColor == 'success',warning:dataColor == 'warning',danger:dataColor == 'danger'}">
            <template v-if="props.isHref === true">
              <a href="javascript:void(0)"
                 @click="router(props.href, compValue)">
                <template v-if="!isEmpty(props.prepend)">{{
                  props.prepend
                }}</template>
                {{ compValue }}
                <template v-if="!isEmpty(props.suffix)">{{
                  props.suffix
                }}</template>
                <template v-else-if="props.dataType === 'money(jiao)'">角</template>
                <template v-else-if="props.dataType === 'money(fen)'">分</template>
                <template v-else-if="props.dataType === 'money(wan)'">万元</template>
                <template v-else-if="props.dataType === 'money(baiwan)'">百万元</template>
                <template v-else-if="props.dataType === 'money(yi)'">亿元</template>
                <template v-else-if="props.dataType === 'percentile'">%</template>
                <template v-else-if="props.dataType === 'thousand'">‰</template>
                <template v-else-if="props.dataType === 'tenThousand'">‱</template>
                <template v-if="props.isBigAmt">
                  {{ toBigAmt() }}
                </template>
              </a>
            </template>
            <template v-else>
              <template v-if="isConver">
                {{ compValue }}
              </template>
              <template v-else>
                <template v-if="!isEmpty(props.prepend)">{{
                  props.prepend
                }}</template>
                {{ compValue }}
                <template v-if="!isEmpty(props.suffix)">{{
                  props.suffix
                }}</template>
                <template v-else-if="props.dataType === 'money(jiao)'">角</template>
                <template v-else-if="props.dataType === 'money(fen)'">分</template>
                <template v-else-if="props.dataType === 'money(wan)'">万元</template>
                <template v-else-if="props.dataType === 'money(baiwan)'">百万元</template>
                <template v-else-if="props.dataType === 'money(yi)'">亿元</template>
                <template v-else-if="props.dataType === 'percentile'">%</template>
                <template v-else-if="props.dataType === 'thousand'">‰</template>
                <template v-else-if="props.dataType === 'tenThousand'">‱</template>
                <template v-if="props.isBigAmt">
                  {{ toBigAmt() }}
                </template>
              </template>
            </template>
          </span>
          <div v-if="props.fieldType == 'text'"
               style="
              position: absolute;
              bottom: 50%;
              right: 15px;
              font-size: 18px;
              margin-bottom: -18px;
            ">
            <template v-for="(btn, index) in props.optBtn">
              <i :key="index"
                 :class="btn.icon"
                 style="margin-left: 10px; color: #007afe; cursor: pointer"
                 v-if="
                  btn.icon && (designer || $hasPerm(btn.jurisdiction || true))
                "
                 v-on:click.stop="Fn(btn.callBackFunc)">
              </i>
              <el-button :key="index"
                         size="mini"
                         plain
                         v-if="
                  !btn.icon && (designer || $hasPerm(btn.jurisdiction || true))
                "
                         v-on:click.native.stop="Fn(btn.callBackFunc)">{{ btn.key }}
              </el-button>
            </template>
          </div>
        </template>
        <template v-else>
          <template v-if="!isQuery && props.isHref === true">
            <template v-if="designer || (!props.disabled && !props.readonly)">
              <a slot="label"
                 href="javascript:void(0)"
                 @click="router(props.href, compValue)">{{ props.label }}</a>
              <component :is="type"
                         v-model="compValue"
                         :event="event"
                         :props="props"
                         :pramDicItem="pramDicItem"
                         :designer="designer"
                         :setting="setting"
                         :isSearch="isSearch"
                         :parentVm="parentVm">
              </component>
            </template>
            <a v-else
               style="height: 100%;
                  display: inline-flex;
                  align-items: center;
                  padding: 0 17px;
                  line-height: 40px;"
               href="javascript:void(0)"
               @click="router(props.href, compValue)">{{ compValue }}</a>
          </template>
          <component v-else
                     :is="type"
                     v-model="compValue"
                     :event="event"
                     :props="props"
                     :pramDicItem="pramDicItem"
                     :designer="designer"
                     :setting="setting"
                     :isSearch="isSearch"
                     :parentVm="parentVm">
          </component>
          <slot name="widgets-tools"></slot>
        </template>
      </el-form-item>
    </div>
    <slot name="widgets-hiddenItem"></slot>
  </div>
</template>
<script>
  import formUtil from "../../../utils/formUtil";
  export default {
    data() {
      return {
        isEmpty: formUtil.isEmpty,
        bigAmt: formUtil.bigAmt,
        isConver: false,
        dataColor: ""
      };
    },
    computed: {
      type() {
        let tt = this.$Component[this.props.fieldType];
        return tt;
      },
      required: {
        get() {
          let required = false;
          if (this.designer === true) {
            if (this.props.fieldType === "group") {
              for (let item of this.props.group) {
                for (let rule of item.rules) {
                  if (rule.type == "required") {
                    required = true;
                  }
                }
              }
            } else {
              for (let rule of this.props.rules) {
                if (rule.type == "required") {
                  required = true;
                }
              }
            }
          }
          return required;
        }
      },
      compValue: {
        get() {
          this.isConver = false;
          if (this.designer === true) {
            return this.value;
          } else if (
            this.props.fieldType === "dateGroup" ||
            this.props.fieldType === "datetimeGroup" ||
            this.props.fieldType === "timeGroup"
          ) {
            if (this.query === "query") {
              let separator = "-";
              if (!this.isEmpty(this.props.separator)) {
                separator = this.props.separator;
              }
              return this.value[this.props.fieldName] + separator + this.value[this.props.endFieldName];
            }

            let dateValue = ["", ""];
            if (!this.isEmpty(this.value[this.props.fieldName])) {
              dateValue[0] = this.value[this.props.fieldName];
            }
            if (!this.isEmpty(this.value[this.props.endFieldName])) {
              dateValue[1] = this.value[this.props.endFieldName];
            }
            return dateValue;
          } else if (this.props.fieldType === "group") {
            if (this.query === "query") {
              let result = "";
              let separator = "-";
              if (!this.isEmpty(this.props.separator)) {
                separator = this.props.separator;
              }
              for (let i = 0; i < this.props.group.length; i++) {
                if (i === 0) {
                  result = this.value[this.props.group[i].fieldName];
                } else {
                  result = result + separator + this.value[this.props.group[i].fieldName];
                }
              }
              return result;
            }

            return this.value;
          } else {
            if (
              this.query === "query" &&
              (this.props.fieldType === "select" || this.props.fieldType === "multipleSelection")
            ) {
              let result = "";
              let optCode = "";
              if (this.props.optionType === "1") {
                const selectItem = this.unique(this.props.dicItem);
                for (let dic of selectItem) {
                  if (dic.optCode == this.value[this.props.fieldName]) {
                    optCode = dic.optCode;
                    result = dic.optName;
                    break;
                  }
                }
              } else if (this.props.optionType === "2") {
                if (this.pramDicItem) {
                  for (let dic of this.pramDicItem) {
                    if (dic.optCode == this.value[this.props.fieldName]) {
                      optCode = dic.optCode;
                      result = dic.optName;
                      break;
                    }
                  }
                }
              }
              if (optCode) {
                if (this.props.converColorData && this.props.converColorData.length > 0) {
                  for (let item of this.props.converColorData) {
                    if (item.originalData == optCode) {
                      this.dataColor = item.dataColor;
                      break;
                    }
                  }
                }
              }
              if (!result) {
                return this.value[this.props.fieldName];
              }
              return result;
            }
            if (this.props.fieldDesc) {
              let valueText = this.value[this.props.fieldDesc];
              this.props.fieldDescValue = valueText;
              if (this.query === "query") {
                return valueText;
              }
            }
            if (this.query === "query" && (this.props.fieldType === "text" || this.props.fieldType === "textarea")) {
              let value = this.value[this.props.fieldName];
              if (this.props.converColorData && this.props.converColorData.length > 0) {
                value = this.getCalcParamValue(value);
                value = value.replace(".00", "");
                for (let item of this.props.converColorData) {
                  if (item.originalData == value) {
                    this.dataColor = item.dataColor;
                    break;
                  }
                }
              }
              if (this.props.desensitization) {
                /* 数据脱敏 */
                let dese = {
                  desensitization: this.props.desensitization,
                  front: this.props.desensitizationFront,
                  after: this.props.desensitizationAfter
                };
                value = formUtil.desensitization(value, dese);
              } else if (this.props.converData && this.props.converData.length > 0) {
                value = this.getCalcParamValue(value) + "";
                value = value.replace(".00", "");
                for (let item of this.props.converData) {
                  if (item.originalData == value) {
                    value = item.newData;
                    this.isConver = true;
                    break;
                  }
                }
              }
              return value;
            }
            return this.value[this.props.fieldName];
          }
        },
        set(val) {
          let result = this.value;
          if (this.designer === true) {
            if (val instanceof Object && !(val instanceof Array)) {
              result = val.value;
            } else {
              result = val;
            }
          } else if (
            this.props.fieldType === "dateGroup" ||
            this.props.fieldType === "datetimeGroup" ||
            this.props.fieldType === "timeGroup"
          ) {
            if (val != null) {
              this.$set(this.value, this.props.fieldName, val[0]);
              this.$set(this.value, this.props.endFieldName, val[1]);
            } else {
              this.$set(this.value, this.props.fieldName, "");
              this.$set(this.value, this.props.endFieldName, "");
            }
          } else if (this.props.fieldType === "group") {
          } else if (val instanceof Object && !(val instanceof Array)) {
            this.$set(this.value, this.props[val.key], val.value);
          } else {
            this.$set(this.value, this.props.fieldName, val);
          }
          this.$emit("returnBack", result);
        }
      }
    },
    model: {
      prop: "value", //值可以随意命名
      event: "returnBack" //方法也可以随意命名
    },
    props: {
      query: {
        type: String,
        default() {
          return "";
        }
      },
      designer: {
        type: Boolean,
        default() {
          return false;
        }
      },
      setting: {
        type: Boolean,
        default() {
          return false;
        }
      },
      isQuery: {
        type: Boolean,
        default() {
          return false;
        }
      },
      isExpandQuery: {
        type: Boolean,
        default() {
          return false;
        }
      },
      isSearch: {
        type: Boolean,
        default() {
          return false;
        }
      },
      event: {
        type: Object,
        default() {
          return {};
        }
      },
      pramDicItem: {
        type: Array,
        default() {
          return null;
        }
      },
      value: {},
      props: {
        type: Object,
        default() {
          return {};
        }
      },
      parentVm: {
        type: Object,
        required: true
      }
    },
    watch: {
      props: {
        handler(val, oldVal) {
          if (this.isExpandQuery) {
            val.placeholder = val.label;
          }
        },
        immediate: true
      }
    },
    created() {},
    methods: {
      unique(arr1) {
        const res = new Map();
        return arr1.filter((a) => !res.has(a.optCode) && res.set(a.optCode, 1));
      },
      toBigAmt() {
        let value = this.value[this.props.fieldName];
        if (this.props.dataType === "money(yuan)") {
          value = formUtil.delcommafy(value);
        } else if (this.props.dataType === "money(wan)") {
          value = formUtil.delcommafy(value);
          value = formUtil.numMulti(value, 10000);
        } else if (this.props.dataType === "money(baiwan)") {
          value = formUtil.delcommafy(value);
          value = formUtil.numMulti(value, 1000000);
        } else if (this.props.dataType === "money(yi)") {
          value = formUtil.delcommafy(value);
          value = formUtil.numMulti(value, 100000000);
        }
        value = this.bigAmt(value);
        if (value) {
          return "(" + value + ")";
        }
        return "";
      },
      toMoneyFn(event) {
        if (
          this.props.dataType === "money(yuan)" ||
          this.props.dataType === "money(wan)" ||
          this.props.dataType === "money(baiwan)" ||
          this.props.dataType === "money(yi)"
        ) {
          this.compValue = this.toMoney(event);
        }
      },
      getCalcParamValue(fieldValue) {
        if (this.props.dataType === "money(yuan)") {
          fieldValue = formUtil.delcommafy(fieldValue);
        } else if (this.props.dataType === "money(wan)") {
          fieldValue = formUtil.delcommafy(fieldValue);
          fieldValue = formUtil.numMulti(fieldValue, 10000);
        } else if (this.props.dataType === "money(baiwan)") {
          fieldValue = formUtil.delcommafy(fieldValue);
          fieldValue = formUtil.numMulti(fieldValue, 1000000);
        } else if (this.props.dataType === "money(yi)") {
          fieldValue = formUtil.delcommafy(fieldValue);
          fieldValue = formUtil.numMulti(fieldValue, 100000000);
        } else if (this.props.dataType === "percentile") {
          fieldValue = formUtil.numDiv(fieldValue, 100);
        } else if (this.props.dataType === "thousand") {
          fieldValue = formUtil.numDiv(fieldValue, 1000);
        } else if (this.props.dataType === "tenThousand") {
          fieldValue = formUtil.numDiv(fieldValue, 10000);
        }
        return fieldValue;
      },
      router(href, val) {
        let path = href.path;
        if (href.path) {
          let query = {};
          if (href.query) {
            let queryArr = href.query.split(";");
            for (let queryStr of queryArr) {
              let arr = queryStr.split("-");
              let key = arr[0];
              let value = arr[1];
              if (value.startsWith("${")) {
                value = value.substring(2, value.length - 1);
              }
              query[key] = this.value[value];
            }
          }
          this.$router.push({ path: path, query: query });
        } else if (href.callbackType) {
          if (formUtil.parentVmExist(this, href.callbackType)) {
            this.parentVm._self[href.callbackType](val);
          }
        }
      },
      format(props, value) {
        let dateArr = ["date", "time", "datetime", "dateGroup", "timeGroup", "datetimeGroup"];
        if (props.fieldType) {
        }
      },
      Fn(method, param) {
        if (formUtil.parentVmExist(this, method)) {
          this.parentVm._self[method](param);
        }
      }
    }
  };
</script>
