import { traverseFieldWidgetsOfContainer, traverseWidgetsOfContainer } from "@/utils/util";

export default {
  inject: ['getFormConfig', 'getGlobalDsv'],
  computed: {
    customClass() {
      return this.widget.options.customClass || ''
    },

    formModel: {
      cache: false,
      get() {
        return this.globalModel.formModel
      }
    },

  },
  mounted() {
    this.callSetHidden()
  },

  methods: {
    cloneWidgetSchema(e) {
      return deepClone(e)
    },
    unregisterFromRefList() {  //销毁容器组件时注销组件ref
      if ((this.refList !== null) && !!this.widget.options.name) {
        let oldRefName = this.widget.options.name
        delete this.refList[oldRefName]
      }
    },

    /* 主动触发setHidden()方法，以清空被隐藏容器内字段组件的校验规则！！ */
    callSetHidden() {
      if (this.widget.options.hidden === true) {
        this.setHidden(true)
      }
    },

    //--------------------- 以下为组件支持外部调用的API方法 begin ------------------//
    /* 提示：用户可自行扩充这些方法！！！ */
    setHidden(e) {
      this.widget.options.hidden = e;
      const o = n=>{
          let l = n.options.name
            , i = this.getWidgetRef(l);
          e && !!i && !!i.clearFieldRules && i.clearFieldRules(),
          !e && !!i && !!i.buildFieldRules && i.buildFieldRules()
      }
      ;
      let t = [];
      const r = n=>{
          (n.type === "sub-form" || n.type === "grid-sub-form") && t.push(n)
      }
      ;
      traverseWidgetsOfContainer(this.widget, o, r),
      t.forEach(n=>{
          const l = this.getWidgetRef(n.options.name);
          if (l) {
              const i = l.getRowIdData()
                , a = s=>{
                  !!i && i.length > 0 && i.forEach(d=>{
                      const c = s.options.name + "@row" + d
                        , u = this.getWidgetRef(c);
                      e && !!u && !!u.clearFieldRules && u.clearFieldRules(),
                      !e && !!u && !!u.buildFieldRules && u.buildFieldRules()
                  }
                  )
              }
              ;
              traverseFieldWidgetsOfContainer(l.widget, a)
          }
      }
      )
  },

    // setHidden(flag) {
    //   this.widget.options.hidden = flag

    //   /* 容器被隐藏后，需要同步清除容器内部字段组件的校验规则 */
    //   let clearRulesFn = (fieldWidget) => {
    //     let fwName = fieldWidget.options.name
    //     let fwRef = this.getWidgetRef(fwName)
    //     if (flag && !!fwRef && !!fwRef.clearFieldRules) {
    //       fwRef.clearFieldRules()
    //     }

    //     if (!flag && !!fwRef && !!fwRef.buildFieldRules) {
    //       fwRef.buildFieldRules()
    //     }
    //   }

    //   traverseFieldWidgetsOfContainer(this.widget, clearRulesFn)
    // },
    setDisabled(e) {
      const o = r=>{
          const n = r.options.name
            , l = this.getWidgetRef(n);
          !!l && !!l.setDisabled && l.setDisabled(e)
      }
        , t = r=>{
          if (r.id === this.widget.id)
              return;
          const n = r.options.name
            , l = this.getWidgetRef(n);
          !!l && !!l.setDisabled && l.setDisabled(e)
      }
      ;
      traverseWidgetsOfContainer(this.widget, o, t)
    },
    activeTab(tabIndex) { //tabIndex从0计数
      if ((tabIndex >= 0) && (tabIndex < this.widget.tabs.length)) {
        this.widget.tabs.forEach((tp, idx) => {
          tp.options.active = idx === tabIndex
          if (idx === tabIndex) {
            this.activeTabName = tp.options.name
          }
        })
      }
    },

    disableTab(tabIndex) {
      if ((tabIndex >= 0) && (tabIndex < this.widget.tabs.length)) {
        this.widget.tabs[tabIndex].options.disabled = true
      }
    },

    enableTab(tabIndex) {
      if ((tabIndex >= 0) && (tabIndex < this.widget.tabs.length)) {
        this.widget.tabs[tabIndex].options.disabled = false
      }
    },

    hideTab(tabIndex) {
      if ((tabIndex >= 0) && (tabIndex < this.widget.tabs.length)) {
        this.widget.tabs[tabIndex].options.hidden = true
      }
    },

    showTab(tabIndex) {
      if ((tabIndex >= 0) && (tabIndex < this.widget.tabs.length)) {
        this.widget.tabs[tabIndex].options.hidden = false
      }
    },

    setWidgetOption(optionName, optionValue) { //通用组件选项修改API
      if (this.widget.options.hasOwnProperty(optionName)) {
        this.widget.options[optionName] = optionValue
      }
    },

    /**
     * 获取子表单的行数
     */
    getSubFormRowCount() {
      return !this.rowIdData ? 0 : this.rowIdData.length
    },
    setGridSubFormRowDisabled(e, o) {
      const t = n=>{
          const l = n.options.name + "@row" + e
            , i = this.getWidgetRef(l);
          !!i && !!i.setDisabled && i.setDisabled(o)
      }
        , r = n=>{
          const l = n.options.name + "@row" + e
            , i = this.getWidgetRef(l);
          !!i && !!i.setDisabled && i.setDisabled(o)
      }
      ;
      traverseWidgetsOfContainer(this.widget, t, r)
  },
  disableSubFormRow(e) {
    this.widget.type === "sub-form" ? this.widget.widgetList.forEach(o=>{
        let t = o.options.name + "@row" + this.rowIdData[e]
          , r = this.getWidgetRef(t);
        !!r && !!r.setDisabled && r.setDisabled(!0)
    }
    ) : this.widget.type === "grid-sub-form" && this.setGridSubFormRowDisabled(this.rowIdData[e], !0)
},
enableSubFormRow(e) {
    this.widget.type === "sub-form" ? this.widget.widgetList.forEach(o=>{
        let t = o.options.name + "@row" + this.rowIdData[e]
          , r = this.getWidgetRef(t);
        !!r && !!r.setDisabled && r.setDisabled(!1)
    }
    ) : this.widget.type === "grid-sub-form" && this.setGridSubFormRowDisabled(this.rowIdData[e], !1)
},
disableSubForm() {
    this.widget.options.disabled = !0,
    this.widget.widgetList.forEach(e=>{
        e.options.disabled = !0
    }
    ),
    this.rowIdData.length > 0 && this.rowIdData.forEach((e,o)=>{
        this.disableSubFormRow(o)
    }
    ),
    this.actionDisabled = !0
},
enableSubForm() {
    this.widget.options.disabled = !1,
    this.widget.widgetList.forEach(e=>{
        e.options.disabled = !1
    }
    ),
    this.rowIdData.length > 0 && this.rowIdData.forEach((e,o)=>{
        this.enableSubFormRow(o)
    }
    ),
    this.actionDisabled = !1
},
disableGridSubFormRow(e) {
    let o = []
      , t = r=>{
        o.push(r)
    }
    ;
    traverseFieldWidgetsOfContainer(this.widget, t),
    o.forEach(r=>{
        let n = r.options.name + "@row" + this.rowIdData[e]
          , l = this.getWidgetRef(n);
        !!l && !!l.setDisabled && l.setDisabled(!0)
    }
    )
},
enableGridSubFormRow(e) {
    let o = []
      , t = r=>{
        o.push(r)
    }
    ;
    traverseFieldWidgetsOfContainer(this.widget, t),
    o.forEach(r=>{
        let n = r.options.name + "@row" + this.rowIdData[e]
          , l = this.getWidgetRef(n);
        !!l && !!l.setDisabled && l.setDisabled(!1)
    }
    )
},
disableGridSubForm() {
    traverseFieldWidgetsOfContainer(this.widget, e=>{
        e.options.disabled = !0
    }
    ),
    this.rowIdData.length > 0 && this.rowIdData.forEach((e,o)=>{
        this.disableGridSubFormRow(o)
    }
    ),
    this.actionDisabled = !0
},
enableGridSubForm() {
    traverseFieldWidgetsOfContainer(this.widget, e=>{
        e.options.disabled = !1
    }
    ),
    this.rowIdData.length > 0 && this.rowIdData.forEach((e,o)=>{
        this.enableGridSubFormRow(o)
    }
    ),
    this.actionDisabled = !1
},
resetSubForm() {
    if (this.widget.type === "sub-form" || this.widget.type === "grid-sub-form") {
        let e = this.formModel[this.widget.options.name];
        e && (e.splice(0, e.length),
        this.rowIdData.splice(0, this.rowIdData.length)),
        this.widget.options.showBlankRow && this.addSubFormRow()
    }
},
getSubFormValues(e=!0) {
    if (this.widget.type === "sub-form" || this.widget.type === "grid-sub-form")
        return this.formModel[this.widget.options.name];
    this.$message.error(this.i18nt("render.hint.nonSubFormType"))
},
setSubFormValues(e) {},
    // disableSubFormRow(rowIndex) {
    //   this.widget.widgetList.forEach(subWidget => {
    //     let swRefName = subWidget.options.name + '@row' + this.rowIdData[rowIndex]
    //     let foundSW = this.getWidgetRef(swRefName)
    //     if (!!foundSW) {
    //       foundSW.setDisabled(true)
    //     }
    //   })
    // },

    // enableSubFormRow(rowIndex) {
    //   this.widget.widgetList.forEach(subWidget => {
    //     let swRefName = subWidget.options.name + '@row' + this.rowIdData[rowIndex]
    //     let foundSW = this.getWidgetRef(swRefName)
    //     if (!!foundSW) {
    //       foundSW.setDisabled(false)
    //     }
    //   })
    // },

    // disableSubForm() {
    //   if (this.rowIdData.length > 0) {
    //     this.rowIdData.forEach((dataRow, rIdx) => {
    //       this.disableSubFormRow(rIdx)
    //     })
    //   }

    //   //禁用3个操作按钮
    //   this.actionDisabled = true
    // },

    // enableSubForm() {
    //   if (this.rowIdData.length > 0) {
    //     this.rowIdData.forEach((dataRow, rIdx) => {
    //       this.enableSubFormRow(rIdx)
    //     })
    //   }

    //   //启用3个操作按钮
    //   this.actionDisabled = false
    // },

    // resetSubForm() { //重置subForm数据为空
    //   if (this.widget.type === 'sub-form') {
    //     let subFormModel = this.formModel[this.widget.options.name]
    //     if (!!subFormModel) {
    //       subFormModel.splice(0, subFormModel.length)
    //       this.rowIdData.splice(0, this.rowIdData.length)
    //     }

    //     if (this.widget.options.showBlankRow) {
    //       this.addSubFormRow()
    //     }
    //   }
    // },

    // getSubFormValues(needValidation = true) {
    //   if (this.widget.type === 'sub-form') {
    //     //TODO: 逐行校验子表单！！
    //     return this.formModel[this.widget.options.name]
    //   } else {
    //     this.$message.error(this.i18nt('render.hint.nonSubFormType'))
    //   }
    // },

    // validateField(fieldName) { //逐行校验子表单字段
    //   //TODO:
    // },
    //
    // validateSubForm() { //逐行校验子表单全部字段
    //   //TODO:
    // },

    /**
     * 动态增加自定义css样式
     * @param className
     */
    addCssClass(className) {
      if (!this.widget.options.customClass) {
        this.widget.options.customClass = [className]
      } else {
        this.widget.options.customClass.push(className)
      }
    },

    /**
     * 动态移除自定义css样式
     * @param className
     */
    removeCssClass(className) {
      if (!this.widget.options.customClass) {
        return
      }

      let foundIdx = -1
      this.widget.options.customClass.map((cc, idx) => {
        if (cc === className) {
          foundIdx = idx
        }
      })
      if (foundIdx > -1) {
        this.widget.options.customClass.splice(foundIdx, 1)
      }
    },

    //--------------------- 以上为组件支持外部调用的API方法 end ------------------//

  },

}
