<template>
  <div
    ref="mftccEditTable"
    style="width: 100%; flex-grow: 1; position: relative"
    class="mftcc-edit-table"
  >
    <el-dropdown
      size="small"
      v-if="option.isDColumn"
      :hide-on-click="false"
      class="el-dropdown-DColumn"
      trigger="click"
    >
      <el-button icon="el-icon-setting" type="primary" class="mftcc-edit-table-dropdown">
      </el-button>
      <el-dropdown-menu slot="dropdown" style="text-align: center">
        <div style="text-align: left">
          <template v-for="(col, index) in option.columns">
            <el-dropdown-item :key="index" v-if="col.fieldName != ''">
              <el-checkbox
                :checked="col.isShow"
                v-model="col.isShow"
                @change="checkChange(col)"
              >{{ col.label }}</el-checkbox
              >
            </el-dropdown-item>
          </template>
        </div>
      </el-dropdown-menu>
    </el-dropdown>
    <div v-loading="option.loading">
      <el-form
        :model="formData"
        :rules="rules"
        :ref="option.formId"
        @submit.native.prevent
      >
        <el-table
          :data="option.tableData"
          :max-height="maxHeight"
          :height="height"
          highlight-current-row
          :ref="option.tableId"
          style="width: 100%"
          @current-change="currentChange"
          @selection-change="$emit('selection-change', $event)"
          @row-click="rowClick"
          @row-dblclick="rowDblclick"
          empty-text="暂无数据"
          :row-style="rowStyle"
          :row-class-name="rowClassName"
          :cell-style="cellStyle"
          :cell-class-name="cellClassName"
        >
          <template
            v-if="option.isSelect != '' && option.isSelect ? option.isSelect : false"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
          </template>
          <template v-for="(item, index) in option.columns">
            <el-table-column
              v-if="item.fieldName != '' ? item.isShow : true"
              :key="index"
              :prop="item.fieldName"
              :label="item.label"
              :show-overflow-tooltip="
                item['show-overflow-tooltip'] === true ? true : false
              "
              :min-width="item.width"
              :fixed="item.fixed || false"
              :align="item.align || 'left'"
              :width="item.fieldName == '' ? item.width : ''"
            >
              <template slot-scope="scope">
                <div v-if="item.fieldName == ''">
                  <template v-for="(btn, key) in item.data">
                    <el-button
                      :key="key"
                      type="text"
                      size="mini"
                      :disabled="buttonAuth(btn, scope.row)"
                      v-if="$hasPerm(btn.perm || true)"
                      @click="Fn(btn.type, scope.$index, scope.row)"
                    >{{ btn.label }}</el-button
                    >
                  </template>
                </div>
                <div v-else>
                  <el-form-item
                    :prop="item.fieldName + '_' + scope.$index"
                    v-show="editFlag[scope.$index] === true"
                    size="small"
                    style="margin-top: 20px"
                  >
                    <template v-if="item.fieldType === 'text'">
                      <template v-if="item.dataType === 'money(yuan)'">
                        <el-input
                          :ref="item.fieldName"
                          type="text"
                          v-model="formData[item.fieldName + '_' + scope.$index]"
                          :placeholder="
                            isEmpty(
                              columns[item.fieldName + '_' + scope.$index].placeholder
                            )
                              ? ''
                              : columns[item.fieldName + '_' + scope.$index].placeholder
                          "
                          :disabled="
                            isEmpty(columns[item.fieldName + '_' + scope.$index].disabled)
                              ? false
                              : columns[item.fieldName + '_' + scope.$index].disabled
                          "
                          :readonly="
                            isEmpty(columns[item.fieldName + '_' + scope.$index].readOnly)
                              ? false
                              : columns[item.fieldName + '_' + scope.$index].readOnly
                          "
                          v-on="events[item.fieldName]"
                          @blur="blurFunc(item.dataType, $event)"
                          @keyup.native="toMoney"
                          @click.native="clickFunc(item, $event, scope.$index)"
                          :maxlength="item.maxlength"
                          :show-word-limit="
                            isEmpty(item['show-word-limit'])
                              ? false
                              : item['show-word-limit']
                          "
                        >
                          <!-- <template slot="append">元</template> -->
                          <template slot="suffix">元</template>
                        </el-input>
                      </template>
                      <template v-else>
                        <el-input
                          :ref="item.fieldName"
                          type="text"
                          v-model="formData[item.fieldName + '_' + scope.$index]"
                          :placeholder="
                            isEmpty(
                              columns[item.fieldName + '_' + scope.$index].placeholder
                            )
                              ? ''
                              : columns[item.fieldName + '_' + scope.$index].placeholder
                          "
                          :disabled="
                            isEmpty(columns[item.fieldName + '_' + scope.$index].disabled)
                              ? false
                              : columns[item.fieldName + '_' + scope.$index].disabled
                          "
                          :readonly="
                            isEmpty(columns[item.fieldName + '_' + scope.$index].readOnly)
                              ? false
                              : columns[item.fieldName + '_' + scope.$index].readOnly
                          "
                          v-on="events[item.fieldName]"
                          @blur="blurFunc(item.dataType, $event)"
                          @click.native="clickFunc(item, $event, scope.$index)"
                          :maxlength="item.maxlength"
                          :show-word-limit="
                            isEmpty(item['show-word-limit'])
                              ? false
                              : item['show-word-limit']
                          "
                        >
                          <template v-if="item.dataType === 'money(jiao)'">
                            <template slot="suffix">角</template>
                          </template>
                          <template v-else-if="item.dataType === 'money(分)'">
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
                        </el-input>
                      </template>
                    </template>
                    <template v-else-if="item.fieldType === 'password'">
                      <el-input
                        :ref="item.fieldName"
                        type="password"
                        autocomplete="off"
                        v-model="formData[item.fieldName + '_' + scope.$index]"
                        :placeholder="
                          isEmpty(
                            columns[item.fieldName + '_' + scope.$index].placeholder
                          )
                            ? ''
                            : columns[item.fieldName + '_' + scope.$index].placeholder
                        "
                        :disabled="
                          isEmpty(columns[item.fieldName + '_' + scope.$index].disabled)
                            ? false
                            : columns[item.fieldName + '_' + scope.$index].disabled
                        "
                        :readonly="
                          isEmpty(columns[item.fieldName + '_' + scope.$index].readOnly)
                            ? false
                            : columns[item.fieldName + '_' + scope.$index].readOnly
                        "
                        v-on="events[item.fieldName]"
                        @blur="blurFunc(item.dataType, $event)"
                        @click.native="clickFunc(item, $event, scope.$index)"
                      >
                      </el-input>
                    </template>
                    <template v-else-if="item.fieldType === 'checkbox'">
                      <el-checkbox-group
                        :ref="item.fieldName"
                        v-model="formData[item.fieldName + '_' + scope.$index]"
                        :placeholder="
                          isEmpty(
                            columns[item.fieldName + '_' + scope.$index].placeholder
                          )
                            ? ''
                            : columns[item.fieldName + '_' + scope.$index].placeholder
                        "
                        :disabled="
                          isEmpty(columns[item.fieldName + '_' + scope.$index].disabled)
                            ? false
                            : columns[item.fieldName + '_' + scope.$index].disabled
                        "
                        :readonly="
                          isEmpty(columns[item.fieldName + '_' + scope.$index].readOnly)
                            ? false
                            : columns[item.fieldName + '_' + scope.$index].readOnly
                        "
                        v-on="events[item.fieldName]"
                        @click.native="clickFunc(item, $event, scope.$index)"
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
                          :ref="item.fieldName"
                          v-model="formData[item.fieldName + '_' + scope.$index]"
                          :url="item.library.url"
                          :realField="item.library.realField"
                          :showField="item.library.showField"
                          :multiple="false"
                          :placeholder="
                            isEmpty(
                              columns[item.fieldName + '_' + scope.$index].placeholder
                            )
                              ? ''
                              : columns[item.fieldName + '_' + scope.$index].placeholder
                          "
                          v-on="events[item.fieldName]"
                          :disabled="
                            isEmpty(columns[item.fieldName + '_' + scope.$index].disabled)
                              ? false
                              : columns[item.fieldName + '_' + scope.$index].disabled
                          "
                          :readonly="
                            isEmpty(columns[item.fieldName + '_' + scope.$index].readOnly)
                              ? false
                              : columns[item.fieldName + '_' + scope.$index].readOnly
                          "
                          @click.native="clickFunc(item, $event, scope.$index)"
                        >
                        </mftcc-library-select>
                      </template>
                      <template v-else>
                        <el-select
                          autocomplete="off"
                          clearable
                          filterable
                          :ref="item.fieldName"
                          v-model="formData[item.fieldName + '_' + scope.$index]"
                          :placeholder="
                            isEmpty(
                              columns[item.fieldName + '_' + scope.$index].placeholder
                            )
                              ? ''
                              : columns[item.fieldName + '_' + scope.$index].placeholder
                          "
                          :disabled="
                            isEmpty(columns[item.fieldName + '_' + scope.$index].disabled)
                              ? false
                              : columns[item.fieldName + '_' + scope.$index].disabled
                          "
                          :readonly="
                            isEmpty(columns[item.fieldName + '_' + scope.$index].readOnly)
                              ? false
                              : columns[item.fieldName + '_' + scope.$index].readOnly
                          "
                          v-on="events[item.fieldName]"
                          @click.native="clickFunc(item, $event, scope.$index)"
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
                          :ref="item.fieldName"
                          v-model="formData[item.fieldName + '_' + scope.$index]"
                          :url="item.library.url"
                          :realField="item.library.realField"
                          :showField="item.library.showField"
                          :multiple="true"
                          :placeholder="
                            isEmpty(
                              columns[item.fieldName + '_' + scope.$index].placeholder
                            )
                              ? ''
                              : columns[item.fieldName + '_' + scope.$index].placeholder
                          "
                          v-on="events[item.fieldName]"
                          :disabled="
                            isEmpty(columns[item.fieldName + '_' + scope.$index].disabled)
                              ? false
                              : columns[item.fieldName + '_' + scope.$index].disabled
                          "
                          :readonly="
                            isEmpty(columns[item.fieldName + '_' + scope.$index].readOnly)
                              ? false
                              : columns[item.fieldName + '_' + scope.$index].readOnly
                          "
                          @click.native="clickFunc(item, $event, scope.$index)"
                        >
                        </mftcc-library-select>
                      </template>
                      <template v-else>
                        <el-select
                          multiple
                          autocomplete="off"
                          :ref="item.fieldName"
                          v-model="formData[item.fieldName + '_' + scope.$index]"
                          :placeholder="
                            isEmpty(
                              columns[item.fieldName + '_' + scope.$index].placeholder
                            )
                              ? ''
                              : columns[item.fieldName + '_' + scope.$index].placeholder
                          "
                          :disabled="
                            isEmpty(columns[item.fieldName + '_' + scope.$index].disabled)
                              ? false
                              : columns[item.fieldName + '_' + scope.$index].disabled
                          "
                          :readonly="
                            isEmpty(columns[item.fieldName + '_' + scope.$index].readOnly)
                              ? false
                              : columns[item.fieldName + '_' + scope.$index].readOnly
                          "
                          v-on="events[item.fieldName]"
                          @click.native="clickFunc(item, $event, scope.$index)"
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
                        v-model="formData[item.fieldName + '_' + scope.$index]"
                        :placeholder="
                          isEmpty(
                            columns[item.fieldName + '_' + scope.$index].placeholder
                          )
                            ? ''
                            : columns[item.fieldName + '_' + scope.$index].placeholder
                        "
                        :disabled="
                          isEmpty(columns[item.fieldName + '_' + scope.$index].disabled)
                            ? false
                            : columns[item.fieldName + '_' + scope.$index].disabled
                        "
                        :readonly="
                          isEmpty(columns[item.fieldName + '_' + scope.$index].readOnly)
                            ? false
                            : columns[item.fieldName + '_' + scope.$index].readOnly
                        "
                        v-on="events[item.fieldName]"
                        @click.native="clickFunc(item, $event, scope.$index)"
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
                        v-model="formData[item.fieldName + '_' + scope.$index]"
                        :active-value="
                          isEmpty(
                            columns[item.fieldName + '_' + scope.$index].switchValue
                              .activeValue
                          )
                            ? '1'
                            : columns[item.fieldName + '_' + scope.$index].switchValue
                                .activeValue
                        "
                        :inactive-value="
                          isEmpty(
                            columns[item.fieldName + '_' + scope.$index].switchValue
                              .inActiveValue
                          )
                            ? '0'
                            : columns[item.fieldName + '_' + scope.$index].switchValue
                                .inActiveValue
                        "
                        :placeholder="
                          isEmpty(
                            columns[item.fieldName + '_' + scope.$index].placeholder
                          )
                            ? ''
                            : columns[item.fieldName + '_' + scope.$index].placeholder
                        "
                        :disabled="
                          isEmpty(columns[item.fieldName + '_' + scope.$index].disabled)
                            ? false
                            : columns[item.fieldName + '_' + scope.$index].disabled
                        "
                        :readonly="
                          isEmpty(columns[item.fieldName + '_' + scope.$index].readOnly)
                            ? false
                            : columns[item.fieldName + '_' + scope.$index].readOnly
                        "
                        @change="changeFunc(item, $event, scope.$index, scope.row)"
                        @click.native="clickFunc(item, $event, scope.$index)"
                      ></el-switch>
                    </template>
                    <template v-else-if="item.fieldType === 'date'">
                      <el-date-picker
                        :ref="item.fieldName"
                        v-model="formData[item.fieldName + '_' + scope.$index]"
                        :format="
                          formData[item.fieldName + '_' + scope.$index] ===
                          dateFormat(
                            new Date('9999/12/31'),
                            isEmpty(
                              columns[item.fieldName + '_' + scope.$index].dateFormat
                                .valueFormat
                            )
                              ? 'yyyyMMdd'
                              : columns[item.fieldName + '_' + scope.$index].dateFormat
                                  .valueFormat
                          )
                            ? '长期'
                            : isEmpty(
                                columns[item.fieldName + '_' + scope.$index].dateFormat
                                  .format
                              )
                            ? 'yyyy-MM-dd'
                            : columns[item.fieldName + '_' + scope.$index].dateFormat
                                .format
                        "
                        :value-format="
                          isEmpty(
                            columns[item.fieldName + '_' + scope.$index].dateFormat
                              .valueFormat
                          )
                            ? 'yyyyMMdd'
                            : columns[item.fieldName + '_' + scope.$index].dateFormat
                                .valueFormat
                        "
                        type="date"
                        :placeholder="
                          isEmpty(
                            columns[item.fieldName + '_' + scope.$index].placeholder
                          )
                            ? ''
                            : columns[item.fieldName + '_' + scope.$index].placeholder
                        "
                        :disabled="
                          isEmpty(columns[item.fieldName + '_' + scope.$index].disabled)
                            ? false
                            : columns[item.fieldName + '_' + scope.$index].disabled
                        "
                        :readonly="
                          isEmpty(columns[item.fieldName + '_' + scope.$index].readOnly)
                            ? false
                            : columns[item.fieldName + '_' + scope.$index].readOnly
                        "
                        v-on="events[item.fieldName]"
                        :picker-options="
                          !isEmpty(item.dateOption) && item.dateOption.isLong === true
                            ? pickerOptions
                            : {}
                        "
                        @click.native="clickFunc(item, $event, scope.$index)"
                      >
                      </el-date-picker>
                    </template>
                    <template v-else-if="item.fieldType === 'time'">
                      <el-time-picker
                        :ref="item.fieldName"
                        v-model="formData[item.fieldName + '_' + scope.$index]"
                        :format="
                          isEmpty(
                            columns[item.fieldName + '_' + scope.$index].dateFormat.format
                          )
                            ? 'HH:mm:ss'
                            : columns[item.fieldName + '_' + scope.$index].dateFormat
                                .format
                        "
                        :value-format="
                          isEmpty(
                            columns[item.fieldName + '_' + scope.$index].dateFormat
                              .valueFormat
                          )
                            ? 'HH:mm:ss'
                            : columns[item.fieldName + '_' + scope.$index].dateFormat
                                .valueFormat
                        "
                        :placeholder="
                          isEmpty(
                            columns[item.fieldName + '_' + scope.$index].placeholder
                          )
                            ? ''
                            : columns[item.fieldName + '_' + scope.$index].placeholder
                        "
                        :disabled="
                          isEmpty(columns[item.fieldName + '_' + scope.$index].disabled)
                            ? false
                            : columns[item.fieldName + '_' + scope.$index].disabled
                        "
                        :readonly="
                          isEmpty(columns[item.fieldName + '_' + scope.$index].readOnly)
                            ? false
                            : columns[item.fieldName + '_' + scope.$index].readOnly
                        "
                        v-on="events[item.fieldName]"
                        :picker-options="isEmpty(item.dateOption) ? {} : item.dateOption"
                        @click.native="clickFunc(item, $event, scope.$index)"
                      >
                      </el-time-picker>
                    </template>
                    <template v-else-if="item.fieldType === 'datetime'">
                      <el-date-picker
                        :ref="item.fieldName"
                        v-model="formData[item.fieldName + '_' + scope.$index]"
                        :format="
                          isEmpty(
                            columns[item.fieldName + '_' + scope.$index].dateFormat.format
                          )
                            ? 'yyyy-MM-dd HH:mm:ss'
                            : columns[item.fieldName + '_' + scope.$index].dateFormat
                                .format
                        "
                        :value-format="
                          isEmpty(
                            columns[item.fieldName + '_' + scope.$index].dateFormat
                              .valueFormat
                          )
                            ? 'yyyyMMdd HH:mm:ss'
                            : columns[item.fieldName + '_' + scope.$index].dateFormat
                                .valueFormat
                        "
                        type="datetime"
                        :placeholder="
                          isEmpty(
                            columns[item.fieldName + '_' + scope.$index].placeholder
                          )
                            ? ''
                            : columns[item.fieldName + '_' + scope.$index].placeholder
                        "
                        :disabled="
                          isEmpty(columns[item.fieldName + '_' + scope.$index].disabled)
                            ? false
                            : columns[item.fieldName + '_' + scope.$index].disabled
                        "
                        :readonly="
                          isEmpty(columns[item.fieldName + '_' + scope.$index].readOnly)
                            ? false
                            : columns[item.fieldName + '_' + scope.$index].readOnly
                        "
                        v-on="events[item.fieldName]"
                        @click.native="clickFunc(item, $event, scope.$index)"
                      >
                      </el-date-picker>
                    </template>
                    <template v-else-if="item.fieldType === 'number'">
                      <el-input
                        :ref="item.fieldName"
                        type="number"
                        v-model.number="formData[item.fieldName + '_' + scope.$index]"
                        :placeholder="
                          isEmpty(
                            columns[item.fieldName + '_' + scope.$index].placeholder
                          )
                            ? ''
                            : columns[item.fieldName + '_' + scope.$index].placeholder
                        "
                        :disabled="
                          isEmpty(columns[item.fieldName + '_' + scope.$index].disabled)
                            ? false
                            : columns[item.fieldName + '_' + scope.$index].disabled
                        "
                        :readonly="
                          isEmpty(columns[item.fieldName + '_' + scope.$index].readOnly)
                            ? false
                            : columns[item.fieldName + '_' + scope.$index].readOnly
                        "
                        v-on="events[item.fieldName]"
                        @click.native="clickFunc(item, $event, scope.$index)"
                      >
                      </el-input>
                    </template>
                    <template v-else-if="item.fieldType === 'textarea'">
                      <el-input
                        :ref="item.fieldName"
                        type="textarea"
                        v-model="formData[item.fieldName + '_' + scope.$index]"
                        :placeholder="
                          isEmpty(
                            columns[item.fieldName + '_' + scope.$index].placeholder
                          )
                            ? ''
                            : columns[item.fieldName + '_' + scope.$index].placeholder
                        "
                        :disabled="
                          isEmpty(columns[item.fieldName + '_' + scope.$index].disabled)
                            ? false
                            : columns[item.fieldName + '_' + scope.$index].disabled
                        "
                        :readonly="
                          isEmpty(columns[item.fieldName + '_' + scope.$index].readOnly)
                            ? false
                            : columns[item.fieldName + '_' + scope.$index].readOnly
                        "
                        v-on="events[item.fieldName]"
                        @click.native="clickFunc(item, $event, scope.$index)"
                        :maxlength="item.maxlength"
                        :show-word-limit="
                          isEmpty(item['show-word-limit'])
                            ? true
                            : item['show-word-limit']
                        "
                      >
                      </el-input>
                    </template>
                    <template v-else-if="item.fieldType === 'query'">
                      <span>{{ tableFormatter(scope.row[item.fieldName], item) }}</span>
                    </template>
                    <template v-else>
                      <el-input
                        :ref="item.fieldName"
                        v-model="formData[item.fieldName + '_' + scope.$index]"
                        :placeholder="
                          isEmpty(
                            columns[item.fieldName + '_' + scope.$index].placeholder
                          )
                            ? ''
                            : columns[item.fieldName + '_' + scope.$index].placeholder
                        "
                        :disabled="
                          isEmpty(columns[item.fieldName + '_' + scope.$index].disabled)
                            ? false
                            : columns[item.fieldName + '_' + scope.$index].disabled
                        "
                        :readonly="
                          isEmpty(columns[item.fieldName + '_' + scope.$index].readOnly)
                            ? false
                            : columns[item.fieldName + '_' + scope.$index].readOnly
                        "
                        v-on="events[item.fieldName]"
                        @click.native="clickFunc(item, $event, scope.$index)"
                      ></el-input>
                    </template>
                  </el-form-item>

                  <template v-if="item.fieldType === 'switch'">
                    <el-switch
                      v-show="editFlag[scope.$index] === false"
                      :ref="item.fieldName + '_query'"
                      v-model="scope.row[item.fieldName]"
                      :active-value="
                        isEmpty(
                          columns[item.fieldName + '_' + scope.$index].switchValue
                            .activeValue
                        )
                          ? 0
                          : columns[item.fieldName + '_' + scope.$index].switchValue
                              .activeValue
                      "
                      :inactive-value="
                        isEmpty(
                          columns[item.fieldName + '_' + scope.$index].switchValue
                            .inActiveValue
                        )
                          ? 1
                          : columns[item.fieldName + '_' + scope.$index].switchValue
                              .inActiveValue
                      "
                      :disabled="
                        isEmpty(columns[item.fieldName + '_' + scope.$index].disabled)
                          ? false
                          : columns[item.fieldName + '_' + scope.$index].disabled
                      "
                      :readonly="
                        isEmpty(columns[item.fieldName + '_' + scope.$index].readOnly)
                          ? false
                          : columns[item.fieldName + '_' + scope.$index].readOnly
                      "
                      @change="changeFunc(item, $event, scope.$index, scope.row)"
                      @click.native="clickFunc(item, $event, scope.$index)"
                    ></el-switch>
                  </template>
                  <template v-else>
                    <span v-show="editFlag[scope.$index] === false">{{
                      tableFormatter(scope.row[item.fieldName], item)
                    }}</span>
                  </template>
                </div>
              </template>
            </el-table-column>
          </template>
        </el-table>
      </el-form>
    </div>
  </div>
