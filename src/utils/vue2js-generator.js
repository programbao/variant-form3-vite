import {isNotNull, traverseContainerWidgets, traverseFieldWidgets} from "@/utils/util";
import {translate} from "@/utils/i18n";
import FormValidators, {getRegExp} from "@/utils/validators";
export function emptyAttr(e, o) {
  return o ? `${e}="${o}"` : ""
}
export function sfcTraverseSubformWidgets(e, o) {
  e.forEach(t=>{
      o(t)
  }
  )
}
export function sfcTraverseFieldWidgets(e, o, t=null) {
  e.forEach(r=>{
      r.formItemFlag ? o(r, t) : r.type === "grid" ? r.cols.forEach(n=>{
          sfcTraverseFieldWidgets(n.widgetList, o, r)
      }
      ) : r.type === "table" ? r.rows.forEach(n=>{
          n.cols.forEach(l=>{
              sfcTraverseFieldWidgets(l.widgetList, o, r)
          }
          )
      }
      ) : r.type === "tab" ? r.tabs.forEach(n=>{
          sfcTraverseFieldWidgets(n.widgetList, o, r)
      }
      ) : r.type === "sub-form" || r.type === "grid-sub-form" || r.type === "data-table" ? o(r, t) : r.category === "container" && sfcTraverseFieldWidgets(r.widgetList, o, r)
  }
  )
}
export function sfcTraverseContainerWidgets(e, o) {
  e.forEach(t=>{
      t.category === "container" && o(t),
      t.type === "grid" ? t.cols.forEach(r=>{
          sfcTraverseContainerWidgets(r.widgetList, o)
      }
      ) : t.type === "table" ? t.rows.forEach(r=>{
          r.cols.forEach(n=>{
              sfcTraverseContainerWidgets(n.widgetList, o)
          }
          )
      }
      ) : t.type === "tab" ? t.tabs.forEach(r=>{
          sfcTraverseContainerWidgets(r.widgetList, o)
      }
      ) : t.type === "sub-form" || t.type === "grid-sub-form" ? traverseAllWidgets(t.widgetList, o) : t.category === "container" && sfcTraverseContainerWidgets(t.widgetList, o)
  }
  )
}
export function buildDefaultValueListFn(formConfig, widgetList, resultList) {
  return function(fieldWidget) {
    const fop = fieldWidget.options
    const fd = fop.defaultValue
    if (isNotNull(fd)) {
      resultList.push(`${fop.name}: ${JSON.stringify(fd)},`)
    } else {
      resultList.push(`${fop.name}: null,`)
    }
  }
}

export function buildRulesListFn(formConfig, widgetList, resultList) {
  return function(fieldWidget) {
    const fop = fieldWidget.options
    let fieldRules = []
    if (!!fop.required) {
      fieldRules.push(`{
        required: true,
        message: '${translate('render.hint.fieldRequired')}',
      }`)
    }

    if (!!fop.validation) {
      let vldName = fop.validation
      if (!!FormValidators[vldName]) {
        fieldRules.push(`{
          pattern: ${eval( getRegExp(vldName) )},
          trigger: ['blur', 'change'],
          message: '${fop.validationHint}'
        }`)
      } else {
        fieldRules.push(`{
          pattern: '${eval(vldName)}',
          trigger: ['blur', 'change'],
          message: '${fop.validationHint}'
        }`)
      }
    }

    //TODO: 自定义校验函数

    fieldRules.length > 0 && resultList.push(`${fop.name}: [${fieldRules.join(',')}],`)
  }
}

// export function buildFieldOptionsFn(formConfig, widgetList, resultList) {
//   return function(fieldWidget) {
//     const fop = fieldWidget.options
//     const ft = fieldWidget.type
//     if ((ft === 'radio') || (ft === 'checkbox') || (ft === 'select') || (ft === 'cascader')) {
//       resultList.push(`${fop.name}Options: ${JSON.stringify(fop.optionItems)},`)
//     }
//   }
// }
export function buildFieldOptionsFn(e, o, t) {
  return function(r) {
      const n = r.options
        , l = r.type;
      if (l === "radio" || l === "checkbox" || l === "select" || l === "cascader")
          t.push(`${n.name}Options: ${JSON.stringify(n.optionItems)},`);
      else if (l === "sub-form" || l === "grid-sub-form") {
          let i = [];
          r.widgetList.forEach(a=>{
              buildFieldOptionsFn(e, n.widgetList, i)(a)
          }
          ),
          t.push(...i)
      } else if (l === "grid") {
          let i = [];
          r.cols.forEach(a=>{
              a.widgetList.forEach(s=>{
                  buildFieldOptionsFn(e, n.widgetList, i)(s)
              }
              )
          }
          ),
          t.push(...i)
      }
  }
}
export function buildUploadDataFn(formConfig, widgetList, resultList) {
  return function(fieldWidget) {
    const fop = fieldWidget.options
    const ft = fieldWidget.type
    if ((ft === 'picture-upload') || (ft === 'file-upload')) {
      resultList.push(`${fop.name}FileList: [],`)
      resultList.push(`${fop.name}UploadHeaders: {},`)
      resultList.push(`${fop.name}UploadData: {},`)
    }
  }
}

export function buildActiveTabs(formConfig, widgetList) {
  let resultList = []
  const handlerFn = function (cw) {
    const cop = cw.options
    const ct = cw.type
    if (ct === 'tab') {
      cw.tabs.length > 0 && resultList.push(`'${cop.name}ActiveTab': '${cw.tabs[0].options.name}',`)
    }
  }
  traverseContainerWidgets(widgetList, handlerFn)

  return resultList
}

export const genVue2JS = function (formConfig, widgetList) {
  let defaultValueList = []
  let rulesList = []
  let fieldOptions = []
  let uploadData = []
  traverseFieldWidgets(widgetList, (widget) => {
    buildDefaultValueListFn(formConfig, widgetList, defaultValueList)(widget)
    buildRulesListFn(formConfig, widgetList, rulesList)(widget)
    buildFieldOptionsFn(formConfig, widgetList, fieldOptions)(widget)
    buildUploadDataFn(formConfig, widgetList, uploadData)(widget)
  })

  const activeTabs = buildActiveTabs(formConfig, widgetList)

  const v2JSTemplate =
`  export default {
    components: {},
    props: {},
    data() {
      return {
        ${formConfig.modelName}: {
          ${defaultValueList.join('\n')}
        },
        
        ${formConfig.rulesName}: {
          ${rulesList.join('\n')}
        },
        
        ${activeTabs.join('\n')}
        
        ${fieldOptions.join('\n')}
        
        ${uploadData.join('\n')}
      }
    },
    computed: {},
    watch: {},
    created() {
    },
    mounted() {
    },
    methods: {
      submitForm() {
        this.$refs['vForm'].validate(valid => {
          if (!valid) return
          
          //TODO: 提交表单
        })
      },
      
      resetForm() {
        this.$refs['vForm'].resetFields()
      }
    }
  }`

  return v2JSTemplate
}
