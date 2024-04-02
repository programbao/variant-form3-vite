<template>
  <el-form-item :label="i18nt('designer.setting.tableWidth')">
    <el-input v-model="optionModel.tableWidth" />
  </el-form-item>
  <el-form-item :label="i18nt('designer.setting.tableHeight')">
    <el-input v-model="optionModel.tableHeight" />
  </el-form-item>
  <el-form-item :label="i18nt('designer.setting.customClass')">
    <el-select
      v-model="optionModel.customClass"
      multiple
      filterable
      allow-create
      default-first-option
    >
      <el-option
        v-for="item in cssClassList"
        :key="item"
        :label="item"
        :value="item"
      />
    </el-select>
  </el-form-item>
  <el-form-item :label="i18nt('designer.setting.showIndex')">
    <el-switch v-model="optionModel.showIndex" />
  </el-form-item>
  <el-form-item :label="i18nt('designer.setting.showCheckBox')">
    <el-switch v-model="optionModel.showCheckBox" />
  </el-form-item>
  <el-form-item :label="i18nt('designer.setting.showPagination')">
    <el-switch v-model="optionModel.showPagination" />
  </el-form-item>
  <el-form-item
    v-if="optionModel.showPagination"
    :label="i18nt('designer.setting.paginationAlign')"
  >
    <el-radio-group
      v-model="optionModel.paginationAlign"
      class="radio-group-custom"
    >
      <el-radio-button label="left">{{
        i18nt('designer.setting.leftAlign')
      }}</el-radio-button>
      <el-radio-button label="center">{{
        i18nt('designer.setting.centerAlign')
      }}</el-radio-button>
      <el-radio-button label="right">{{
        i18nt('designer.setting.rightAlign')
      }}</el-radio-button>
    </el-radio-group>
  </el-form-item>
  <el-form-item
    v-if="optionModel.showPagination"
    :label="i18nt('designer.setting.smallPagination')"
  >
    <el-switch v-model="optionModel.smallPagination" />
  </el-form-item>
  <el-form-item :label="i18nt('designer.setting.showSummary')">
    <el-switch v-model="optionModel.showSummary" />
  </el-form-item>
  <el-form-item :label="i18nt('designer.setting.stripe')">
    <el-switch v-model="optionModel.stripe" />
  </el-form-item>
  <el-form-item :label="i18nt('designer.setting.rowSpacing')">
    <el-input-number
      v-model="optionModel.rowSpacing"
      controls-position="right"
      :min="0"
      :max="20"
      style="width: 100%"
    />
  </el-form-item>
  <el-form-item :label="i18nt('designer.setting.widgetSize')">
    <el-select v-model="optionModel.tableSize">
      <el-option
        v-for="item in widgetSizes"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </el-form-item>
  <el-form-item
    :label="i18nt('designer.setting.autoColumnWidthDisabled')"
    :title="i18nt('designer.setting.autoColumnWidthDisabled')"
  >
    <el-switch v-model="optionModel.autoColumnWidthDisabled" />
  </el-form-item>
  <el-form-item :label="i18nt('designer.setting.tableColEdit')">
    <el-button
      type="primary"
      plain
      round
      @click="openSetting"
      >{{ i18nt('designer.setting.editAction') }}</el-button
    >
  </el-form-item>
  <el-form-item
    v-if="!optionModel.dsEnabled"
    :label="i18nt('designer.setting.tableDataEdit')"
  >
    <el-button
      type="primary"
      plain
      round
      @click="openTableDataEdit"
      >{{ i18nt('designer.setting.editAction') }}</el-button
    >
  </el-form-item>
  <el-form-item :label="i18nt('designer.setting.dsEnabled')">
    <el-switch v-model="optionModel.dsEnabled" />
  </el-form-item>
  <el-form-item
    v-if="optionModel.dsEnabled"
    :label="i18nt('designer.setting.dsName')"
  >
    <el-select
      v-model="optionModel.dsName"
      filterable
      clearable
      @change="getDataSetList"
    >
      <el-option
        v-for="(item, index) in dataSourceList"
        :key="index"
        :title="item.description"
        :label="item.uniqueName"
        :value="item.uniqueName"
      />
    </el-select>
  </el-form-item>
  <el-form-item
    v-if="optionModel.dsEnabled"
    :label="i18nt('designer.setting.dataSetName')"
  >
    <el-select
      v-model="optionModel.dataSetName"
      filterable
      clearable
    >
      <el-option
        v-for="(item, index) in dataSetList"
        :key="index"
        :title="item.remark"
        :label="item.name"
        :value="item.name"
      />
    </el-select>
  </el-form-item>
  <el-form-item :label="i18nt('designer.setting.treeDataEnabled')">
    <el-switch
      v-model="optionModel.treeDataEnabled"
      @change="handleTDEChange"
    />
  </el-form-item>
  <el-form-item :label="i18nt('designer.setting.rowKeyOfTreeData')">
    <el-input v-model="optionModel.rowKey" />
  </el-form-item>
  <el-form-item
    v-if="optionModel.treeDataEnabled"
    :label="i18nt('designer.setting.childrenKeyOfTreeData')"
  >
    <el-input v-model="optionModel.childrenKey" />
  </el-form-item>
  <el-form-item :label="i18nt('designer.setting.showButtonsColumn')">
    <el-switch
      v-model="optionModel.showButtonsColumn"
      @change="handleShowButtonsColumnChange"
    />
  </el-form-item>
  <el-form-item
    v-if="optionModel.showButtonsColumn"
    :label="i18nt('designer.setting.buttonsColumnEdit')"
  >
    <el-button
      type="primary"
      plain
      round
      @click="editButtonsColumn"
      >{{ i18nt('designer.setting.editAction') }}</el-button
    >
  </el-form-item>

  <!-- Data Table Dialog -->
  <div
    v-if="dataDialogVisible"
    v-drag="['.drag-dialog.el-dialog', '.drag-dialog .el-dialog__header']"
  >
    <el-dialog
      :title="i18nt('designer.setting.tableDataEdit')"
      v-model="dataDialogVisible"
      show-close
      class="drag-dialog small-padding-dialog"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      destroy-on-close
      width="75%"
    >
      <code-editor
        v-model="tableDataOptions"
        mode="json"
        readonly="false"
      ></code-editor>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            size="default"
            type="primary"
            @click="saveTableData"
            >{{ i18nt('designer.hint.confirm') }}</el-button
          >
          <el-button
            size="default"
            @click="dataDialogVisible = !dataDialogVisible"
            >{{ i18nt('designer.hint.cancel') }}</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>

  <!-- Table Column Edit Dialog -->
  <div
    v-if="dialogVisible"
    v-drag="['.drag-dialog.el-dialog', '.drag-dialog .el-dialog__header']"
  >
    <el-dialog
      :title="i18nt('designer.setting.tableColEdit')"
      v-model="dialogVisible"
      show-close
      class="drag-dialog small-padding-dialog"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      destroy-on-close
      width="1500px"
    >
      <el-table
        :data="optionModel.tableColumns"
        style="width: 100%"
        :cell-style="{ padding: '3px 0' }"
        height="500"
        border
        row-key="columnId"
        ref="singleTable"
        stripe
      >
        <!-- Table Columns -->
      </el-table>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            size="default"
            @click="colSubmit"
            >{{ i18nt('designer.hint.closePreview') }}</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>

  <!-- Buttons Column Edit Dialog -->
  <div
    v-if="showButtonsEditDialog"
    v-drag="['.drag-dialog.el-dialog', '.drag-dialog .el-dialog__header']"
  >
    <el-dialog
      :title="i18nt('designer.setting.buttonsColumnEdit')"
      v-model="showButtonsEditDialog"
      show-close
      class="drag-dialog small-padding-dialog"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      destroy-on-close
      width="1120px"
    >
      <el-form
        label-position="left"
        :model="optionModel"
      >
        <!-- Form fields for editing buttons column -->
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            size="default"
            @click="showButtonsEditDialog = false"
            >{{ i18nt('designer.hint.closePreview') }}</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>

  <!-- Render Function Dialog -->
  <div
    v-if="showRenderDialogFlag"
    v-drag="['.drag-dialog.el-dialog', '.drag-dialog .el-dialog__header']"
  >
    <el-dialog
      :title="i18nt('designer.setting.renderFunction')"
      v-model="showRenderDialogFlag"
      show-close
      class="drag-dialog small-padding-dialog"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      destroy-on-close
    >
      <el-alert
        type="info"
        :closable="false"
        title="function customRender(h, params, components) {"
      ></el-alert>
      <code-editor
        v-model="renderJson"
        mode="javascript"
        readonly="false"
        ref="dsResultEditor"
      ></code-editor>
      <el-alert
        type="info"
        :closable="false"
        title="}"
      ></el-alert>
      <template #footer="{ footer }">
        <div class="dialog-footer">
          <el-button
            size="default"
            type="primary"
            @click="saveColumnRender"
            >{{ i18nt('designer.hint.confirm') }}</el-button
          >
          <el-button
            size="default"
            @click="showRenderDialogFlag = false"
            >{{ i18nt('designer.hint.cancel') }}</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import i18n from '@/utils/i18n'
