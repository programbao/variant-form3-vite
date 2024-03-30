import {isNotNull, traverseContainerWidgets, traverseFieldWidgets, traverseAllWidgets} from "@/utils/util";
import {translate} from "@/utils/i18n";
import FormValidators, {getRegExp} from "@/utils/validators";

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
// export function buildDefaultValueListFn(formConfig, widgetList, resultList) {
//   return function(fieldWidget) {
//     const fop = fieldWidget.options
//     const fd = fop.defaultValue
//     if (isNotNull(fd)) {
//       resultList.push(`${fop.name}: ${JSON.stringify(fd)},`)
//     } else {
//       resultList.push(`${fop.name}: null,`)
//     }
//   }
// }

// export function buildRulesListFn(formConfig, widgetList, resultList) {
//   return function(fieldWidget) {
//     const fop = fieldWidget.options
//     let fieldRules = []
//     if (!!fop.required) {
//       fieldRules.push(`{
//         required: true,
//         message: '${translate('render.hint.fieldRequired')}',
//       }`)
//     }

//     if (!!fop.validation) {
//       let vldName = fop.validation
//       if (!!FormValidators[vldName]) {
//         fieldRules.push(`{
//           pattern: ${eval( getRegExp(vldName) )},
//           trigger: ['blur', 'change'],
//           message: '${fop.validationHint}'
//         }`)
//       } else {
//         fieldRules.push(`{
//           pattern: '${eval(vldName)}',
//           trigger: ['blur', 'change'],
//           message: '${fop.validationHint}'
//         }`)
//       }
//     }

//     //TODO: 自定义校验函数

//     fieldRules.length > 0 && resultList.push(`${fop.name}: [${fieldRules.join(',')}],`)
//   }
// }

// export function buildFieldOptionsFn(formConfig, widgetList, resultList) {
//   return function(fieldWidget) {
//     const fop = fieldWidget.options
//     const ft = fieldWidget.type
//     if ((ft === 'radio') || (ft === 'checkbox') || (ft === 'select') || (ft === 'cascader')) {
//       resultList.push(`${fop.name}Options: ${JSON.stringify(fop.optionItems)},`)
//     }
//   }
// }
export function buildDefaultValueListFn(e, o, t) {
  return function(r) {
      const n = r.options
        , l = n.defaultValue;
      if (r.type === "sub-form" || r.type === "grid-sub-form") {
          let i = {};
          sfcTraverseSubformWidgets(r.widgetList, a=>{
              i[a.options.name] = a.options.defaultValue
          }
          ),
          t.push(`${n.name}: [${JSON.stringify(i)}],`)
      } else if (r.type === "data-table") {
          let i = {
              tableData: n.tableData,
              tableColumns: n.tableColumns
          };
          t.push(`${n.name}: ${JSON.stringify(i)},`)
      } else
          isNotNull(l) ? t.push(`${n.name}: ${JSON.stringify(l)},`) : t.push(`${n.name}: null,`)
  }
}
export function buildRulesListFn(formConfig, widgetList, resultList) {
  return function(fieldWidget) {
      const fop = fieldWidget.options;
      let fieldRules = [];
      if (fieldWidget.type !== "sub-form" && fieldWidget.type !== "grid-sub-form") {
          if (fop.required && fieldRules.push(`{
        required: true,
        message: '${translate("render.hint.fieldRequired")}',
      }`),
          fop.validation) {
              let vldName = fop.validation;
              FormValidators[vldName] ? fieldRules.push(`{
          pattern: ${eval(getRegExp(vldName))},
          trigger: ['blur', 'change'],
          message: '${fop.validationHint}'
        }`) : fieldRules.push(`{
          pattern: '${eval(vldName)}',
          trigger: ['blur', 'change'],
          message: '${fop.validationHint}'
        }`)
          }
          fieldRules.length > 0 && resultList.push(`${fop.name}: [${fieldRules.join(",")}],`)
      } else {
          let e = [];
          fieldWidget.widgetList.forEach(o=>{
              buildRulesListFn(formConfig, fieldWidget.widgetList, e)(o)
          }
          ),
          resultList.push(e)
      }
  }
}
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

// export function buildActiveTabs(formConfig, widgetList) {
//   let resultList = []
//   const handlerFn = function (cw) {
//     const cop = cw.options
//     const ct = cw.type
//     if (ct === 'tab') {
//       cw.tabs.length > 0 && resultList.push(`'${cop.name}ActiveTab': '${cw.tabs[0].options.name}',`)
//     }
//   }
//   traverseContainerWidgets(widgetList, handlerFn)

