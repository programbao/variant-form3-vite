<template>
  <container-item-wrapper :widget="widget">
    <div class="sub-form-container" :class="[disabledClass, readModeClass]">
  <el-row class="header-row">
    <!-- 左侧操作列 -->
    <div v-if="leftActionColumn" class="action-header-column">
      <span class="action-label">{{ i18nt('render.hint.subFormAction') }}</span>
      <el-button v-if="!isReadMode" :disabled="widgetDisabled || actionDisabled || insertDisabled" round type="primary" size="small" class="action-button" @click="addSubFormRow" :title="i18nt('render.hint.subFormAddActionHint')">
        {{ i18nt('render.hint.subFormAddAction') }}
        <svg-icon icon-class="el-plus"></svg-icon>
      </el-button>
    </div>
    <!-- 行号列 -->
    <div v-else-if="!leftActionColumn && widget.options.showRowNumber" class="row-no-header-column">
      <span>{{ i18nt('render.hint.subFormRowNo') }}</span>
    </div>
    <!-- 字段列头 -->
    <template v-for="field in widget.widgetList" :key="field.id + 'thc'">
      <div v-if="!field.options.hidden" :class="['field-header-column', [getLabelAlign(widget, field), field.options.required ? 'is-required' : '']]" :style="{ width: field.options.columnWidth }">
        <span v-if="field.options.labelIconClass" class="custom-label">
          <template v-if="field.options.labelIconPosition === 'front'">
            <el-tooltip v-if="field.options.labelTooltip" :content="field.options.labelTooltip" effect="light">
              <svg-icon :icon-class="field.options.labelIconClass"></svg-icon>
            </el-tooltip>
            <template v-else>
              <svg-icon :icon-class="field.options.labelIconClass"></svg-icon>
              {{ field.options.label }}
            </template>
          </template>
          <template v-else-if="field.options.labelIconPosition === 'rear'">
            <el-tooltip v-if="field.options.labelTooltip" :content="field.options.labelTooltip" effect="light">
              {{ field.options.label }}
              <svg-icon :icon-class="field.options.labelIconClass"></svg-icon>
            </el-tooltip>
            <template v-else>
              {{ field.options.label }}
              <svg-icon :icon-class="field.options.labelIconClass"></svg-icon>
            </template>
          </template>
        </span>
        <span v-else :title="field.options.labelTooltip">{{ field.options.label }}</span>
      </div>
    </template>
    <!-- 右侧操作列 -->
    <div v-if="!leftActionColumn" class="action-header-column">
      <span class="action-label">{{ i18nt('render.hint.subFormAction') }}</span>
      <el-button v-if="!isReadMode" :disabled="widgetDisabled || actionDisabled || insertDisabled" round type="primary" size="small" class="action-button" @click="addSubFormRow" :title="i18nt('render.hint.subFormAddActionHint')">
        {{ i18nt('render.hint.subFormAddAction') }}
        <svg-icon icon-class="el-plus"></svg-icon>
      </el-button>
    </div>
  </el-row>

  <el-row v-for="(rowId, rowIndex) in rowIdData" :key="rowId" class="sub-form-row">
    <!-- 左侧操作列 -->
    <div v-if="leftActionColumn" class="sub-form-action-column hide-label">
      <div class="action-button-column">
        <el-button v-show="!isReadMode" :disabled="widgetDisabled || actionDisabled || insertDisabled" circle @click="insertSubFormRow(rowIndex)" :title="i18nt('render.hint.insertSubFormRow')">
          <svg-icon icon-class="el-plus"></svg-icon>
        </el-button>
        <el-button v-show="!isReadMode" :disabled="widgetDisabled || actionDisabled || deleteDisabled" circle @click="deleteSubFormRow(rowIndex)" :title="i18nt('render.hint.deleteSubFormRow')">
          <svg-icon icon-class="el-delete"></svg-icon>
        </el-button>
        <span v-if="widget.options.showRowNumber" class="row-number-span">#{{ rowIndex + 1 }}</span>
      </div>
    </div>
    <!-- 行号列 -->
    <div v-else-if="!leftActionColumn && widget.options.showRowNumber" class="row-no-column">
      <span v-if="widget.options.showRowNumber" class="row-number-span">#{{ rowIndex + 1 }}</span>
    </div>
    <!-- 子表单字段 -->
    <div v-for="(fieldSchema, fieldIndex) in widget.widgetList" :key="fieldSchemaData[rowIndex][fieldIndex].id" class="sub-form-table-column hide-label" :style="{ width: fieldSchema.options.columnWidth }" v-show="!fieldSchema.options.hidden">
      <component :is="fieldSchema.type + '-widget'" :field="fieldSchemaData[rowIndex][fieldIndex]" :parent-list="widget.widgetList" :index-of-parent-list="fieldIndex" :parent-widget="widget" :sub-form-row-id="rowId" :sub-form-row-index="rowIndex" :sub-form-col-index="fieldIndex"></component>
    </div>
    <!-- 右侧操作列 -->
    <div v-if="!leftActionColumn" class="sub-form-action-column hide-label">
      <div class="action-button-column">
        <el-button v-show="!isReadMode" :disabled="widgetDisabled || actionDisabled || insertDisabled" circle @click="insertSubFormRow(rowIndex)" :title="i18nt('render.hint.insertSubFormRow')">
          <svg-icon icon-class="el-plus"></svg-icon>
        </el-button>
        <el-button v-show="!isReadMode" :disabled="widgetDisabled || actionDisabled || deleteDisabled" circle @click="deleteSubFormRow(rowIndex)" :title="i18nt('render.hint.deleteSubFormRow')">
          <svg-icon icon-class="el-delete"></svg-icon>
        </el-button>
      </div>
    </div>
  </el-row>
