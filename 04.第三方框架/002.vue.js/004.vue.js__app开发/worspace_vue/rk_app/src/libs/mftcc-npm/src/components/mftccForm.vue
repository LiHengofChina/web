<template>
  <el-form
    :label-position="option.labelPosition"
    :model="formData"
    :rules="rules"
    :ref="option.formId"
    :disabled="isEmpty(option.formDisabled) ? false : option.formDisabled"
    label-width="150px"
    :class="
      search === 'search'
        ? 'mftcc-form-search'
        : option.query === 'query'
        ? 'mftcc-form-query'
        : 'mftcc-form'
    "
    @submit.native.prevent
  >
    <el-row class="form-el-row">
      <template v-for="(item, index) in option.formItem">
        <template v-if="item.fieldType === 'label'">
          <el-col :span="24" :key="index">
            <el-alert
              :title="item.label"
              type="success"
              effect="dark"
              :closable="false"
              style="margin-bottom: 22px"
            >
            </el-alert>
          </el-col>
        </template>
        <template v-else>
          <el-col
            :span="
              isEmpty(option.columns)
                ? 24
                : Math.floor(24 / option.columns) *
                  Math.floor(
                    isEmpty(item.colspan)
                      ? 1
                      : item.colspan > option.columns
                      ? option.columns
                      : item.colspan
                  )
            "
            :key="item.fieldName"
          >
            <template v-if="item.fieldType === 'group'">
              <el-form-item
                :label="item.label"
                :required="item.required"
                v-show="isEmpty(item.isShow) ? true : item.isShow"
                class="mftcc-form-group"
              >
                <template v-for="(grouItem, groupIndex) in item.group">
                  <el-col
                    :key="grouItem.fieldName + 'field'"
                    :span="
                      Math.floor((24 - (item.group.length - 1) * 2) / item.group.length)
                    "
                    v-show="isEmpty(grouItem.isShow) ? true : grouItem.isShow"
                  >
                    <el-form-item :prop="grouItem.fieldName">
                      <template v-if="option.query === 'query'">
                        <span :title="formData[grouItem.fieldName]">
                          <template v-if="!isEmpty(grouItem.prepend)">
                            {{ grouItem.prepend }}
                          </template>
                          {{ formData[grouItem.fieldName] }}
                          <template v-if="!isEmpty(grouItem.suffix)">
                            {{ grouItem.suffix }}
                          </template>
                        </span>
                      </template>
                      <template v-else-if="grouItem.fieldType === 'text'">
                        <template v-if="grouItem.dataType === 'money(yuan)'">
                          <el-input
                            :ref="grouItem.fieldName"
                            type="text"
                            v-model="formData[grouItem.fieldName]"
                            :placeholder="
                              isEmpty(grouItem.placeholder) ? '' : grouItem.placeholder
                            "
                            :disabled="
                              isEmpty(grouItem.disabled) ? false : grouItem.disabled
                            "
                            :readonly="
                              isEmpty(grouItem.readOnly) ? false : grouItem.readOnly
                            "
                            v-on="events[grouItem.fieldName]"
                            @blur="blurFunc(grouItem.dataType, $event)"
                            @keyup.native="toMoney"
                            @click.native="clickFunc(grouItem, $event)"
                            :maxlength="grouItem.maxlength"
                            :show-word-limit="
                              isEmpty(grouItem['show-word-limit'])
                                ? false
                                : grouItem['show-word-limit']
                            "
                          >
                            <!-- <template slot="append">元</template> -->
                            <template slot="suffix">元</template>
                            <template v-if="!isEmpty(grouItem.prepend)">
                              <template slot="prepend">{{ grouItem.prepend }}</template>
                            </template>
                          </el-input>
                        </template>
                        <template v-else>
                          <el-input
                            :ref="grouItem.fieldName"
                            type="text"
                            v-model="formData[grouItem.fieldName]"
                            :placeholder="
                              isEmpty(grouItem.placeholder) ? '' : grouItem.placeholder
                            "
                            :disabled="
                              isEmpty(grouItem.disabled) ? false : grouItem.disabled
                            "
                            :readonly="
                              isEmpty(grouItem.readOnly) ? false : grouItem.readOnly
                            "
                            v-on="events[grouItem.fieldName]"
                            @blur="blurFunc(grouItem.dataType, $event)"
                            @click.native="clickFunc(grouItem, $event)"
                            :maxlength="grouItem.maxlength"
                            :show-word-limit="
                              isEmpty(grouItem['show-word-limit'])
                                ? false
                                : grouItem['show-word-limit']
                            "
                          >
                            <template v-if="!isEmpty(grouItem.prepend)">
                              <template slot="prepend">{{ grouItem.prepend }}</template>
                            </template>
                            <template v-if="grouItem.dataType === 'money(jiao)'">
                              <template slot="suffix">角</template>
                            </template>
                            <template v-else-if="grouItem.dataType === 'money(fen)'">
                              <template slot="suffix">分</template>
                            </template>
                            <template v-else-if="grouItem.dataType === 'money(wan)'">
                              <template slot="suffix">万元</template>
                            </template>
                            <template v-else-if="grouItem.dataType === 'money(yi)'">
                              <template slot="suffix">亿元</template>
                            </template>
                            <template v-else-if="grouItem.dataType === 'percentile'">
                              <template slot="suffix">%</template>
                            </template>
                            <template v-else-if="grouItem.dataType === 'thousand'">
                              <template slot="suffix">‰</template>
                            </template>
                            <template v-else-if="grouItem.dataType === 'tenThousand'">
                              <template slot="suffix">‱</template>
                            </template>
                            <template v-else-if="!isEmpty(grouItem.suffix)">
                              <template slot="suffix">{{ grouItem.suffix }}</template>
                            </template>
                          </el-input>
                        </template>
                      </template>
                      <template v-else-if="grouItem.fieldType === 'number'">
                        <el-input
                          :ref="grouItem.fieldName"
                          type="number"
                          v-model.number="formData[grouItem.fieldName]"
                          :placeholder="
                            isEmpty(grouItem.placeholder) ? '' : grouItem.placeholder
                          "
                          :disabled="
                            isEmpty(grouItem.disabled) ? false : grouItem.disabled
                          "
                          :readonly="
                            isEmpty(grouItem.readOnly) ? false : grouItem.readOnly
                          "
                          v-on="events[grouItem.fieldName]"
                          @click.native="clickFunc(grouItem, $event)"
                        >
                        </el-input>
                      </template>
                      <template v-else-if="grouItem.fieldType === 'date'">
                        <el-date-picker
                          :ref="grouItem.fieldName"
                          v-model="formData[grouItem.fieldName]"
                          :format="
                            formData[grouItem.fieldName] ===
                            dateFormat(
                              new Date('9999/12/31'),
                              isEmpty(grouItem.dateFormat.valueFormat)
                                ? 'yyyyMMdd'
                                : grouItem.dateFormat.valueFormat
                            )
                              ? '长期'
                              : isEmpty(grouItem.dateFormat.format)
                              ? 'yyyy-MM-dd'
                              : grouItem.dateFormat.format
                          "
                          :value-format="
                            isEmpty(grouItem.dateFormat.valueFormat)
                              ? 'yyyyMMdd'
                              : grouItem.dateFormat.valueFormat
                          "
                          type="date"
                          :placeholder="
                            isEmpty(grouItem.placeholder) ? '' : grouItem.placeholder
                          "
                          :disabled="
                            isEmpty(grouItem.disabled) ? false : grouItem.disabled
                          "
                          :readonly="
                            isEmpty(grouItem.readOnly) ? false : grouItem.readOnly
                          "
                          :picker-options="
                            !isEmpty(grouItem.dateOption) &&
                            grouItem.dateOption.isLong === true
                              ? pickerOptions
                              : {}
                          "
                          v-on="events[grouItem.fieldName]"
                          @click.native="clickFunc(grouItem, $event)"
                        >
                        </el-date-picker>
                      </template>
                    </el-form-item>
                  </el-col>
                  <template v-if="groupIndex !== item.group.length - 1">
                    <el-col
                      :key="grouItem.fieldName + 'line'"
                      class="line"
                      :span="2"
                      style="text-align: center"
                      v-show="isEmpty(grouItem.isShow) ? true : grouItem.isShow"
                      >{{
                        isEmpty(grouItem.separator) ? "-" : grouItem.separator
                      }}</el-col
                    >
                  </template>
                </template>
              </el-form-item>
            </template>
            <template v-else-if="item.fieldType === 'empty'">
              <el-form-item>
                <span slot="label">&nbsp;</span>
              </el-form-item>
            </template>
            <template v-else>
              <el-form-item
                :label="item.label"
                :prop="item.fieldName"
                v-show="isEmpty(item.isShow) ? true : item.isShow"
              >
                <template v-if="option.query === 'query'">
                  <span :title="formData[item.fieldName]">
                    <template v-if="!isEmpty(item.prepend)">
                      {{ item.prepend }}
                    </template>
                    {{ formData[item.fieldName] }}
                    <template v-if="!isEmpty(item.suffix)">
                      {{ item.suffix }}
                    </template>
                  </span>
                </template>
                <template v-else-if="item.fieldType === 'text'">
                  <template v-if="item.dataType === 'money(yuan)'">
                    <el-input
                      :ref="item.fieldName"
                      type="text"
                      v-model="formData[item.fieldName]"
                      :placeholder="isEmpty(item.placeholder) ? '' : item.placeholder"
                      :disabled="isEmpty(item.disabled) ? false : item.disabled"
                      :readonly="isEmpty(item.readOnly) ? false : item.readOnly"
                      v-on="events[item.fieldName]"
                      @blur="blurFunc(item.dataType, $event)"
                      @keyup.native="toMoney"
                      @click.native="clickFunc(item, $event)"
                      :maxlength="item.maxlength"
                      :show-word-limit="
                        isEmpty(item['show-word-limit']) ? false : item['show-word-limit']
                      "
                    >
                      <!-- <template slot="append">元</template> -->
                      <template slot="suffix">元</template>
                      <template v-if="!isEmpty(item.prepend)">
                        <template slot="prepend">{{ item.prepend }}</template>
                      </template>
                    </el-input>
                  </template>
                  <template v-else>
                    <el-input
                      :ref="item.fieldName"
                      type="text"
                      v-model="formData[item.fieldName]"
                      :placeholder="isEmpty(item.placeholder) ? '' : item.placeholder"
                      :disabled="isEmpty(item.disabled) ? false : item.disabled"
                      :readonly="isEmpty(item.readOnly) ? false : item.readOnly"
                      v-on="events[item.fieldName]"
                      @blur="blurFunc(item.dataType, $event)"
                      @click.native="clickFunc(item, $event)"
                      :maxlength="item.maxlength"
                      :show-word-limit="
                        isEmpty(item['show-word-limit']) ? false : item['show-word-limit']
                      "
                    >
                      <template v-if="!isEmpty(item.prepend)">
                        <template slot="prepend">{{ item.prepend }}</template>
                      </template>
                      <template v-if="item.dataType === 'money(jiao)'">
                        <template slot="suffix">角</template>
                      </template>
                      <template v-else-if="item.dataType === 'money(fen)'">
                        <template slot="suffix">分</template>
                      </template>
                      <template v-else-if="item.dataType === 'money(wan)'">
                        <template slot="suffix">万元</template>
                      </template>
                      <template v-else-if="item.dataType === 'money(yi)'">
                        <template slot="suffix">亿元</template>
                      </template>
                      <template v-else-if="item.dataType === 'percentile'">
                        <template slot="suffix">%</template>
                      </template>
                      <template v-else-if="item.dataType === 'thousand'">
                        <template slot="suffix">‰</template>
                      </template>
                      <template v-else-if="item.dataType === 'tenThousand'">
                        <template slot="suffix">‱</template>
                      </template>
                      <template v-else-if="!isEmpty(item.suffix)">
                        <template slot="suffix">{{ item.suffix }}</template>
                      </template>
                    </el-input>
                  </template>
                </template>
                <template v-else-if="item.fieldType === 'password'">
                  <el-input
                    :ref="item.fieldName"
                    type="password"
                    autocomplete="off"
                    v-model="formData[item.fieldName]"
                    :placeholder="isEmpty(item.placeholder) ? '' : item.placeholder"
                    :disabled="isEmpty(item.disabled) ? false : item.disabled"
                    :readonly="isEmpty(item.readOnly) ? false : item.readOnly"
                    v-on="events[item.fieldName]"
                    @blur="blurFunc(item.dataType, $event)"
                    @click.native="clickFunc(item, $event)"
                  >
                  </el-input>
                </template>
                <template v-else-if="item.fieldType === 'checkbox'">
                  <el-checkbox-group
                    :ref="item.fieldName"
                    v-model="formData[item.fieldName]"
                    :placeholder="isEmpty(item.placeholder) ? '' : item.placeholder"
                    :disabled="isEmpty(item.disabled) ? false : item.disabled"
                    :readonly="isEmpty(item.readOnly) ? false : item.readOnly"
                    v-on="events[item.fieldName]"
                    @click.native="clickFunc(item, $event)"
                  >
                    <el-checkbox
                      v-for="boxItem in pramDicItem[item.fieldName]"
                      :key="boxItem.optCode"
                      :label="boxItem.optCode"
                    >
                      {{ boxItem.optName }}</el-checkbox
                    >
                  </el-checkbox-group>
                </template>
                <template v-else-if="item.fieldType === 'select'">
                  <template v-if="item.dataType === 'library'">
                    <mftcc-library-select
                      v-model="formData[item.fieldName]"
                      :url="item.library.url"
                      :realField="item.library.realField"
                      :showField="item.library.showField"
                      :multiple="false"
                      :placeholder="isEmpty(item.placeholder) ? '' : item.placeholder"
                      v-on="events[item.fieldName]"
                      :disabled="isEmpty(item.disabled) ? false : item.disabled"
                      :readonly="isEmpty(item.readOnly) ? false : item.readOnly"
                      @click.native="clickFunc(item, $event)"
                    >
                    </mftcc-library-select>
                  </template>
                  <template v-else>
                    <el-select
                      autocomplete="off"
                      clearable
                      filterable
                      :ref="item.fieldName"
                      v-model="formData[item.fieldName]"
                      :placeholder="isEmpty(item.placeholder) ? '' : item.placeholder"
                      :disabled="isEmpty(item.disabled) ? false : item.disabled"
                      :readonly="isEmpty(item.readOnly) ? false : item.readOnly"
                      v-on="events[item.fieldName]"
                      @click.native="clickFunc(item, $event)"
                    >
                      <el-option
                        v-for="selectItem in pramDicItem[item.fieldName]"
                        :key="selectItem.optCode"
                        :label="selectItem.optName"
                        :value="selectItem.optCode"
                      >
                      </el-option>
                    </el-select>
                  </template>
                </template>
                <template v-else-if="item.fieldType === 'multipleSelection'">
                  <template v-if="item.dataType === 'library'">
                    <mftcc-library-select
                      v-model="formData[item.fieldName]"
                      :url="item.library.url"
                      :realField="item.library.realField"
                      :showField="item.library.showField"
                      :multiple="true"
                      :placeholder="isEmpty(item.placeholder) ? '' : item.placeholder"
                      v-on="events[item.fieldName]"
                      :disabled="isEmpty(item.disabled) ? false : item.disabled"
                      :readonly="isEmpty(item.readOnly) ? false : item.readOnly"
                      @click.native="clickFunc(item, $event)"
                    >
                    </mftcc-library-select>
                  </template>
                  <template v-else>
                    <el-select
                      multiple
                      autocomplete="off"
                      :ref="item.fieldName"
                      v-model="formData[item.fieldName]"
                      :placeholder="isEmpty(item.placeholder) ? '' : item.placeholder"
                      :disabled="isEmpty(item.disabled) ? false : item.disabled"
                      :readonly="isEmpty(item.readOnly) ? false : item.readOnly"
                      v-on="events[item.fieldName]"
                      @click.native="clickFunc(item, $event)"
                    >
                      <el-option
                        v-for="selectItem in pramDicItem[item.fieldName]"
                        :key="selectItem.optCode"
                        :label="selectItem.optName"
                        :value="selectItem.optCode"
                      ></el-option>
                    </el-select>
                  </template>
                </template>
                <template v-else-if="item.fieldType === 'radio'">
                  <el-radio-group
                    :ref="item.fieldName"
                    v-model="formData[item.fieldName]"
                    :placeholder="isEmpty(item.placeholder) ? '' : item.placeholder"
                    :disabled="isEmpty(item.disabled) ? false : item.disabled"
                    :readonly="isEmpty(item.readOnly) ? false : item.readOnly"
                    v-on="events[item.fieldName]"
                    @click.native="clickFunc(item, $event)"
                  >
                    <el-radio
                      v-for="radioItem in pramDicItem[item.fieldName]"
                      :key="radioItem.optCode"
                      :label="radioItem.optCode"
                    >
                      {{ radioItem.optName }}</el-radio
                    >
                  </el-radio-group>
                </template>
                <template v-else-if="item.fieldType === 'switch'">
                  <el-switch
                    :ref="item.fieldName"
                    v-model="formData[item.fieldName]"
                    :active-value="
                      isEmpty(item.switchValue.activeValue)
                        ? 0
                        : item.switchValue.activeValue
                    "
                    :inactive-value="
                      isEmpty(item.switchValue.inActiveValue)
                        ? 1
                        : item.switchValue.inActiveValue
                    "
                    :placeholder="isEmpty(item.placeholder) ? '' : item.placeholder"
                    :disabled="isEmpty(item.disabled) ? false : item.disabled"
                    :readonly="isEmpty(item.readOnly) ? false : item.readOnly"
                    v-on="events[item.fieldName]"
                    @click.native="clickFunc(item, $event)"
                  ></el-switch>
                </template>
                <template v-else-if="item.fieldType === 'date'">
                  <el-date-picker
                    :ref="item.fieldName"
                    v-model="formData[item.fieldName]"
                    :format="
                      formData[item.fieldName] ===
                      dateFormat(
                        new Date('9999/12/31'),
                        isEmpty(item.dateFormat.valueFormat)
                          ? 'yyyyMMdd'
                          : item.dateFormat.valueFormat
                      )
                        ? '长期'
                        : isEmpty(item.dateFormat.format)
                        ? 'yyyy-MM-dd'
                        : item.dateFormat.format
                    "
                    :value-format="
                      isEmpty(item.dateFormat.valueFormat)
                        ? 'yyyyMMdd'
                        : item.dateFormat.valueFormat
                    "
                    type="date"
                    :placeholder="isEmpty(item.placeholder) ? '' : item.placeholder"
                    :disabled="isEmpty(item.disabled) ? false : item.disabled"
                    :readonly="isEmpty(item.readOnly) ? false : item.readOnly"
                    :picker-options="
                      !isEmpty(item.dateOption) && item.dateOption.isLong === true
                        ? pickerOptions
                        : {}
                    "
                    v-on="events[item.fieldName]"
                    @click.native="clickFunc(item, $event)"
                  >
                  </el-date-picker>
                </template>
                <template v-else-if="item.fieldType === 'time'">
                  <el-time-picker
                    :ref="item.fieldName"
                    v-model="formData[item.fieldName]"
                    :format="
                      isEmpty(item.dateFormat.format)
                        ? 'HH:mm:ss'
                        : item.dateFormat.format
                    "
                    :value-format="
                      isEmpty(item.dateFormat.valueFormat)
                        ? 'HH:mm:ss'
                        : item.dateFormat.valueFormat
                    "
                    :placeholder="isEmpty(item.placeholder) ? '' : item.placeholder"
                    :disabled="isEmpty(item.disabled) ? false : item.disabled"
                    :readonly="isEmpty(item.readOnly) ? false : item.readOnly"
                    :picker-options="isEmpty(item.dateOption) ? {} : item.dateOption"
                    v-on="events[item.fieldName]"
                    @click.native="clickFunc(item, $event)"
                  >
                  </el-time-picker>
                </template>
                <template v-else-if="item.fieldType === 'datetime'">
                  <el-date-picker
                    :ref="item.fieldName"
                    v-model="formData[item.fieldName]"
                    :format="
                      isEmpty(item.dateFormat.format)
                        ? 'yyyy-MM-dd HH:mm:ss'
                        : item.dateFormat.format
                    "
                    :value-format="
                      isEmpty(item.dateFormat.valueFormat)
                        ? 'yyyyMMdd HH:mm:ss'
                        : item.dateFormat.valueFormat
                    "
                    type="datetime"
                    :placeholder="isEmpty(item.placeholder) ? '' : item.placeholder"
                    :disabled="isEmpty(item.disabled) ? false : item.disabled"
                    :readonly="isEmpty(item.readOnly) ? false : item.readOnly"
                    v-on="events[item.fieldName]"
                    @click.native="clickFunc(item, $event)"
                  >
                  </el-date-picker>
                </template>
                <template v-else-if="item.fieldType === 'number'">
                  <el-input
                    :ref="item.fieldName"
                    type="number"
                    v-model.number="formData[item.fieldName]"
                    :placeholder="isEmpty(item.placeholder) ? '' : item.placeholder"
                    :disabled="isEmpty(item.disabled) ? false : item.disabled"
                    :readonly="isEmpty(item.readOnly) ? false : item.readOnly"
                    v-on="events[item.fieldName]"
                    @click.native="clickFunc(item, $event)"
                  >
                  </el-input>
                </template>
                <template v-else-if="item.fieldType === 'textarea'">
                  <el-input
                    :ref="item.fieldName"
                    type="textarea"
                    v-model="formData[item.fieldName]"
                    :placeholder="isEmpty(item.placeholder) ? '' : item.placeholder"
                    :disabled="isEmpty(item.disabled) ? false : item.disabled"
                    :readonly="isEmpty(item.readOnly) ? false : item.readOnly"
                    v-on="events[item.fieldName]"
                    @click.native="clickFunc(item, $event)"
                    :maxlength="item.maxlength"
                    :show-word-limit="
                      isEmpty(item['show-word-limit']) ? true : item['show-word-limit']
                    "
                  >
                  </el-input>
                </template>
                <template v-else>
                  <el-input
                    :ref="item.fieldName"
                    v-model="formData[item.fieldName]"
                    :placeholder="isEmpty(item.placeholder) ? '' : item.placeholder"
                    :disabled="isEmpty(item.disabled) ? false : item.disabled"
                    :readonly="isEmpty(item.readOnly) ? false : item.readOnly"
                    v-on="events[item.fieldName]"
                    @click.native="clickFunc(item, $event)"
                  ></el-input>
                </template>
              </el-form-item>
            </template>
          </el-col>
        </template>
      </template>
    </el-row>
  </el-form>
