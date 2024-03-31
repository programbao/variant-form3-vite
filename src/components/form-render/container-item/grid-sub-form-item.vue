<template>
    <container-item-wrapper :widget="widget">
     <div 
       class="sub-form-container" 
       :class="[disabledClass, readModeClass]"
       v-show="!widget.options.hidden"
     >
       <el-row class="header-row">
         <div class="action-header-column">
           <span class="action-label">{{ i18nt('render.hint.subFormAction') }}</span>
           <el-button
             v-if="!isReadMode"
             :disabled="widgetDisabled || actionDisabled || insertDisabled"
             round
             type="primary"
             size="small"
             class="action-button"
             @click="addSubFormRow"
             :title="i18nt('render.hint.subFormAddActionHint')"
           >
             {{ i18nt('render.hint.subFormAddAction') }}<i class="el-icon-plus el-icon-right" />
           </el-button>
         </div>
       </el-row>
 
       <div v-for="(rowId, rowIndex) in rowIdData" :key="rowId" class="sub-form-row">
         <!-- 左侧操作列 -->
         <div v-if="leftActionColumn" class="sub-form-action-column hide-label">
           <div class="action-button-column">
             <el-button
               v-show="!isReadMode" 
               :disabled="widgetDisabled || actionDisabled || insertDisabled"
               circle
               type=""
               icon="el-icon-circle-plus-outline"
               @click="insertSubFormRow(rowIndex)"
               :title="i18nt('render.hint.insertSubFormRow')"
             />
             <el-button
               v-show="!isReadMode"
               :disabled="widgetDisabled || actionDisabled || deleteDisabled"
               circle 
               type=""
               icon="el-icon-delete"
               @click="deleteSubFormRow(rowIndex)"
               :title="i18nt('render.hint.deleteSubFormRow')"
             />
             <span v-if="widget.options.showRowNumber" class="row-number-span">
               #{{ rowIndex + 1 }}
             </span>
           </div>
         </div>
 
         <!-- 行号列 -->
         <div v-else-if="!leftActionColumn && widget.options.showRowNumber" class="row-no-column">
           <span v-if="widget.options.showRowNumber" class="row-number-span">
             #{{ rowIndex + 1 }}
           </span>
         </div>
 
         <!-- 子表单字段列 -->
         <div class="grid-sub-form-data-row">
           <component
             v-for="(fieldWidget, fieldIndex) in widget.widgetList"
             :is="getComponentByContainer(fieldWidget)"
             :key="widgetSchemaData[rowIndex][fieldIndex].id"
             :widget="widgetSchemaData[rowIndex][fieldIndex]" 
             :parent-list="widget.widgetList"
             :index-of-parent-list="fieldIndex"
             :parent-widget="widget"
             :sub-form-row-id="rowId"
             :sub-form-row-index="rowIndex" 
             :sub-form-col-index="fieldIndex"
           />
         </div>
 
         <!-- 右侧操作列 -->
         <div v-if="!leftActionColumn" class="sub-form-action-column hide-label">
           <div class="action-button-column">
             <el-button
               v-show="!isReadMode"
               :disabled="widgetDisabled || actionDisabled || insertDisabled"
               circle
               type=""
               icon="el-icon-circle-plus-outline"
               @click="insertSubFormRow(rowIndex)"
               :title="i18nt('render.hint.insertSubFormRow')"
             />
             <el-button
               v-show="!isReadMode"
               :disabled="widgetDisabled || actionDisabled || deleteDisabled"
               circle
               type=""
               icon="el-icon-delete"
               @click="deleteSubFormRow(rowIndex)"
               :title="i18nt('render.hint.deleteSubFormRow')"
             />
           </div>
         </div>
       </div>
     </div>
   </container-item-wrapper>
 </template>
 
 <script>
   import emitter from '@/utils/emitter'
   import i18n from '@/utils/i18n'
   import {deepClone, generateId, traverseFieldWidgetsOfContainer} from '@/utils/util'
   import refMixin from '../../../components/form-render/refMixin'
   import ContainerItemWrapper from './container-item-wrapper'
   import containerItemMixin from './containerItemMixin'
   import FieldComponents from '@/components/form-designer/form-widget/field-widget/index'
   import SvgIcon from "@/components/svg-icon/index";
   export default {
     name: "grid-sub-form-item",
     componentName: 'ContainerItem',
     mixins: [emitter, i18n, refMixin, containerItemMixin],
     components: {
       ContainerItemWrapper,
       ...FieldComponents,
       SvgIcon,
     },
     props: {
       widget: Object,
     },
     provide() {
         return {
             getSubFormFieldFlag: ()=>!0,
             getSubFormName: ()=>this.widget.options.name
         }
     },
     inject: ['refList', 'sfRefList', 'globalModel', 'getReadMode'],
     data() {
       return {
         rowIdData: [],
         widgetSchemaData: [],
         actionDisabled: !1,
         insertDisabled: !1,
         deleteDisabled: !1,
         fieldWidgetList: []
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
         this.initWidgetSchemaData(),
         this.initEventHandler()
     },
     mounted() {
       this.extractFieldWidgetList(),
       this.handleSubFormFirstRowAdd()  //默认添加首行后，主动触发相关事件！！
     },
     beforeUnmount() {
       this.unregisterFromRefList()
     },
     methods: {
       extractFieldWidgetList() {
             this.fieldWidgetList.splice(0, this.fieldWidgetList.length);
             let e = o=>{
                 this.fieldWidgetList.push(o)
             }
             ;
             traverseFieldWidgetsOfContainer(this.widget, e)
         },
         getLabelAlign(e, o) {
             return o.options.labelAlign || e.options.labelAlign
         },
         registerSubFormToRefList() {
             this.widget.type === "grid-sub-form" && (this.sfRefList[this.widget.options.name] = this)
         },
         initRowIdData(e) {
             if (this.widget.type === "grid-sub-form") {
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
         initWidgetSchemaData() {
             if (this.widget.type !== "grid-sub-form")
                 return;
             let e = this.rowIdData.length;
             if (this.widgetSchemaData.splice(0, this.widgetSchemaData.length),
             e > 0)
                 for (let o = 0; o < e; o++) {
                     let t = [];
                     this.widget.widgetList.forEach(r=>{
                         t.push(this.cloneSchemaOfWidget(r))
                     }
                     ),
                     this.widgetSchemaData.push(t)
                 }
         },
         addToWidgetSchemaData(e) {
             let o = [];
             this.widget.widgetList.forEach(t=>{
                 o.push(this.cloneSchemaOfWidget(t))
             }
             ),
             e === void 0 ? this.widgetSchemaData.push(o) : this.widgetSchemaData.splice(e, 0, o)
         },
         deleteFromWidgetSchemaData(e) {
             this.widgetSchemaData.splice(e, 1)
         },
         cloneSchemaOfWidget(e) {
             let o = deepClone(e);
             return o.id = e.type + generateId(),
             o
         },
         initEventHandler() {
             this.widget.type === "grid-sub-form" && this.on$("setFormData", e=>{
                 this.initRowIdData(!1),
                 this.initWidgetSchemaData();
                 let o = e[this.widget.options.name] || [];
                 setTimeout(()=>{
                     this.handleSubFormRowChange(o)
                 }
                 , 800)
             }
             )
         },
         handleSubFormFirstRowAdd() {
             if (this.widget.type === "grid-sub-form" && !!this.widget.options.showBlankRow && this.rowIdData.length === 1) {
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
             this.fieldWidgetList.forEach(t=>{
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
             this.addToWidgetSchemaData(),
             this.$nextTick(()=>{
                 this.handleSubFormRowAdd(o, this.rowIdData[o.length - 1]),
                 this.handleSubFormRowChange(o)
             }
             )
         },
         insertSubFormRow(e) {
             let o = {};
             this.fieldWidgetList.forEach(r=>{
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
             this.addToWidgetSchemaData(e),
             this.$nextTick(()=>{
                 this.handleSubFormRowInsert(t, this.rowIdData[e]),
                 this.handleSubFormRowChange(t)
             }
             )
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
                 this.deleteFromWidgetSchemaData(e),
                 this.$nextTick(()=>{
                     this.handleSubFormRowDelete(o, t, e),
                     this.handleSubFormRowChange(o)
                 }
                 )
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
             e ? this.disableGridSubForm() : this.enableGridSubForm()
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
             this.initWidgetSchemaData(),
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
     },
   }
 </script>
 
 <style lang="scss" scoped>
 .sub-form-container {
     margin-bottom: 8px;
     text-align: left
 }
 
 .sub-form-container .el-row.header-row {
     padding: 0;
     display: flex
 }
 
 .sub-form-container div.sub-form-row {
     padding: 0;
     display: flex;
     align-items: center;
     border: 1px solid #e1e2e3
 }
 
 .sub-form-container div.sub-form-row .row-number-span {
     margin-left: 16px
 }
 
 div.action-header-column {
     display: inline-block;
     width: 100%;
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
 
 div.field-header-column {
     display: inline-block;
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
     display: inline-block;
     align-items: center;
     text-align: center;
     width: 120px;
     padding: 8px
 }
 
 div.sub-form-action-column .el-form-item {
     margin-bottom: 0
 }
 
 div.sub-form-action-column .el-button {
     font-size: 18px;
     padding: 0;
     background: #DCDFE6;
     border: 4px solid #DCDFE6
 }
 
 div.grid-sub-form-data-row {
     display: inline-block;
     width: 100%;
     border-left: 1px solid #e1e2e3;
     border-right: 1px solid #e1e2e3
 }
 
 div.sub-form-action-column.hide-label .el-form-item__label {
     display: none
 }
 
 div.row-no-column {
     display: flex;
     align-items: center;
     width: 50px;
     border-radius: 10px;
     background: #f1f2f3;
     padding: 5px 0;
     margin: 0 6px
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
 