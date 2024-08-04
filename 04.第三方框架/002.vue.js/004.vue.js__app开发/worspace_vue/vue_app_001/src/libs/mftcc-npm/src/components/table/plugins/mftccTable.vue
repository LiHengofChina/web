<template>
  <div style="
      width: 100%;
      flex-grow: 1;
      position: relative;
      display: flex;
      flex-direction: column;
      background: #FFF;
    "
       :title="$show_title == false ? '' : tableId || initOption.tableId">
    <div class="mftcc-form-search"
         v-if="option.modelType == 'queryModel' && queryModelShow">
      <el-form label-position="right"
               label-width="130px"
               ref="searchForm"
               style="width: 100%"
               :model="searchData"
               @submit.native.prevent>
        <el-row style="width: 100%">
          <el-col :span="20"
                  style="min-height: 100px; display: flex; align-items: center; flex-wrap: wrap">
            <template v-for="col in option.columns">
              <el-col :span="
                  isEmpty(option.searchColCut) || option.searchColCut <= 1
                    ? 24
                    : Math.floor(24 / option.searchColCut)
                "
                      v-if="col.isQuery"
                      :key="col.prop">
                <form-item :props="col"
                           v-model="searchData[col.prop]"
                           :designer="true"
                           :isQuery="true"
                           :isSearch="true"
                           class="widgets">
                </form-item>
              </el-col>
            </template>
          </el-col>
          <div v-if="isButtonColor == '0'">
            <el-col :span="4">
              <div class="search-button">
                <el-button class="searchBtn" type="primary" native-type="submit" @click="searchTableData">查询</el-button>
              </div>
            </el-col>
            <el-col :span="4" style="margin-top: 10px">
              <div class="search-button">
                <el-button class="searchBtn" type="primary" @click="resetSearchData">重置</el-button>
              </div>
            </el-col>
          </div>
          <div v-else>
            <el-col :span="4">
              <button class="specialBtn" native-type="submit" @click="searchTableData">查询</button>
            </el-col>
            <el-col :span="4" style="margin-top: 10px">
              <button class="specialBtn" @click="resetSearchData">重置</button>
            </el-col>
          </div>
        </el-row>
      </el-form>
    </div>
    <div class="mftcc-form-buttom"
         v-if="
        option.modelType == 'queryModel' ||
          option.modelType == 'dynamicModel'
      "
         :class="option.modelType">
      <span v-if="option.modelType == 'queryModel'">{{
        option.tableName
      }}</span>
      <template v-for="(btn, index) in option.customBtns">
        <el-button :key="index"
                   class="optbtn"
                   :type="btn.colorType == undefined ? 'primary' : btn.colorType"
                   v-if="$hasPerm(btn.perm || true)"
                   @click="Fn(btn.callback)">
          {{ btn.label }}
        </el-button>
      </template>
      <!-- 动态列表展示表单名称 动态查询、表单名称不能为空、左侧存在新增按钮 -->
      <div v-if="option.modelType == 'dynamicModel' && option.tableName!='' && this.addButtonAuto" style="text-align: center;margin-top: -29px;">
        <span v-if="tableName==''">{{
        option.tableName
      }}</span>
        <span v-if="tableName!=''">{{
        tableName
      }}</span>
      </div>
      <!-- 动态列表展示表单名称 动态查询、左侧无新增按钮 -->
      <div v-if="option.modelType == 'dynamicModel' && this.addButtonAuto==false" style="text-align: center;">
        <span v-if="tableName==''">{{
        option.tableName
      }}</span>
        <span v-if="tableName!=''">{{
        tableName
      }}</span>
      </div>
      <div class="sysBtns"
           v-if="option.modelType == 'queryModel'">
        <template v-if="option.isEdit && !option.dontShowEditOptBtn">
          <el-button type="primary"
                     icon="el-icon-plus"
                     size="mini"
                     @click="addTableRow">{{ editTableInsertLabel }}
          </el-button>
          <el-button type="primary"
                     icon="el-icon-check"
                     size="mini"
                     @click="saveTableRows">{{ editTableSaveLabel }}
          </el-button>
          <template v-if="option.editType == 'all'">
            <el-button v-if="tableIsEdit == false"
                       type="primary"
                       icon="el-icon-edit"
                       size="mini"
                       @click="editTableRows">{{ editTableUpdateLabel }}
            </el-button>
            <el-button v-else
                       type="primary"
                       icon="el-icon-close"
                       size="mini"
                       @click="cancelTableRows">{{ editTableCancelLabel }}
            </el-button>
          </template>
        </template>
        <el-button v-if="option.isExport"
                   type="primary"
                   class="exportBtn"
                   icon="el-icon-download"
                   @click="exportTable">导出
        </el-button>
        <el-dropdown size="small"
                     v-if="option.isDColumn"
                     :hide-on-click="false"
                     class="el-dropdown-DColumn"
                     trigger="click">
          <el-button icon="el-icon-setting"
                     type="primary"
                     class="mftcc-table-dropdown">设置
          </el-button>
          <el-dropdown-menu slot="dropdown"
                            style="text-align: center">
            <div style="text-align: left">
              <template v-for="(col, index) in option.columns">
                <el-dropdown-item :key="index"
                                  v-if="col.prop != ''"
                                  :class="{ 'is-disabled': col.isDisabled,optCol:true }">
                  <el-checkbox :checked="col.isShow"
                               v-model="col.isShow"
                               :disabled="col.isDisabled"
                               @change="checkChange(col)">{{ col.label }}
                  </el-checkbox>
                </el-dropdown-item>
              </template>
            </div>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="mftcc-form-tools"
         v-if="option.modelType == 'dynamicModel'">
      <div class="mftcc-form-tools-item" style="width: 62%">
        <div class="tabs"
             style="max-width: 88%"
             v-if="
            (option.queryTabs && option.queryTabs.length > 0) ||
              customFilterData.length > 0
          ">
          <el-tabs v-model="option.tabActiveName"
                   @tab-click="queryTabClick">
            <el-tab-pane v-for="tab in option.queryTabs"
                         :key="tab.id"
                         :label="tab.label"
                         :name="tab.id">
            </el-tab-pane>
            <template v-for="tab in customFilterData">
              <el-tab-pane v-if="tab.selected"
                           :key="tab.id"
                           :label="tab.label"
                           :name="tab.id">
              </el-tab-pane>
            </template>
          </el-tabs>
        </div>
        <el-button type="text"
                   v-if="option.isCustomQuery"
                   @click="customQueryClick"
                   style="margin-left: 24px">筛选<i class="el-icon-d-arrow-right el-icon--right"
                                                  style="transform: rotate(90deg)"></i></el-button>
      </div>
      <div class="mftcc-form-tools-item" style="flex: 1; justify-content: right">
        <div class="dynamicQuery"
             v-if="option.isDynamicQuery">
          <el-input :placeholder="
              option.dynamicQuery.placeholder
                ? option.dynamicQuery.placeholder
                : '请输入查询条件'
            "
                    v-model="dynamicQuery"
                    @keyup.enter.native="searchTableData">
            <i slot="suffix"
               @click="searchTableData"
               class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
        <div class="sysBtns">
          <template v-if="option.isEdit && !option.dontShowEditOptBtn">
            <el-button type="primary"
                       icon="el-icon-plus"
                       size="mini"
                       @click="addTableRow">{{ editTableInsertLabel }}
            </el-button>
            <el-button type="primary"
                       icon="el-icon-check"
                       size="mini"
                       @click="saveTableRows">{{ editTableSaveLabel }}
            </el-button>
            <template v-if="option.editType == 'all'">
              <el-button v-if="tableIsEdit == false"
                         type="primary"
                         icon="el-icon-edit"
                         size="mini"
                         @click="editTableRows">{{ editTableUpdateLabel }}
              </el-button>
              <el-button v-else
                         type="primary"
                         icon="el-icon-close"
                         size="mini"
                         @click="cancelTableRows">{{ editTableCancelLabel }}
              </el-button>
            </template>
          </template>
          <el-button v-if="option.isExport"
                     type="primary"
                     class="exportBtn"
                     icon="el-icon-download"
                     @click="exportTable">导出
          </el-button>
          <el-dropdown size="small"
                       v-if="option.isDColumn"
                       :hide-on-click="false"
                       class="el-dropdown-DColumn"
                       trigger="click">
            <el-button icon="el-icon-setting"
                       type="primary"
                       class="mftcc-table-dropdown">设置
            </el-button>
            <el-dropdown-menu slot="dropdown"
                              style="text-align: center">
              <div style="text-align: left">
                <template v-for="(col, index) in option.columns">
                  <el-dropdown-item :key="index"
                                    v-if="col.prop != ''"
                                    :class="{ 'is-disabled': col.isDisabled,optCol:true }">
                    <el-checkbox :checked="col.isShow"
                                 v-model="col.isShow"
                                 :disabled="col.isDisabled"
                                 @change="checkChange(col)">{{ col.label }}
                    </el-checkbox>
                  </el-dropdown-item>
                </template>
              </div>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <div class="mftcc-form-buttom"
         v-if="
        option.modelType == 'nothingModel' &&
          option.isEdit &&
          !option.dontShowEditOptBtn
      "
         :class="option.modelType">
      <div class="sysBtns">
        <el-button type="primary"
                   icon="el-icon-plus"
                   size="mini"
                   @click="addTableRow">{{ editTableInsertLabel }}
        </el-button>
        <el-button type="primary"
                   icon="el-icon-check"
                   size="mini"
                   @click="saveTableRows">{{ editTableSaveLabel }}
        </el-button>
        <template v-if="option.editType == 'all'">
          <el-button v-if="tableIsEdit == false"
                     type="primary"
                     icon="el-icon-edit"
                     size="mini"
                     @click="editTableRows">{{ editTableUpdateLabel }}
          </el-button>
          <el-button v-else
                     type="primary"
                     icon="el-icon-close"
                     size="mini"
                     @click="cancelTableRows">{{ editTableCancelLabel }}
          </el-button>
        </template>
      </div>
    </div>
    <template v-if="option.modelType == 'expandModel'">
      <div class="expandModelDiv">
        <div class="mftcc-form-tools">
          <div class="mftcc-form-tools-item">
            <i v-if="option.isShowGoBack !== false"
               class="el-icon-arrow-left goBack"
               @click="$router.back(-1)"></i>
            <span style="margin: 0 20px 0 15px;font-weight: bold;">{{
        option.tableName
      }}</span>
            <div class="tabs"
                 v-if="
            (option.queryTabs && option.queryTabs.length > 0) ||
              customFilterData.length > 0
          ">
              <el-tabs v-model="option.tabActiveName"
                       @tab-click="queryTabClick">
                <el-tab-pane v-for="tab in option.queryTabs"
                             :key="tab.id"
                             :label="tab.label"
                             :name="tab.id">
                </el-tab-pane>
                <template v-for="tab in customFilterData">
                  <el-tab-pane v-if="tab.selected"
                               :key="tab.id"
                               :label="tab.label"
                               :name="tab.id">
                  </el-tab-pane>
                </template>
              </el-tabs>
            </div>
          </div>
          <div class="mftcc-form-tools-item">
            <div class="dynamicQuery"
                 v-if="option.isDynamicQuery">
              <el-input :placeholder="
              option.dynamicQuery.placeholder
                ? option.dynamicQuery.placeholder
                : '请输入查询条件'
            "
                        v-model="dynamicQuery"
                        @keyup.enter.native="searchTableData">
                <i slot="suffix"
                   @click="searchTableData"
                   class="el-input__icon el-icon-search"></i>
              </el-input>
            </div>
            <div class="sysBtns">
              <template v-for="(btn, index) in option.customBtns">
                <el-button :key="index"
                           class="optbtn"
                           :type="btn.colorType == undefined ? 'primary' : btn.colorType"
                           v-if="$hasPerm(btn.perm || true)"
                           @click="Fn(btn.callback)">
                  {{ btn.label }}
                </el-button>
              </template>
              <template v-if="option.isEdit && !option.dontShowEditOptBtn">
                <el-button type="primary"
                           icon="el-icon-plus"
                           size="mini"
                           @click="addTableRow">{{ editTableInsertLabel }}
                </el-button>
                <el-button type="primary"
                           icon="el-icon-check"
                           size="mini"
                           @click="saveTableRows">{{ editTableSaveLabel }}
                </el-button>
                <template v-if="option.editType == 'all'">
                  <el-button v-if="tableIsEdit == false"
                             type="primary"
                             icon="el-icon-edit"
                             size="mini"
                             @click="editTableRows">{{ editTableUpdateLabel }}
                  </el-button>
                  <el-button v-else
                             type="primary"
                             icon="el-icon-close"
                             size="mini"
                             @click="cancelTableRows">{{ editTableCancelLabel }}
                  </el-button>
                </template>
              </template>
              <el-button v-if="option.isExport"
                         type="primary"
                         class="exportBtn"
                         icon="el-icon-download"
                         @click="exportTable">导出
              </el-button>
              <el-dropdown size="small"
                           v-if="option.isDColumn"
                           :hide-on-click="false"
                           class="el-dropdown-DColumn"
                           trigger="click">
                <el-button icon="el-icon-setting"
                           type="primary"
                           class="mftcc-table-dropdown">设置
                </el-button>
                <el-dropdown-menu slot="dropdown"
                                  style="text-align: center">
                  <div style="text-align: left">
                    <template v-for="(col, index) in option.columns">
                      <el-dropdown-item :key="index"
                                        v-if="col.prop != ''"
                                        :class="{ 'is-disabled': col.isDisabled,optCol:true }">
                        <el-checkbox :checked="col.isShow"
                                     v-model="col.isShow"
                                     :disabled="col.isDisabled"
                                     @change="checkChange(col)">{{ col.label }}
                        </el-checkbox>
                      </el-dropdown-item>
                    </template>
                  </div>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </div>
        <el-collapse-transition>
          <div v-show="showExpandSearchCollapse">
            <el-row style="width: 100%">
              <el-form label-position="right" label-width="100px">
                <template v-for="col in searchColumns">
                  <el-col
                    :span="
                      isEmpty(option.expandSearchColCut) || option.expandSearchColCut <= 1
                        ? 24
                        : Math.floor(24 / option.expandSearchColCut)
                    "
                    v-if="col.isQuery"
                    :key="col.prop"
                  >
                    <form-item
                      :props="col"
                      v-model="searchData[col.prop]"
                      :designer="true"
                      :isQuery="true"
                      :isExpandQuery="true"
                      :isSearch="true"
                      class="widgets"
                    >
                    </form-item>
                  </el-col>
                </template>
                <el-col span="24">
                  <el-form-item
                    v-if="option.hasOther"
                    class="widgets otherWidgets"
                    label="其他"
                  >
                    <template v-for="col in option.columns">
                      <form-item
                        v-if="col.isOtherQuery"
                        :key="col.prop"
                        :props="col"
                        v-model="searchData[col.prop]"
                        :designer="true"
                        :isQuery="true"
                        :isExpandQuery="true"
                        :isSearch="true"
                        class="widgets"
                      >
                      </form-item>
                    </template>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>
            <el-row>
              <div class="tableSreach">
                <el-button
                  class="searchBtn"
                  type="primary"
                  native-type="submit"
                  @click="searchTableData"
                >查询
                </el-button>
                <el-button class="searchBtn" @click="resetSearchData">重置 </el-button>
              </div>
            </el-row>
          </div>
        </el-collapse-transition>
      </div>
      <div v-if="hasExpandQuery()"
           class="expandBtn"
           @click="expandSearchCollapse">
        <span>{{expandBtnLable}}</span>
        <i :class="expandBtnIcon"></i>
      </div>
    </template>

    <custom-filter v-show="customFilterShow"
                   :queryTabs="option.queryTabs"
                   :columns="option.columns"
                   :pramDicItem="pramDicItem"
                   :customFilterData="customFilterData"></custom-filter>
    <div v-loading="isLoading"
         ref="mftccTable"
         :class="option.query === 'query' ? 'mftcc-table-query' : 'mftcc-table'">
      <el-form :rules="rules"
               :model="option"
               ref="ruleForm">
        <!--<--option.treeParentKey-->
        <ElTableDraggable column handle="handler" v-if="isShowTable">
        <el-table
                  :data="option.tableData"
                  :max-height="maxHeight"
                  :show-summary="option.summation"
                  :summary-method="getSummaries"
                  :height="height"
                  border
                  highlight-current-row
                  :ref="tableId || initOption.tableId"
                  style="width: 100%;height:auto"
                  empty-text="暂无数据"
                  lazy
                  :load="treeLoads"
                  :row-key="option.selectKey || option.treeKey"
                  :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
                  :row-style="rowStyle"
                  :row-class-name="rowClassName"
                  :cell-style="cellStyle"
                  :cell-class-name="cellClassName"
                  :class="{
            isExpand: option.isExpand ? true : '',
            maxHeight: maxHeight
          }"
                  :default-expand-all="option.isAllExpanded"
                  v-mftcc-table-infinite-scroll="tableLoad"
                  infinite-scroll-disabled="disabledFlag"
                  infinite-scroll-immediate="false"
                  @current-change="currentChange"
                  @select="tableSelected"
                  @selection-change="$emit('selection-change', $event)"
                  @row-dblclick="rowDblclick"
                  @expand-change="expandChange"
                  @row-click="oneFunc">
          <el-table-column v-if="
              option.isSelect != '' && option.isSelect ? option.isSelect : false
            "
                           type="selection"
                           fixed
                           width="50"
                           align="center"
                           :reserve-selection="true">
          </el-table-column>
          <el-table-column v-else-if="option.isRadio"
                           fixed
                           label=""
                           width="50"
                           align="center"
                           header-align="center"
                           class-name="el-table-column--selection">
            <template slot-scope="scope">
              <el-radio :label="scope.$index"
                        v-model="templateRadio"
                        @change.native="getTemplateRow(scope.$index,scope.row)"
                        style="margin-left: 10px;">&nbsp;</el-radio>
            </template>
          </el-table-column>
          <el-table-column v-if="
              option.isSerial != '' && option.isSerial ? option.isSerial : false
            "
                           type="index"
                           fixed
                           width="50"
                           align="center">
          </el-table-column>
          <el-table-column v-if="option.isExpand"
                           type="expand">
            <template slot-scope="scope">
              <mftcc-form :initOption="expandFormData"
                          :parentVm="this"
                          :ref="'expandForm_' + scope.$index"
                          :class="option.expandType == 'edit' ? 'expandEditForm' : ''"></mftcc-form>
              <template v-if="option.expandType == 'edit'">
                <div style="text-align: center; margin-top: 5px">
                  <el-button type="primary"
                             @click="saveExpandFormData(scope.$index)">保存
                  </el-button>
                  <el-button @click="closeExpand(scope.$index)">取消</el-button>
                </div>
              </template>
            </template>
          </el-table-column>
          <template v-for="(col, index) in option.columns">
            <el-table-column v-if="
                (col.prop != '' ? col.isShow : false) &&
                  $hasPerm(col.perm || true)
              "
                             :sortable="col.sortType == 'defaultSort' ? true : false"
                             :sort-orders="['ascending', 'descending']"
                             :key="index"
                             :prop="col.prop"
                             :label="col.label"
                             :column-key="col.prop"
                             :show-overflow-tooltip="
                col['show-overflow-tooltip'] === true ? true : false
              "
                             :min-width="col.minWidth"
                             :fixed="col.fixedColumn || false"
                             :align="col.align || 'left'"
                             header-align="center"
                             :width="col.width">
              <template slot-scope="scope">
                <template v-if="scope.row.isEdit == true && !col.disableEdit">
                  <el-form-item :prop="'tableData.' + scope.$index + '.' + col.prop"
                                :rules="rules[col.prop]"
                                @click.native="col && clickFunc(col, $event)"
                                :event="scope.row[index + ''] && events[col.prop]">
                    <component :is="$Component[col.fieldType]"
                               v-model="scope.row[col.prop]"
                               :props="col"
                               :event="events[col.prop]"
                               :designer="true"
                               :isTable="true">
                    </component>
                  </el-form-item>
                </template>
                <template v-else-if="col.isHref === true">
                  <template v-if="
                      col.showIconImg &&
                        (col.iconClass || col.imgPath) &&
                        showIconExpr(col.showIconExpr, scope.row)
                    ">
                    <div style="display:inline-flex;align-items: center;color:#409eff;">
                      <template v-if="col.iconImgLocation == 'before'">
                        <i v-if="col.showIconImg == 'icon'"
                           :class="getIconImg(col, scope.row)"></i>
                        <img v-else
                             :src="getIconImg(col, scope.row)" />
                        <span style="margin-left: 3px;">
                          <hyperlinks :scope="scope"
                                      :col="col"></hyperlinks>
                        </span>
                      </template>
                      <template v-else-if="col.iconImgLocation == 'after'">
                        <span style="margin-right: 3px;">
                          <hyperlinks :scope="scope"
                                      :col="col"></hyperlinks>
                        </span>
                        <i v-if="col.showIconImg == 'icon'"
                           :class="getIconImg(col, scope.row)"></i>
                        <img v-else
                             :src="getIconImg(col, scope.row)" />
                      </template>
                    </div>
                  </template>
                  <template v-else>
                    <hyperlinks :scope="scope"
                                :col="col"></hyperlinks>
                  </template>
                </template>
                <template v-else-if="col.fieldType === 'switch'">
                  <mfswitch v-model="scope.row[col.prop]"
                            :props="col"
                            @change="
                      Fn(col.switchValue.changeEvent, scope.$index, scope.row)
                    "></mfswitch>
                </template>
                <template v-else-if="
                    col.isCustomComponent === true && col.customComponentPath
                  ">
                  <component :is="colCustomComp[col.customComponentPath]"
                             v-bind="{ row: scope.row, fieldName: col.prop }">
                  </component>
                </template>
                <template v-else>
                  <template v-if="
                      col.showIconImg &&
                        (col.iconClass || col.imgPath) &&
                        showIconExpr(col.showIconExpr, scope.row)
                    ">
                    <div style="display:inline-flex;align-items: center;">
                      <template v-if="col.iconImgLocation == 'before'">
                        <i v-if="col.showIconImg == 'icon'"
                           :class="getIconImg(col, scope.row)"></i>
                        <img v-else
                             :src="getIconImg(col, scope.row)" />
                        <span style="margin-left: 3px;">{{
                          tableFormatter(scope.row[col.prop], col)
                        }}</span>
                      </template>
                      <template v-else-if="col.iconImgLocation == 'after'">
                        <span style="margin-right: 3px;">{{
                          tableFormatter(scope.row[col.prop], col)
                        }}</span>
                        <i v-if="col.showIconImg == 'icon'"
                           :class="getIconImg(col, scope.row)"></i>
                        <img v-else
                             :src="getIconImg(col, scope.row)" />
                      </template>
                    </div>
                  </template>
                  <template v-else>
                    <i v-if="
                        (col.fieldType === 'date' ||
                          col.fieldType === 'time' ||
                          col.fieldType === 'datetime') &&
                          col.showDateIcon != false
                      "
                       class="el-icon-time"></i>
                    <span>{{ tableFormatter(scope.row[col.prop], col) }}</span>
                  </template>
                </template>
              </template>
            </el-table-column>
          </template>
          <el-table-column v-if="option.isOptBtns === true && getBtnsPermCut()"
                           :fixed="option.isExpand ? false : 'right'"
                           label="操作"
                           align="center"
                           :width="!option.isBtnAutoWidth && option.BtnWidth"
                           :min-width="!option.isBtnAutoWidth && option.BtnMinWidth">
            <template slot-scope="scope">
              <template v-if="
                  option.editType == 'always' ||
                    (option.editType != 'always' && scope.row.isEdit != true)
                ">
                <template v-if="option.isMoreBtn&&option.moreBtnCut&&option.moreBtnCut>0">
                  <template v-for="(btn, index) in option.optBtns">
                    <el-button v-if="$hasPerm(btn.perm || true)&&index<option.moreBtnCut"
                               :key="index"
                               size="mini"
                               type="text"
                               :disabled="buttonAuth(btn, scope.row)"
                               @click.stop="Fn(btn.callback, scope.$index, scope.row)">{{ btn.label }}
                    </el-button>
                  </template>
                  <el-dropdown trigger="click"
                               v-if="option.optBtns.length>option.moreBtnCut"
                               @command="handleCommand"
                               size="mini"
                               placement="bottom"
                               class="moreBtn">
                    <i :class="moreBtnIcon"></i>
                    <el-dropdown-menu slot="dropdown">
                      <template v-for="(btn, index) in option.optBtns">
                        <el-dropdown-item v-if="$hasPerm(btn.perm || true)&&index>=option.moreBtnCut"
                                          :key="index"
                                          :class="{'is-disabled':buttonAuth(btn, scope.row)}"
                                          :command="{callback:btn.callback, index:scope.$index, row:scope.row}">{{ btn.label }}</el-dropdown-item>
                      </template>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
                <template v-else>
                  <template v-for="(btn, index) in option.optBtns">
                    <el-button :key="index"
                               size="mini"
                               type="text"
                               :disabled="buttonAuth(btn, scope.row)"
                               v-if="$hasPerm(btn.perm || true)"
                               @click.stop="Fn(btn.callback, scope.$index, scope.row)">{{ btn.label }}
                    </el-button>
                  </template>
                </template>
              </template>
              <el-button size="mini"
                         :key="index"
                         type="text"
                         v-else-if="
                  option.editType != 'always' &&
                    scope.row.isEdit == true &&
                    !option.dontShowCancelBtn
                "
                         @click.stop="cancelEdit(scope.row, scope.$index)">取消
              </el-button>
            </template>
          </el-table-column>
          <el-table-column v-else-if="
              option.modelType == 'nothingModel' &&
                option.isEdit &&
                !option.dontShowCancelBtn
            "
                           :fixed="option.isExpand ? false : 'right'"
                           label="操作"
                           align="center">
            <template slot-scope="scope">
              <el-button size="mini"
                         :key="index"
                         type="text"
                         @click.stop="cancelEdit(scope.row, scope.$index)">取消
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        </ElTableDraggable>
      </el-form>
      <el-pagination v-if="option.pageInfoClass == 'isPagination'"
                     background
                     :hide-on-single-page="option.isNoDataPagination"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :page-sizes="[10, 20, 50, 100]"
                     :page-size="pageSize"
                     :current-page="pageNo"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="pageTotal">
      </el-pagination>
      <div v-if="option.pageInfoClass == 'isLazy'"
           class="lazy-pagination">
        当前显示{{option.tableData.length}}条数据, 一共{{pageTotal}}条数据
      </div>
    </div>
    <!-- <p v-if="loading" style="text-align: center">加载中...</p>
    <p v-if="noMore" style="text-align: center">没有更多了</p> -->
  </div>
