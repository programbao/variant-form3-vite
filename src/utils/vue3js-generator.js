import {
  buildActiveTabs,
  buildDefaultValueListFn,
  buildFieldOptionsFn,
  buildRulesListFn, buildUploadDataFn,
  sfcTraverseFieldWidgets
} from "@/utils/vue2js-generator";
import {traverseFieldWidgets} from "@/utils/util";
function buildSubFormMethods(e) {
  let o = "";
  return e.find(r=>r.type === "sub-form" || r.type === "grid-sub-form") && (o = `
  methods.addSubFormRow=(widgetId)=>{
  state.formData[widgetId].push({})
 };

 methods.insertSubFormRow=(widgetId,sfrIdx)=>{
  state.formData[widgetId].splice(sfrIdx,0,{})
 };

 methods.deleteSubFormRow=(widgetId,sfrIdx)=>{
  state.formData[widgetId].splice(sfrIdx,1)
 };
 `),
  o
}
function buildDataTableMethods(e) {
  let o = "";
  return e.find(r=>r.type === "data-table") && (o = `
  methods.formatterValue=(row, column, cellValue)=> {
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
  }
 `),
  o
}
// export const genVue3JS = function (formConfig, widgetList) {
//   let defaultValueList = []
//   let rulesList = []
//   let fieldOptions = []
//   let uploadData = []
//   sfcTraverseFieldWidgets(widgetList, (widget) => {
//     buildDefaultValueListFn(formConfig, widgetList, defaultValueList)(widget)
//     buildRulesListFn(formConfig, widgetList, rulesList)(widget)
//     buildFieldOptionsFn(formConfig, widgetList, fieldOptions)(widget)
//     buildUploadDataFn(formConfig, widgetList, uploadData)(widget)
//   })
//   // traverseFieldWidgets(widgetList, (widget) => {
//   //   buildDefaultValueListFn(formConfig, widgetList, defaultValueList)(widget)
//   //   buildRulesListFn(formConfig, widgetList, rulesList)(widget)
//   //   buildFieldOptionsFn(formConfig, widgetList, fieldOptions)(widget)
//   //   buildUploadDataFn(formConfig, widgetList, uploadData)(widget)
//   // })

//   const activeTabs = buildActiveTabs(formConfig, widgetList)

//   const v3JSTemplate =
// `  import { defineComponent, toRefs, reactive, getCurrentInstance } from 'vue'
  
//   export default defineComponent({
//     components: {},
//     props: {},
//     setup() {
//       const state = reactive({
//         ${formConfig.modelName}: {
//           ${defaultValueList.join('\n')}
//         },
        
//         ${formConfig.rulesName}: {
//           ${rulesList.join('\n')}
//         },
        
//         ${activeTabs.join('\n')}
        
//         ${fieldOptions.join('\n')}
        
//         ${uploadData.join('\n')}
//       })
    
//       const instance = getCurrentInstance()
      
//       const submitForm = () => {
//         instance.proxy.$refs['vForm'].validate(valid => {
//           if (!valid) return
          
//           //TODO: 提交表单
//         })
//       }
      
//       const resetForm = () => {
//         instance.proxy.$refs['vForm'].resetFields()
//       }
      
//       return {
//         ...toRefs(state),
//         submitForm,
//         resetForm
//       }
//     }
//   })`

//   return v3JSTemplate
// }
export const genVue3JS = function(e, o) {
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
  return `  import { defineComponent, toRefs, reactive, getCurrentInstance } from 'vue'

export default defineComponent({
  components: {},
  props: {},
  setup() {
    const state = reactive({
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
    })
  
    const methods = {}
    
    const instance = getCurrentInstance()
    
    const submitForm = () => {
      instance.proxy.$refs['vForm'].validate(valid => {
        if (!valid) return
        
        //TODO: \u63D0\u4EA4\u8868\u5355
      })
    }
    
    const resetForm = () => {
      instance.proxy.$refs['vForm'].resetFields()
    }
    
    ${buildSubFormMethods(o)}
    ${buildDataTableMethods(o)}
    
    return {
      ...toRefs(state),
      ...methods,
      submitForm,
      resetForm
    }
  }
})`
};