</template>

<script>
  import { findByList, getParameter } from "../axios";
  import formUtil from "../utils/formUtil";
  export default {
    data() {
      return {
        option: {},
        searchData: {},
        maxHeight: null,
        height: null,
        currentRow: null,
        isEmpty: formUtil.isEmpty,
        toMoney: formUtil.toMoney,
        dateFormat: formUtil.dateFormat,

        addFlag: {},
        editFlag: {},
        formData: {},
        formRules: {},
        rules: {},
        events: {},
        pramDicItem: {},
        columns: {},
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
    props: ["tableId", "initData", "initSearchData", "parentVm"],
    watch: {
      tableId: {
        handler(val, oldVal) {
          this.initTable(() => {
            this.$emit("callback");
          });
        },
        deep: true,
        immediate: true,
      },
      formRules: {
        handler(val, oldVal) {
          let _this = this;
          let dataList = _this.option.tableData;
          let columns = _this.option.columns;
          _this.rules = {};
          for (let i in dataList) {
            for (let j in columns) {
              if (columns[j].fieldName !== "") {
                _this.$set(
                  _this.rules,
                  columns[j].fieldName + "_" + i,
                  val[columns[j].fieldName]
                );
              }
            }
          }
        },
        deep: true,
        immediate: true,
      },
      option: {
        handler(val, oldVal) {
          let _this = this;
          let dataList = val.tableData;
          let columns = val.columns;
          _this.columns = {};
          for (let i in dataList) {
            for (let j in columns) {
              if (columns[j].fieldName !== "") {
                let newColumns = Object.assign({}, columns[j]);
                _this.$set(_this.columns, columns[j].fieldName + "_" + i, newColumns);
              }
            }
          }
        },
        deep: true,
        immediate: true,
      },
    },
    mounted() {
      this.$nextTick(() => {
        this.tableResize();
      });
    },
    methods: {
      rowStyle(obj) {
        let event = this.option["row-style"];
        if (Object.prototype.toString.call(event) === "[object Object]") {
          return event;
        } else if (event && formUtil.parentVmExist(this, event)) {
          return this.parentVm._self[event](obj);
        }
      },
      rowClassName(obj) {
        obj.row._$index = obj.rowIndex;
        let event = this.option["row-class-style"];
        if (event && formUtil.parentVmExist(this, event)) {
          return this.parentVm._self[event](obj);
        } else {
          return event;
        }
      },
      cellStyle(obj) {
        let event = this.option["cell-style"];
        if (Object.prototype.toString.call(event) === "[object Object]") {
          return event;
        } else if (event && formUtil.parentVmExist(this, event)) {
          return this.parentVm._self[event](obj);
        }
      },
      cellClassName(obj) {
        let event = this.option["cell-class-style"];
        if (event && formUtil.parentVmExist(this, event)) {
          return this.parentVm._self[event](obj);
        } else {
          return event;
        }
      },
      buttonAuth(btn, row) {
        let buttonAuth = false;
        let auth = btn.auth || "";
        let authArray = auth.split(";");
        for (let i in authArray) {
          if (!this.isEmpty(authArray[i])) {
            let authObj = authArray[i].split("-");
            if (authObj.length === 2) {
              if (this.$store.getters.buttonAuth[authObj[0]] == authObj[1]) {
                buttonAuth = true;
              } else if (row[authObj[0]] == authObj[1]) {
                buttonAuth = true;
              }
            }
          }
        }
        return buttonAuth;
      },
      blurFunc(dataType, el) {
        formUtil.func_uior_valTypeImm(el, dataType);
      },
      tableFormatter(cellValue, item) {
        let _this = this;
        let value = "";
        if (_this.isEmpty(cellValue)) {
          return cellValue;
        } else {
          value = cellValue;
        }
        let parmArray = _this.pramDicItem[item.fieldName];
        if (item.fieldType === "checkbox" || item.fieldType === "multipleSelection") {
          let checkBoxValue = "";
          let checkArray = cellValue.split("|");
          for (let h in checkArray) {
            if (!_this.isEmpty(checkArray[h])) {
              for (let i in parmArray) {
                if (parmArray[i]["optCode"] === checkArray[h]) {
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
        } else if (item.fieldType === "text") {
          if (item.dataType === "money(yuan)") {
            value = formUtil.formatMoney(cellValue);
          } else if (item.dataType === "percentile") {
            value = formUtil.numMulti(cellValue, 100);
          } else if (item.dataType === "thousand") {
            value = formUtil.numMulti(cellValue, 1000);
          } else if (item.dataType === "tenThousand") {
            value = formUtil.numMulti(cellValue, 10000);
          }
        } else if (item.fieldType === "date") {
          try {
            let valueFormat = "yyyyMMdd";
            let format = "yyyy-MM-dd";
            if (!this.isEmpty(item.dateFormat)) {
              if (!this.isEmpty(item.dateFormat.valueFormat)) {
                valueFormat = item.dateFormat.valueFormat;
              }
              if (!this.isEmpty(item.dateFormat.format)) {
                format = item.dateFormat.format;
              }
            }
            value = formUtil.dateFormat(formUtil.formatDate(value, valueFormat), format);
          } catch (error) {
            console.error(item.fieldName + "日期数据解析错误");
          }
        } else if (item.fieldType === "datetime") {
          try {
            let valueFormat = "yyyyMMdd HH:mm:ss";
            let format = "yyyy-MM-dd HH:mm:ss";
            if (!this.isEmpty(item.dateFormat)) {
              if (!this.isEmpty(item.dateFormat.valueFormat)) {
                valueFormat = item.dateFormat.valueFormat;
              }
              if (!this.isEmpty(item.dateFormat.format)) {
                format = item.dateFormat.format;
              }
            }
            value = formUtil.dateFormat(formUtil.formatDate(value, valueFormat), format);
          } catch (error) {
            console.error(item.fieldName + "日期数据解析错误");
          }
        } else {
          for (let i in parmArray) {
            if (parmArray[i]["optCode"] === cellValue) {
              value = parmArray[i]["optName"];
            }
          }
        }
        if (
          !_this.isEmpty(item.formatter) &&
          formUtil.parentVmExist(this, item.formatter)
        ) {
          value = this.parentVm._self[item.formatter](value);
        } else if (!_this.isEmpty(item.desensitization)) {
          value = formUtil.desensitization(value, item.desensitization);
        }
        return value;
      },
      clickFunc(item, el, index) {
        let events = item.events;
        for (let i in events) {
          if (
            item.disabled !== true &&
            item.readOnly !== true &&
            events[i].type === "click" &&
            formUtil.parentVmExist(this, events[i].callback)
          ) {
            this.parentVm._self[events[i].callback](el, index);
          }
        }
      },
      changeFunc(item, el, index, row) {
        let events = item.events;
        for (let i in events) {
          if (
            item.disabled !== true &&
            item.readOnly !== true &&
            events[i].type === "change" &&
            formUtil.parentVmExist(this, events[i].callback)
          ) {
            this.parentVm._self[events[i].callback](el, index, row);
          }
        }
      },
      addData() {
        let _this = this;
        let columns = _this.option.columns;
        let newObj = {};
        for (let j in columns) {
          if (columns[j].fieldName !== "") {
            newObj[columns[j].fieldName] = "";
          }
        }
        if (arguments.length >= 0) {
          for (let i in arguments[0]) {
            newObj[i] = arguments[0][i];
          }
        }
        _this.option.tableData.push(newObj);
        _this.$set(_this.addFlag, _this.option.tableData.length - 1, true);
        _this.editTable(_this.option.tableData.length - 1, true);
        _this.$nextTick(() => {
          _this.$refs[_this.option.tableId].bodyWrapper.scrollTop =
            _this.$refs[_this.option.tableId].bodyWrapper.scrollHeight;
        });
      },
      editTable() {
        let _this = this;
        let tableData = _this.option.tableData;
        let columns = _this.option.columns;
        _this.rules = {};
        let formCoyeData = JSON.parse(JSON.stringify(this.formData)); //深度copy
        _this.formData = {};
        for (let i = tableData.length - 1; i >= 0; i--) {
          if (arguments.length === 0) {
            this.editTable(i, !_this.editFlag[i]);
          } else if (arguments.length === 1) {
            this.editTable(i, arguments[0]);
          } else if (arguments.length === 2) {
            if (arguments[0] == i) {
              _this.$set(_this.editFlag, arguments[0], arguments[1]);
              for (let j in columns) {
                if (columns[j].fieldName !== "") {
                  _this.$set(
                    _this.rules,
                    columns[j].fieldName + "_" + i,
                    _this.formRules[columns[j].fieldName]
                  );
                  let newColumns = Object.assign({}, columns[j]);
                  _this.$set(_this.columns, columns[j].fieldName + "_" + i, newColumns);
                }
              }
            }
          } else if (arguments.length >= 3) {
            let value = arguments[1];
            if (!(arguments[1] instanceof Array)) {
              value = [arguments[1]];
            }
            for (let j in value) {
              if (tableData[i][arguments[0]] == value[j]) {
                this.editTable(i, arguments[2]);
              }
            }
          }
          _this.setFormValue(i, tableData[i]);
          if (_this.editFlag[i] === false) {
            if (_this.addFlag[i] === true) {
              for (let j = 0; j < tableData.length - i; j++) {
                _this.$set(_this.addFlag, i + j, _this.addFlag[i + j + 1]);
                _this.$set(_this.editFlag, i + j, _this.editFlag[i + j + 1]);

                for (let k in columns) {
                  if (columns[k].fieldName !== "") {
                    formCoyeData[columns[k].fieldName + "_" + (i + j)] =
                      formCoyeData[columns[k].fieldName + "_" + (i + j + 1)];
                    let formItemData =
                      formCoyeData[columns[k].fieldName + "_" + (i + j + 1)];
                    if (!_this.isEmpty(formItemData)) {
                      let formTextValue = this.getFormValueFormatter(
                        columns[k],
                        formItemData
                      ).value;
                      _this.setFormValue(i + j, columns[k].fieldName, formTextValue);
                    } else {
                      _this.setFormValue(i + j, columns[k].fieldName, "");
                    }
                  }
                }
              }
              tableData.splice(i, 1);
            }
          } else {
            for (let k in columns) {
              if (columns[k].fieldName !== "") {
                _this.$nextTick(() => {
                  if (_this.addFlag[i] === true) {
                    _this.$set(
                      _this.columns[columns[k].fieldName + "_" + i],
                      "readOnly",
                      false
                    );
                    _this.$set(
                      _this.columns[columns[k].fieldName + "_" + i],
                      "disabled",
                      false
                    );
                  }
                  let formItemData = formCoyeData[columns[k].fieldName + "_" + i];
                  if (!_this.isEmpty(formItemData)) {
                    let formTextValue = this.getFormValueFormatter(columns[k], formItemData)
                      .value;
                    _this.setFormValue(i, columns[k].fieldName, formTextValue);
                  }
                });
              }
            }
          }
        }
      },
      getFormValueFormatter(item, formItemData) {
        let formTextValue = formItemData;
        let checkFlag = false;
        if (item.fieldType === "checkbox" || item.fieldType === "multipleSelection") {
          formTextValue = formItemData.join("|");
          checkFlag = true;
        } else if (item.fieldType === "text") {
          if (item.dataType === "money(yuan)") {
            formTextValue = formUtil.delcommafy(formItemData);
          } else if (item.dataType === "percentile") {
            formTextValue = formUtil.numDiv(formTextValue, 100);
          } else if (item.dataType === "thousand") {
            formTextValue = formUtil.numDiv(formTextValue, 1000);
          } else if (item.dataType === "tenThousand") {
            formTextValue = formUtil.numDiv(formTextValue, 10000);
          }
        }
        let result = {
          value: formTextValue,
          checkFlag: checkFlag,
        };
        return result;
      },
      validateForm(callback) {
        this.$refs[this.option.formId].validate((valid) => {
          if (formUtil.isFunction(callback)) {
            callback(valid);
          }
        });
      },
      clearValidateForm(props) {
        this.$nextTick(() => {
          if (arguments.length === 0) {
            this.$refs[this.option.formId].clearValidate();
          } else if (arguments.length >= 1) {
            this.$refs[this.option.formId].clearValidate(props);
          }
        });
      },
      setFormValue() {
        let formItem = this.option.columns;
        if (arguments.length === 1) {
          for (let i in arguments[0]) {
            for (let k in arguments[0][i]) {
              this.setFormValue(i, k, arguments[0][i][k]);
            }
          }
        } else if (arguments.length == 2) {
          for (let k in arguments[1]) {
            this.setFormValue(arguments[0], k, arguments[1][k]);
          }
        } else if (arguments.length >= 3) {
          this.$set(this.formData, arguments[1] + "_" + arguments[0], arguments[2]);
          for (let j in formItem) {
            if (arguments[1] === formItem[j].fieldName) {
              if (
                formItem[j].fieldType === "checkbox" ||
                formItem[j].fieldType === "multipleSelection"
              ) {
                let checkBoxArray = [];
                let checkArray = arguments[2].split("|");
                for (let h in checkArray) {
                  if (!this.isEmpty(checkArray[h])) {
                    checkBoxArray.push(checkArray[h]);
                  }
                }
                this.$set(this.formData, arguments[1] + "_" + arguments[0], checkBoxArray);
              } else if (formItem[j].fieldType === "text") {
                let formTextValue = arguments[2];
                if (formItem[j].dataType === "money(yuan)") {
                  formTextValue = formUtil.formatMoney(formTextValue);
                } else if (formItem[j].dataType === "percentile") {
                  formTextValue = formUtil.numMulti(formTextValue, 100);
                } else if (formItem[j].dataType === "thousand") {
                  formTextValue = formUtil.numMulti(formTextValue, 1000);
                } else if (formItem[j].dataType === "tenThousand") {
                  formTextValue = formUtil.numMulti(formTextValue, 10000);
                }
                this.$set(this.formData, arguments[1] + "_" + arguments[0], formTextValue);
              } else {
                this.$set(this.formData, arguments[1] + "_" + arguments[0], arguments[2]);
              }
            }
          }
        }
      },
      getFormValue() {
        let _this = this;
        let formItem = this.option.columns;
        let data = JSON.parse(JSON.stringify(this.formData)); //深度copy
        if (arguments.length === 0) {
          let allData = [];
          let editData = [];
          let dataList = _this.option.tableData;
          for (let i in dataList) {
            if (_this.editFlag[i] === true) {
              let resultObj = _this.getFormValue(i);
              if (resultObj.isEdit === true) {
                editData.push(resultObj.data);
              }
              allData.push(resultObj.data);
            }
          }
          let result = {
            allData: allData,
            editData: editData,
          };
          return result;
        } else if (arguments.length == 1) {
          let dataList = _this.option.tableData;
          let dataObj = {};
          let isEdit = false;
          if (_this.editFlag[arguments[0]] === true) {
            for (let j in dataList[arguments[0]]) {
              dataObj[j] = data[j + "_" + arguments[0]];
              var checkFlag = false;
              for (let k in formItem) {
                if (j === formItem[k].fieldName) {
                  let formText = this.getFormValueFormatter(
                    formItem[k],
                    data[j + "_" + arguments[0]]
                  );
                  dataObj[j] = formText.value;
                  checkFlag = formText.checkFlag;
                }
              }
              let tableValue = dataList[arguments[0]][j];
              if (checkFlag) {
                dataObj[j] =
                  dataObj[j].substring(dataObj[j].length - 1) == "|"
                    ? dataObj[j].substring(0, dataObj[j].length - 1)
                    : dataObj[j];
                tableValue =
                  tableValue.substring(tableValue.length - 1) == "|"
                    ? tableValue.substring(0, tableValue.length - 1)
                    : tableValue;
              }
              if (dataObj[j] != tableValue) {
                isEdit = true;
              }
            }
          }
          let result = {
            isEdit: isEdit,
            data: dataObj,
          };
          return result;
        } else if (arguments.length >= 2) {
          let dataList = _this.option.tableData;
          let result = "";
          if (_this.editFlag[arguments[0]] === true) {
            let dataObj = _this.getFormValue(arguments[0]);
            if (!this.isEmpty(dataObj)) {
              result = dataObj.data[arguments[1]];
            }
          }
          return result;
        }
      },
      attrForm() {
        let formItem = this.option.columns;
        if (arguments.length === 2) {
          let value = "";
          for (let i in formItem) {
            if (formItem[i].fieldName === arguments[0]) {
              if (arguments[1] === "dicItem") {
                value = this.pramDicItem[arguments[0]];
              } else if (arguments[1] === "events") {
                value = this.events[arguments[0]];
                break;
              } else if (arguments[1] === "rules") {
                value = this.formRules[arguments[0]];
                break;
              } else {
                value = formItem[i][arguments[1]];
                break;
              }
            }
          }
          return value;
        } else if (arguments.length >= 3) {
          for (let i in formItem) {
            if (formItem[i].fieldName === arguments[0]) {
              if (arguments[1] === "dicItem") {
                this.$set(this.pramDicItem, arguments[0], arguments[2]);
                break;
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
                  this.$set(this.events, formItem[i].fieldName, event);
                } catch (error) {
                  console.error("事件解析错误：" + error);
                  this.$set(this.events, formItem[i].fieldName, {});
                }
                break;
              } else if (arguments[1] === "rules") {
                //解析规则
                try {
                  //解析规则
                  let formRules = arguments[2];
                  let fieldNameRules = [];
                  if (formItem[i].fieldType === "text") {
                    let type = formItem[i].dataType;
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
                      fieldNameRule["required"] = true;
                      trigger = "blur";
                      message = formItem[i].label + "不能为空";
                    } else if (formRules[k].type === "validator") {
                      if (formUtil.parentVmExist(this, eformRules[k].validator)) {
                        fieldNameRule["validator"] = this.parentVm._self[
                          eformRules[k].validator
                          ];
                      }
                      trigger = "blur";
                    } else if (formRules[k].type === "number") {
                      trigger = "blur";
                      message = formItem[i].label + "必须为数字";
                      type = "number";
                    } else if (formRules[k].type === "email") {
                      trigger = "blur";
                      message = "请输入正确的邮箱";
                      type = "email";
                    } else if (formRules[k].type === "phone") {
                      trigger = "blur";
                      message = "请输入正确的手机号码";
                      fieldNameRule["pattern"] = /^((13[0-9])|(14[0-9])|(15([0-3]|[4-9]))|(16[0-9])|(17[0-9])|(18[0-9])|(19[0-9]))\d{8}$/;
                    } else if (formRules[k].type === "mobile") {
                      trigger = "blur";
                      message = "请输入正确的电话号码";
                      fieldNameRule["pattern"] = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
                    } else if (formRules[k].type === "idNo") {
                      trigger = "blur";
                      fieldNameRule["validator"] = formUtil.validateIdNo;
                    } else {
                      //continue
                    }

                    if (
                      formItem[i].fieldType === "checkbox" ||
                      formItem[i].fieldType === "multipleSelection"
                    ) {
                      type = "array";
                    }

                    if (
                      !this.isEmpty(formRules[k].min) &&
                      !this.isEmpty(formRules[k].max)
                    ) {
                      fieldNameRule["min"] = formRules[k].min;
                      fieldNameRule["max"] = formRules[k].max;
                      message =
                        formItem[i].label +
                        "长度必须大于等于" +
                        formRules[k].min +
                        "并且小于等于" +
                        formRules[k].max;
                    } else if (!this.isEmpty(formRules[k].min)) {
                      fieldNameRule["min"] = formRules[k].min;
                      message = formItem[i].label + "长度必须大于等于" + formRules[k].min;
                    } else if (!this.isEmpty(formRules[k].max)) {
                      fieldNameRule["max"] = formRules[k].max;
                      message = formItem[i].label + "长度必须小于等于" + formRules[k].max;
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
                  this.$set(this.formRules, formItem[i].fieldName, fieldNameRules);
                } catch (error) {
                  console.error("规则解析错误：" + error);
                  this.$set(this.formRules, formItem[i].fieldName, []);
                }
                break;
              } else {
                formItem[i][arguments[1]] = arguments[2];
                break;
              }
            }
          }
        }
      },
      Fn(method, index, row) {
        if (formUtil.parentVmExist(this, method)) {
          this.parentVm._self[method](index, row);
        }
      },
      tableResize() {
        if (!this.option.height || this.option.height == "auto") {
          if (this.option.maxHeight) {
            this.maxHeight = this.option.maxHeight;
          } else {
            this.maxHeight = this.$refs.mftccEditTable.offsetHeight;
          }
          this.option.maxHeight = this.maxHeight;
          if (this.option.isPagination === true) {
            if ((this.maxHeight + "").endsWith("px")) {
              this.maxHeight =
                Number(this.maxHeight.substring(0, this.maxHeight.length - 2)) - 40;
            } else {
              this.maxHeight = Number(this.maxHeight) - 40;
            }
          }
          if (this.maxHeight <= 0) {
            this.maxHeight = null;
          }
        } else {
          this.height = this.option.height;
        }
      },
      getTableData(callback) {
        if (!this.option.url) {
          return;
        }
        var _this = this;
        _this.searchData = _this.searchData || {};
        _this.option.tableData = [];
        let url = _this.option.url;
        url = formUtil.converUrl(url);
        findByList(
          url,
          _this.searchData,
          true,
          (res) => {
            if (res.code == 0) {
              let dataList = res.list;
              for (let i in dataList) {
                _this.$set(_this.editFlag, i, false);
                _this.$set(_this.addFlag, i, false);
              }
              _this.option.tableData = dataList;
            }
            _this.option.loading = false;
            _this.$nextTick(() => {
              _this.initForm();
              _this.tableResize();
            });
            if (typeof callback === "function") {
              _this.$nextTick(() => {
                callback();
              });
            }
          },
          (error) => {
            _this.option.loading = false;
            _this.$nextTick(() => {
              _this.tableResize();
            });
            if (typeof callback === "function") {
              _this.$nextTick(() => {
                callback();
              });
            }
          }
        );
      },
      refresh() {
        this.getTableData();
      },
      search(searchData) {
        this.pageNo = 1;
        this.pageSize = 10;
        this.pageTotal = 0;
        this.currentRow = null;
        this.searchData = this.initSearchData || {};
        if (!this.isEmpty(searchData)) {
          for (let i in searchData) {
            this.searchData[i] = searchData[i];
          }
        }
        this.getTableData();
      },
      checkChange(col) {
        console.log(col);
      },
      setSelectValue() {
        if (arguments.length === 0) {
          this.$refs[this.option.tableId].clearSelection();
        } else if (arguments.length === 1) {
          this.setSelectValue(this.option.selectKey, arguments[0]);
        } else if (arguments.length === 2) {
          let selectKey = arguments[0];
          let tableDatas = this.option.tableData;
          let value = arguments[1];
          if (!(arguments[1] instanceof Array)) {
            value = [arguments[1]];
          }
          for (let i in tableDatas) {
            if (
              tableDatas[i][selectKey] !== undefined &&
              value.indexOf(tableDatas[i][selectKey]) > -1
            ) {
              this.$refs[this.option.tableId].toggleRowSelection(tableDatas[i]);
            }
          }
        } else {
          let selectKey = arguments[0];
          let tableDatas = this.option.tableData;
          let value = arguments[1];
          if (!(arguments[1] instanceof Array)) {
            value = [arguments[1]];
          }
          for (let i in tableDatas) {
            if (
              tableDatas[i][selectKey] !== undefined &&
              value.indexOf(tableDatas[i][selectKey]) > -1
            ) {
              this.$refs[this.option.tableId].toggleRowSelection(
                tableDatas[i],
                arguments[2]
              );
            }
          }
        }
      },
      getSelectValue() {
        let parmKeyArray = this.$refs[this.option.tableId].store.states.selection;
        return parmKeyArray;
      },
      setCurrentValue() {
        if (arguments.length === 0) {
          this.$refs[this.option.tableId].setCurrentRow();
        } else if (arguments.length === 1) {
          this.setCurrentValue(this.option.selectKey, arguments[0]);
        } else {
          let selectKey = arguments[0];
          let tableDatas = this.option.tableData;
          for (let i in tableDatas) {
            if (
              tableDatas[i][selectKey] !== undefined &&
              tableDatas[i][selectKey] === arguments[1]
            ) {
              this.$refs[this.option.tableId].setCurrentRow(tableDatas[i]);
              break;
            }
          }
        }
      },
      getCurrentValue() {
        return this.currentRow;
      },
      currentChange(currentRow, oldCurrentRow) {
        this.currentRow = currentRow;
        this.$emit("current-change", currentRow, oldCurrentRow);
      },
      rowClick(row, column, event) {
        if (!this.editFlag[row._$index]) {
          this.$emit("row-click", row, column, event);
        }
      },
      rowDblclick(row, column, event) {
        if (!this.editFlag[row._$index]) {
          this.$emit("row-dblclick", row, column, event);
        }
      },
      initForm() {
        let dataList = this.option.tableData;
        for (let i in dataList) {
          this.setFormValue(i, dataList[i]);
        }
      },
      async initTable(callback) {
        debugger
        let _this = this;
        _this.option = {};
        _this.searchData = _this.initSearchData || {};
        _this.maxHeight = null;
        _this.height = null;
        _this.currentRow = null;
        let tableData;
        try {
          if (this.tableId) {
            let jsonData = await axios.get(
              formUtil.getFormProfilePath() + "/table/" + this.tableId + ".json"
            );
            tableData = jsonData.data;
          }
        } catch (error) {
          _this.$message.error(
            "未找到 [ " + this.tableId + " ] 配置文件或配置文件格式错误"
          );
        }
        _this.option = JSON.parse(JSON.stringify(tableData));
        if (_this.initData !== undefined) {
          for (let i in _this.initData) {
            _this.option[i] = _this.initData[i];
          }
        }

        let formItem = _this.option.columns;
        let dicKeyArray = [];
        for (let i in formItem) {
          if (formItem[i].fieldName !== "") {
            //解析字典项
            let dicKey = formItem[i].dicKey;
            if (!_this.isEmpty(dicKey) && formItem[i].optionType !== "1") {
              let dicKeyObject = {};
              dicKeyObject.dicKey = dicKey;
              dicKeyObject.fieldName = formItem[i].fieldName;
              dicKeyArray.push(dicKeyObject);
            } else {
              _this.$set(_this.pramDicItem, formItem[i].fieldName, formItem[i].dicItem);
            }

            //解析事件
            _this.attrForm(formItem[i].fieldName, "events", formItem[i].events);

            //解析规则
            _this.attrForm(formItem[i].fieldName, "rules", formItem[i].rules);

            //获取库中选择字典
            if (
              (formItem[i].fieldType === "select" ||
                formItem[i].fieldType === "multipleSelection") &&
              formItem[i].dataType === "library"
            ) {
              getParameter(
                formItem[i].library.url,
                { query: "" },
                true,
                function (reponse) {
                  if (reponse.code === 0) {
                    let parmArray = [];
                    let list = reponse.list;
                    let realField = "optCode";
                    let showField = "optName";
                    if (!_this.isEmpty(formItem[i].library.realField)) {
                      realField = formItem[i].library.realField;
                    }
                    if (!_this.isEmpty(formItem[i].library.showField)) {
                      showField = formItem[i].library.showField;
                    }
                    for (let i in list) {
                      let option = {
                        optCode: list[i][realField],
                        optName: list[i][showField],
                      };
                      parmArray.push(option);
                    }
                    _this.$set(_this.pramDicItem, formItem[i].fieldName, parmArray);
                  }
                }
              );
            }
          }
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

        let url = _this.option.url;
        if (url !== undefined && url !== null && url !== "") {
          _this.getTableData(callback);
        } else {
          if (typeof callback === "function") {
            _this.$nextTick(() => {
              _this.initForm();
              callback();
            });
          }
        }
        // _this.$nextTick(() => {
        //     _this.tableResize();
        // })
      },
    },
  };
</script>
<style scoped>
  .mftcc-edit-table .el-checkbox__label {
    font-size: 12px;
  }
  .mftcc-edit-table .el-dropdown-DColumn {
    position: absolute;
    z-index: 1;
    top: 8px;
    right: 8px;
  }
  .mftcc-edit-table .el-pagination {
    margin-top: 5px;
  }
  .mftcc-edit-table .mftcc-edit-table-dropdown {
    padding: 6px 10px;
    border-radius: 4px;
  }
  .mftcc-edit-table .el-table__body {
    width: calc(100% - 4px) !important;
  }
</style>