//   return resultList
// }
export function buildActiveTabs(e, o) {
  let t = [];
  return sfcTraverseContainerWidgets(o, function(n) {
      const l = n.options;
      n.type === "tab" && n.tabs.length > 0 && t.push(`'${l.name}ActiveTab': '${n.tabs[0].options.name}',`)
  }),
  t
}
// export const genVue2JS = function (formConfig, widgetList) {
//   let defaultValueList = []
//   let rulesList = []
//   let fieldOptions = []
//   let uploadData = []
//   traverseFieldWidgets(widgetList, (widget) => {
//     buildDefaultValueListFn(formConfig, widgetList, defaultValueList)(widget)
//     buildRulesListFn(formConfig, widgetList, rulesList)(widget)
//     buildFieldOptionsFn(formConfig, widgetList, fieldOptions)(widget)
//     buildUploadDataFn(formConfig, widgetList, uploadData)(widget)
//   })

//   const activeTabs = buildActiveTabs(formConfig, widgetList)

//   const v2JSTemplate =
// `  export default {
//     components: {},
//     props: {},
//     data() {
//       return {
//         ${formConfig.modelName}: {
//           ${defaultValueList.join('\n')}
//         },
        
//         ${formConfig.rulesName}: {
//           ${rulesList.join('\n')}
//         },
        
//         ${activeTabs.join('\n')}
        
//         ${fieldOptions.join('\n')}
        
//         ${uploadData.join('\n')}
//       }
//     },
//     computed: {},
//     watch: {},
//     created() {
//     },
//     mounted() {
//     },
//     methods: {
//       submitForm() {
//         this.$refs['vForm'].validate(valid => {
//           if (!valid) return
          
//           //TODO: 提交表单
//         })
//       },
      
//       resetForm() {
//         this.$refs['vForm'].resetFields()
//       }
//     }
//   }`