</div>
  </container-item-wrapper>
</template>

<script>
  import emitter from '@/utils/emitter'
  import i18n from '@/utils/i18n'
  import {deepClone, generateId} from '@/utils/util'
  import refMixin from '../../../components/form-render/refMixin'
  import ContainerItemWrapper from './container-item-wrapper'
  import containerItemMixin from './containerItemMixin'
  import FieldComponents from '@/components/form-designer/form-widget/field-widget/index'
  import SvgIcon from "@/components/svg-icon/index";

  export default {
    name: "sub-form-item",
    componentName: 'ContainerItem',
    mixins: [emitter, i18n, refMixin, containerItemMixin],
    components: {
      ContainerItemWrapper,
      ...FieldComponents,
      SvgIcon,
    },
    props: {
        widget: Object
    },
    provide() {
        return {
            getSubFormFieldFlag: ()=>!0,
            getSubFormName: ()=>this.widget.options.name
        }
    },
    inject: ["refList", "sfRefList", "globalModel", "getReadMode"],
    data() {
        return {
            rowIdData: [],
            fieldSchemaData: [],
            actionDisabled: !1,
            insertDisabled: !1,
            deleteDisabled: !1
        }
    },
    computed: {
        isReadMode() {
            return this.getReadMode()
        },
        leftActionColumn() {
            return (this.widget.options.actionColumnPosition || "left") === "left"
        },
        widgetDisabled() {
            return !!this.widget.options.disabled
        },
        disabledClass() {
            return this.widget.options.disabled ? "sub-form-disabled" : ""
        },
        readModeClass() {
            return this.getReadMode() ? "sub-form-read-mode" : ""
        }
    },
    created() {
        this.initRefList(),
        this.registerSubFormToRefList(),
        this.initRowIdData(!0),
        this.initFieldSchemaData(),
        this.initEventHandler()
    },
    mounted() {
        this.handleSubFormFirstRowAdd()
    },
    beforeUnmount() {
        this.unregisterFromRefList()
    },
    methods: {
        getLabelAlign(e, o) {
            return o.options.labelAlign || e.options.labelAlign
        },
        registerSubFormToRefList() {
            this.widget.type === "sub-form" && (this.sfRefList[this.widget.options.name] = this)
        },
        initRowIdData(e) {
            if (this.widget.type === "sub-form") {
                this.rowIdData.splice(0, this.rowIdData.length);
                let o = this.formModel[this.widget.options.name];
                !!o && o.length > 0 && (o.forEach(()=>{
                    this.rowIdData.push("id" + generateId())
                }
                ),
                e && setTimeout(()=>{
                    this.handleSubFormRowChange(o)
                }
                , 800))
            }
        },
        addToRowIdData() {
            this.rowIdData.push("id" + generateId())
        },
        insertToRowIdData(e) {
            this.rowIdData.splice(e, 0, "id" + generateId())
        },
        deleteFromRowIdData(e) {
            this.rowIdData.splice(e, 1)
        },
        getRowIdData() {
            return this.rowIdData
        },
        getWidgetRefOfSubForm(e, o) {
            let t = e + "@row" + this.rowIdData[o];
            return this.getWidgetRef(t)
        },
        initFieldSchemaData() {
            if (this.widget.type !== "sub-form")
                return;
            let e = this.rowIdData.length;
            if (this.fieldSchemaData.splice(0, this.fieldSchemaData.length),
            e > 0)
                for (let o = 0; o < e; o++) {
                    let t = [];
                    this.widget.widgetList.forEach(r=>{
                        t.push(this.cloneFieldSchema(r))
                    }
                    ),
                    this.fieldSchemaData.push(t)
                }
        },
        addToFieldSchemaData(e) {
            let o = [];
            this.widget.widgetList.forEach(t=>{
                o.push(this.cloneFieldSchema(t))
            }
            ),
            e === void 0 ? this.fieldSchemaData.push(o) : this.fieldSchemaData.splice(e, 0, o)
        },
        deleteFromFieldSchemaData(e) {
            this.fieldSchemaData.splice(e, 1)
        },
        cloneFieldSchema(e) {
            let o = deepClone(e);
            return o.id = e.type + generateId(),
            o
        },
        initEventHandler() {
            this.widget.type === "sub-form" && this.on$("setFormData", e=>{
                this.initRowIdData(!1),
                this.initFieldSchemaData();
                let o = e[this.widget.options.name] || [];
                setTimeout(()=>{
                    this.handleSubFormRowChange(o)
                }
                , 800)
            }
            )
        },
        handleSubFormFirstRowAdd() {
            if (this.widget.type === "sub-form" && !!this.widget.options.showBlankRow && this.rowIdData.length === 1) {
                let e = this.formModel[this.widget.options.name] || [];
                this.$nextTick(()=>{
                    this.handleSubFormRowAdd(e, this.rowIdData[0]),
                    this.handleSubFormRowChange(e),
                    this.widget.options.disabled && this.disableSubForm()
                }
                )
            }
        },
        addSubFormRow() {
            let e = {};
            this.widget.widgetList.forEach(t=>{
                if (t.formItemFlag) {
                    let r = t.options.name;
                    r = t.options.keyNameEnabled && t.options.keyName || r,
                    e[r] = t.options.defaultValue
                }
            }
            );
            let o = this.formModel[this.widget.options.name] || [];
            o.push(e),
            this.addToRowIdData(),
            this.addToFieldSchemaData(),
            this.handleSubFormRowAdd(o, this.rowIdData[o.length - 1]),
            this.handleSubFormRowChange(o)
        },
        insertSubFormRow(e) {
            let o = {};
            this.widget.widgetList.forEach(r=>{
                if (r.formItemFlag) {
                    let n = r.options.name;
                    n = r.options.keyNameEnabled && r.options.keyName || n,
                    o[n] = r.options.defaultValue
                }
            }
            );
            let t = this.formModel[this.widget.options.name] || [];
            t.splice(e, 0, o),
            this.insertToRowIdData(e),
            this.addToFieldSchemaData(e),
            this.handleSubFormRowInsert(t, this.rowIdData[e]),
            this.handleSubFormRowChange(t)
        },
        deleteSubFormRow(e) {
            this.$confirm(this.i18nt("render.hint.deleteSubFormRow") + "?", this.i18nt("render.hint.prompt"), {
                confirmButtonText: this.i18nt("render.hint.confirm"),
                cancelButtonText: this.i18nt("render.hint.cancel")
            }).then(()=>{
                let o = this.formModel[this.widget.options.name] || []
                  , t = deepClone(o[e]);
                o.splice(e, 1),
                this.deleteFromRowIdData(e),
                this.deleteFromFieldSchemaData(e),
                this.handleSubFormRowDelete(o, t, e),
                this.handleSubFormRowChange(o)
            }
            ).catch(()=>{}
            )
        },
        handleSubFormRowChange(e) {
            this.widget.options.onSubFormRowChange && new Function("subFormData",this.widget.options.onSubFormRowChange).call(this, e)
        },
        handleSubFormRowAdd(e, o) {
            this.widget.options.onSubFormRowAdd && new Function("subFormData","newRowId",this.widget.options.onSubFormRowAdd).call(this, e, o)
        },
        handleSubFormRowInsert(e, o) {
            this.widget.options.onSubFormRowInsert && new Function("subFormData","newRowId",this.widget.options.onSubFormRowInsert).call(this, e, o)
        },
        handleSubFormRowDelete(e, o, t) {
            this.widget.options.onSubFormRowDelete && new Function("subFormData","deletedDataRow","deletedRowIndex",this.widget.options.onSubFormRowDelete).call(this, e, o, t)
        },
        setDisabled(e) {
            this.widget.options.disabled = e,
            e ? this.disableSubForm() : this.enableSubForm()
        },
        setInsertDisabled(e) {
            this.insertDisabled = e
        },
        setDeleteDisabled(e) {
            this.deleteDisabled = e
        },
        setSubFormValues(e) {
            this.globalModel.formModel[this.widget.options.name] = e,
            this.initRowIdData(!1),
            this.initFieldSchemaData(),
            setTimeout(()=>{
                this.handleSubFormRowChange(e)
            }
            , 800)
        },
        setSubFormFieldValue(e, o, t) {
            const r = this.globalModel.formModel[this.widget.options.name];
            r[t][e] = o,
            this.handleSubFormRowChange(r)
        }
    }
  }
