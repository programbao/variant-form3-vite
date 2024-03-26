<!--
/**
 * author: vformAdmin
 * email: vdpadmin@163.com
 * website: https://www.vform666.com
 * date: 2021.08.18
 * remark: 如果要分发VForm源码，需在本文件顶部保留此文件头信息！！
 */
-->

<template>
  <el-form
    :label-position="labelPosition"
    :size="size"
    :class="[customClass, readModeFlag ? 'readonly-mode-form' : '']"
    class="render-form"
    :label-width="labelWidth"
    :validate-on-rule-change="false"
    :model="formDataModel"
    ref="renderForm"
    @submit.prevent
  >
    <template v-for="(widget, index) in widgetList">
      <template v-if="'container' === widget.category">
        <component
          :is="getContainerWidgetName(widget)"
          :widget="widget"
          :key="widget.id"
          :parent-list="widgetList"
          :index-of-parent-list="index"
          :parent-widget="null"
        >
          <!-- 递归传递插槽！！！ -->
          <template
            v-for="slot in Object.keys($slots)"
            v-slot:[slot]="scope"
          >
            <slot
              :name="slot"
              v-bind="scope"
            />
          </template>
        </component>
      </template>
      <template v-else>
        <component
          :is="getWidgetName(widget)"
          :field="widget"
          :form-model="formDataModel"
          :designer="null"
          :key="widget.id"
          :parent-list="widgetList"
          :index-of-parent-list="index"
          :parent-widget="null"
        >
          <!-- 递归传递插槽！！！ -->
          <template
            v-for="slot in Object.keys($slots)"
            v-slot:[slot]="scope"
          >
            <slot
              :name="slot"
              v-bind="scope"
            />
          </template>
        </component>
      </template>
    </template>
  </el-form>
</template>

<script>
//import ElForm from 'element-ui/packages/form/src/form.vue'  /* 用于源码调试Element UI */
import emitter from '@/utils/emitter'
import './container-item/index'
// import DynamicDialog from './dynamic-widget/dynamic-dialog.vue'
import FieldComponents from '@/components/form-designer/form-widget/field-widget/index'
import { createApp ,render, nextTick } from 'vue'
import {
  generateId,
  deepClone,
  insertCustomCssToHead,
  insertGlobalFunctionsToHtml,
  getAllContainerWidgets,
  getAllFieldWidgets,
  traverseFieldWidgets,
  buildDefaultFormJson,
  traverseFieldWidgetsOfContainer,
  getFieldWidgetByName,
  getFieldWidgetById,
  getContainerWidgetByName,
  setObjectValue,
  getObjectValue,
  hasPropertyOfObject,
  deleteCustomStyleAndScriptNode,
  cloneFormConfigWithoutEventHandler
} from '@/utils/util'
import i18n, { changeLocale } from '@/utils/i18n'
import ElementPlus from 'element-plus'