//   return v2JSTemplate
// }
function buildSubFormMethods$1(e) {
  let o = "";
  return e.find(r=>r.type === "sub-form" || r.type === "grid-sub-form") && (o = `
 addSubFormRow(widgetId){
  this.formData[widgetId].push({})
 },
 insertSubFormRow(widgetId,sfrIdx){
  this.formData[widgetId].splice(sfrIdx,0,{})
 },
 deleteSubFormRow(widgetId,sfrIdx){
  this.formData[widgetId].splice(sfrIdx,1)
 },
 `),
  o
}
function buildDataTableMethods$1(e) {
  let o = "";
  return e.find(r=>r.type === "data-table") && (o = `
  formatterValue(row, column, cellValue) {
    if (!cellValue) {
      return ''
    }

    let date=cellValue;      
    let v=cellValue;
    let y,m,d,res,length

    if(!!column.formatS) {
      switch(column.formatS) {
        case 'd1':
            if (new Date(Date.parse(date.replace(/-/g, "/"))) === "Invalid Date") {
              return date;
            }
            date = new Date(Date.parse(date.replace(/-/g, "/"))); //\u8F6C\u6362\u6210Date
            y = date.getFullYear();
            m = date.getMonth() + 1;
            m = m < 10 ? '0' + m : m;
            d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            return y + '-' + m + '-' + d;
        case 'd2':
          if (new Date(Date.parse(date.replace(/-/g, "/"))) === "Invalid Date") {
            return date;
          }
          date = new Date(Date.parse(date.replace(/-/g, "/"))); //\u8F6C\u6362\u6210Date
          y = date.getFullYear();
          m = date.getMonth() + 1;
          m = m < 10 ? '0' + m : m;
          d = date.getDate();
          d = d < 10 ? ('0' + d) : d;
          return y + '/' + m + '/' + d;
        case 'd3':
          if (new Date(Date.parse(date.replace(/-/g, "/"))) === "Invalid Date") {
            return date;
          }
          date = new Date(Date.parse(date.replace(/-/g, "/"))); //\u8F6C\u6362\u6210Date
          y = date.getFullYear();
          m = date.getMonth() + 1;
          m = m < 10 ? '0' + m : m;
          d = date.getDate();
          d = d < 10 ? ('0' + d) : d;
          return y + '\u5E74' + m + '\u6708' + d +'\u65E5';
        case 'd4':
          if (new Date(Date.parse(date.replace(/-/g, "/"))) === "Invalid Date"){
            return date;
          }
          date = new Date(Date.parse(date.replace(/-/g, "/"))); //\u8F6C\u6362\u6210Date
          return date.toLocaleString()
        case 'd5':
          if (new Date(Date.parse(date.replace(/-/g, "/"))) === "Invalid Date") {
            return date;
          }
          date = new Date(Date.parse(date.replace(/-/g, "/"))); //\u8F6C\u6362\u6210Data();
          return date.toLocaleString('chinese', { hour12: false })
        case 'n1':
          if (typeof(v) != "number") {
            return v;
          }
        
          length = v.toString().split(".")[1].length;
          switch(length){
            case 0:
                v = v.toFixed(0)
                break;
            case 1:
                v = v.toFixed(1)
                break;
            case 2:
                v = v.toFixed(2)
                break;
            case 3:
                v = v.toFixed(3)
                break;
            case 4:
                v = v.toFixed(4)
                break;
            case 5:
                v = v.toFixed(5)
                break;
            default:
                v = v.toFixed(6)
          }
          res = v.toString().replace(/d+/, function(n){ // \u5148\u63D0\u53D6\u6574\u6570\u90E8\u5206
            return n.replace(/(d)(?=(d{3})+$)/g,function($1){
              return $1+",";
              });
            })
          return res;
        case 'n2':
          if (typeof(v) != "number") {
            return v;
          }
        
          length = v.toString().split(".")[1].length;
          switch(length){
            case 0:
            case 1:
            case 2:
                v = v.toFixed(2)
                break;
            case 3:
                v = v.toFixed(3)
                break;
            case 4:
                v = v.toFixed(4)
                break;
            case 5:
                v = v.toFixed(5)
                break;
            default:
                v = v.toFixed(6)
          }
        
          res = v.toString().replace(/d+/, function(n){ // \u5148\u63D0\u53D6\u6574\u6570\u90E8\u5206
            return n.replace(/(d)(?=(d{3})+$)/g,function($1){
              return $1+",";
              });
            })
          return res;
        case 'n3':
          if (typeof(v) != "number") {
            return v;
          }
        
          v = v.toFixed(6)
          res = v.toString().replace(/d+/, function(n){ // \u5148\u63D0\u53D6\u6574\u6570\u90E8\u5206
            return n.replace(/(d)(?=(d{3})+$)/g,function($1){
              return $1+",";
              });
            })
          return res;
        case 'n4':
          if (typeof(v) != "number") {
            return v;
          }
        
          v = v.toFixed(3)
          res = v.toString().replace(/d+/, function(n){ // \u5148\u63D0\u53D6\u6574\u6570\u90E8\u5206
            return n.replace(/(d)(?=(d{3})+$)/g,function($1){
              return $1+",";
              });
            })
          return res;
        case 'n5':
          if (typeof(v) != "number") {
            return v;
          }
        
          v = v.toFixed(2)
          res = v.toString().replace(/d+/, function(n){ // \u5148\u63D0\u53D6\u6574\u6570\u90E8\u5206
            return n.replace(/(d)(?=(d{3})+$)/g,function($1){
              return $1+",";
              });
            })
          return res;
        case 'n6':
          if (typeof(v) != "number") {
            return v;
          }
        
          v = v.toFixed(0)
          res = v.toString().replace(/d+/, function(n){ // \u5148\u63D0\u53D6\u6574\u6570\u90E8\u5206
            return n.replace(/(d)(?=(d{3})+$)/g,function($1){
              return $1+",";
              });
            })
          return res;
        case 'n7':
          if (typeof(v) != "number") {
            return v;
          }
        
          length = v.toString().split(".")[1].length;
          v = v*100
          switch(length){
            case 0:
            case 1:
            case 2:
                v = v.toFixed(2)
                break;
            case 3:
                v = v.toFixed(3)
                break;
            default:
                v = v.toFixed(4)
          }
        
          res = v.toString().replace(/d+/, function(n){ // \u5148\u63D0\u53D6\u6574\u6570\u90E8\u5206
            return n.replace(/(d)(?=(d{3})+$)/g,function($1){
              return $1+",";
              });
            })
          return res+'%';
      }
    }
    return cellValue;
  },
 `),
  o
}
export const genVue2JS = function(e, o) {
  let t = []
    , r = []
    , n = []
    , l = [];
  sfcTraverseFieldWidgets(o, s=>{
      buildDefaultValueListFn(e, o, t)(s),
      buildRulesListFn(e, o, r)(s),
      buildFieldOptionsFn(e, o, n)(s),
      buildUploadDataFn(e, o, l)(s)
  }
  );
  const i = buildActiveTabs(e, o);
  return `  export default {
  components: {},
  props: {},
  data() {
    return {
      ${e.modelName}: {
        ${t.join(`
`)}
      },
      
      ${e.rulesName}: {
        ${r.join(`
`)}
      },
      
      ${i.join(`
`)}
      
      ${n.join(`
`)}
      
      ${l.join(`
`)}
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    ${buildSubFormMethods$1(o)}
    ${buildDataTableMethods$1(o)}
    
    submitForm() {
      this.$refs['vForm'].validate(valid => {
        if (!valid) return
        
        //TODO: \u63D0\u4EA4\u8868\u5355
      })
    },
    
    resetForm() {
      this.$refs['vForm'].resetFields()
    }
  }
}`
};