</template>

<script>
  import ElTableDraggable from "el-table-draggable";
  import { postJsonNoLoading, postJson, getParameter } from "../../../axios";
  import formUtil from "../../../utils/formUtil";
  import customFilter from "../customFilter/index";
  import api from "../../../api/sysCustomFilter";
  import mfswitch from "../../form/switch";
  import hyperlinks from "./components/hyperlinks";
  export default {
    data() {
      return {
        isInit: true,
        option: {},
        searchData: {},
        maxHeight: null,
        height: null,
        isShowTable: false,
        pageNo: 1,
        pageSize: 10,
        pageTotal: 0,
        currentRow: null,
        isEmpty: formUtil.isEmpty,
        pramDicItem: {},
        exportHeader: [],
        exportField: [],
        dynamicQuery: "",
        oldTabActiveName: "",
        isLoading: false,
        queryModelShow: false,
        editWatch: null,
        editTableData: null,
        tableIsEdit: false,
        editTableInsertLabel: "新增行",
        editTableSaveLabel: "保存",
        editTableUpdateLabel: "编辑",
        editTableCancelLabel: "取消",
        rules: {},
        events: {},
        expandFormData: {},
        totals: "",
        sort: [],
        tableData: [],
        customFilterData: [],
        customFilterShow: false,
        customQuery: "",
        allSum: [],
        flag: 1,
        treeArray: [],
        loading: false,
        colCustomComp: {},
        showExpandSearchCollapse: false,
        expandBtnLable: "展开",
        expandBtnIcon: "el-icon-arrow-down",
        moreBtnIcon: "el-icon-arrow-down",
        templateRadio: false, //是否被选中，默认否
        templateSelection: null, //选中对象
        addButtonAuto:false,
        searchColumns: [],
      };
    },
    provide() {
      return {
        tableFormatter: this.tableFormatter,
        Fn: this.Fn
      };
    },
    computed: {
      noMore() {
        return this.total < this.pageNo;
      },
      disabledFlag() {
        return this.loading || this.noMore;
      }
    },
    components: {
      customFilter,
      mfswitch,
      hyperlinks,
      ElTableDraggable,
    },
    props: {
      tableId: {
        type: String,
        required: ""
      },
      tableName: {
        type: String,
        default: function () {
          return "";
        }
      },
      initOption: {
        type: Object
      },
      initSearchData: {
        type: Object,
        default: function () {
          return {};
        }
      },
      parentVm: {
        type: Object,
        required: true
      },
      isButtonColor: {
        type: String,
        default: function () {
         return '0';
        }
      }
    },
    watch: {
      tableId: {
        handler(val, oldVal) {
          if (val) {
            this.init();
          }
        }
      }
    },
    created() {
      this.init();
    },
    updated() {
      this.$nextTick(() => {
        this.$refs[this.tableId || this.initOption.tableId].doLayout() // 解决表格行错位
      })
    },
    methods: {
      getBtnsPermCut() {
        if (this.option.optBtns && this.option.optBtns.length > 0) {
          let hasAuthCut = 0;
          for (let btn of this.option.optBtns) {
            let state = this.$hasPerm(btn.perm || true);
            if (state) {
              hasAuthCut++;
            }
          }
          if (hasAuthCut > 0) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      },
      /* 用于弹层单选 radio选中 */
      getTemplateRow(index, row) {
        this.templateSelection = this.clone(row);
      },
      /* 操作列按钮超出后下拉点击事件 */
      handleCommand(data) {
        let index = data.index;
        let row = data.row;
        let callback = data.callback;
        this.Fn(callback, index, row);
      },
      /* 判断是否有展开的筛选条件（仅在组合模板下生效） */
      hasExpandQuery() {
        if (this.option.hasOther) {
          return true;
        }
        for (let item of this.option.columns) {
          if (item.isQuery) {
            return true;
          }
        }
        return false;
      },
      /**
       * 切换展开筛选面板按钮名称（仅在组合模板下生效）
       */
      expandSearchCollapse() {
        if (this.showExpandSearchCollapse) {
          this.showExpandSearchCollapse = false;
          this.expandBtnLable = "展开";
          this.expandBtnIcon = "el-icon-arrow-down";
        } else {
          this.showExpandSearchCollapse = true;
          this.expandBtnLable = "收起";
          this.expandBtnIcon = "el-icon-arrow-up";
        }
      },
      /**
       * 列表初始化
       */
      init() {
        this.initTable(() => {
          if (this.option.editType == "always" && this.option.isEdit) {
            this.editTableRows();
          }
          this.$emit("callback");
        });
      },
      /**
       * 根据条件判断要显示的图片/图标
       */
      getIconImg(col, row) {
        //判断是否配置了图标切换
        if (col.isIconSwitch) {
          for (let item of col.iconSwitchData) {
            if (this.showIconExpr(item.expr, row)) {
              return item.value;
            }
          }
        } else if (col.showIconImg == "icon") {
          return col.iconClass;
        } else {
          return col.imgPath;
        }
      },
      /**
       * 根据表达式判断是否显示/隐藏图标
       */
      showIconExpr(condition, row) {
        if (condition) {
          let keys = formUtil.doExpression(condition);
          //转换条件
          for (let name of keys.values()) {
            //字段真实值
            let value = row[name];
            //数字
            if (!isNaN(value)) {
              condition = condition.replaceAll("${" + name + "}", value);
            }
            //boolean
            else if (value === true || value === false || value === "true" || value === "false") {
              condition = condition.replaceAll("${" + name + "}", value);
            }
            //string
            else {
              condition = condition.replaceAll("${" + name + "}", `'${value}'`);
            }
          }
          //判断是否满足表达式
          if (eval(condition)) {
            return true;
          } else {
            return false;
          }
        } else {
          //没有填写表达式则不控制
          return true;
        }
      },
      /**
       * 列表多选事件触发
       */
      tableSelected(selection, row) {
        let flag = false;
        for (let item of selection) {
          if (JSON.stringify(item) == JSON.stringify(row)) {
            flag = true;
            break;
          }
        }
        if (this.option.selectedEvent) {
          this.Fn(this.option.selectedEvent, row, flag);
        }
      },
      /*
       * 列表数据赋值
       */
      setTableData(data) {
        this.isShowTable = false;
        this.$set(this.option, "tableData", data);
        this.$nextTick(() => {
          this.isShowTable = true;
        });
      },
      /*
       * 表格合计
       * */
      getSummaries(param) {
        if (this.option.summationType == "allSum" && this.flag == 1) {
          this.getAllTableData();
          this.flag++;
        }
        const { columns, data } = param;
        if (param.columns == undefined) {
          return;
        }
        var sums = [];
        columns.forEach((column, index) => {
          let col = null;
          this.option.columns.forEach((item, ele) => {
            if (column.property == item.prop) {
              col = item;
              return false;
            }
          });
          if (this.option.summationAddr === undefined && index === 0) {
            sums[0] = this.option.summationName;
            return;
          }
          if (this.option.summationAddr === "front" && index === 0) {
            sums[index] = this.option.summationName;
            return;
          }
          if (this.option.summationAddr === "after" && index === columns.length - 1) {
            sums[index] = this.option.summationName;
            return;
          }

          if (column.property && col && col.fieldType == "text" && col.dataType) {
            const values = data.map((item) => Number(item[column.property]));
            if (!values.every((value) => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return prev + curr;
                } else {
                  return prev;
                }
              }, 0);
              if (col.dataType == "money(yuan)") {
                sums[index] = formUtil.formatMoney(sums[index]);
                sums[index] += "元";
              } else if (col.dataType == "money(wan)") {
                sums[index] = formUtil.formatMoney(Number(sums[index]) / 10000, 2);
                sums[index] += "万元";
              } else if (col.dataType == "percentile") {
                sums[index] = formUtil.numMulti(sums[index], 100);
                sums[index] += "%";
              } else if (col.dataType == "thousand") {
                sums[index] = formUtil.numMulti(sums[index], 1000);
                sums[index] += "‰";
              } else if (col.dataType == "tenThousand") {
                sums[index] = formUtil.numMulti(sums[index], 10000);
                sums[index] += "‱";
              }
            } else {
              sums[index] = "";
            }
          } else {
            sums[index] = "";
            return;
          }
        });
        return sums;
      },
      /*
       * 监听表格排序
       * */
      onSortChange({ prop, order }) {
        this.sort = [];
        if ((prop, order)) {
          this.sort.push({
            filedName: prop,
            order: order
          });
        } else {
          this.sort.push({
            filedName: prop,
            order: ""
          });
        }
        if (this.option.pageInfoClass == "isPagination") {
          for (let index = 0; index < this.option.columns.length; index++) {
            if (this.option.columns[index].sortType == "defaultSort") {
              this.getTableData(this.pageNo, this.pageSize);
            }
          }
        }
        if (this.option.pageInfoClass == "isLazy") {
          this.option.tableData.sort(this.compare(prop, order));
        }
      },
      /*
       * 瀑布流情况下前端计算排序
       * */
      compare(propertyName, sort) {
        return function (obj1, obj2) {
          var value1 = obj1[propertyName];
          var value2 = obj2[propertyName];
          if (typeof value1 === "string" && typeof value2 === "string") {
            const res = value1.localeCompare(value2, "zh");
            if (res < 0) {
              return sort === "descending" ? 1 : -1;
            } else {
              return sort === "ascending" ? 1 : -1;
            }
          } else {
            if (value1 <= value2) {
              return sort === "ascending" ? -1 : 1;
            } else if (value1 > value2) {
              return sort === "ascending" ? 1 : -1;
            }
          }
        };
      },

      loadData() {
        this.getTableData(this.pageNo, this.pageSize);
      },
      tableLoad() {
        if (this.option.pageInfoClass == "isLazy") {
          this.loading = true;
          //当前页数小于总页数继续请求
          setTimeout(() => {
            if (this.pageNo < this.total) {
              this.pageNo++;
              this.loadData();
            }
            this.loading = false;
          }, 200);
        }
      },
      isNumber(val) {
        var regPos = /^\d+(\.\d+)?$/; //非负浮点数
        var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
        if (regPos.test(val) || regNeg.test(val)) {
          return true;
        } else {
          return false;
        }
      },
      switchValue(value, prop, state) {
        if (this.isEmpty(prop)) {
          return state;
        }
        if (typeof value == "number") {
          return Number(prop);
        }
        return prop;
      },
      queryTabClick(tab, event) {
        let tabData = this.option.queryTabs[tab.index];
        this.customQuery = null;
        delete this.searchData.queryTab;
        this.setSelectValue();
        if (tabData) {
          let data = {};
          if (tabData.filterType == "normal" || typeof tabData.filterType == "undefined") {
            if (!this.isEmpty(tabData.fieldName)) {
              data[tabData.fieldName] = tabData.value;
            }
            if (this.oldTabActiveName) {
              let tabs = this.option.queryTabs.filter((item) => item.id == this.oldTabActiveName);
              if (tabs.length > 0) {
                delete this.searchData[tabs[0].fieldName];
              }
            }
          } else if (tabData.filterType == "expr" && !this.isEmpty(tabData.queryExpr)) {
            let queryExpr = tabData.queryExpr;
            data.queryTab = queryExpr;
          }
          this.oldTabActiveName = tabData.id;
          this.search(data);
        } else {
          for (let item of this.customFilterData) {
            if (item.id == tab.name) {
              this.customQuery = JSON.stringify(item.filter);
              this.search();
              break;
            }
          }
        }
      },
      searchTableData() {
        this.search();
      },
      resetSearchData() {
        this.searchData = {};
        this.$nextTick(() => {
          this.$refs.searchForm.resetFields();
          this.$nextTick(() => {
            this.searchTableData();
          });
        });
      },
      rowStyle(obj) {
        let event = this.option["row-style"];
        if (Object.prototype.toString.call(event) === "[object Object]") {
          return event;
        } else if (event && formUtil.parentVmExist(this, event)) {
          return this.parentVm._self[event](obj);
        }
      },
      //列表树形懒加载
      treeLoads(tree, treeNode, resolve) {
        if (this.option.treeLoad) {
          let tableSearchData = Object.assign({}, this.searchData);
          tableSearchData.sort = JSON.stringify(this.sort);
          tableSearchData.tableId = this.tableId || window.productType + "/" + this.initOption.tableId;
          tableSearchData.pageNo = 1;
          tableSearchData.pageSize = -1;
          let initTreeSearchData = Object.assign({}, this.initSearchData);
          initTreeSearchData[this.option.treeParentKey] = tree[this.option.treeKey];
          tableSearchData.initQuery = JSON.stringify(initTreeSearchData);

          let url = this.option.url;
          if (url) {
            url = formUtil.converUrl(url);
            postJsonNoLoading(url, tableSearchData, true, (res) => {
              if (res.code == 0) {
                let dataList = res.list;
                let list = dataList.records || dataList;
                let treeData = this.treeArray;
                let sid = this.option.treeKey;
                let pid = this.option.treeParentKey;
                for (let node in list) {
                  for (let index in treeData) {
                    if (list[node][sid] == treeData[index][pid]) {
                      list[node].hasChildren = true;
                      break;
                    }
                  }
                }
                resolve(list);
              }
            });
          }
        } else {
          let result = [];
          let data = this.treeArray;
          for (let node in data) {
            if (data[node][this.option.treeParentKey] == tree[this.option.treeKey]) {
              result.push(data[node]);
            }
          }
          for (let node in data) {
            for (let index in result) {
              if (result[index][this.option.treeKey] == data[node][this.option.treeParentKey]) {
                result[index].hasChildren = true;
              }
            }
          }
          resolve(result);
        }
      },
      /**
       * 获取全部数据（树形懒加载使用）
       * 用于判断懒加载后的节点 是否有子级
       */
      getTreeData() {
        let tableSearchData = Object.assign({}, this.searchData);
        tableSearchData.pageNo = 1;
        tableSearchData.pageSize = -1;
        tableSearchData.tableId = this.tableId || window.productType + "/" + this.initOption.tableId;
        tableSearchData.initQuery = JSON.stringify(this.initSearchData);
        tableSearchData.sort = JSON.stringify(this.sort);
        let url = this.option.url;
        if (url) {
          url = formUtil.converUrl(url);
          postJsonNoLoading(url, tableSearchData, true, (res) => {
            if (res.code == 0) {
              let dataList = res.list;
              this.treeArray = dataList.records || dataList;
            }
          });
        }
      },
      rowClassName(obj) {
        let event = this.option["row-class-name"];
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
        let cellClassName = "";
        let column = this.option.columns.find((item) => {
          if (obj.column.property == item.prop) {
            return true;
          }
        });
        if (column && column.converColorData && column.converColorData.length > 0) {
          let value = obj.row[column.prop] || "";
          value = value.replace(".00", "");
          for (let item of column.converColorData) {
            if (item.originalData == value) {
              cellClassName += " " + item.dataColor;
              break;
            }
          }
        }
        let event = this.option["cell-class-name"];
        if (event) {
          if (formUtil.parentVmExist(this, event)) {
            cellClassName += " " + this.parentVm._self[event](obj);
          } else {
            cellClassName += " " + event;
          }
        }
        return cellClassName;
      },
      buttonAuth(btn, row) {
        let buttonAuth = false;
        let auth = btn.noShowParams || "";
        let authArray = auth.split(";");
        for (let i in authArray) {
          if (!this.isEmpty(authArray[i])) {
            let authObj = authArray[i].split("-");
            if (authObj.length === 2) {
              if (this.$store.getters.buttonAuth && this.$store.getters.buttonAuth[authObj[0]] == authObj[1]) {
                buttonAuth = true;
              } else if (row[authObj[0]] == authObj[1]) {
                buttonAuth = true;
              }
            }
          }
        }
        return buttonAuth;
      },
      tableFormatter(cellValue, item) {
        let _this = this;
        let value = "";
        if (_this.isEmpty(cellValue)) {
          return cellValue;
        } else {
          value = cellValue;
        }
        let parmArray = _this.pramDicItem[item.prop];
        if (item.fieldType === "checkbox" || item.fieldType === "multipleSelection") {
          let checkBoxValue = "";
          let checkArray;
          if (Array.isArray(cellValue)) {
            checkArray = cellValue;
          } else {
            checkArray = cellValue.split("|");
          }
          if (checkArray && checkArray[0].indexOf(",") != -1) {
            for (let h in checkArray) {
              if (!_this.isEmpty(checkArray[h])) {
                for (let i in parmArray) {
                  let cascaderArr = parmArray[i]["optName"];
                  if (cascaderArr) {
                    if (typeof cascaderArr != "string") {
                      cascaderArr = cascaderArr.toString();
                    }
                    cascaderArr = cascaderArr.split("|");
                  }
                  let cascaderCodeArr = parmArray[i]["optCode"];
                  if (cascaderCodeArr) {
                    if (typeof cascaderCodeArr != "string") {
                      cascaderCodeArr = cascaderCodeArr.toString();
                    }
                    cascaderCodeArr = cascaderCodeArr.split("|");
                  }
                  //级联选择器解析
                  let arrs = checkArray[h].split(",");
                  for (let key in cascaderArr) {
                    for (let g in arrs) {
                      if (cascaderCodeArr[key] == arrs[g]) {
                        if (arrs.length - 1 === parseInt(g)) {
                          checkBoxValue = checkBoxValue + "/" + cascaderArr[key] + ",";
                        } else {
                          if (checkBoxValue === "") {
                            checkBoxValue = cascaderArr[key];
                          } else {
                            if (0 === parseInt(g)) {
                              checkBoxValue = checkBoxValue + cascaderArr[key];
                            } else {
                              checkBoxValue = checkBoxValue + "/" + cascaderArr[key];
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          } else {
            for (let h in checkArray) {
              if (!_this.isEmpty(checkArray[h])) {
                for (let i in parmArray) {
                  if (parmArray[i]["optCode"] === checkArray[h]) {
                    if (checkBoxValue === "") {
                      checkBoxValue = parmArray[i]["optName"];
                    } else {
                      checkBoxValue = checkBoxValue + "|" + parmArray[i]["optName"];
                    }
                  }
                }
              }
            }
          }
          value = checkBoxValue;
        } else if (item.fieldType === "text") {
          let isConver = false;
          if (item.converData && item.converData.length > 0) {
            cellValue = cellValue + "";
            cellValue = cellValue.replace(".00", "");
            for (let cd of item.converData) {
              if (cd.originalData == cellValue) {
                value = cd.newData;
                isConver = true;
                break;
              }
            }
          }
          if (!isConver) {
            if (item.dataType === "money(yuan)") {
              cellValue = formUtil.delcommafy(cellValue);
              value = formUtil.formatMoney(cellValue);
            } else if (item.dataType === "money(wan)") {
              cellValue = formUtil.delcommafy(cellValue);
              value = formUtil.formatMoney(Number(cellValue) / 10000, 2);
            } else if (item.dataType === "percentile") {
              value = formUtil.numMulti(cellValue, 100);
            } else if (item.dataType === "thousand") {
              value = formUtil.numMulti(cellValue, 1000);
            } else if (item.dataType === "tenThousand") {
              value = formUtil.numMulti(cellValue, 10000);
            }
            value += item.suffix || "";
          }
        } else if (item.fieldType === "date" || item.fieldType === "dateGroup") {
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
        } else if (item.fieldType === "datetime" || item.fieldType === "datetimeGroup") {
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
        if (!_this.isEmpty(item.formatter) && formUtil.parentVmExist(this, item.formatter)) {
          value = this.parentVm._self[item.formatter](value);
        } else if (!_this.isEmpty(item.desensitization)) {
          let dese = {
            desensitization: item.desensitization,
            front: item.desensitizationFront,
            after: item.desensitizationAfter
          };
          value = formUtil.desensitization(value, dese);
        }
        return value;
      },
      Fn(method, index, row) {
        // this[method](index, row);
        //this.$emit('callback', method, index, row);
        if (formUtil.parentVmExist(this, method)) {
          this.parentVm._self[method](index, row);
        }
      },
      tableResize() {
        if (this.option.isAutoHeight || this.option.height == "auto") {
          if (this.option.query == "query") {
            return;
          }
          if (!this.maxHeight) {
            this.maxHeight = this.$refs.mftccTable.offsetHeight;
            if (this.option.pageInfoClass === "isPagination" || this.option.pageInfoClass === "isLazy") {
              if ((this.maxHeight + "").endsWith("px")) {
                this.maxHeight = Number(this.maxHeight.substring(0, this.maxHeight.length - 2)) - 40;
              } else {
                this.maxHeight = Number(this.maxHeight) - 40;
              }
            }
            if (this.maxHeight <= 0) {
              this.maxHeight = null;
            }
          }
        } else {
          this.height = this.option.height;
          this.maxHeight = this.option.maxHeight;
        }
      },
      getAllTableData(pageNo, pageSize) {
        let tableSearchData = {};
        tableSearchData.dynamicQuery = this.dynamicQuery;
        tableSearchData.pageNo = 1;
        tableSearchData.pageSize = -1;
        tableSearchData.tableId = this.tableId || window.productType + "/" + this.initOption.tableId;
        tableSearchData.initQuery = JSON.stringify(this.initSearchData);
        tableSearchData.sort = JSON.stringify(this.sort);
        let url = this.option.url;
        if (url) {
          url = formUtil.converUrl(url);
          postJsonNoLoading(url, tableSearchData, true, (res) => {
            if (res.code == 0) {
              let dataList = res.list;
              this.allSum = [];
              this.$refs[this.tableId || this.initOption.tableId].$children.forEach((obj) => {
                this.allSum.push(obj.columnConfig);
              });
              for (let i = 0; i < this.allSum.length; i++) {
                if (this.allSum[i] === undefined) {
                  this.allSum.splice(i, 1);
                  i = i - 1;
                }
              }
              let param = {};
              param["data"] = dataList.records || dataList;
              param["columns"] = this.allSum;
              this.$nextTick(() => {
                let allList = this.getSummaries(param);
                let alltable = document.querySelector(".el-table__footer-wrapper>table");
                for (let j = 0; j < allList.length; j++) {
                  for (let i = 0; i < alltable.rows[0].children.length; i++) {
                    // alltable.rows[0].children[j].innerText = allList[j]
                    alltable.rows[0].children[j].innerHTML = '<div class="cell">' + allList[j] + "</div>";
                  }
                }
              });
            }
          });
        }
      },
      getTableData(pageNo, pageSize, callback) {
        if (this.option.isLoading) {
          this.isLoading = true;
        }
        let tableSearchData = Object.assign({}, this.searchData);
        if (typeof tableSearchData.dynamicQuery != "undefined") {
          this.dynamicQuery = tableSearchData.dynamicQuery;
        }
        for (let key in tableSearchData) {
          if (typeof tableSearchData[key] == "object") {
            tableSearchData[key] = JSON.stringify(tableSearchData[key]);
          }
        }
        //分页或者懒加载 只要开了全部合计 赋值给1，-1
        if (this.option.pageInfoClass === "isPagination" || this.option.pageInfoClass === "isLazy") {
          tableSearchData.pageNo = pageNo;
          tableSearchData.pageSize = pageSize;
        } else {
          tableSearchData.pageNo = 1;
          tableSearchData.pageSize = -1;
        }
        for (let index = 0; index < this.option.columns.length; index++) {
          if (this.option.columns[index].sort && this.option.columns[index].sortType == "customSort") {
            this.sort.push({
              filedName: this.option.columns[index].prop,
              order: this.option.columns[index].sort
            });
          }
        }
        if (!this.option.pageInfoClass == "isLazy") {
          this.option.tableData = [];
        }
        tableSearchData.dynamicQuery = this.dynamicQuery;
        tableSearchData.sort = JSON.stringify(this.sort);
        tableSearchData.tableId = this.tableId || window.productType + "/" + this.initOption.tableId;
        // for (let key in tableSearchData) {
        //   if (this.initSearchData[key]) {
        //     delete this.initSearchData[key];
        //   }
        // }

        /* 自定义筛选 */
        if (this.customQuery) {
          tableSearchData.customQuery = this.customQuery;
        }
        //树形列表懒加载默认pid为0
        if (this.option.isTree && this.option.treeLoad && this.dynamicQuery == "") {
          let initTreeSearchData = Object.assign({}, this.initSearchData);
          initTreeSearchData[this.option.treeParentKey] = 0;
          tableSearchData.initQuery = JSON.stringify(initTreeSearchData);
        } else {
          tableSearchData.initQuery = JSON.stringify(this.initSearchData);
        }

        let url = this.option.url;
        if (url) {
          url = formUtil.converUrl(url);
          postJsonNoLoading(
            url,
            tableSearchData,
            true,
            (res) => {
              if (res.code == 0) {
                let dataList = res.list;
                if (this.option.pageInfoClass == "isLazy") {
                  let tl = dataList.records || dataList;
                  for (let i = 0; i < tl.length; i++) {
                    this.option.tableData.push(tl[i]);
                  }
                  this.loading = false;
                } else {
                  this.option.tableData = dataList.records || dataList;
                  this.option.tableData = this.resTreeData(this.option.tableData);
                }
                this.editTableData = this.clone(this.option.tableData);
                if (!this.option.treeLoad) {
                  this.treeArray = dataList.records || dataList;
                }
                // this.tableData = dataList.records || dataList;
                // this.tableData  = this.tableData.concat(this.tableData);
                this.pageNo = dataList.current; // 当前页数
                this.pageSize = dataList.size; // 每页数量
                this.pageTotal = dataList.total; // 页面总数
                let colList = res.colList;
                if (colList && colList.length > 0) {
                  this.option.columns = colList;
                }
                this.total = this.pageTotal / this.pageSize;
              }
              this.isLoading = false;
              this.$nextTick(() => {
                this.tableResize();
              });
              if (typeof callback === "function") {
                this.$nextTick(() => {
                  callback();
                });
              }
              this.initCallBack();
            },
            (error) => {
              this.isLoading = false;
              this.$nextTick(() => {
                this.tableResize();
              });
              if (typeof callback === "function") {
                this.$nextTick(() => {
                  callback();
                });
              }
              this.initCallBack();
            }
          );
        }
      },
      initCallBack() {
        if (this.isInit) {
          this.$nextTick(() => {
            this.$emit("initCallBack", this);
          });
          this.isInit = false;
        }
      },
      clickFunc(item, el) {
        let events = item.events;
        for (let i in events) {
          if (events[i].type === "click" && formUtil.parentVmExist(this, events[i].callback)) {
            this.parentVm._self[events[i].callback](el);
          }
        }
      },
      resTreeData(data) {
        if (!this.option.isTree || this.dynamicQuery != "") {
          return data;
        }
        let result = [];
        for (let node of data) {
          if (node[this.option.treeParentKey] == 0) {
            let childs = this.getTreeChilds(node[this.option.treeKey], data);
            node.children = childs;
            result.push(node);
          }
        }
        return result;
      },
      getTreeChilds(id, data) {
        let childs = [];
        for (let node of data) {
          if (node[this.option.treeParentKey] == id) {
            childs.push(node);
          }
        }
        for (let child of childs) {
          let childs2 = this.getTreeChilds(child[this.option.treeKey], data); //递归获取子节点
          if (childs2.length > 0) {
            child.children = childs2;
          }
        }
        return childs;
      },
      refresh() {
        this.option.tableData = [];
        this.getTableData(this.pageNo, this.pageSize, () => {
          if (this.option.editType == "always" && this.option.isEdit) {
            this.editTableRows();
          }
          this.setSelectValue();
        });
      },
      search(searchData) {
        this.setSelectValue();
        this.pageNo = 1;
        // this.pageSize = 10;
        this.pageTotal = 0;
        this.currentRow = null;
        if (!this.isEmpty(searchData)) {
          Object.assign(this.searchData, searchData);
        }
        this.option.tableData = [];
        this.getTableData(this.pageNo, this.pageSize);
      },
      handleSizeChange(val) {
        this.getTableData(1, val);
      },
      handleCurrentChange(val) {
        this.getTableData(val, this.pageSize);
      },
      checkChange(col) {
        console.log(col);
      },
      setSelectValue() {
        if (arguments.length === 0) {
          this.$refs[this.tableId || this.initOption.tableId].clearSelection();
        } else if (arguments.length === 1) {
          this.setSelectValue(this.option.selectKey, arguments[0]);
        } else if (arguments.length === 2) {
          let selectKey = arguments[0];
          let value = arguments[1];
          if (!(arguments[1] instanceof Array)) {
            value = [arguments[1]];
          }
          this.getSelectedRows(selectKey, value, true);
        } else {
          let selectKey = arguments[0];
          let value = arguments[1];
          if (!(arguments[1] instanceof Array)) {
            value = [arguments[1]];
          }
          this.getSelectedRows(selectKey, value, arguments[2]);
        }
      },
      getSelectedRows(selectKey, selectValue, state) {
        let url = this.option.url;
        if (url) {
          url = formUtil.converUrl(url);
          let tableSearchData = {};
          tableSearchData.dynamicQuery = "";
          tableSearchData.pageNo = 1;
          tableSearchData.pageSize = -1;
          tableSearchData.tableId = this.tableId || window.productType + "/" + this.initOption.tableId;
          tableSearchData.selectKey = selectKey;
          tableSearchData.selectValue = selectValue.join(",");
          tableSearchData.sort = JSON.stringify(this.sort);
          if (!tableSearchData.selectValue) {
            return;
          }
          postJsonNoLoading(url, tableSearchData, true, (res) => {
            if (res.code == 0) {
              let dataList = res.list;
              let list = dataList.records || dataList;

              let tableDatas = this.option.tableData;
              list.forEach((item) => {
                let flag = true;
                let tableItem;
                for (let i in tableDatas) {
                  if (JSON.stringify(item) == JSON.stringify(tableDatas[i])) {
                    flag = false;
                    tableItem = tableDatas[i];
                    break;
                  }
                }
                if (flag) {
                  this.$refs[this.tableId || this.initOption.tableId].toggleRowSelection(item, state);
                } else {
                  this.$refs[this.tableId || this.initOption.tableId].toggleRowSelection(tableItem, state);
                }
              });
            }
          });
        }
      },
      getSelectValue() {
        let parmKeyArray = this.$refs[this.tableId || this.initOption.tableId].store.states.selection;
        return parmKeyArray;
      },
      setCurrentValue() {
        if (arguments.length === 0) {
          this.$refs[this.tableId || this.initOption.tableId].setCurrentRow();
        } else if (arguments.length === 1) {
          this.setCurrentValue(this.option.selectKey, arguments[0]);
        } else {
          let selectKey = arguments[0];
          let tableDatas = this.option.tableData;
          for (let i in tableDatas) {
            if (tableDatas[i][selectKey] !== undefined && tableDatas[i][selectKey] === arguments[1]) {
              this.$refs[this.tableId || this.initOption.tableId].setCurrentRow(tableDatas[i]);
              break;
            }
          }
        }
      },
      getCurrentValue() {
        return this.currentRow;
      },
      currentChange(currentRow, oldCurrentRow) {
        this.getTemplateRow(null, currentRow);
        this.currentRow = currentRow;
        this.$emit("current-change", currentRow, oldCurrentRow);
      },
      async initTable(callback) {
        let _this = this;
        this.option = {};
        this.maxHeight = null;
        this.height = null;
        this.pageNo = 1;
        this.pageSize = 10;
        this.pageTotal = 0;
        this.currentRow = null;
        this.queryModelShow = false;
        this.searchData = {};
        try {
          let jsonData;
          if (this.tableId) {
            jsonData = await axios.get(formUtil.getFormProfilePath() + "/table/" + this.tableId + ".json");
          }
          if (jsonData) {
            this.option = JSON.parse(JSON.stringify(jsonData.data));
          } else {
            this.option = JSON.parse(JSON.stringify(this.$busDatas[this.tableId]));
          }
        } catch (error) {
          if (_this.initOption === undefined) {
            this.$message.error("未找到 [ " + this.tableId + " ] 配置文件或配置文件格式错误");
          }
        }
        let customBtns = this.option.customBtns;
        for (let i = 0; i < customBtns.length; i++) {
          let btnAut = $hasPerm(customBtns[i].perm);
          if (btnAut){
            this.addButtonAuto=true;
          }
        }
        if (_this.initOption !== undefined) {
          this.option = Object.assign(this.option, this.initOption);
        }

        /* 设置分页条数 */
        if (this.option.paginationPageSize) {
          this.pageSize = this.option.paginationPageSize;
        }
        if (this.option.pageInfoClass === "isLazy" && this.pageSize < 20) {
          this.pageSize = 20;
        }
        if (typeof this.option.tableData == "undefined") {
          this.option.tableData = [];
        }
        //如果为合计全部 则在这里调用查询全部数据接口
        // if (this.option.summationType == "allSum"){
        //   await this.getAllTableData();
        // }
        this.$nextTick(() => {
          this.tableResize();
        });
        if (
          this.option.isPagination === true &&
          this.option.pageInfoClass != "unIsPagination" &&
          this.option.pageInfoClass != "isLazy"
        ) {
          this.option.pageInfoClass = "isPagination";
        }
        if (this.option.isTree) {
          this.option.pageInfoClass = "unIsPagination";
        }
        if (this.option.modelType == "dynamicModel" && this.option.queryTabs.length > 0) {
          let tabs = this.option.queryTabs.filter((item) => item.id == this.option.tabActiveName);
          if (tabs.length > 0) {
            if (
              (tabs[0].filterType == "normal" || typeof tabs[0].filterType == "undefined") &&
              !this.isEmpty(tabs[0].fieldName)
            ) {
              this.searchData[tabs[0].fieldName] = tabs[0].value;
              this.oldTabActiveName = this.option.tabActiveName;
            } else if (tabs[0].filterType == "expr" && !this.isEmpty(tabs[0].queryExpr)) {
              let queryExpr = tabs[0].queryExpr;
              this.searchData.queryTab = queryExpr;
              this.oldTabActiveName = this.option.tabActiveName;
            }
          }
          if (tabs.length > 0 && !this.isEmpty(tabs[0].fieldName)) {
            this.searchData[tabs[0].fieldName] = tabs[0].value;
            this.oldTabActiveName = this.option.tabActiveName;
          }
        }
        if (this.option.isTree && this.option.treeLoad) {
          this.getTreeData();
        }
        this.searchColumns = this.option.columns.filter((item) => item.isQuery === true);
        this.searchColumns.forEach((item) => {
          if (typeof item.searchSeq == "undefined") {
            item.searchSeq = 0;
          }
        });
        this.searchColumns = this.searchColumns.sort((a, b) => {
          return a.searchSeq - b.searchSeq;
        });
        if (this.option.modelType == "queryModel") {
          for (let col of this.searchColumns) {
            this.$set(this.searchData, col.prop, col.value);
          }
          /* 判断是否存在固定列查询 */
          for (let col of this.option.columns) {
            if (col.isQuery) {
              this.queryModelShow = true;
              break;
            }
          }
        }

        /* 获取自定义筛选信息 */
        if (this.option.isCustomQuery && this.option.modelType == "dynamicModel") {
          let cfData = {
            router: this.$route.path,
            opNo: this.$store.getters.user.opNo
          };
          api.findByRouterOpNo(cfData, (res) => {
            if (res.code == 0 && res.data) {
              this.customFilterData = JSON.parse(res.data.customFilter);
            } else {
              // this.$message.error(res.msg);
            }
          });
        }

        if (this.initSearchData) {
          for (let key in this.initSearchData) {
            this.$set(this.searchData, key, this.initSearchData[key]);
          }
        }
        let formItem = this.option.columns;
        let dicKeyArray = [];
        for (let i in formItem) {
          if (formItem[i].prop !== "") {
            formItem[i].pkType = "table";
            //解析字典项
            let dicKey = formItem[i].dicKey;
            if (!this.isEmpty(dicKey) && formItem[i].optionType == "2") {
              let dicKeyObject = {};
              dicKeyObject.dicKey = dicKey;
              dicKeyObject.fieldName = formItem[i].prop;
              dicKeyArray.push(dicKeyObject);
            } else {
              this.$set(this.pramDicItem, formItem[i].prop, formItem[i].dicItem);
            }

            //获取库中选择字典
            if (
              formItem[i].optionType == "3" &&
              (formItem[i].fieldType === "select" || formItem[i].fieldType === "multipleSelection") &&
              formItem[i].dataType === "library"
            ) {
              let url = formItem[i].library.url;
              let searchData = {};
              let searchDataStr = formItem[i].library.searchDataStr || "";
              let searchDataArray = searchDataStr.split(";");
              for (let j in searchDataArray) {
                if (!this.isEmpty(searchDataArray[j])) {
                  let searchDataObj = searchDataArray[j].split("-");
                  if (searchDataObj.length === 2) {
                    let value = searchDataObj[1];
                    var reg = /^\${.*}$/;
                    let parm = value.replace(/^(\s|\${)+|(\s|})+$/g, "");
                    // value = parm;
                    if (value === undefined || value === "") {
                      value = this.$route.query[parm];
                    }
                    if (value === undefined || value === "") {
                      value = this.$route.params[parm];
                    }
                    searchData[searchDataObj[0]] = value;
                  }
                }
              }
              this.$set(formItem[i].library, "searchData", searchData);
              url = formUtil.converUrl(url);
              getParameter(url, searchData, true, (reponse) => {
                if (reponse.code === 0) {
                  let parmArray = [];
                  let list = reponse.list;
                  let realField = "optCode";
                  let showField = "optName";
                  if (!this.isEmpty(formItem[i].library.realField)) {
                    realField = formItem[i].library.realField;
                  }
                  if (!this.isEmpty(formItem[i].library.showField)) {
                    showField = formItem[i].library.showField;
                  }
                  for (let i in list) {
                    let option = {
                      optCode: list[i][realField],
                      optName: list[i][showField]
                    };
                    parmArray.push(option);
                  }
                  this.$set(this.pramDicItem, formItem[i].prop, parmArray);
                }
              });
            }
            //解析校验规则
            this.resRules(formItem[i]);
            //解析事件设置
            this.resEvents(formItem[i]);
            //解析自定义组件
            this.resCustomComponent(formItem[i]);
          }
        }

        this.isShowTable = true;

        //请求字典json文件
        let keyArray = [];
        for (let j in dicKeyArray) {
          keyArray.push(dicKeyArray[j].dicKey);
        }
        formUtil.getParmDic(keyArray, (dicKeyData) => {
          for (let k in dicKeyArray) {
            _this.$set(_this.pramDicItem, dicKeyArray[k].fieldName, dicKeyData[dicKeyArray[k].dicKey]);
          }
        });

        let url = this.option.url;
        this.option.tableData = [];
        if (url !== undefined && url !== null && url !== "") {
          this.getTableData(this.pageNo, this.pageSize, callback);
        } else {
          if (typeof callback === "function") {
            this.$nextTick(() => {
              callback();
            });
          }
          this.initCallBack();
        }

        if (this.option.isExpand) {
          const formId = this.option.expandFormId;
          try {
            let formData = await axios.get(formUtil.getFormProfilePath() + "/form/" + formId + ".json");
            if (formData) {
              this.expandFormData = formData.data;
            } else {
              this.expandFormData = this.$busDatas[_this.formId];
            }
          } catch (error) {
            this.$message.error("未找到 [ " + formId + " ] 配置文件或配置文件格式错误");
          }

          if (this.option.expandType == "readOnly") {
            this.expandFormData.query = "query";
          } else if (this.option.expandType == "edit") {
            this.expandFormData.formDisabled = null;
          }
          this.expandFormData.isExpand = true;
        }
      },
      exportTable(list) {
        this.$confirm("此功能导出当前列表全部数据，数据量过大可能导致耗时过长或导出失败，请耐心等待！建议条件筛选后导出，或通过报表功能查询及导出大数据量业务。确定继续导出？", "提示", {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        })
          .then(() => {
            this.getExpportData(list);
          })
          .catch(() => { });
      },
      getExpportData(list) {
        let loading = this.$loading({
          lock: true,
          text: "正在拼命导出......",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        //传入数据
        if(list!=undefined && list.length > 0){
          this.exportHeader = [];
          this.exportField = [];
          const { export_json_to_excel } = require("../../../plugins/Export2Excel.js");
          for (let c in this.option.columns) {
            if (this.option.columns[c].prop != "" && this.option.columns[c].isShow) {
              this.exportField.push(this.option.columns[c].prop);
              this.exportHeader.push(this.option.columns[c].label);
            }
          }
          let tableData = list;
          const data = this.formatJson(this.option.columns, tableData);
          export_json_to_excel(this.exportHeader, data, this.option.tableName);
          loading.close();
        }else {
          let tableSearchData = Object.assign({}, this.searchData);
          for (let key in tableSearchData) {
            if (typeof tableSearchData[key] == "object") {
              tableSearchData[key] = JSON.stringify(tableSearchData[key]);
            }
          }
          tableSearchData.pageNo = 1;
          tableSearchData.pageSize = -1;
          tableSearchData.dynamicQuery = this.dynamicQuery;
          tableSearchData.tableId = this.option.tableId;
          // for (let key in tableSearchData) {
          //   if (this.initSearchData[key]) {
          //     delete this.initSearchData[key];
          //   }
          // }
          tableSearchData.sort = JSON.stringify(this.sort);
          tableSearchData.tableId =
            this.tableId || window.productType + "/" + this.initOption.tableId;
          /* 自定义筛选 */
          if (this.customQuery) {
            tableSearchData.customQuery = this.customQuery;
          }
          tableSearchData.initQuery = JSON.stringify(this.initSearchData);
          let url = this.option.url;
          url = formUtil.converUrl(url);
          postJsonNoLoading(
            url,
            tableSearchData,
            true,
            (res) => {
              //分页列表
              if (res.code == 0 && res.list.records !=undefined && res.list.records.length > 0) {
                // require.ensure([], () => {
                /* eslint-disable */
                // 这里的径路要修改正确
                this.exportHeader = [];
                this.exportField = [];
                const { export_json_to_excel } = require("../../../plugins/Export2Excel.js");
                for (let c in this.option.columns) {
                  if (this.option.columns[c].prop != "" && this.option.columns[c].isShow) {
                    this.exportField.push(this.option.columns[c].prop);
                    this.exportHeader.push(this.option.columns[c].label);
                  }
                }
                let tableData = res.list.records;
                const data = this.formatJson(this.option.columns, tableData);
                export_json_to_excel(this.exportHeader, data, this.option.tableName);
                loading.close();
                // });
              }else if (res.code == 0 && res.list.length > 0) {//非分页list
                // require.ensure([], () => {
                /* eslint-disable */
                // 这里的径路要修改正确
                this.exportHeader = [];
                this.exportField = [];
                const { export_json_to_excel } = require("../../../plugins/Export2Excel.js");
                for (let c in this.option.columns) {
                  if (this.option.columns[c].prop != "" && this.option.columns[c].isShow) {
                    this.exportField.push(this.option.columns[c].prop);
                    this.exportHeader.push(this.option.columns[c].label);
                  }
                }
                let tableData = res.list;
                const data = this.formatJson(this.option.columns, tableData);
                export_json_to_excel(this.exportHeader, data, this.option.tableName);
                loading.close();
                // });
              } else {
                this.$alert(res.msg, this.$alertTitle, {
                  type: res.msgType,
                  dangerouslyUseHTMLString: true
                });
                loading.close();
              }
            },
            (error) => {
              console.log(error);
              loading.close();
            }
          );
        }
      },
      formatJson(columns, tableData) {
        columns = columns.filter((col) => {
          if (col.prop != "" && col.isShow) {
            return true;
          }
          return false;
        });
        let data = tableData.map((data) => {
          return columns.map((col) => {
            if (col.prop != "" && col.isShow) {
              let value = data[col.prop];
              if (
                col.dataType === "money(yuan)" ||
                col.dataType === "money(wan)" ||
                col.dataType === "percentile" ||
                col.dataType === "thousand" ||
                col.dataType === "tenThousand"
              ) {
                return value;
              } else {
                return this.tableFormatter(value, col);
              }
            } else {
              return null;
            }
          });
        });
        return data;
      },
      addTableRow() {
        let rowData = {};
        for (const columns of this.option.columns) {
          if (columns.prop) {
            rowData[columns.prop] = "";
          }
        }
        rowData.isEdit = true;
        rowData.isNewRow = true;
        this.option.tableData.push(rowData);
        this.$nextTick(function () {
          this.$refs[this.tableId || this.initOption.tableId];
          let bodyWrapper = this.$refs[this.tableId || this.initOption.tableId].$refs.bodyWrapper;
          bodyWrapper.scrollTop = bodyWrapper.scrollHeight;
          this.$refs.ruleForm.clearValidate();
        });
      },
      /*
       * 获取地址栏中的参数
       * */
      GetRequest() {
        var query = this.$route.query;
        return query;
      },
      saveTableRows(callback, query) {
        let url = this.option.editUrl;
        if (!url) {
          this.$message.warning("未配置列表保存请求地址，无法保存");
          return;
        }
        let routeParams = this.GetRequest();
        if (query) {
          routeParams = Object.assign(routeParams, query);
        }
        this.saveEditTable(callback, routeParams);
      },
      getEditTableData() {
        const multipleSelection = {};
        for (const columns of this.option.columns) {
          if (columns.prop && columns.fieldType == "multipleSelection") {
            multipleSelection[columns.prop] = true;
          }
        }
        let insertTableData = [];
        let updateTableData = [];
        let allTableData = [];
        // let tableData = this.clone(this.option.tableData);
        let tableData = this.option.tableData;
        for (const r in tableData) {
          let row = tableData[r];
          if (row.isEdit === true) {
            for (const key in multipleSelection) {
              let value = row[key];
              if (Array.isArray(value)) {
                row[key] = value.join("|");
              }
            }
            for (let fieldName in row) {
              for (let columns of this.option.columns) {
                let value = row[fieldName];
                if (columns.prop == fieldName) {
                  if (columns.dataType == "percentile") {
                    row[fieldName] = Number(value) / 100;
                  } else if (columns.dataType == "thousand") {
                    row[fieldName] = Number(value) / 1000;
                  } else if (columns.dataType == "tenThousand") {
                    row[fieldName] = Number(value) / 1000;
                  } else if (columns.dataType === "money(yuan)") {
                    row[fieldName] = formUtil.delcommafy(value);
                  } else if (columns.dataType === "money(wan)") {
                    value = formUtil.delcommafy(value);
                    row[fieldName] = formUtil.numMulti(value, 10000);
                  }
                }
              }
            }
            // delete row.isEdit;
            if (row.isNewRow === true) {
              // delete row.isNewRow;
              insertTableData.push(row);
            } else if (row.isEditRow === true) {
              // delete row.isEditRow;
              updateTableData.push(row);
            }
          }
          allTableData.push(row);
        }
        return {
          insertTableData,
          updateTableData,
          allTableData,
        };
      },
      validateEditTable(callback) {
        this.$refs.ruleForm.validate((valid, object) => {
          callback(valid);
        });
      },
      saveEditTable(callback, routeParams) {
        let url = this.option.editUrl;
        url = formUtil.converUrl(url);
        const multipleSelection = {};
        for (const columns of this.option.columns) {
          if (columns.prop && columns.fieldType == "multipleSelection") {
            multipleSelection[columns.prop] = true;
          }
        }
        let insertTableData = [];
        let updateTableData = [];
        // let tableData = this.clone(this.option.tableData);
        let tableData = this.option.tableData;
        for (const r in tableData) {
          let row = tableData[r];
          if (row.isEdit === true) {
            for (const key in multipleSelection) {
              let value = row[key];
              if (Array.isArray(value)) {
                row[key] = value.join("|");
              }
            }
            for (let fieldName in row) {
              for (let columns of this.option.columns) {
                let value = row[fieldName];
                if (columns.prop == fieldName) {
                  if (columns.dataType == "percentile") {
                    row[fieldName] = Number(value) / 100;
                  } else if (columns.dataType == "thousand") {
                    row[fieldName] = Number(value) / 1000;
                  } else if (columns.dataType == "tenThousand") {
                    row[fieldName] = Number(value) / 1000;
                  } else if (columns.dataType === "money(yuan)") {
                    row[fieldName] = formUtil.delcommafy(value);
                  } else if (columns.dataType === "money(wan)") {
                    value = formUtil.delcommafy(value);
                    row[fieldName] = formUtil.numMulti(value, 10000);
                  }
                }
              }
            }
            // delete row.isEdit;
            if (row.isNewRow === true) {
              // delete row.isNewRow;
              insertTableData.push(row);
            } else if (row.isEditRow === true) {
              // delete row.isEditRow;
              updateTableData.push(row);
            }
          }
        }
        if (insertTableData.length > 0 || updateTableData.length > 0) {
          this.$refs.ruleForm.validate((valid, object) => {
            if (valid) {
              postJson(
                url,
                {
                  insertData: insertTableData,
                  updateData: updateTableData,
                  editType: this.option.editType,
                  routeParams: routeParams
                },
                true,
                (res) => {
                  if (res.code == 0) {
                    // for (const r in this.option.tableData) {
                    //   let row = this.option.tableData[r];
                    //   if (row.isEdit === true) {
                    //     delete row.isEdit;
                    //     if (row.isNewRow === true) {
                    //       delete row.isNewRow;
                    //     } else if (row.isEditRow === true) {
                    //       delete row.isEditRow;
                    //     }
                    //     this.$set(this.option.tableData, r, row);
                    //   }
                    // }
                    this.getTableData(1, -1);
                    this.editTableData = this.clone(this.option.tableData);
                    this.$message.success(res.msg || "保存成功");
                    let trDivs = document.querySelectorAll("tr[active=true]");
                    for (let i = 0; i < trDivs.length; i++) {
                      trDivs[i].removeAttribute("active");
                    }
                    this.tableIsEdit = false;
                  }
                  if (typeof callback == "function") {
                    callback(res);
                  }
                },
                (error) => {
                  this.$message.error(error);
                }
              );
            } else {
              let validateMsg = [];
              for (let key in object) {
                let arr = object[key];
                for (let data of arr) {
                  validateMsg.push(data.message);
                }
              }
              this.$message({
                duration: 5000,
                showClose: true,
                dangerouslyUseHTMLString: true,
                customClass: "errorMessage",
                message: validateMsg.join("<br/>"),
                type: "error"
              });
              return false;
            }
          });
        } else {
          for (const r in this.option.tableData) {
            let row = this.option.tableData[r];
            if (row.isEdit === true) {
              delete row.isEdit;
              this.$set(this.option.tableData, r, row);
            }
          }
          this.tableIsEdit = false;
        }
      },
      editTableRows() {
        this.tableIsEdit = true;
        for (const r in this.option.tableData) {
          let row = this.option.tableData[r];
          for (const columns of this.option.columns) {
            if (columns.prop && columns.fieldType == "multipleSelection") {
              let value = row[columns.prop] || [];
              if (Array.isArray(value)) {
                row[columns.prop] = value;
              } else {
                row[columns.prop] = value.split("|");
              }
            }
            let value = row[columns.prop];
            if (value) {
              let dataType = columns.dataType;
              if (dataType === "money(yuan)") {
                value = formUtil.formatMoney(value);
              } else if (dataType === "money(wan)") {
                value = formUtil.formatMoney(Number(value) / 10000, 2);
              } else if (dataType === "percentile") {
                value = formUtil.numMulti(value, 100);
              } else if (dataType === "thousand") {
                value = formUtil.numMulti(value, 1000);
              } else if (dataType === "tenThousand") {
                value = formUtil.numMulti(value, 10000);
              }
              row[columns.prop] = value;
            }
          }
          // row.isEdit = true;
          this.$set(row, "isEdit", true);
          // this.$set(this.option.tableData, r, row);
        }
        this.editWatcher();
      },
      cancelTableRows() {
        this.option.tableData = this.clone(this.editTableData);
        this.tableIsEdit = false;
      },
      //单击事件
      oneFunc(row, column, event) {
        if (this.option.isSelect) {
          //多选
          this.$refs[this.tableId || this.initOption.tableId].toggleRowSelection(row);
        } else if (this.option.isRadio) {
          //单选
          this.templateRadio = event.currentTarget.rowIndex;
        }
        if (this.option.oneClickEve) {
          this.Fn(this.option.oneFunc, column, row);
        }
      },
      cancelEdit(data, index) {
        if (data.isNewRow) {
          data.isEdit = false;
          data.isNewRow = false;
          this.option.tableData.splice(index, 1);
        } else {
          this.$set(this.option.tableData, index, this.clone(this.editTableData[index]));
        }
      },
      rowDblclick(row, column, event) {
        //双击事件
        if (this.option.doubleClickEve) {
          this.Fn(this.option.doubleFunc, column, row);
        }
        if (!this.option.isEdit || this.option.editType != "row") {
          return;
        }
        //因为第一次点开时isedit为undefined
        for (let i in this.option.columns) {
          let dataType = this.option.columns[i].dataType;
          if (!row.isEdit) {
          }
          let value = row[this.option.columns[i].prop];
          if (value) {
            if (dataType === "money(yuan)") {
              value = formUtil.formatMoney(value);
            } else if (dataType === "money(wan)") {
              value = formUtil.formatMoney(Number(value) / 10000, 2);
            } else if (dataType === "percentile") {
              value = formUtil.numMulti(value, 100);
            } else if (dataType === "thousand") {
              value = formUtil.numMulti(value, 1000);
            } else if (dataType === "tenThousand") {
              value = formUtil.numMulti(value, 10000);
            }
            row[this.option.columns[i].prop] = value;
          }
        }
        let rowDiv = event.currentTarget;
        if (!rowDiv.hasAttribute("active")) {
          rowDiv.setAttribute("active", true);
        }
        const multipleSelection = {};
        for (const columns of this.option.columns) {
          if (columns.prop && columns.fieldType == "multipleSelection") {
            multipleSelection[columns.prop] = true;
          }
        }
        for (const key in multipleSelection) {
          let value = row[key];
          if (Array.isArray(value)) {
            row[key] = value;
          } else {
            row[key] = value.split("|");
          }
        }
        this.editWatcher();
        this.$set(row, "isEdit", true);
      },
      editWatcher() {
        if (this.editWatch != null) {
          this.editWatch();
        }
        this.editWatch = this.$watch("option.tableData", {
          handler(val, oldVal) {
            for (const i in val) {
              let row = val[i];
              let rowData = this.clone(row);
              for (let columns of this.option.columns) {
                let value = rowData[columns.prop];
                if (columns.dataType == "percentile") {
                  rowData[columns.prop] = Number(value) / 100;
                } else if (columns.dataType == "thousand") {
                  rowData[columns.prop] = Number(value) / 1000;
                } else if (columns.dataType == "tenThousand") {
                  rowData[columns.prop] = Number(value) / 1000;
                } else if (columns.dataType === "money(yuan)") {
                  rowData[columns.prop] = formUtil.delcommafy(value);
                } else if (columns.dataType === "money(wan)") {
                  value = formUtil.delcommafy(value);
                  rowData[columns.prop] = formUtil.numMulti(value, 10000);
                }
              }
              if (rowData.isEdit && !rowData.isNewRow && !this.isObjEqual(rowData, this.editTableData[i])) {
                row.isEditRow = true;
              }
            }
          },
          deep: true
        });
      },
      clone(data) {
        return JSON.parse(JSON.stringify(data));
      },
      isObjEqual(o1, o2) {
        let object = this.clone(o1);
        delete object.isEdit;
        delete object.isNewRow;
        delete object.isEditRow;
        var props1 = Object.getOwnPropertyNames(object);
        // var props2 = Object.getOwnPropertyNames(o2);
        // if (props1.length != props2.length) {
        //   return false;
        // }
        for (var i = 0, max = props1.length; i < max; i++) {
          var propName = props1[i];
          // if (propName == "isEdit" || propName == "isEditRow" || propName == "isNewRow") {
          //   continue;
          // }
          let v1 = o1[propName];
          let v2 = o2[propName];
          if (Array.isArray(v1)) {
            v1 = v1.join("|");
          }
          if (Array.isArray(v2)) {
            v2 = v2.join("|");
          }
          if (v1 != v2) {
            return false;
          }
        }
        return true;
      },
      /**
       * 自定义组件处理
       */
      resCustomComponent(formField) {
        if (formField.isCustomComponent === true && formField.customComponentPath) {
          this.getCustomComponent(formField.customComponentPath);
        }
      },
      /**
       * 获取自定义组件
       */
      getCustomComponent(path) {
        let compPath = path.replace(/\s+/g, "");
        if (/.vue$/.test(compPath)) {
          compPath = compPath.substring(0, compPath.length - 4);
        }
        if (compPath.startsWith("/")) {
          compPath = compPath.substring(1);
        }
        let productName = compPath.split("/")[0];
        let spaPath = compPath.substring(productName.length);
        if(this.$singleSpa){
          if (productName.startsWith("mftcc")) {
            //微前端
          } else {
            //单体项目
          }
          this.$singleSpa.toLoadPromise(this.$singleSpa.getApp(productName)).then((res) => {
            res.loadApp().then((res) => {
              const apps = res.default;
              const app = apps[spaPath];
              this.colCustomComp[path] = app;
            });
          });
        }else {
          this.colCustomComp[path] = require("/src/components"+spaPath).default;
        }
      },
      //事件函数处理
      resEvents(formField) {
        try {
          let eventsArray = formField.events;
          let event = {};

          for (let evetIndex in eventsArray) {
            if (
              !this.isEmpty(eventsArray[evetIndex].type) &&
              eventsArray[evetIndex].type !== "click" &&
              formUtil.parentVmExist(this, eventsArray[evetIndex].callback)
            ) {
              event[eventsArray[evetIndex].type] = this.parentVm._self[eventsArray[evetIndex].callback];
            }
          }
          this.$set(this.events, formField.prop, event);
          console.log(this.events);
        } catch (error) {
          console.error("事件解析错误：" + error);
          this.$set(this.events, formField.prop, {});
        }
      },
      resRules(formField) {
        let formRules = formField.rules;
        let label = formField.label;
        try {
          //解析规则
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
            let trigger = "change";
            let message = "";
            let type = "";
            if (formRules[k].type === "required") {
              if (!this.isEmpty(formField["formItem"])) {
                formField["formItem"].required = true;
              }
              fieldNameRule["required"] = true;
              // trigger = "blur";
              message = label + "不能为空";
            } else if (formRules[k].type === "validator") {
              if (formUtil.parentVmExist(this, formRules[k].validator)) {
                fieldNameRule["validator"] = this.parentVm._self[formRules[k].validator];
              }
              // trigger = "blur";
            } else if (formRules[k].type === "number") {
              // trigger = "blur";
              message = label + "必须为数字";
              type = "number";
            } else if (formRules[k].type === "email") {
              // trigger = "blur";
              message = label + "格式不正确";
              type = "email";
            } else if (formRules[k].type === "phone") {
              // trigger = "blur";
              message = "请输入正确的手机号码";
              fieldNameRule["pattern"] =
                /^((13[0-9])|(14[0-9])|(15([0-3]|[4-9]))|(16[0-9])|(17[0-9])|(18[0-9])|(19[0-9]))\d{8}$/;
            } else if (formRules[k].type === "mobile") {
              // trigger = "blur";
              message = "请输入正确的电话";
              fieldNameRule["pattern"] = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
            } else if (formRules[k].type === "idNo") {
              // trigger = "blur";
              fieldNameRule["validator"] = formUtil.validateIdNo;
            } else {
              //continue
            }

            if (formField.fieldType === "checkbox" || formField.fieldType === "multipleSelection") {
              type = "array";
            }

            if (!this.isEmpty(formRules[k].min) && !this.isEmpty(formRules[k].max)) {
              fieldNameRule["min"] = formRules[k].min;
              fieldNameRule["max"] = formRules[k].max;
              message = label + "长度必须大于等于" + formRules[k].min + "并且小于等于" + formRules[k].max;
            } else if (!this.isEmpty(formRules[k].min)) {
              fieldNameRule["min"] = formRules[k].min;
              message = label + "长度必须大于等于" + formRules[k].min;
            } else if (!this.isEmpty(formRules[k].max)) {
              fieldNameRule["max"] = formRules[k].max;
              message = label + "长度必须小于等于" + formRules[k].max;
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
          this.$set(this.rules, formField.prop, fieldNameRules);
        } catch (error) {
          console.error("规则解析错误：" + error);
          this.$set(this.rules, formField.prop, []);
        }
      },
      expandChange(row, expanded) {
        if (!this.option.isExpand) {
          return;
        }
        if (!row.isExpand) {
          let rowIndex = null;
          for (const i in this.option.tableData) {
            let rowData = this.option.tableData[i];
            if (this.isObjEqual(rowData, row)) {
              rowIndex = i;
              break;
            }
          }
          if (rowIndex == null) {
            return;
          }
          this.$nextTick(() => {
            let form = this.$refs["expandForm_" + rowIndex];
            form.setFormValue(this.clone(row));
          });
          row.isExpand = true;
        } else {
          delete row.isExpand;
        }
        // if (this.option.isTree){
        //   row.children = [];
        //   let Array = this.treeArray;
        //   for (let index in Array){
        //     if (row[this.option.treeKey] == Array[index][this.option.treeParentKey])
        //     row.children.push(Array[index])
        //   }
        // }else {
        //
        // }
      },
      closeExpand(index) {
        this.$refs[this.tableId || this.initOption.tableId].toggleRowExpansion(this.option.tableData[index], false);
      },
      saveExpandFormData(index) {
        const formId = "expandForm_" + index;
        let form = this.$refs[formId];
        form.validateForm((state) => {
          if (state) {
            let data = form.getFormValue();
            let url = this.option.expandFormUrl;
            if (!url) {
              this.$message.warning("未配置表单保存请求地址");
              return;
            }
            url = formUtil.converUrl(url);
            postJson(
              url,
              data,
              true,
              (res) => {
                if (res.code == 0) {
                  Object.assign(this.option.tableData[index], data);
                  this.closeExpand(index);
                  this.$message.success(res.msg);
                } else {
                  this.$message.error(res.msg);
                }
              },
              (error) => {
                this.$message.error(error);
              }
            );
          }
        });
      },
      customQueryClick() {
        if (this.customFilterShow) {
          this.customFilterShow = false;
        } else {
          this.customFilterShow = true;
        }
      }
    }
  };
</script>
<style>
  .el-tabs__nav-next,
  .el-tabs__nav-prev {
    font-size: 16px;
    color: #3d3d3d;
  }

  .specialBtn {
    color: #409EFF;
    background: #ecf5ff;
    border: 1px solid #b3d8ff;
    height: 100%;
    float: right;
    padding: 10px 20px;
    border-radius: 4px;
    font-size: 13px;
    line-height: 13px;
  }
  .specialBtn:hover {
    background: #409EFF;
    border-color: #409EFF;
    color: #fff;
  }
  .mftcc-table .el-checkbox__label {
    font-size: 12px;
  }

  .mftcc-table .el-pagination {
    margin-top: 5px;
  }

  .mftcc-table-query .el-table__body,
  .mftcc-table .el-table__body {
    width: calc(100% - 4px) !important;
  }

  .errorMessage .el-message__content {
    line-height: 20px;
  }

  .errorMessage .el-message__closeBtn {
    top: 24px;
  }

  .mftcc-table .el-table th > .cell {
    display: block;
    padding-left: 14px;
    padding-right: 14px;
    white-space: nowrap;
    overflow: visible;
    text-overflow: ellipsis;
  }

  .el-table .caret-wrapper {
    display: -webkit-inline-box;
    display: -ms-inline-flexbox;
    display: inline-flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    height: 34px;
    width: 24px;
    vertical-align: middle;
    cursor: pointer;
    overflow: initial;
    position: absolute;
    left: 84%;
    bottom: -30%;
  }

  .btnPage {
    margin-top: 2%;
  }
  .mftcc-table .el-table__body tr td.success {
    color: #67c23a;
  }
  .mftcc-table .el-table__body tr td.warning {
    color: #e6a23c;
  }
  .mftcc-table .el-table__body tr td.danger {
    color: #f56c6c;
  }
  .expandBtn {
    background: url("../../../assets/common/trapezoidal.png") center center no-repeat;
  }
  .el-table .el-table__body-wrapper .el-scrollbar .el-scrollbar__bar {
    opacity: 1 !important;
  }
  .el-table__footer-wrapper tbody td{
    font-weight: 700;
  }
</style>