</script>

<style lang="scss" scoped>
  // .sub-form-container {
  //   margin-bottom: 8px;
  //   text-align: left; //IE浏览器强制居左对齐

  //   :deep(.el-row.header-row) {
  //     padding-bottom: 0;
  //   }

  //   :deep(.el-row.sub-form-row) {
  //     padding-top: 3px;
  //     padding-bottom: 3px;

  //     .row-number-span {
  //       margin-left: 16px;
  //     }
  //   }
  // }

  // div.action-header-column {
  //   display: inline-block;
  //   width: 120px;

  //   .action-label {
  //     margin-right: 12px;
  //   }

  //   .action-button {
  //     padding-left: 8px;
  //     padding-right: 8px;
  //   }
  // }

  // div.field-header-column {
  //   display: inline-block;
  //   //overflow: hidden;
  //   //white-space: nowrap;  //文字超出长度不自动换行
  //   //text-overflow: ellipsis;  //文字超出长度显示省略号

  //   span.custom-label i {
  //     margin: 0 3px;
  //   }
  // }

  // div.field-header-column.is-required:before {
  //   content: '*';
  //   color: #F56C6C;
  //   margin-right: 4px;
  // }

  // div.label-center-left {
  //   text-align: left;
  // }

  // div.label-center-align {
  //   text-align: center;
  // }

  // div.label-right-align {
  //   text-align: right;
  // }

  // div.sub-form-action-column {
  //   display: inline-block;
  //   width: 120px;

  //   :deep(.el-form-item) {
  //     margin-bottom: 0;
  //   }

  //   :deep(.el-button) {
  //     font-size: 14px;
  //     padding: 0;
  //     background: #DCDFE6;
  //     border: 4px solid #DCDFE6;
  //   }

  // }

  // div.sub-form-action-column.hide-label {
  //   :deep(.el-form-item__label) {
  //     display: none;
  //   }
  // }

  // div.sub-form-table-column {
  //   display: inline-block;
  //   //width: 200px;

  //   :deep(.el-form-item) {
  //     margin-left: 4px;
  //     margin-right: 4px;
  //     margin-bottom: 0;
  //   }

  //   :deep(.el-form-item__content) {
  //     margin-left: 0 !important;
  //   }
  // }

  // div.sub-form-table-column.hide-label {
  //   :deep(.el-form-item__label) {
  //     display: none;
  //   }
  // }
  .sub-form-container {
    margin-bottom: 8px;
    text-align: left
}