//import Draggable from 'vuedraggable'
import { deepClone } from '@/utils/util'
import CodeEditor from '@/components/code-editor/index'

export default {
  name: 'data-table-customClass-editor',
  componentName: 'PropertyEditor',
  mixins: [i18n],
  components: {
    //Draggable,
    CodeEditor
  },
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object
  },
  data() {
    return {
      dialogVisible: !1,
      dataDialogVisible: !1,
      showButtonsEditDialog: !1,
      oldButtonName: '',
      cssClassList: [],
      tableDataOptions: [],
      dataSetList: [],
      widgetSizes: [
        {
          label: 'default',
          value: ''
        },
        {
          label: 'large',
          value: 'large'
        },
        {
          label: 'small',
          value: 'small'
        }
      ],
      alignOptions: [
        {
          value: 'left',
          label: 'left'
        },
        {
          value: 'center',
          label: 'center'
        },
        {
          value: 'right',
          label: 'right'
        }
      ],
      fieldTypeOptions: [
        {
          value: 'text',
          label: 'Text'
        },
        {
          value: 'number',
          label: 'Number'
        },
        {
          value: 'date',
          label: 'Date'
        }
      ],
      op: [
        {
          label: 'Date Format',
          options: [
            {
              value: 'd1',
              label: 'yyyy-MM-dd'
            },
            {
              value: 'd2',
              label: 'yyyy/MM/dd'
            },
            {
              value: 'd3',
              label: 'yyyy\u5E74MM\u6708dd\u65E5'
            },
            {
              value: 'd4',
              label: 'yyyy-MM-dd HH:mm:ss'
            },
            {
              value: 'd5',
              label: 'yyyy-MM-dd hh:mm:ss'
            }
          ]
        },
        {
          label: 'Number Format',
          options: [
            {
              value: 'n1',
              label: '###,###,###,##0.######'
            },
            {
              value: 'n2',
              label: '###,###,###,##0.00####'
            },
            {
              value: 'n3',
              label: '###,###,###,##0.000000'
            },
            {
              value: 'n4',
              label: '###,###,###,##0.000'
            },
            {
              value: 'n5',
              label: '###,###,###,##0.00'
            },
            {
              value: 'n6',
              label: '###,###,###,##0'
            },
            {
              value: 'n7',
              label: '###,##0.00##%'
            }
          ]
        }
      ],
      showRenderDialogFlag: !1,
      renderJson: '',
      currentTableColumn: null,
      tableColumnRows: null,
      nameRules: [
        {
          required: !0,
          trigger: ['blur', 'change'],
          message: this.i18nt('designer.setting.fieldValueRequired')
        }
      ]
    }
  },
  computed: {
    dataSourceList() {
      return !this.designer.formConfig || !this.designer.formConfig.dataSources
        ? []
        : this.designer.formConfig.dataSources
    }
  },
  watch: {
    selectedWidget: {
      handler(e, o) {
        !e || this.loadDataSet(e.options.dsName)
      },
      immediate: !0
    }
  },
  created() {
    ;(this.cssClassList = deepClone(this.designer.getCssClassList())),
      this.designer.handleEvent('form-css-updated', (e) => {
        this.cssClassList = e
      })
  },
  mounted() {},
  methods: {
    treeColumnsToArray() {
      const e = [],
        o = (t, r) => {
          t.map((n) => {
            let l = deepClone(n)
            ;(l.nodeLevel = r), e.push(l), n.children && o(n.children, r + 1)
          })
        }
      return o(this.optionModel.tableColumns, 1), e
    },
    getParentArrayOfTableColumn(e, o) {
      let t = !1
      if (
        (e.forEach((n) => {
          n.columnId === o && (t = !0)
        }),
        t)
      )
        return e
      let r = []
      return (
        e.forEach((n) => {
          if (n.children) {
            let l = this.getParentArrayOfTableColumn(n.children, o)
            l.length > 0 && (r = l)
          }
        }),
        r
      )
    },
    dragSort() {
      const e = this.$refs.singleTable.$el.querySelectorAll(
        '.el-table__body-wrapper .el-table__body > tbody'
      )[0]
      this.sortable = Sortable.create(e, {
        handle: '.column-drag-handler',
        ghostClass: 'sortable-ghost',
        setData: function (o) {
          o.setData('Text', '')
        },
        onStart: (o) => {
          this.tableColumnRows = this.treeColumnsToArray()
        },
        onMove: ({ dragged: o, related: t }) => {
          const r = this.tableColumnRows[o.rowIndex],
            n = this.tableColumnRows[t.rowIndex]
          if (r.nodeLevel !== n.nodeLevel)
            return (
              this.$message.warning(
                this.i18nt('designer.setting.onlyDragBetweenSiblingNodes')
              ),
              !1
            )
        },
        onEnd: (o) => {
          const t = this.tableColumnRows[o.oldIndex],
            r = this.tableColumnRows[o.newIndex]
          if (t.nodeLevel !== r.nodeLevel || o.oldIndex === o.newIndex) return
          const n = t.columnId,
            l = r.columnId
          let i = this.getParentArrayOfTableColumn(
              this.optionModel.tableColumns,
              n
            ),
            a = i.findIndex((d) => d.columnId === n),
            s = i.findIndex((d) => d.columnId === l)
          a > s
            ? (i.splice(s, 0, deepClone(i[a])), i.splice(a + 1, 1))
            : (i.splice(s + 1, 0, deepClone(i[a])), i.splice(a, 1))
        }
      })
    },
    openTableDataEdit() {
      ;(this.dataDialogVisible = !0),
        (this.tableDataOptions = JSON.stringify(
          this.optionModel.tableData,
          null,
          '  '
        ))
    },
    saveTableData() {
      try {
        ;(this.optionModel.tableData = JSON.parse(this.tableDataOptions)),
          (this.dataDialogVisible = !1)
      } catch (e) {
        this.$message.error(
          this.i18nt('designer.hint.invalidOptionsData') + e.message
        )
      }
    },
    openSetting() {
      ;(this.dialogVisible = !0),
        this.$nextTick(() => {
          this.dragSort(),
            this.expandAllTableColumns(this.optionModel.tableColumns)
        })
    },
    getHeaderSpace(e) {
      let o = this.getHeaderLevel(this.optionModel.tableColumns, e.columnId, 1)
      return '|' + '-'.repeat(o > 6 ? 0 : 6 - o)
    },
    getHeaderTitle(e) {
      let o = this.getHeaderLevel(this.optionModel.tableColumns, e.columnId, 1)
      return this.i18ntp('designer.setting.getHeaderLevelTitle', o)
    },
    getHeaderLevel(e, o, t) {
      let r = !1
      if (
        (e.forEach((l) => {
          l.columnId === o && (r = !0)
        }),
        r)
      )
        return t
      let n = -1
      return (
        e.forEach((l) => {
          if (l.children) {
            let i = this.getHeaderLevel(l.children, o, t + 1)
            i > -1 && (n = i)
          }
        }),
        n
      )
    },
    expandAllTableColumns(e) {
      e.forEach((o) => {
        this.$refs.singleTable.toggleRowExpansion(o, !0),
          o.children && this.expandAllTableColumns(o.children)
      })
    },
    colSubmit() {
      this.dialogVisible = !1
    },
    addCol(e) {
      let o = {
        columnId: new Date().getTime(),
        show: !1
      }
      this.optionModel.tableColumns.splice(e, 0, o),
        this.designer.emitHistoryChange()
    },
    handleAddColCommand(e, o, t) {
      if (e === 'column') {
        let r = {
          columnId: new Date().getTime(),
          show: !1
        }
        this.insertTableColumnById(
          this.optionModel.tableColumns,
          t.columnId,
          r,
          !1
        ),
          this.designer.emitHistoryChange()
      } else if (e === 'sub-column') {
        let r = {
          columnId: new Date().getTime(),
          show: !1
        }
        this.insertTableColumnById(
          this.optionModel.tableColumns,
          t.columnId,
          r,
          !0
        ),
          this.designer.emitHistoryChange()
      } else if (e === 'header') {
        let r = {
          columnId: new Date().getTime(),
          prop: '~',
          headerFlag: !0,
          label: 'header',
          align: 'center',
          children: []
        }
        this.insertTableColumnById(
          this.optionModel.tableColumns,
          t.columnId,
          r,
          !1
        ),
          this.designer.emitHistoryChange()
      } else if (e === 'sub-header') {
        let r = {
          columnId: new Date().getTime(),
          prop: '~',
          headerFlag: !0,
          label: 'header',
          align: 'center',
          children: []
        }
        this.insertTableColumnById(
          this.optionModel.tableColumns,
          t.columnId,
          r,
          !0
        ),
          this.designer.emitHistoryChange()
      }
      this.$nextTick(() => {
        this.$refs.singleTable.toggleRowExpansion(t, !0)
      })
    },
    insertTableColumnById(e, o, t, r) {
      let n = -1
      e.forEach((l, i) => {
        l.columnId === o && (n = i),
          l.children && this.insertTableColumnById(l.children, o, t, r)
      }),
        n > -1 && (r ? e[n].children.push(t) : e.splice(n + 1, 0, t))
    },
    disableDropdownItem(e, o) {
      return !e.children
    },
    handleDelete(e, o) {
      if (this.optionModel.tableColumns.length === 1)
        return (
          this.$message.warning(
            this.i18nt('designer.setting.onlyOneColumnCannotBeDeleted')
          ),
          !1
        )
      this.deleteTableColumnById(this.optionModel.tableColumns, o.columnId),
        this.designer.emitHistoryChange()
    },
    deleteTableColumnById(e, o) {
      let t = -1
      e.forEach((r, n) => {
        r.columnId === o && (t = n),
          r.children && this.deleteTableColumnById(r.children, o)
      }),
        t > -1 && e.splice(t, 1)
    },
    showRenderDialog(e) {
      ;(this.currentTableColumn = e),
        (this.renderJson = e.render || ''),
        (this.showRenderDialogFlag = !0)
    },
    saveColumnRender() {
      ;(this.currentTableColumn.render = this.renderJson),
        (this.showRenderDialogFlag = !1)
    },
    handleShowButtonsColumnChange(e) {
      e && this.refreshTableLayout()
    },
    onButtonNameFocus(e) {
      this.oldButtonName = e.target.value
    },
    onButtonNameChange(e, o) {
      let t = !1
      this.optionModel.operationButtons.map((r, n) => {
        r.name === e && n !== o && (t = !0)
      }),
        t &&
          (this.$message.error(
            this.i18nt('designer.setting.operationButtonDuplicatedNameError')
          ),
          (this.optionModel.operationButtons[o].name = this.oldButtonName))
    },
    editButtonsColumn() {
      this.showButtonsEditDialog = !0
    },
    deleteOperationButton(e) {
      this.$confirm(
        this.i18nt('designer.setting.deleteOperationButtonHint'),
        this.i18nt('render.hint.prompt'),
        {
          confirmButtonText: this.i18nt('render.hint.confirm'),
          cancelButtonText: this.i18nt('render.hint.cancel')
        }
      )
        .then(() => {
          this.optionModel.operationButtons.splice(e, 1)
        })
        .catch((o) => {})
    },
    addOperationButton() {
      ;(this.optionModel.operationButtons =
        this.optionModel.operationButtons || []),
        this.optionModel.operationButtons.push({
          name: 'btn' + generateId(),
          label: 'new btn',
          type: 'text',
          size: 'small',
          round: !1,
          hidden: !1,
          disabled: !1
        })
    },
    refreshTableLayout() {
      const e = this.designer.formWidget.getSelectedWidgetRef()
      !!e &&
        !!e.refreshLayout &&
        this.$nextTick(() => {
          e.refreshLayout()
        })
    },
    loadDataSet(e) {
      if (((this.dataSetList.length = 0), !e)) return
      let o = getDSByName(this.designer.formConfig, e)
      !!o &&
        !!o.dataSets &&
        o.dataSets.forEach((t) => {
          this.dataSetList.push({
            name: t.name,
            remark: t.remark
          })
        })
    },
    getDataSetList() {
      ;(this.optionModel.dataSetName = ''),
        this.loadDataSet(this.optionModel.dsName)
    },
    handleTDEChange(e) {
      e
        ? ((this.optionModel.rowKey = 'id'),
          (this.optionModel.childrenKey = 'children'))
        : ((this.optionModel.rowKey = ''), (this.optionModel.childrenKey = ''))
    }
  }
}
</script>

<style lang="scss" scoped>
li.col-item {
  list-style: none;

  span.col-span-title {
    display: inline-block;
    font-size: 13px;
    width: 120px;
  }

  .col-delete-button {
    margin-left: 6px;
  }
}

.panes-setting {
  ul {
    padding-inline-start: 0;
    padding-left: 0; /* 重置IE11默认样式 */
    margin: 0;
  }

  .drag-option {
    cursor: move;
  }

  li.ghost {
    background: #fff;
    border: 2px dotted $--color-primary;
  }
}
</style>
