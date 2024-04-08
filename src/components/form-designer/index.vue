<!--
/**
 * author: vformAdmin
 * email: vdpadmin@163.com
 * website: https://www.vform666.com
 * date: 2021.08.18
 * remark: 如果要分发VForm源码，需在本文件顶部保留此文件头信息！！
 */
-->
<!-- 
<template>
  <el-container class="main-container full-height">
    <el-header class="main-header">
      <div class="float-left main-title">
        <img src="../../assets/vform-logo.png" @click="openHome">
        <span class="bold">VForm 3</span> {{i18nt('application.productTitle')}} <span class="version-span">Ver {{vFormVersion}}</span></div>
      <div class="float-right external-link">
        <el-dropdown v-if="showLink('languageMenu')" :hide-timeout="2000" @command="handleLanguageChanged">
          <span class="el-dropdown-link">{{curLangName}}<svg-icon icon-class="el-arrow-down" /></span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="zh-CN">{{i18nt('application.zh-CN')}}</el-dropdown-item>
              <el-dropdown-item command="en-US">{{i18nt('application.en-US')}}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <a v-if="showLink('externalLink')" href="javascript:void(0)" @click="(ev) => openUrl(ev, gitUrl)" target="_blank"><svg-icon icon-class="github" />{{i18nt('application.github')}}</a>
        <a v-if="showLink('externalLink')" href="javascript:void(0)" @click="(ev) => openUrl(ev, docUrl)" target="_blank"><svg-icon icon-class="document" />{{i18nt('application.document')}}</a>
        <a v-if="showLink('externalLink')" href="javascript:void(0)" @click="(ev) => openUrl(ev, chatUrl)" target="_blank">{{i18nt('application.qqGroup')}}</a>
        <a v-if="showLink('externalLink')" href="javascript:void(0)" @click="(ev) => openUrl(ev, subScribeUrl)" target="_blank">
          {{i18nt('application.subscription')}}<i class="el-icon-top-right"></i></a>
      </div>
    </el-header>

    <el-container>
      <el-aside class="side-panel">
        <widget-panel :designer="designer" />
      </el-aside>

      <el-container class="center-layout-container">
        <el-header class="toolbar-header">
          <toolbar-panel :designer="designer" :global-dsv="globalDsv" ref="toolbarRef">
            <template v-for="(idx, slotName) in $slots" #[slotName]>
              <slot :name="slotName"></slot>
            </template>
          </toolbar-panel>
        </el-header>
        <el-main class="form-widget-main">
          <el-scrollbar class="container-scroll-bar" :style="{height: scrollerHeight}">
            <v-form-widget :designer="designer" :form-config="designer.formConfig" :global-dsv="globalDsv" ref="formRef">
            </v-form-widget>
          </el-scrollbar>
        </el-main>
      </el-container>

      <el-aside>
        <setting-panel :designer="designer" :selected-widget="designer.selectedWidget"
                       :form-config="designer.formConfig" :global-dsv="globalDsv" @edit-event-handler="testEEH" />
      </el-aside>
    </el-container>

  </el-container>