.sub-form-container .el-row.header-row,.sub-form-container .el-row.sub-form-row {
    padding: 0
}

.sub-form-container .el-row.sub-form-row .row-number-span {
    margin-left: 16px
}

div.action-header-column {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 120px;
    border: 1px solid #e1e2e3;
    background: #f1f2f3;
    padding: 8px
}

div.action-header-column .action-label {
    margin-right: 12px
}

div.action-header-column .action-button {
    padding-left: 8px;
    padding-right: 8px
}

div.row-no-header-column {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    text-align: center;
    border: 1px solid #e1e2e3;
    background: #f1f2f3
}

div.field-header-column {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #e1e2e3;
    background: #f1f2f3;
    padding: 8px
}

div.field-header-column span.custom-label i {
    margin: 0 3px
}

div.field-header-column.is-required:before {
    content: "*";
    color: #f56c6c;
    margin-right: 4px
}

div.label-center-left {
    text-align: left
}

div.label-center-align {
    text-align: center
}

div.label-right-align {
    text-align: right
}

div.sub-form-action-column {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 120px;
    border: 1px solid #e1e2e3;
    padding: 8px
}

div.sub-form-action-column .el-form-item {
    margin-bottom: 0
}

div.sub-form-action-column .el-button {
    font-size: 14px;
    padding: 0;
    background: #DCDFE6;
    border: 4px solid #DCDFE6
}

div.sub-form-action-column.hide-label .el-form-item__label {
    display: none
}

div.row-no-column {
    display: flex;
    align-items: center;
    width: 50px;
    border: 1px solid #e1e2e3
}

div.sub-form-table-column {
    display: inline-block;
    border: 1px solid #e1e2e3;
    padding: 8px
}

div.sub-form-table-column .el-form-item {
    margin-left: 4px;
    margin-right: 4px;
    margin-bottom: 0
}

div.sub-form-table-column .el-form-item__content {
    margin-left: 0!important
}

div.sub-form-table-column.hide-label .el-form-item__label {
    display: none
}
</style>