export default {
  name: 'VFormRender',
  componentName: 'VFormRender',
  mixins: [emitter, i18n],
  components: {
    //ElForm,

    ...FieldComponents
  },
  props: {
    formJson: {
      type: Object,
      default: () => buildDefaultFormJson()
    },
    formData: {
      type: Object,
      default: () => ({})
    },
    optionData: {
      type: Object,
      default: () => ({})
    },
    previewState: {
      type: Boolean,
      default: !1
    },
    disabledMode: {
      type: Boolean,
      default: !1
    },
    renderConfig: {
      type: Object,
      default: () => ({
        languageName: 'zh-CN'
      })
    },
    globalDsv: {
      type: Object,
      default: () => ({})
    },
    parentForm: {
      type: Object,
      default: null
    },
    dynamicCreation: {
      type: Boolean,
      default: !1
    }
  },
  provide() {
    return {
      refList: this.widgetRefList,
      sfRefList: this.subFormRefList,
      getFormConfig: () => this.formJsonObj.formConfig,
      getGlobalDsv: () => this.globalDsv,
      globalOptionData: this.optionData,
      getOptionData: () => this.optionData,
      globalModel: {
        formModel: this.formDataModel
      },
      previewState: this.previewState,
      getReadMode: () => this.readModeFlag,
      getSubFormFieldFlag: () => !1,
      getSubFormName: () => '',
      getObjectFieldFlag: () => !1,
      getObjectName: () => '',
      getDSResultCache: () => this.dsResultCache
    }
  },
  data() {
    return {
      formJsonObj: this.formJson,
      formDataModel: {},
      widgetRefList: {},
      subFormRefList: {},
      formId: null,
      externalComponents: {},
      readModeFlag: !1,
      dialogOrDrawerRef: null,
      childFormRef: null,
      dsResultCache: {}
    }
  },
  computed: {
    formConfig() {
      return this.formJsonObj.formConfig
    },
    widgetList() {
      return this.formJsonObj.widgetList
    },
    labelPosition() {
      return !!this.formConfig && !!this.formConfig.labelPosition
        ? this.formConfig.labelPosition
        : 'left'
    },
    labelWidth() {
      return !!this.formConfig && !!this.formConfig.labelWidth
        ? this.formConfig.labelWidth + 'px'
        : '80px'
    },
    size() {
      return !!this.formConfig && !!this.formConfig.size
        ? this.formConfig.size
        : 'default'
    },
    customClass() {
      return !!this.formConfig && !!this.formConfig.customClass
        ? this.formConfig.customClass
        : ''
    }
  },
  watch: {},
  created() {
    this.buildFormModel(this.formJsonObj ? this.formJsonObj.widgetList : null),
      this.initFormObject()
  },
  mounted() {
    this.initLocale(), this.initDataSetRequest(), this.handleOnMounted()
  },
  beforeUnmount() {
    deleteCustomStyleAndScriptNode(this.previewState, this.formId)
  },
  methods: {
    initFormObject(e = !0) {
      ;(this.formId = 'vfRender' + generateId()),
        !!e && !this.dynamicCreation && this.insertCustomStyleAndScriptNode(),
        this.addFieldChangeEventHandler(),
        this.addFieldValidateEventHandler(),
        this.registerFormToRefList(),
        this.handleOnCreated(),
        this.disabledMode &&
          this.$nextTick(() => {
            this.disableForm()
          })
    },
    getContainerWidgetName(e) {
      return e.type === 'grid' ? 'vf-grid-item' : e.type + '-item'
    },
    getWidgetName(e) {
      return e.type + '-widget'
    },
    initLocale() {
      let e = localStorage.getItem('v_form_locale') || 'zh-CN'
      this.changeLanguage(e)
    },
    insertCustomStyleAndScriptNode() {
      !!this.formConfig &&
        !!this.formConfig.cssCode &&
        insertCustomCssToHead(
          this.formConfig.cssCode,
          this.previewState ? '' : this.formId
        ),
        !!this.formConfig &&
          !!this.formConfig.functions &&
          insertGlobalFunctionsToHtml(
            this.formConfig.functions,
            this.previewState ? '' : this.formId
          )
    },
    buildFormModel(e) {
      !!e &&
        e.length > 0 &&
        e.forEach((o) => {
          this.buildDataFromWidget(o)
        })
    },
    getFieldKeyName(e) {
      let o = e.options.name
      return (e.options.keyNameEnabled && e.options.keyName) || o
    },
    buildDataFromWidget(e) {
      if (e.category === 'container') {
        if (!(e.type === 'vf-dialog' || e.type === 'vf-drawer'))
          if (e.type === 'grid')
            !!e.cols &&
              e.cols.length > 0 &&
              e.cols.forEach((o) => {
                this.buildDataFromWidget(o)
              })
          else if (e.type === 'table')
            !!e.rows &&
              e.rows.length > 0 &&
              e.rows.forEach((o) => {
                !!o.cols &&
                  o.cols.length > 0 &&
                  o.cols.forEach((t) => {
                    this.buildDataFromWidget(t)
                  })
              })
          else if (e.type === 'tab')
            !!e.tabs &&
              e.tabs.length > 0 &&
              e.tabs.forEach((o) => {
                !!o.widgetList &&
                  o.widgetList.length > 0 &&
                  o.widgetList.forEach((t) => {
                    this.buildDataFromWidget(t)
                  })
              })
          else if (e.type === 'sub-form') {
            let o = e.options.name
            if (this.formData.hasOwnProperty(o)) {
              let t = this.formData[o]
              this.formDataModel[o] = deepClone(t)
            } else {
              let t = {}
              e.options.showBlankRow
                ? (e.widgetList.forEach((r) => {
                    if (r.formItemFlag) {
                      let n = this.getFieldKeyName(r)
                      t[n] = r.options.defaultValue
                    }
                  }),
                  (this.formDataModel[o] = [t]))
                : (this.formDataModel[o] = [])
            }
          } else if (e.type === 'grid-sub-form') {
            let o = e.options.name
            if (this.formData.hasOwnProperty(o)) {
              let t = this.formData[o]
              this.formDataModel[o] = deepClone(t)
            } else {
              let t = []
              traverseFieldWidgetsOfContainer(e, (l) => {
                t.push(l)
              })
              let n = {}
              e.options.showBlankRow
                ? (t.forEach((l) => {
                    let i = this.getFieldKeyName(l)
                    n[i] = l.options.defaultValue
                  }),
                  (this.formDataModel[o] = [n]))
                : (this.formDataModel[o] = [])
            }
          } else if (e.type === 'grid-col' || e.type === 'table-cell')
            !!e.widgetList &&
              e.widgetList.length > 0 &&
              e.widgetList.forEach((o) => {
                this.buildDataFromWidget(o)
              })
          else if (e.type === 'object-group') {
            let o = []
            traverseFieldWidgetsOfContainer(e, (r) => {
              r.formItemFlag && o.push(r.options.name)
            })
            let t = e.options.objectName
            o.forEach((r) => {
              let n = getFieldWidgetByName(e.widgetList, r, !1),
                l = t + '.' + this.getFieldKeyName(n)
              if (!hasPropertyOfObject(this.formData, l))
                setObjectValue(this.formDataModel, l, n.options.defaultValue)
              else {
                let i = getObjectValue(this.formData, l)
                setObjectValue(this.formDataModel, l, i)
              }
            })
          } else
            !!e.widgetList &&
              e.widgetList.length > 0 &&
              e.widgetList.forEach((o) => {
                this.buildDataFromWidget(o)
              })
      } else if (e.formItemFlag) {
        let o = this.getFieldKeyName(e)
        if (!this.formData.hasOwnProperty(o))
          this.formDataModel[o] = e.options.defaultValue
        else {
          let t = this.formData[o]
          this.formDataModel[o] = deepClone(t)
        }
      }
    },
    addFieldChangeEventHandler() {
      this.off$('fieldChange'),
        this.on$('fieldChange', ([e, o, t, r, n]) => {
          this.handleFieldDataChange(e, o, t, r, n),
            this.$emit('formChange', e, o, t, this.formDataModel, r, n)
        })
    },
    addFieldValidateEventHandler() {
      this.off$('fieldValidation'),
        this.on$('fieldValidation', (e) => {
          this.$refs.renderForm && this.$refs.renderForm.validateField(e)
        })
    },
    registerFormToRefList() {
      this.widgetRefList.v_form_ref = this
    },
    handleFieldDataChange(e, o, t, r, n) {
      !!this.formConfig &&
        !!this.formConfig.onFormDataChange &&
        new Function(
          'fieldName',
          'newValue',
          'oldValue',
          'formModel',
          'subFormName',
          'subFormRowIndex',
          this.formConfig.onFormDataChange
        ).call(this, e, o, t, this.formDataModel, r, n)
    },
    handleOnCreated() {
      !!this.formConfig &&
        !!this.formConfig.onFormCreated &&
        new Function(this.formConfig.onFormCreated).call(this)
    },
    handleOnMounted() {
      !!this.formConfig &&
        !!this.formConfig.onFormMounted &&
        new Function(this.formConfig.onFormMounted).call(this)
    },
    findWidgetAndSetDisabled(e, o) {
      let t = this.getWidgetRef(e)
      !!t && !!t.setDisabled
        ? t.setDisabled(o)
        : this.findWidgetOfSubFormAndSetDisabled(e, o)
    },
    findWidgetOfSubFormAndSetDisabled(e, o) {
      const t = getFieldWidgetByName(this.formJsonObj.widgetList, e, !0)
      !!t &&
        !!t.options &&
        t.options.hasOwnProperty('disabled') &&
        (t.options.disabled = o),
        this.findWidgetNameInSubForm(e).forEach((r) => {
          let n = this.getWidgetRef(r)
          !!n && !!n.setDisabled && n.setDisabled(o)
        })
    },
    findWidgetAndSetHidden(e, o) {
      let t = this.getWidgetRef(e)
      !!t && !!t.setHidden
        ? t.setHidden(o)
        : this.findWidgetOfSubFormAndSetHidden(e, o)
    },
    findWidgetOfSubFormAndSetHidden(e, o) {
      const t = getFieldWidgetByName(this.formJsonObj.widgetList, e, !0)
      !!t &&
        !!t.options &&
        t.options.hasOwnProperty('hidden') &&
        (t.options.hidden = o),
        this.findWidgetNameInSubForm(e).forEach((r) => {
          let n = this.getWidgetRef(r)
          !!n && !!n.setHidden && n.setHidden(o)
        })
    },
    findWidgetNameInSubForm(e) {
      let o = [],
        t = null
      if (
        (Object.keys(this.subFormRefList).forEach((r) => {
          const n = (i) => {
              i.options.name === e && (t = r)
            },
            l = this.subFormRefList[r]
          traverseFieldWidgetsOfContainer(l.widget, n)
        }),
        t)
      ) {
        let r = this.getWidgetRef(t)
        if (r) {
          let n = r.getRowIdData()
          !!n &&
            n.length > 0 &&
            n.forEach((l) => {
              o.push(e + '@row' + l)
            })
        }
      }
      return o
    },
    findFieldWidgetById(e, o) {
      return getFieldWidgetById(this.formJsonObj.widgetList, e, o)
    },
    initDataSetRequest() {
      let e = new Set()
      this.getFieldWidgets().forEach((o) => {
        !!o.field.options.dsEnabled &&
          !!o.field.options.dsName &&
          !!o.field.options.dataSetName &&
          e.add(o.field.options.dsName)
      }),
        e.size > 0 &&
          e.forEach(async (o) => {
            let t = getDSByName(this.formConfig, o)
            if (t) {
              let r = new Object({})
              overwriteObj(r, this.globalDsv || {})
              let n = null
              try {
                ;(n = await runDataSourceRequest(
                  t,
                  r,
                  this,
                  !1,
                  this.$message
                )),
                  (this.dsResultCache[o] = n),
                  this.broadcast('FieldWidget', 'loadOptionItemsFromDataSet', o)
              } catch (l) {
                this.$message.error(l.message)
              }
            }
          })
    },
    changeLanguage(e) {
      changeLocale(e)
    },
    getLanguageName() {
      return localStorage.getItem('v_form_locale') || 'zh-CN'
    },
    getNativeForm() {
      return this.$refs.renderForm
    },
    getFormRef() {
      return this
    },
    getWidgetRef(e, o = !1) {
      let t = this.widgetRefList[e]
      return (
        !t &&
          !!o &&
          this.$message.error(this.i18nt('render.hint.refNotFound') + e),
        t
      )
    },
    clearFormDataModel() {
      for (let e in this.formDataModel) delete this.formDataModel[e]
    },
    getFormJson() {
      return this.formJsonObj
    },
    setFormJson(e) {
      if (e)
        if (typeof e == 'string' || e.constructor === Object) {
          let o = null
          if (
            (typeof e == 'string' ? (o = JSON.parse(e)) : (o = e),
            !o.formConfig || !o.widgetList)
          ) {
            this.$message.error('Invalid format of form json.')
            return
          }
          this.clearFormDataModel(),
            this.buildFormModel(o.widgetList),
            (this.formJsonObj.formConfig = o.formConfig),
            (this.formJsonObj.widgetList = o.widgetList),
            this.insertCustomStyleAndScriptNode(),
            this.$nextTick(() => {
              this.initFormObject(!1),
                this.initDataSetRequest(),
                this.handleOnMounted()
            })
        } else this.$message.error('Set form json failed.')
    },
    reloadOptionData(e) {
      let o = []
      !!e && typeof e == 'string'
        ? (o = [e])
        : !!e && Array.isArray(e) && (o = [...e]),
        this.broadcast('FieldWidget', 'reloadOptionItems', o)
    },
    getFormData(e = !0) {
      if (!e) return this.formDataModel
      let o = function () {},
        t = new window.Promise(function (r, n) {
          o = function (l, i) {
            i ? n(i) : r(l)
          }
        })
      return (
        this.$refs.renderForm.validate((r, n) => {
          r
            ? this.doCustomValidation()
              ? o(this.formDataModel)
              : o(
                  this.formDataModel,
                  this.i18nt('render.hint.validationFailed')
                )
            : o(this.formDataModel, this.i18nt('render.hint.validationFailed'))
        }),
        t
      )
    },
    setFormData(e) {
      let o = e
      typeof e == 'string' && (o = JSON.parse(e)),
        Object.keys(this.formDataModel).forEach((t) => {
          !!o &&
            o.hasOwnProperty(t) &&
            (this.formDataModel[t] = deepClone(o[t]))
        }),
        this.broadcast('ContainerItem', 'setFormData', this.formDataModel),
        this.broadcast('FieldWidget', 'setFormData', this.formDataModel)
    },
    getFieldValue(e) {
      let o = this.getWidgetRef(e)
      if (!!o && !!o.getValue) return o.getValue()
      if (!o) {
        let t = []
        return (
          this.findWidgetNameInSubForm(e).forEach((r) => {
            let n = this.getWidgetRef(r)
            !!n && !!n.getValue && t.push(n.getValue())
          }),
          t
        )
      }
    },
    setFieldValue(e, o, t = !1) {
      let r = this.getWidgetRef(e)
      !!r && !!r.setValue && r.setValue(o, t),
        r ||
          this.findWidgetNameInSubForm(e).forEach((n) => {
            let l = this.getWidgetRef(n)
            !!l && !!l.setValue && l.setValue(o, t)
          })
    },
    getSubFormValues(e, o = !0) {
      return this.subFormRefList[e].getSubFormValues(o)
    },
    setSubFormValues(e, o) {
      return this.subFormRefList[e].setSubFormValues(o)
    },
    disableForm() {
      Object.keys(this.widgetRefList).forEach((o) => {
        let t = this.getWidgetRef(o)
        t &&
          (!!t.widget && t.widget.type === 'sub-form'
            ? t.disableSubForm()
            : !!t.widget && t.widget.type === 'grid-sub-form'
            ? t.disableGridSubForm()
            : !!t.setDisabled && t.setDisabled(!0))
      })
    },
    enableForm() {
      Object.keys(this.widgetRefList).forEach((o) => {
        let t = this.getWidgetRef(o)
        t &&
          (!!t.widget && t.widget.type === 'sub-form'
            ? t.enableSubForm()
            : !!t.widget && t.widget.type === 'grid-sub-form'
            ? t.enableGridSubForm()
            : !!t.setDisabled && t.setDisabled(!1))
      })
    },
    resetForm(e = !1) {
      Object.keys(this.subFormRefList).forEach((r) => {
        this.subFormRefList[r].resetSubForm &&
          this.subFormRefList[r].resetSubForm()
      }),
        Object.keys(this.widgetRefList).forEach((r) => {
          let n = this.getWidgetRef(r)
          !!n && !n.subFormItemFlag && !!n.resetField && n.resetField(e)
        }),
        this.$nextTick(() => {
          this.clearValidate()
        })
    },
    clearValidate(e) {
      this.$refs.renderForm.clearValidate(e)
    },
    validateForm(e) {
      this.$refs.renderForm.validate((o, t) => {
        if (o) {
          let r = this.doCustomValidation()
          e(r, t)
        } else e(o, t)
      })
    },
    doCustomValidation() {
      if (!this.formConfig.onFormValidate) return !0
      let o = new Function('formModel', this.formConfig.onFormValidate).call(
        this,
        this.formDataModel
      )
      return o === void 0 ? !0 : o
    },
    validateFields() {},
    disableWidgets(e) {
      e &&
        (typeof e == 'string'
          ? this.findWidgetAndSetDisabled(e, !0)
          : Array.isArray(e) &&
            e.forEach((o) => {
              this.findWidgetAndSetDisabled(o, !0)
            }))
    },
    enableWidgets(e) {
      e &&
        (typeof e == 'string'
          ? this.findWidgetAndSetDisabled(e, !1)
          : Array.isArray(e) &&
            e.forEach((o) => {
              this.findWidgetAndSetDisabled(o, !1)
            }))
    },
    hideWidgets(e) {
      e &&
        (typeof e == 'string'
          ? this.findWidgetAndSetHidden(e, !0)
          : Array.isArray(e) &&
            e.forEach((o) => {
              this.findWidgetAndSetHidden(o, !0)
            }))
    },
    showWidgets(e) {
      e &&
        (typeof e == 'string'
          ? this.findWidgetAndSetHidden(e, !1)
          : Array.isArray(e) &&
            e.forEach((o) => {
              this.findWidgetAndSetHidden(o, !1)
            }))
    },
    setWidgetsRequired(e, o) {
      e &&
        (typeof e == 'string'
          ? this.findWidgetAndSetRequired(e, o)
          : Array.isArray(e) &&
            e.forEach((t) => {
              this.findWidgetAndSetRequired(t, o)
            }))
    },
    findWidgetAndSetRequired(e, o) {
      let t = this.getWidgetRef(e)
      !!t && !!t.setRequired
        ? t.setRequired(o)
        : this.findWidgetOfSubFormAndSetRequired(e, o)
    },
    findWidgetOfSubFormAndSetRequired(e, o) {
      const t = getFieldWidgetByName(this.formJsonObj.widgetList, e, !0)
      !!t &&
        !!t.options &&
        t.options.hasOwnProperty('required') &&
        (t.options.required = o),
        this.findWidgetNameInSubForm(e).forEach((r) => {
          let n = this.getWidgetRef(r)
          !!n && !!n.setRequired && n.setRequired(o)
        })
    },
    getSubFormNameOfWidget(e) {
      let o = null
      return (
        Object.keys(this.subFormRefList).forEach((t) => {
          const r = (l) => {
              l.options.name === e && (o = t)
            },
            n = this.subFormRefList[t]
          traverseFieldWidgetsOfContainer(n.widget, r)
        }),
        o
      )
    },
    getFieldWidgets(e = !1) {
      return getAllFieldWidgets(this.formJsonObj.widgetList, e)
    },
    getContainerWidgets() {
      return getAllContainerWidgets(this.formJsonObj.widgetList)
    },
    addEC(e, o) {
      this.externalComponents[e] = o
    },
    hasEC(e) {
      return this.externalComponents.hasOwnProperty(e)
    },
    getEC(e) {
      return this.externalComponents[e]
    },
    setReadMode(e = !0) {
      this.readModeFlag = e
    },
    getReadMode() {
      return this.readModeFlag
    },
    getGlobalDsv() {
      return this.globalDsv
    },
    async executeDataSource(e, o = {}) {
      let t = getDSByName(this.formJsonObj.formConfig, e),
        r = new Object({})
      return (
        overwriteObj(r, this.globalDsv),
        overwriteObj(r, o),
        await runDataSourceRequest(t, r, this, !1, this.$message)
      )
    },
    getParentFormRef() {
      return this.parentForm
    },
    getTopFormRef() {
      if (!this.parentForm) return this
      let e = this.parentForm
      for (; e.parentForm; ) e = e.parentForm
      return e
    },
    setChildFormRef(e) {
      this.childFormRef = e
    },
    getChildFormRef() {
      return this.childFormRef
    },
    isDynamicCreation() {
      return this.dynamicCreation
    },
    setDialogOrDrawerRef(e) {
      this.dialogOrDrawerRef = e
    },
    getDialogOrDrawerRef() {
      return this.dialogOrDrawerRef
    },
    async showDialog(e, o = {}, t = {}, r = '') {
      let n = this.getTopFormRef(),
        l = getContainerWidgetByName(n.widgetList, e)
      if (!e || l.type !== 'vf-dialog') {
        this.$message.error(this.i18nt('render.hint.refNotFound') + e)
        return
      }
      const { default: DynamicDialog } = await import('./dynamic-widget/dynamic-dialog.vue');
     
      let i = {
        widgetList: deepClone(l.widgetList),
        formConfig: cloneFormConfigWithoutEventHandler(n.formConfig)
      },
      a = generateId() + '';
      if (!document.getElementById('vf-dynamic-dialog-wrapper')) {
        const dynamicWrapper = document.createElement('div')
        dynamicWrapper.id = 'vf-dynamic-dialog-wrapper'
        document.body.appendChild(dynamicWrapper) 
      }
      
      // 创建Vue应用实例并挂载组件
      const dynamicComponent = createApp(DynamicDialog, {
          options: l.options,
          formJson: i,
          formData: o || {},
          optionData: n.optionData,
          globalDsv: n.globalDsv,
          parentFormRef: this,
          extraData: t,
          wrapperId: a,
          title: r
      });
      dynamicComponent.use(ElementPlus);
      const instance = dynamicComponent.mount(`#vf-dynamic-dialog-wrapper`);
      instance.show();
    },
    async showDrawer(e, o = {}, t = {}, r = '') {
      let n = this.getTopFormRef(),
        l = getContainerWidgetByName(n.widgetList, e)
      if (!l || l.type !== 'vf-drawer') {
        this.$message.error(this.i18nt('render.hint.refNotFound') + e)
        return
      }
        const { default: DynamicDrawer } = await import('./dynamic-widget/dynamic-drawer.vue');
     
      let i = {
        widgetList: deepClone(l.widgetList),
        formConfig: cloneFormConfigWithoutEventHandler(n.formConfig)
      },
      a = generateId() + '';
      if (!document.getElementById('vf-dynamic-drawer-wrapper')) {
        const dynamicWrapper = document.createElement('div')
        dynamicWrapper.id = 'vf-dynamic-drawer-wrapper'
        document.body.appendChild(dynamicWrapper) 
      }
      
      // 创建Vue应用实例并挂载组件
      const dynamicComponent = createApp(DynamicDrawer, {
          options: l.options,
          formJson: i,
          formData: o || {},
          optionData: n.optionData,
          globalDsv: n.globalDsv,
          parentFormRef: this,
          extraData: t,
          wrapperId: a,
          title: r
      });
      dynamicComponent.use(ElementPlus);
      const instance = dynamicComponent.mount(`#vf-dynamic-drawer-wrapper`);
      instance.show();
    },
    isPreviewState() {
      return this.previewState
    },
    setFormJsonAndData(e, o, t = null) {
      this.setFormJson(e),
        this.$nextTick(() => {
          o &&
            (this.setFormData(o),
            this.$nextTick(() => {
              t && this.disableForm()
            }))
        })
    },
    setBlankFormJson() {
      let e = {
        widgetList: [],
        formConfig: getDefaultFormConfig()
      }
      this.setFormJson(e)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form :deep(.el-row) {
  padding: 8px;
}
.readonly-mode-form .el-form-item__content {
    background-color: #f8f8f8
}
</style>
<style>
.readonly-mode-form .el-form-item__content {
    background-color: #f8f8f8
}
</style>