</template> -->
<template>
  <el-container class="main-container full-height">
    <el-header v-if="designerConfig.logoHeader !== false" class="main-header">
      <div class="float-left main-title">
        <!-- <img :src="logoImgSrc" @click="openHome" /> -->
        <span class="bold">{{ vfProductName }}</span>
        {{ vfProductTitle }}
        <span class="version-span">Ver {{ vFormVersion }}</span>
      </div>
      <div class="float-right external-link">
        <el-dropdown
          v-if="showLink('languageMenu')"
          :hide-timeout="2000"
          @command="handleLanguageChanged"
        >
          <span class="el-dropdown-link">
            {{ curLangName }}
            <svg-icon icon-class="el-arrow-down"></svg-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="zh-CN">{{ i18nt('application.zh-CN') }}</el-dropdown-item>
              <el-dropdown-item command="en-US">{{ i18nt('application.en-US') }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <a href="javascript:void(0)">&nbsp;</a>
      </div>
    </el-header>

    <el-container class="main-content">
      <el-aside v-show="leftAsideVisible" class="side-panel">
        <widget-panel :designer="designer" ref="widgetPanelRef"></widget-panel>
      </el-aside>

      <div
        class="left-aside-toggle-bar"
        :class="{ 'aside-hidden': !leftAsideVisible }"
        @click="toggleLeftAside"
      >
        <el-icon size="18">
          <CaretLeft v-if="leftAsideVisible" />
          <CaretRight v-else />
        </el-icon>
      </div>

      <el-container class="center-layout-container">
        <el-header class="toolbar-header">
          <toolbar-panel
            :designer="designer"
            :global-dsv="globalDsv"
            ref="toolbarRef"
          >
            <slot />
          </toolbar-panel>
        </el-header>

        <el-main class="form-widget-main">
          <el-scrollbar class="container-scroll-bar">
            <v-form-widget
              :designer="designer"
              :form-config="designer.formConfig"
              :global-dsv="globalDsv"
              ref="formRef"
            ></v-form-widget>
          </el-scrollbar>
        </el-main>
      </el-container>

      <div
        class="right-aside-toggle-bar"
        :class="{ 'aside-hidden': !rightAsideVisible }"
        @click="toggleRightAside"
      >
        <el-icon size="18">
          <CaretRight v-if="rightAsideVisible" />
          <CaretLeft v-else />
        </el-icon>
      </div>

      <el-aside v-show="rightAsideVisible" class="setting-panel">
        <setting-panel
          :designer="designer"
          :selected-widget="designer.selectedWidget"
          :global-dsv="globalDsv"
          :form-config="designer.formConfig"
          @editEventHandler="testEEH"
        ></setting-panel>
      </el-aside>
    </el-container>
  </el-container>
</template>
<script>
  import WidgetPanel from './widget-panel/index'
  import ToolbarPanel from './toolbar-panel/index'
  import SettingPanel from './setting-panel/index'
  import VFormWidget from './form-widget/index'
  import {createDesigner} from "@/components/form-designer/designer"
  import {addWindowResizeHandler, deepClone, getQueryParam, getAllContainerWidgets,
    getAllFieldWidgets, traverseAllWidgets} from "@/utils/util"
  import {MOCK_CASE_URL, VARIANT_FORM_VERSION} from "@/utils/config"
  import i18n, { changeLocale } from "@/utils/i18n"
  import axios from 'axios'
  import SvgIcon from "@/components/svg-icon/index"
  import { CaretLeft, CaretRight } from '@element-plus/icons-vue'

  export default {
    name: "VFormDesigner",
    componentName: "VFormDesigner",
    mixins: [i18n],
    components: {
      SvgIcon,
      WidgetPanel,
      ToolbarPanel,
      SettingPanel,
      VFormWidget,
      CaretLeft,
      CaretRight
    },
    props: {
      fieldListApi: {
            type: Object,
            default: null
        },
        fieldListData: {
            type: Object,
            default: null
        },
        bannedWidgets: {
            type: Array,
            default: ()=>[]
        },
        designerConfig: {
            type: Object,
            default: ()=>({
                languageMenu: !0,
                externalLink: !0,
                formTemplates: !0,
                componentLib: !0,
                chartLib: !1,
                metadataLib: !1,
                layoutTypeButton: !0,
                eventCollapse: !0,
                widgetNameReadonly: !1,
                clearDesignerButton: !0,
                previewFormButton: !0,
                importJsonButton: !0,
                exportJsonButton: !0,
                exportCodeButton: !0,
                generateSFCButton: !0,
                logoHeader: !0,
                toolbarMaxWidth: 450,
                toolbarMinWidth: 300,
                productName: "作业票",
                productTitle: "",
                presetCssCode: "",
                languageName: "zh-CN",
                resetFormJson: !1
            })
        },
        globalDsv: {
            type: Object,
            default: ()=>({})
        },
        formTemplates: {
            type: Array,
            default: null
        },
        testOptionData: {
            type: Object,
            default: null
        }
      // /* 后端字段列表API */
      // fieldListApi: {
      //   type: Object,
      //   default: null,
      // },

      // /* 禁止显示的组件名称数组 */
      // bannedWidgets: {
      //   type: Array,
      //   default: () => []
      // },

      // designerConfig: {
      //   type: Object,
      //   default: () => {
      //     return {
      //       languageMenu: true,  //是否显示语言切换菜单
      //       externalLink: true,  //是否显示GitHub、文档等外部链接
      //       formTemplates: true,  //是否显示表单模板
      //       eventCollapse: true,  //是否显示组件事件属性折叠面板
      //       widgetNameReadonly: false,  //禁止修改组件名称

      //       clearDesignerButton: true,  //是否显示清空设计器按钮
      //       previewFormButton: true,  //是否显示预览表单按钮
      //       importJsonButton: true,  //是否显示导入JSON按钮
      //       exportJsonButton: true,  //是否显示导出JSON器按钮
      //       exportCodeButton: true,  //是否显示导出代码按钮
      //       generateSFCButton: true,  //是否显示生成SFC按钮

      //       toolbarMaxWidth: 450,  //设计器工具按钮栏最大宽度（单位像素）
      //       toolbarMinWidth: 300,  //设计器工具按钮栏最小宽度（单位像素）

      //       presetCssCode: '',  //设计器预设CSS样式代码

      //       resetFormJson: false,  //是否在设计器初始化时将表单内容重置为空
      //     }
      //   }
      // },

      // /* 全局数据源变量 */
      // globalDsv: {
      //   type: Object,
      //   default: () => ({})
      // },

    },
    data() {
        return {
            vFormVersion: VARIANT_FORM_VERSION,
            curLangName: "",
            curLocale: "",
            vsCodeFlag: !1,
            caseName: "",
            docUrl: "https://www.vform666.com/document3.html",
            gitUrl: "https://github.com/vform666/variant-form3-vite",
            chatUrl: "https://www.vform666.com/chat-group.html",
            subScribeUrl: "https://www.vform666.com/subscribe.html",
            designer: createDesigner(this),
            fieldList: [],
            subFormList: [],
            optionData: this.testOptionData,
            externalComponents: {},
            leftAsideVisible: !0,
            rightAsideVisible: !0
        }
    },
    provide() {
        return {
            getServerFieldList: ()=>this.fieldList,
            getServerSubFormList: ()=>this.subFormList,
            getDesignerConfig: ()=>this.designerConfig,
            getBannedWidgets: ()=>this.bannedWidgets,
            getTestOptionData: ()=>this.optionData
        }
    },
    computed: {
        vfProductName() {
            return this.designerConfig && this.designerConfig.productName || "VForm Pro"
        },
        vfProductTitle() {
            return this.designerConfig && this.designerConfig.productTitle || this.i18nt("application.productTitle")
        }
    },
    created() {
        this.designer.initDesigner(!!this.designerConfig.resetFormJson),
        this.vsCodeFlag = getQueryParam("vscode") == 1,
        this.caseName = getQueryParam("case"),
        this.designer.handleEvent("canvas-select-field", e=>{
            this.$emit("field-widget-used", e)
        }
        ),
        this.designer.handleEvent("canvas-remove-field", e=>{
            this.$emit("field-widget-removed", e)
        }
        ),
        this.designer.handleEvent("form-json-imported", ()=>{
            this.$emit("form-json-updated", "form-json-imported")
        }
        ),
        this.designer.handleEvent("canvas-undo", ()=>{
            this.$emit("form-json-updated", "canvas-undo")
        }
        ),
        this.designer.handleEvent("canvas-redo", ()=>{
            this.$emit("form-json-updated", "canvas-redo")
        }
        ),
        this.designer.handleEvent("canvas-remove-container", ()=>{
            this.$emit("form-json-updated", "canvas-remove-container")
        }
        )
    },
    mounted() {
        this.initLocale(),
        this.initFormTemplates(),
        this.loadCase(),
        this.initServerFields()
    },
    methods: {
        testEEH(e, o) {
            console.log("test", e),
            console.log("test222222", o)
        },
        showLink(e) {
            return this.designerConfig[e] === void 0 ? !0 : !!this.designerConfig[e]
        },
        openHome() {
            if (this.vsCodeFlag) {
                const e = {
                    cmd: "openUrl",
                    data: {
                        url: "https://www.vform666.com/"
                    }
                };
                window.parent.postMessage(e, "*")
            }
        },
        openUrl(e, o) {
            if (this.vsCodeFlag) {
                const t = {
                    cmd: "openUrl",
                    data: {
                        url: o
                    }
                };
                window.parent.postMessage(t, "*")
            } else {
                let t = e.currentTarget;
                t.href = o
            }
        },
        loadCase() {
            !this.caseName || axios.get(MOCK_CASE_URL + this.caseName + ".txt").then(e=>{
                if (e.data.code) {
                    this.$message.error(this.i18nt("designer.hint.sampleLoadedFail"));
                    return
                }
                this.setFormJson(e.data),
                this.$message.success(this.i18nt("designer.hint.sampleLoadedSuccess"))
            }
            ).catch(e=>{
                this.$message.error(this.i18nt("designer.hint.sampleLoadedFail") + ":" + e)
            }
            )
        },
        initLocale() {
            this.curLocale = localStorage.getItem("v_form_locale"),
            this.vsCodeFlag ? this.curLocale = this.curLocale || "en-US" : this.curLocale = this.curLocale || "zh-CN",
            this.curLangName = this.i18nt("application." + this.curLocale),
            this.changeLanguage(this.curLocale)
        },
        initFormTemplates() {
            !!this.formTemplates && this.formTemplates.length > 0 && (clearFormTemplates(),
            this.formTemplates.forEach(e=>{
                addFormTemplate(e)
            }
            ))
        },
        loadFieldListFromServer() {
            if (!this.fieldListApi)
                return;
            let e = this.fieldListApi.headers || {};
            axios.get(this.fieldListApi.URL, {
                headers: e
            }).then(o=>{
                let t = this.fieldListApi.labelKey || "label"
                  , r = this.fieldListApi.nameKey || "name"
                  , n = this.fieldListApi.resultDataName || ""
                  , l = n ? o.data[n] : o.data;
                this.fieldList.splice(0, this.fieldList.length),
                l.forEach(i=>{
                    this.fieldList.push({
                        label: i[t],
                        name: i[r]
                    })
                }
                )
            }
            ).catch(o=>{
                this.$message.error(o)
            }
            )
        },
        initServerFields() {
            !!this.fieldListData && !!this.fieldListData.fieldList ? (this.fieldList.splice(0, this.fieldList.length, ...this.fieldListData.fieldList),
            this.fieldListData.subFormList && this.subFormList.splice(0, this.subFormList.length, ...this.fieldListData.subFormList)) : this.loadFieldListFromServer()
        },
        setFieldListData(e) {
            !!e && !!e.fieldList && (this.fieldList.splice(0, this.fieldList.length, ...e.fieldList),
            e.subFormList && this.subFormList.splice(0, this.subFormList.length, ...e.subFormList))
        },
        handleLanguageChanged(e) {
            this.changeLanguage(e),
            this.curLangName = this.i18nt("application." + e)
        },
        changeLanguage(e) {
            changeLocale(e)
        },
        setFormJson(e) {
            let o = !1;
            e && (typeof e == "string" ? o = this.designer.loadFormJson(JSON.parse(e)) : e.constructor === Object && (o = this.designer.loadFormJson(e)),
            o && this.designer.emitHistoryChange())
        },
        getFormJson() {
            return {
                widgetList: deepClone(this.designer.widgetList),
                formConfig: deepClone(this.designer.formConfig)
            }
        },
        clearDesigner() {
            this.$refs.toolbarRef.clearFormWidget()
        },
        refreshDesigner() {
            let e = this.getFormJson();
            this.designer.clearDesigner(!0),
            this.designer.loadFormJson(e)
        },
        previewForm() {
            this.$refs.toolbarRef.previewForm()
        },
        importJson() {
            this.$refs.toolbarRef.importJson()
        },
        exportJson() {
            this.$refs.toolbarRef.exportJson()
        },
        exportCode() {
            this.$refs.toolbarRef.exportCode()
        },
        generateSFC() {
            this.$refs.toolbarRef.generateSFC()
        },
        getFieldWidgets(e=null, o=!1) {
            return getAllFieldWidgets(e || this.designer.widgetList, o)
        },
        getContainerWidgets(e=null) {
            return getAllContainerWidgets(e || this.designer.widgetList)
        },
        upgradeFormJson(e) {
            if (!e.widgetList || !e.formConfig) {
                this.$message.error("Invalid form json!");
                return
            }
            return traverseAllWidgets(e.widgetList, o=>{
                this.designer.upgradeWidgetConfig(o)
            }
            ),
            this.designer.upgradeFormConfig(e.formConfig),
            e
        },
        getWidgetRef(e, o=!1) {
            return this.$refs.formRef.getWidgetRef(e, o)
        },
        getSelectedWidgetRef() {
            return this.$refs.formRef.getSelectedWidgetRef()
        },
        addDataSource(e) {
            this.designer.formConfig.dataSources.push(e)
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
        buildFormDataSchema() {
            let e = {}
              , o = getAllContainerWidgets(this.designer.widgetList)
              , t = []
              , r = [];
            o.forEach(a=>{
                a.type === "sub-form" || a.type === "grid-sub-form" ? t.push(a.container) : a.type === "object-group" && r.push(a.container)
            }
            );
            let n = [];
            t.forEach(a=>{
                let s = {};
                traverseFieldWidgetsOfContainer(a, d=>{
                    d.formItemFlag && (s[d.options.name] = d.type,
                    n.push(d.options.name))
                }
                ),
                e[a.options.name] = s
            }
            );
            let l = [];
            return r.forEach(a=>{
                let s = {};
                traverseFieldWidgetsOfContainer(a, c=>{
                    c.formItemFlag && (s[c.options.name] = c.type,
                    l.push(c.options.name))
                }
                );
                let d = a.options.objectName;
                setObjectValue(e, d, s)
            }
            ),
            getAllFieldWidgets(this.designer.widgetList).forEach(a=>{
                n.indexOf(a.name) === -1 && l.indexOf(a.name) === -1 && (e[a.name] = a.type)
            }
            ),
            e
        },
        getFormTemplates() {
            return getAllFormTemplates()
        },
        clearFormTemplates() {
            clearFormTemplates()
        },
        addFormTemplate(e) {
            addFormTemplate(e)
        },
        toggleLeftAside() {
            this.leftAsideVisible = !this.leftAsideVisible
        },
        toggleRightAside() {
            this.rightAsideVisible = !this.rightAsideVisible
        },
        changePrimaryColor(e) {
            document.documentElement.style.setProperty("--el-color-primary", e),
            document.documentElement.style.setProperty("--vf-color-primary", e)
        },
        setMetaFields(e) {
            this.$refs.widgetPanelRef.setMetaFields(e)
        },
        setTestOptionData(e) {
            this.optionData = e
        }
    }
    // data() {
    //   return {
    //     vFormVersion: VARIANT_FORM_VERSION,
    //     curLangName: "",
    //     curLocale: "",
    //     vsCodeFlag: false,
    //     caseName: "",
    //     docUrl: "https://www.vform666.com/document3.html",
    //     gitUrl: "https://github.com/vform666/variant-form3-vite",
    //     chatUrl: "https://www.vform666.com/chat-group.html",
    //     subScribeUrl: "https://www.vform666.com/subscribe.html",
    //     designer: createDesigner(this),
    //     fieldList: [],
    //     subFormList: [],
    //     optionData: this.testOptionData,
    //     externalComponents: {},
    //     leftAsideVisible: true,
    //     rightAsideVisible: true
    //   }
    // },
    // provide() {
    //   return {
    //     getServerFieldList: ()=>this.fieldList,
    //     getServerSubFormList: ()=>this.subFormList,
    //     getDesignerConfig: ()=>this.designerConfig,
    //     getBannedWidgets: ()=>this.bannedWidgets,
    //     getTestOptionData: ()=>this.optionData
    //   }
    // },
    // created() {
    //   this.vsCodeFlag = getQueryParam('vscode') == 1
    //   this.caseName = getQueryParam('case')
    // },
    // mounted() {
    //   this.initLocale()

    //   this.scrollerHeight = window.innerHeight - 56 - 36 + 'px'
    //   addWindowResizeHandler(() => {
    //     this.$nextTick(() => {
    //       this.scrollerHeight = window.innerHeight - 56 - 36 + 'px'
    //     })
    //   })

    //   this.loadCase()
    //   this.loadFieldListFromServer()
    // },
    // methods: {
    //   testEEH(eventName, eventParams) {
    //     console.log('test', eventName)
    //     console.log('test222222', eventParams)
    //   },

    //   showLink(configName) {
    //     if (this.designerConfig[configName] === undefined) {
    //       return true
    //     }

    //     return !!this.designerConfig[configName]
    //   },

    //   openHome() {
    //     if (!!this.vsCodeFlag) {
    //       const msgObj = {
    //         cmd: 'openUrl',
    //         data: {
    //           url: 'https://www.vform666.com/'
    //         }
    //       }
    //       window.parent.postMessage(msgObj, '*')
    //     }
    //   },

    //   openUrl(event, url) {
    //     if (!!this.vsCodeFlag) {
    //       const msgObj = {
    //         cmd: 'openUrl',
    //         data: {
    //           url
    //         }
    //       }
    //       window.parent.postMessage(msgObj, '*')
    //     } else {
    //       let aDom = event.currentTarget
    //       aDom.href = url
    //       //window.open(url, '_blank') //直接打开新窗口，会被浏览器拦截
    //     }
    //   },

    //   loadCase() {
    //     if (!this.caseName) {
    //       return
    //     }

    //     axios.get(MOCK_CASE_URL + this.caseName + '.txt').then(res => {
    //       if (!!res.data.code) {
    //         this.$message.error(this.i18nt('designer.hint.sampleLoadedFail'))
    //         return
    //       }

    //       this.setFormJson(res.data)
    //       this.$message.success(this.i18nt('designer.hint.sampleLoadedSuccess'))
    //     }).catch(error => {
    //       this.$message.error(this.i18nt('designer.hint.sampleLoadedFail') + ':' + error)
    //     })
    //   },

    //   initLocale() {
    //     this.curLocale = localStorage.getItem('v_form_locale')
    //     if (!!this.vsCodeFlag) {
    //       this.curLocale = this.curLocale || 'en-US'
    //     } else {
    //       this.curLocale = this.curLocale || 'zh-CN'
    //     }
    //     this.curLangName = this.i18nt('application.' + this.curLocale)
    //     this.changeLanguage(this.curLocale)
    //   },

    //   loadFieldListFromServer() {
    //     if (!this.fieldListApi) {
    //       return
    //     }

    //     let headers = this.fieldListApi.headers || {}
    //     axios.get(this.fieldListApi.URL, {'headers': headers}).then(res => {
    //       let labelKey = this.fieldListApi.labelKey || 'label'
    //       let nameKey = this.fieldListApi.nameKey || 'name'

    //       this.fieldList.splice(0, this.fieldList.length)  //清空已有
    //       res.data.forEach(fieldItem => {
    //         this.fieldList.push({
    //           label: fieldItem[labelKey],
    //           name: fieldItem[nameKey]
    //         })
    //       })
    //     }).catch(error => {
    //       this.$message.error(error)
    //     })
    //   },

    //   handleLanguageChanged(command) {
    //     this.changeLanguage(command)
    //     this.curLangName = this.i18nt('application.' + command)
    //   },

    //   changeLanguage(langName) {
    //     changeLocale(langName)
    //   },

    //   setFormJson(formJson) {
    //     let modifiedFlag = false
    //     if (!!formJson) {
    //       if (typeof formJson === 'string') {
    //         modifiedFlag = this.designer.loadFormJson( JSON.parse(formJson) )
    //       } else if (formJson.constructor === Object) {
    //         modifiedFlag = this.designer.loadFormJson(formJson)
    //       }

    //       if (modifiedFlag) {
    //         this.designer.emitHistoryChange()
    //       }
    //     }
    //   },

    //   getFormJson() {
    //     return {
    //       widgetList: deepClone(this.designer.widgetList),
    //       formConfig: deepClone(this.designer.formConfig)
    //     }
    //   },

    //   clearDesigner() {
    //     this.$refs.toolbarRef.clearFormWidget()
    //   },


    //   /**
    //    * 刷新表单设计器
    //    */
    //   refreshDesigner() {
    //     //this.designer.loadFormJson( this.getFormJson() )  //只有第一次调用生效？？

    //     let fJson = this.getFormJson()
    //     this.designer.clearDesigner(true)  //不触发历史记录变更
    //     this.designer.loadFormJson(fJson)
    //   },

    //   /**
    //    * 预览表单
    //    */
    //   previewForm() {
    //     this.$refs.toolbarRef.previewForm()
    //   },

    //   /**
    //    * 导入表单JSON
    //    */
    //   importJson() {
    //     this.$refs.toolbarRef.importJson()
    //   },

    //   /**
    //    * 导出表单JSON
    //    */
    //   exportJson() {
    //     this.$refs.toolbarRef.exportJson()
    //   },

    //   /**
    //    * 导出Vue/HTML代码
    //    */
    //   exportCode() {
    //     this.$refs.toolbarRef.exportCode()
    //   },

    //   /**
    //    * 生成SFC代码
    //    */
    //   generateSFC() {
    //     this.$refs.toolbarRef.generateSFC()
    //   },

    //   /**
    //    * 获取所有字段组件
    //    * @returns {*[]}
    //    */
    //   getFieldWidgets(widgetList = null) {
    //     return !!widgetList ? getAllFieldWidgets(widgetList) : getAllFieldWidgets(this.designer.widgetList)
    //   },

    //   /**
    //    * 获取所有容器组件
    //    * @returns {*[]}
    //    */
    //   getContainerWidgets(widgetList = null) {
    //     return !!widgetList ? getAllContainerWidgets(widgetList) : getAllContainerWidgets(this.designer.widgetList)
    //   },

    //   /**
    //    * 升级表单json，以补充最新的组件属性
    //    * @param formJson
    //    */
    //   upgradeFormJson(formJson) {
    //     if (!formJson.widgetList || !formJson.formConfig) {
    //       this.$message.error('Invalid form json!')
    //       return
    //     }

    //     traverseAllWidgets(formJson.widgetList, (w) => {
    //       this.designer.upgradeWidgetConfig(w)
    //     })
    //     this.designer.upgradeFormConfig(formJson.formConfig)

    //     return formJson
    //   },

    //   getWidgetRef(widgetName, showError = false) {
    //     return this.$refs['formRef'].getWidgetRef(widgetName, showError)
    //   },

    //   getSelectedWidgetRef() {
    //     return this.$refs['formRef'].getSelectedWidgetRef()
    //   },

    //   //TODO: 增加更多方法！！
    //   addDataSource(e) {
    //         this.designer.formConfig.dataSources.push(e)
    //     },
    //     addEC(e, o) {
    //         this.externalComponents[e] = o
    //     },
    //     hasEC(e) {
    //         return this.externalComponents.hasOwnProperty(e)
    //     },
    //     getEC(e) {
    //         return this.externalComponents[e]
    //     },
    //     buildFormDataSchema() {
    //         let e = {}
    //           , o = getAllContainerWidgets(this.designer.widgetList)
    //           , t = []
    //           , r = [];
    //         o.forEach(a=>{
    //             a.type === "sub-form" || a.type === "grid-sub-form" ? t.push(a.container) : a.type === "object-group" && r.push(a.container)
    //         }
    //         );
    //         let n = [];
    //         t.forEach(a=>{
    //             let s = {};
    //             traverseFieldWidgetsOfContainer(a, d=>{
    //                 d.formItemFlag && (s[d.options.name] = d.type,
    //                 n.push(d.options.name))
    //             }
    //             ),
    //             e[a.options.name] = s
    //         }
    //         );
    //         let l = [];
    //         return r.forEach(a=>{
    //             let s = {};
    //             traverseFieldWidgetsOfContainer(a, c=>{
    //                 c.formItemFlag && (s[c.options.name] = c.type,
    //                 l.push(c.options.name))
    //             }
    //             );
    //             let d = a.options.objectName;
    //             setObjectValue(e, d, s)
    //         }
    //         ),
    //         getAllFieldWidgets(this.designer.widgetList).forEach(a=>{
    //             n.indexOf(a.name) === -1 && l.indexOf(a.name) === -1 && (e[a.name] = a.type)
    //         }
    //         ),
    //         e
    //     },
    //     getFormTemplates() {
    //         return getAllFormTemplates()
    //     },
    //     clearFormTemplates() {
    //         clearFormTemplates()
    //     },
    //     addFormTemplate(e) {
    //         addFormTemplate(e)
    //     },
    //     toggleLeftAside() {
    //         this.leftAsideVisible = !this.leftAsideVisible
    //     },
    //     toggleRightAside() {
    //         this.rightAsideVisible = !this.rightAsideVisible
    //     },
    //     changePrimaryColor(e) {
    //         document.documentElement.style.setProperty("--el-color-primary", e),
    //         document.documentElement.style.setProperty("--vf-color-primary", e)
    //     },
    //     setMetaFields(e) {
    //         this.$refs.widgetPanelRef.setMetaFields(e)
    //     },
    //     setTestOptionData(e) {
    //         this.optionData = e
    //     }
    // }
  }
</script>

<style lang="scss" scoped>

$primary-color: var(--vf-color-primary, #409EFF);

.primary-color {
    color: $primary-color;
}

.background-opacity {
    background: rgba($primary-color, 0.6);
}

.form-widget-list .ghost,
.drag-drop-zone .ghost {
    content: "";
    font-size: 0;
    height: 3px;
    box-sizing: border-box;
    background: $primary-color;
    border: 2px solid $primary-color;
    outline-width: 0;
    padding: 0;
    overflow: hidden;
}

.el-form-item {
    .el-rate {
        margin-top: 8px;
    }

    &--medium {
        .el-radio {
            line-height: 36px !important;
        }

        .el-rate {
            margin-top: 8px;
        }
    }

    &--small {
        .el-radio {
            line-height: 32px !important;
        }

        .el-rate {
            margin-top: 6px;
        }
    }

    &--mini {
        .el-radio {
            line-height: 28px !important;
        }

        .el-rate {
            margin-top: 4px;
        }
    }
}

.el-card {
    margin-top: 3px;
    margin-bottom: 3px;
}

:deep(.readonly-mode-form) .el-form-item__content {
    background-color: #f8f8f8;
}

input[type="password"]::-ms-reveal {
    display: none;
}

.auto-full-width.el-date-editor.el-input,
:deep(.auto-full-width.el-date-editor).el-input__inner {
    width: 100% !important;
}

::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    width: 8px;
    background: rgba(16, 31, 28, 0.1);
    -webkit-border-radius: 2em;
    -moz-border-radius: 2em;
    border-radius: 2em;
}

::-webkit-scrollbar-thumb {
    background-color: #101f1c59;
    background-clip: padding-box;
    min-height: 28px;
    -webkit-border-radius: 2em;
    -moz-border-radius: 2em;
    border-radius: 2em;

    &:hover {
        background-color: #101f1cd9;
    }
}

* {
    scrollbar-color: #e5e5e5 #f7f7f9;
    scrollbar-width: thin;
}

.el-container.main-container {
    &.full-height {
        display: flex;
    }

    .el-container.main-content {
        display: inline-flex;
        height: 100%;
        width: 100%;
        flex-direction: row;
        flex-shrink: 1;
        overflow: hidden;
        position: relative;

        .el-aside.side-panel,
        .el-main.form-widget-main :deep(.el-scrollbar) .el-scrollbar__view {
            height: 100%;
        }
        .el-aside.side-panel {
            height: 98%;
        }

        .el-main.form-widget-main {
            .form-widget-container {
                overflow-y: auto;
                // height: 100%;
                // box-sizing: border-box;

                .el-form.full-height-width {
                    box-sizing: border-box;
                    overflow-y: auto;
                }

                .form-widget-canvas {
                    height: 100%;
                    box-sizing: border-box;
                }
            }
        }

        .el-aside.setting-panel {
            height: 100%;
            overflow-y: hidden;
            display: flex;
            flex-basis: auto;

            .panel-container {
                padding: 0;

                .el-tabs {
                    display: flex;
                    flex-direction: column;
                }
            }

            :deep(.panel-container) {
                .el-tabs__header {
                    padding: 0 8px;
                }

                .el-tabs__content,
                .el-tab-pane {
                    height: calc(100% - 40px);
                    flex-grow: 1;
                }

                .el-scrollbar__wrap {
                    padding-left: 8px;
                    padding-right: 12px;
                }
            }
        }

        .left-aside-toggle-bar {
            display: block;
            cursor: pointer;
            height: 36px;
            width: 12px;
            position: absolute;
            top: calc(50% - 18px);
            left: 258px;
            border-radius: 0 8px 8px 0;
            background: #fff;
            z-index: 8;
            padding-top: 16px;
            box-sizing: content-box;
            i {
                font-size: 18px;
                color: #909399;
                margin-left: -3px;
            }

            &:hover i {
                color: $primary-color;
            }

            &.aside-hidden {
                left: -2px;
            }
        }

        .right-aside-toggle-bar {
            display: block;
            cursor: pointer;
            height: 36px;
            width: 12px;
            position: absolute;
            top: calc(50% - 18px);
            right: 298px;
            border-radius: 8px 0 0 8px;
            background: #fff;
            z-index: 8;
            padding-top: 16px;
            padding-right: -5px !important;
            box-sizing: content-box;
            i {
                font-size: 18px;
                color: #909399;
                position: relative;
                top: 3px;
                left: -4px;
            }

            &:hover i {
                color: $primary-color;
            }

            &.aside-hidden {
                right: -2px;
            }
        }
    }

    background: #fff;

    aside {
        margin: 0;
        padding: 0;
        background: inherit;
    }
}

.el-container.full-height {
    height: 100%;
    overflow-y: hidden;
}

.el-container.center-layout-container {
    min-width: 680px;
    border-left: 2px dotted #EBEEF5;
    border-right: 2px dotted #EBEEF5;
}

.el-header.main-header {
    border-bottom: 2px dotted #EBEEF5;
    height: 48px !important;
    line-height: 48px !important;
    min-width: 800px;
}

div.main-title {
    font-size: 18px;
    color: #242424;
    display: flex;
    align-items: center;
    justify-items: center;

    img {
        cursor: pointer;
        width: 36px;
        height: 36px;
    }

    span.bold {
        font-size: 20px;
        font-weight: 700;
        margin: 0 6px;
    }

    span.version-span {
        font-size: 14px;
        color: #101f1c;
        margin-left: 6px;
    }
}

.float-left {
    float: left;
}

.float-right {
    float: right;
}

.el-dropdown-link {
    margin-right: 12px;
    cursor: pointer;
}

div.external-link {
    display: flex;
    align-items: center;
    justify-content: center;

    a {
        font-size: 13px;
        text-decoration: none;
        margin-right: 10px;color: #606266;
    }
}

.el-header.toolbar-header {
    font-size: 14px;
    border-bottom: 1px dotted #CCCCCC;
    height: 42px !important;
}

.el-aside.side-panel {
    width: 260px !important;
    overflow-y: hidden;
}

.el-main.form-widget-main {
    padding: 0;
    position: relative;
    overflow-x: hidden;
}

:deep(.container-scroll-bar) {
    .el-scrollbar__wrap,
    .el-scrollbar__view {
        overflow-x: hidden;
    }
}
  // .el-container.main-container {
  //   background: #fff;

  //   :deep(aside) {  /* 防止aside样式被外部样式覆盖！！ */
  //     margin: 0;
  //     padding: 0;
  //     background: inherit;
  //   }
  // }

  // .el-container.full-height {
  //   height: 100%;
  //   overflow-y: hidden;
  // }

  // .el-container.center-layout-container {
  //   min-width: 680px;
  //   border-left: 2px dotted #EBEEF5;
  //   border-right: 2px dotted #EBEEF5;
  // }

  // .el-header.main-header {
  //   border-bottom: 2px dotted #EBEEF5;
  //   height: 48px !important;
  //   line-height: 48px !important;
  //   min-width: 800px;
  // }

  // div.main-title {
  //   font-size: 18px;
  //   color: #242424;
  //   display: flex;
  //   align-items: center;
  //   justify-items: center;

  //   img {
  //     cursor: pointer;
  //     width: 36px;
  //     height: 36px;
  //   }

  //   span.bold {
  //     font-size: 20px;
  //     font-weight: bold;
  //     margin: 0 6px 0 6px;
  //   }

  //   span.version-span {
  //     font-size: 14px;
  //     color: #101F1C;
  //     margin-left: 6px;
  //   }
  // }

  // .float-left {
  //   float: left;
  // }

  // .float-right {
  //   float: right;
  // }

  // .el-dropdown-link {
  //   margin-right: 12px;
  //   cursor: pointer;
  // }

  // div.external-link {
  //   display: flex;
  //   align-items: center;

  //   a {
  //     font-size: 13px;
  //     text-decoration: none;
  //     margin-right: 10px;
  //     color: #606266;
  //   }
  // }

  // .el-header.toolbar-header {
  //   font-size: 14px;
  //   border-bottom: 1px dotted #CCCCCC;
  //   height: 42px !important;
  //   //line-height: 42px !important;
  // }

  // .el-aside.side-panel {
  //   width: 260px !important;
  //   overflow-y: hidden;
  // }

  // .el-main.form-widget-main {
  //   padding: 0;

  //   position: relative;
  //   overflow-x: hidden;
  // }

  // .container-scroll-bar {
  //   :deep(.el-scrollbar__wrap), :deep(.el-scrollbar__view) {
  //     overflow-x: hidden;
  //   }
  // }
</style>