</template>
<script>
import { get, postJson, putJson } from "../axios";
import formUtil from "../utils/formUtil";
export default {
  props: ["formId", "parentVm", "initData", "search"],
  data() {
    return {
      option: {},
      formData: {},
      events: {},
      pramDicItem: {},
      rules: {},
      isEmpty: formUtil.isEmpty,
      toMoney: formUtil.toMoney,
      dateFormat: formUtil.dateFormat,
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
          {
            text: "长期",
            onClick(picker) {
              picker.$emit("pick", new Date("9999/12/31"));
            },
          },
        ],
      },
    };
  },
  watch: {
    formId: {
      handler(val, oldVal) {
        this.initForm();
      },
      deep: true,
      immediate: true,
    },
    initData() {
      this.initForm();
    },
  },
  methods: {
    resetForm(callback) {
      this.$refs[this.option.formId].resetFields();
      if (formUtil.isFunction(callback)) {
        callback();
      }
    },
    blurFunc(dataType, el) {
      formUtil.func_uior_valTypeImm(el, dataType);
    },
    clickFunc(item, el) {
      let events = item.events;
      for (let i in events) {
        if (
          this.option.formDisabled !== true &&
          item.disabled !== true &&
          events[i].type === "click" &&
          formUtil.parentVmExist(this, events[i].callback)
        ) {
          this.parentVm._self[events[i].callback](el);
        }
      }
    },
    validateForm(callback) {
      this.$refs[this.option.formId].validate((valid) => {
        if (formUtil.isFunction(callback)) {
          callback(valid);
        }
      });
    },
    validateField(parm, callback) {
      this.$refs[this.option.formId].validateField(parm, (valid) => {
        if (formUtil.isFunction(callback)) {
          callback(valid);
        }
      });
    },
    clearValidate() {
      this.$nextTick(() => {
        if (arguments.length === 0) {
          this.$refs[this.option.formId].clearValidate();
        } else if (arguments.length >= 1) {
          this.$refs[this.option.formId].clearValidate(arguments[1]);
        }
      });
    },
    getFormItems(formItem) {
      let formItems = [];
      for (let i in formItem) {
        if (formItem[i].fieldType === "group") {
          let groupItem = formItem[i].group;
          for (let j in groupItem) {
            formItems.push(groupItem[j]);
          }
        } else {
          formItems.push(formItem[i]);
        }
      }
      return formItems;
    },
    setFormValue() {
      let formItem = this.option.formItem;
      if (arguments.length === 1) {
        for (let i in arguments[0]) {
          this.setFormValue(i, arguments[0][i]);
        }
      } else if (arguments.length >= 2) {
        if (this.formData.hasOwnProperty(arguments[0]) || arguments[2] === true) {
          let formItems = this.getFormItems(formItem);
          for (let i in formItems) {
            let formField = formItems[i];
            if (formField !== null && arguments[0] === formField.fieldName) {
              let value = arguments[1];
              if (
                formField.fieldType === "checkbox" ||
                formField.fieldType === "multipleSelection"
              ) {
                let checkValue = [];
                if (!this.isEmpty(value)) {
                  let checkArray = value.split("|");
                  for (let k in checkArray) {
                    if (!this.isEmpty(checkArray[k])) {
                      checkValue.push(checkArray[k]);
                    }
                  }
                }
                value = checkValue;
              } else if (formField.fieldType === "text") {
                if (formField.dataType === "money(yuan)") {
                  value = formUtil.formatMoney(value);
                } else if (formField.dataType === "money(wan)") {
                  value = formUtil.numDiv(value, 10000);
                } else if (formField.dataType === "money(baiwan)") {
                  value = formUtil.numDiv(value, 1000000);
                } else if (formField.dataType === "money(yi)") {
                  value = formUtil.numDiv(value, 100000000);
                } else if (formField.dataType === "percentile") {
                  value = formUtil.numMulti(value, 100);
                } else if (formField.dataType === "thousand") {
                  value = formUtil.numMulti(value, 1000);
                } else if (formField.dataType === "tenThousand") {
                  value = formUtil.numMulti(value, 10000);
                }
              }
              if (this.option.query === "query") {
                let parmArray = this.pramDicItem[formField.fieldName];
                if (
                  formField.fieldType === "checkbox" ||
                  formField.fieldType === "multipleSelection"
                ) {
                  let checkBoxValue = "";
                  for (let h in value) {
                    if (!this.isEmpty(value[h])) {
                      for (let i in parmArray) {
                        if (parmArray[i]["optCode"] === value[h]) {
                          if (checkBoxValue === "") {
                            checkBoxValue = parmArray[i]["optName"];
                          } else {
                            checkBoxValue = parmArray[i]["optName"] + "|" + checkBoxValue;
                          }
                        }
                      }
                    }
                  }
                  value = checkBoxValue;
                } else if (formField.fieldType === "switch") {
                  if (formField.switchValue.activeValue === value) {
                    value = "是";
                  } else {
                    value = "否";
                  }
                } else if (formField.fieldType === "date") {
                  try {
                    let valueFormat = "yyyyMMdd";
                    let format = "yyyy-MM-dd";
                    if (!this.isEmpty(formField.dateFormat)) {
                      if (!this.isEmpty(formField.dateFormat.valueFormat)) {
                        valueFormat = formField.dateFormat.valueFormat;
                      }
                      if (!this.isEmpty(formField.dateFormat.format)) {
                        format = formField.dateFormat.format;
                      }
                    }
                    value = formUtil.dateFormat(
                      formUtil.formatDate(value, valueFormat),
                      format
                    );
                  } catch (error) {
                    console.error(formField.fieldName + "日期数据解析错误");
                  }
                } else if (formField.fieldType === "datetime") {
                  try {
                    let valueFormat = "yyyyMMdd HH:mm:ss";
                    let format = "yyyy-MM-dd HH:mm:ss";
                    if (!this.isEmpty(formField.dateFormat)) {
                      if (!this.isEmpty(formField.dateFormat.valueFormat)) {
                        valueFormat = formField.dateFormat.valueFormat;
                      }
                      if (!this.isEmpty(formField.dateFormat.format)) {
                        format = formField.dateFormat.format;
                      }
                    }
                    value = formUtil.dateFormat(
                      formUtil.formatDate(value, valueFormat),
                      format
                    );
                  } catch (error) {
                    console.error(formField.fieldName + "日期数据解析错误");
                  }
                } else {
                  for (let i in parmArray) {
                    if (parmArray[i]["optCode"] === value) {
                      value = parmArray[i]["optName"];
                    }
                  }
                }
              }
              if (
                this.option.formDisabled === true &&
                !this.isEmpty(formField.formatter) &&
                formUtil.parentVmExist(this, formField.formatter)
              ) {
                value = this.parentVm._self[formField.formatter](value);
              }
              this.$set(this.formData, arguments[0], value);
            }
          }
        }
      }
    },
    getFormValue() {
      let formItem = this.option.formItem;
      let data = JSON.parse(JSON.stringify(this.formData)); //深度copy
      if (arguments.length === 0) {
        for (let j in data) {
          let formItems = this.getFormItems(formItem);
          for (let i in formItems) {
            let formField = formItems[i];
            if (formField !== null && j === formField.fieldName) {
              if (
                formField.fieldType === "checkbox" ||
                formField.fieldType === "multipleSelection"
              ) {
                data[j] = data[j].join("|");
              } else if (formField.fieldType === "text") {
                let formTextValue = data[j];
                if (formField.dataType === "money(yuan)") {
                  formTextValue = formUtil.delcommafy(formTextValue);
                } else if (formField.dataType === "money(wan)") {
                  formTextValue = formUtil.numMulti(formTextValue, 10000);
                } else if (formField.dataType === "money(baiwan)") {
                  formTextValue = formUtil.numMulti(formTextValue, 1000000);
                } else if (formField.dataType === "money(yi)") {
                  formTextValue = formUtil.numMulti(formTextValue, 100000000);
                } else if (formField.dataType === "percentile") {
                  formTextValue = formUtil.numDiv(formTextValue, 100);
                } else if (formField.dataType === "thousand") {
                  formTextValue = formUtil.numDiv(formTextValue, 1000);
                } else if (formField.dataType === "tenThousand") {
                  formTextValue = formUtil.numDiv(formTextValue, 10000);
                }
                data[j] = formTextValue;
              }
            }
          }
        }
        return data;
      } else if (arguments.length >= 1) {
        let result = this.getFormValue();
        if (!this.isEmpty(result)) {
          result = result[arguments[0]];
        }
        return result;
      }
    },
    attr() {
      let formItem = this.option.formItem;
      if (arguments.length === 2) {
        let formField = null;
        for (let i in formItem) {
          if (formItem[i].fieldType === "group") {
            let groupItem = formItem[i].group;
            for (let j in groupItem) {
              if (arguments[0] === groupItem[j].fieldName) {
                formField = groupItem[j];
              }
            }
          } else {
            if (arguments[0] === formItem[i].fieldName) {
              formField = formItem[i];
            }
          }
        }
        let value = "";
        if (formField !== null) {
          if (arguments[1] === "dicItem") {
            value = this.pramDicItem[arguments[0]];
          } else if (arguments[1] === "events") {
            value = this.events[arguments[0]];
          } else if (arguments[1] === "rules") {
            value = this.rules[arguments[0]];
          } else {
            value = formField[arguments[1]];
          }
        }
        return value;
      } else if (arguments.length >= 3) {
        let formField = null;
        for (let i in formItem) {
          if (formItem[i].fieldType === "group") {
            let groupItem = formItem[i].group;
            for (let j in groupItem) {
              if (arguments[0] === groupItem[j].fieldName) {
                formField = groupItem[j];
                formField["formItem"] = formItem[i];
                formField["label"] = formItem[i].label;
              }
            }
          } else {
            if (arguments[0] === formItem[i].fieldName) {
              formField = formItem[i];
            }
          }
        }
        if (formField !== null) {
          if (arguments[1] === "dicItem") {
            this.$set(this.pramDicItem, arguments[0], arguments[2]);
          } else if (arguments[1] === "events") {
            //解析事件
            try {
              let eventsArray = arguments[2];
              let event = {};
              for (let evetIndex in eventsArray) {
                if (
                  !this.isEmpty(eventsArray[evetIndex].type) &&
                  eventsArray[evetIndex].type !== "click" &&
                  formUtil.parentVmExist(this, eventsArray[evetIndex].callback)
                ) {
                  event[eventsArray[evetIndex].type] = this.parentVm._self[
                    eventsArray[evetIndex].callback
                  ];
                }
              }
              this.$set(this.events, formField.fieldName, event);
            } catch (error) {
              console.error("事件解析错误：" + error);
              this.$set(this.events, formField.fieldName, {});
            }
          } else if (arguments[1] === "rules") {
            //解析规则
            try {
              //解析规则
              let formRules = arguments[2];
              let fieldNameRules = [];
              if (formField.fieldType === "text") {
                let type = formField.dataType;
                if (type === "int") {
                  let fieldNameRule = {};
                  fieldNameRule["validator"] = formUtil.validateInt;
                  fieldNameRule["trigger"] = "blur";
                  fieldNameRules.push(fieldNameRule);
                } else if (type == "long") {
                  let fieldNameRule = {};
                  fieldNameRule["validator"] = formUtil.validateLong;
                  fieldNameRule["trigger"] = "blur";
                  fieldNameRules.push(fieldNameRule);
                } else if (
                  type == "double(2)" ||
                  type == "double(4)" ||
                  type == "double(6)" ||
                  type == "money(fen)" ||
                  type == "money(jiao)" ||
                  type == "money(wan)" ||
                  type == "money(yi)" ||
                  type == "percentile" ||
                  type === "thousand" ||
                  type == "tenThousand"
                ) {
                  let fieldNameRule = {};
                  fieldNameRule["validator"] = formUtil.validateNumber;
                  fieldNameRule["trigger"] = "blur";
                  fieldNameRules.push(fieldNameRule);
                } else if (type == "float") {
                  let fieldNameRule = {};
                  fieldNameRule["validator"] = formUtil.validateFloat;
                  fieldNameRule["trigger"] = "blur";
                  fieldNameRules.push(fieldNameRule);
                } else if (type == "boolean") {
                  let fieldNameRule = {};
                  fieldNameRule["validator"] = formUtil.validateBoolean;
                  fieldNameRule["trigger"] = "blur";
                  fieldNameRules.push(fieldNameRule);
                } else if (type === "money(yuan)") {
                  let fieldNameRule = {};
                  fieldNameRule["validator"] = formUtil.validateMoney;
                  fieldNameRule["trigger"] = "blur";
                  fieldNameRules.push(fieldNameRule);
                }
              }

              for (let k in formRules) {
                let fieldNameRule = {};
                let trigger = "blur";
                let message = "";
                let type = "";
                if (formRules[k].type === "required") {
                  if (!this.isEmpty(formField["formItem"])) {
                    formField["formItem"].required = true;
                  }
                  fieldNameRule["required"] = true;
                  trigger = "blur";
                  message = formField.label + "不能为空";
                } else if (formRules[k].type === "validator") {
                  if (formUtil.parentVmExist(this, formRules[k].validator)) {
                    fieldNameRule["validator"] = this.parentVm._self[
                      formRules[k].validator
                    ];
                  }
                  trigger = "blur";
                } else if (formRules[k].type === "number") {
                  trigger = "blur";
                  message = formField.label + "必须为数字";
                  type = "number";
                } else if (formRules[k].type === "email") {
                  trigger = "blur";
                  message = formField.label + "格式不正确";
                  type = "email";
                } else if (formRules[k].type === "phone") {
                  trigger = "blur";
                  message = "请输入正确的手机号码";
                  fieldNameRule["pattern"] = /^((13[0-9])|(14[0-9])|(15([0-3]|[4-9]))|(16[0-9])|(17[0-9])|(18[0-9])|(19[0-9]))\d{8}$/;
                } else if (formRules[k].type === "mobile") {
                  trigger = "blur";
                  message = "请输入正确的电话";
                  fieldNameRule["pattern"] = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
                } else if (formRules[k].type === "idNo") {
                  trigger = "blur";
                  fieldNameRule["validator"] = formUtil.validateIdNo;
                } else {
                  //continue
                }

                if (
                  formField.fieldType === "checkbox" ||
                  formField.fieldType === "multipleSelection"
                ) {
                  type = "array";
                }

                if (!this.isEmpty(formRules[k].min) && !this.isEmpty(formRules[k].max)) {
                  fieldNameRule["min"] = formRules[k].min;
                  fieldNameRule["max"] = formRules[k].max;
                  message =
                    formField.label +
                    "长度必须大于等于" +
                    formRules[k].min +
                    "并且小于等于" +
                    formRules[k].max;
                } else if (!this.isEmpty(formRules[k].min)) {
                  fieldNameRule["min"] = formRules[k].min;
                  message = formField.label + "长度必须大于等于" + formRules[k].min;
                } else if (!this.isEmpty(formRules[k].max)) {
                  fieldNameRule["max"] = formRules[k].max;
                  message = formField.label + "长度必须小于等于" + formRules[k].max;
                }

                if (!this.isEmpty(formRules[k].message)) {
                  message = formRules[k].message;
                }
                fieldNameRule["message"] = message;

                if (!this.isEmpty(type)) {
                  fieldNameRule["type"] = type;
                }

                if (!this.isEmpty(formRules[k].trigger)) {
                  trigger = formRules[k].trigger;
                }
                fieldNameRule["trigger"] = trigger;

                fieldNameRules.push(fieldNameRule);
              }
              this.$set(this.rules, formField.fieldName, fieldNameRules);
            } catch (error) {
              console.error("规则解析错误：" + error);
              this.$set(this.rules, formField.fieldName, []);
            }
          } else {
            formField[arguments[1]] = arguments[2];
          }
        }
      }
    },
    async initForm() {
      let _this = this;
      _this.option = {};
      _this.formData = {};
      _this.events = {};
      _this.pramDicItem = {};
      _this.rules = {};
      let formData;
      if (_this.formId) {
        try {
          let formData = await axios.get(
            formUtil.getFormProfilePath() + "/form/" + this.formId + ".json"
          );
          _this.option = JSON.parse(JSON.stringify(formData.data));
        } catch (error) {
          _this.$message.error(
            "未找到 [ " + _this.formId + " ] 配置文件或配置文件格式错误"
          );
        }
      }
      if (_this.initData !== undefined) {
        _this.option = Object.assign(_this.option, _this.initData);
      }
      let formItem = _this.option.formItem;
      let dicKeyArray = [];
      let formItems = this.getFormItems(formItem);
      for (let i in formItems) {
        //解析字典项
        let dicKey = formItems[i].dicKey;
        if (!_this.isEmpty(dicKey) && formItems[i].optionType !== "1") {
          let dicKeyObject = {};
          dicKeyObject.dicKey = dicKey;
          dicKeyObject.fieldName = formItems[i].fieldName;
          dicKeyArray.push(dicKeyObject);
        } else {
          _this.$set(_this.pramDicItem, formItems[i].fieldName, formItems[i].dicItem);
        }

        if (
          Array.isArray(formItems[i].value) &&
          (formItems[i].fieldType === "checkbox" ||
            formItems[i].fieldType === "multipleSelection")
        ) {
          formItems[i].value = formItems[i].value.join("|");
        }

        _this.setFormValue(formItems[i].fieldName, formItems[i].value, true);

        //解析事件
        _this.attr(formItems[i].fieldName, "events", formItems[i].events);

        //解析规则
        _this.attr(formItems[i].fieldName, "rules", formItems[i].rules);
      }

      //请求字典json文件
      let keyArray = [];
      for (let j in dicKeyArray) {
        keyArray.push(dicKeyArray[j].dicKey);
      }
      formUtil.getParmDic(keyArray, (dicKeyData) => {
        for (let k in dicKeyArray) {
          _this.$set(
            _this.pramDicItem,
            dicKeyArray[k].fieldName,
            dicKeyData[dicKeyArray[k].dicKey]
          );
        }
      });

      _this.clearValidate();
    },
  },
};
</script>
<style>
.mftcc-form,
.mftcc-form-search {
  display: flex;
  flex-wrap: wrap;
}
.mftcc-form .el-form-item__content,
.mftcc-form-search .el-form-item__content {
  width: auto;
}
.mftcc-form .el-form-item,
.mftcc-form-search .el-form-item {
  padding-left: 20px;
  padding-right: 20px;
}
.mftcc-form .mftcc-form-group .el-form-item,
.mftcc-form-search .mftcc-form-group .el-form-item {
  padding: 0;
}
.mftcc-form .el-select,
.mftcc-form-search .el-select {
  width: 100%;
}
.mftcc-form .form-el-row,
.mftcc-form-search .form-el-row {
  width: 100%;
}
</style>
