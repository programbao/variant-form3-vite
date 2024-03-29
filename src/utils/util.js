import Clipboard from 'clipboard'

export function isNull(value) {
  return (value === null) || (value === undefined);
}

export function isNotNull(value) {
  return (value !== null) && (value !== undefined);
}

export function isEmptyStr(str) {
  //return (str === undefined) || (!str) || (!/[^\s]/.test(str));
  return (str === undefined) || (!str && (str !== 0) && (str !== '0')) || (!/[^\s]/.test(str));
}

export const generateId = function() {
  return Math.floor(Math.random() * 100000 + Math.random() * 20000 + Math.random() * 5000);
};

export const deepClone = function (origin) {
  if (origin === undefined) {
    return undefined
  }

  return JSON.parse(JSON.stringify(origin))
}

export const overwriteObj = function(obj1, obj2) {  /* 浅拷贝对象属性，obj2覆盖obj1 */
  // for (let prop in obj2) {
  //   if (obj2.hasOwnProperty(prop)) {
  //     obj1[prop] = obj2[prop]
  //   }
  // }

  Object.keys(obj2).forEach(prop => {
    obj1[prop] = obj2[prop]
  })
}

/* 用Function对象实现eval函数功能 */
export const evalFn = function (fn, DSV = null, VFR = null) {
  let f = new Function('DSV', 'VFR', 'return ' + fn);
  return f(DSV, VFR);
};
export const  trimEx = function(e, o, t) {
  return o ? t === "left" ? e.replace(new RegExp("^\\" + o + "+","g"), "") : t === "right" ? e.replace(new RegExp("\\" + o + "+$","g"), "") : e.replace(new RegExp("^\\" + o + "+|\\" + o + "+$","g"), "") : e.replace(/^\s+|\s+$/g, "")
}
export const  hasPropertyOfObject = function(e, o) {
  const t = o.split(".");
  let r = e
    , n = !0;
  for (const l of t)
      if (r.hasOwnProperty(l))
          r = r[l];
      else {
          n = !1;
          break
      }
  return n
};
export function isDef(e) {
  return e != null
}
export const  getObjectValue = function(e, o) {
  const t = o.split(".");
  let r = e;
  return t.forEach(n=>{
      r = isDef(r) && isDef(r[n]) ? r[n] : null
  }
  ),
  r
}
export const  setObjectValue = function(e, o, t) {
  const r = o.split(".");
  let n = e;
  r.forEach((l,i)=>{
      if (!!l) {
          if (i === r.length - 1) {
              n[l] = t;
              return
          }
          n[l] === void 0 && (n[l] = {}),
          n = n[l]
      }
  }
  )
}
export const addWindowResizeHandler = function (handler) {
  let oldHandler = window.onresize
  if (typeof window.onresize != 'function') {
    window.onresize = handler
  } else {
    window.onresize = function () {
      oldHandler()
      handler()
    }
  }
}

const createStyleSheet = function() {
  let head = document.head || document.getElementsByTagName('head')[0];
  let style = document.createElement('style');
  style.type = 'text/css';
  head.appendChild(style);
  return style.sheet;
}

export const insertCustomCssToHead = function (cssCode, formId = '') {
  let head = document.getElementsByTagName('head')[0]
  let oldStyle = document.getElementById('vform-custom-css')
  if (!!oldStyle) {
    head.removeChild(oldStyle)  //先清除后插入！！
  }
  if (!!formId) {
    oldStyle = document.getElementById('vform-custom-css' + '-' + formId)
    !!oldStyle && head.removeChild(oldStyle)  //先清除后插入！！
  }

  let newStyle = document.createElement('style')
  newStyle.type = 'text/css'
  newStyle.rel = 'stylesheet'
  newStyle.id = !!formId ? 'vform-custom-css' + '-' + formId : 'vform-custom-css'
  try {
    newStyle.appendChild(document.createTextNode(cssCode))
  } catch(ex) {
    newStyle.styleSheet.cssText = cssCode
  }

  head.appendChild(newStyle)
}

export const insertGlobalFunctionsToHtml = function (functionsCode, formId = '') {
  let bodyEle = document.getElementsByTagName('body')[0]
  let oldScriptEle = document.getElementById('v_form_global_functions')
  !!oldScriptEle && bodyEle.removeChild(oldScriptEle)  //先清除后插入！！
  if (!!formId) {
    oldScriptEle = document.getElementById('v_form_global_functions' + '-' + formId)
    !!oldScriptEle && bodyEle.removeChild(oldScriptEle)  //先清除后插入！！
  }

  let newScriptEle = document.createElement('script')
  newScriptEle.id = !!formId ? 'v_form_global_functions' + '-' + formId : 'v_form_global_functions'
  newScriptEle.type = 'text/javascript'
  newScriptEle.innerHTML = functionsCode
  bodyEle.appendChild(newScriptEle)
}
export const deleteCustomStyleAndScriptNode = function(e, o) {
  const t = document.getElementsByTagName("head")[0];
  let r = document.getElementById("vform-custom-css-" + o);
  e && (r = document.getElementById("vform-custom-css")),
  r && t.removeChild(r);
  const n = document.getElementsByTagName("body")[0];
  let l = document.getElementById("v_form_global_functions-" + o);
  e && (l = document.getElementById("v_form_global_functions")),
  l && n.removeChild(l)
}
export const optionExists = function(optionsObj, optionName) {
  if (!optionsObj) {
    return false
  }

  return Object.keys(optionsObj).indexOf(optionName) > -1
}

export const loadRemoteScript = function(srcPath, callback) {  /*加载远程js，加载成功后执行回调函数*/
  let sid = encodeURIComponent(srcPath)
  let oldScriptEle = document.getElementById(sid)

  if (!oldScriptEle) {
    let s = document.createElement('script')
    s.src = srcPath
    s.id = sid
    document.body.appendChild(s)

    s.onload = s.onreadystatechange = function (_, isAbort) { /* 借鉴自ace.js */
      if (isAbort || !s.readyState || s.readyState === "loaded" || s.readyState === "complete") {
        s = s.onload = s.onreadystatechange = null
        if (!isAbort) {
          callback()
        }
      }
    }
  }
}

// export function traverseFieldWidgets(widgetList, handler, parent = null) {
//   if (!widgetList) {
//     return
//   }

//   widgetList.map(w => {
//     if (w.formItemFlag) {
//       handler(w, parent)
//     } else if (w.type === 'grid') {
//       w.cols.map(col => {
//         traverseFieldWidgets(col.widgetList, handler, w)
//       })
//     } else if (w.type === 'table') {
//       w.rows.map(row => {
//         row.cols.map(cell => {
//           traverseFieldWidgets(cell.widgetList, handler, w)
//         })
//       })
//     } else if (w.type === 'tab') {
//       w.tabs.map(tab => {
//         traverseFieldWidgets(tab.widgetList, handler, w)
//       })
//     } else if (w.type === 'sub-form' || w.type === "grid-sub-form") {
//       traverseFieldWidgets(w.widgetList, handler, w)
//     } else if (w.category === 'container') {  //自定义容器
//       traverseFieldWidgets(w.widgetList, handler, w)
//     }
//   })
// }
export function traverseFieldWidgets(e, o, t=null, r=false) {
  !e || e.map(n=>{
      n.formItemFlag || n.formItemFlag === !1 && r ? o(n, t) : n.type === "grid" ? n.cols.map(l=>{
          traverseFieldWidgets(l.widgetList, o, n, r)
      }
      ) : n.type === "table" ? n.rows.map(l=>{
          l.cols.map(i=>{
              traverseFieldWidgets(i.widgetList, o, n, r)
          }
          )
      }
      ) : n.type === "tab" ? n.tabs.map(l=>{
          traverseFieldWidgets(l.widgetList, o, n, r)
      }
      ) : (n.type === "sub-form" || n.type === "grid-sub-form" || n.category === "container") && traverseFieldWidgets(n.widgetList, o, n, r)
  }
  )
}
// export function traverseContainerWidgets(widgetList, handler) {
//   if (!widgetList) {
//     return
//   }

//   widgetList.map(w => {
//     if (w.category === 'container') {
//       handler(w)
//     }

//     if (w.type === 'grid') {
//       w.cols.map(col => {
//         traverseContainerWidgets(col.widgetList, handler)
//       })
//     } else if (w.type === 'table') {
//       w.rows.map(row => {
//         row.cols.map(cell => {
//           traverseContainerWidgets(cell.widgetList, handler)
//         })
//       })
//     } else if (w.type === 'tab') {
//       w.tabs.map(tab => {
//         traverseContainerWidgets(tab.widgetList, handler)
//       })
//     } else if (w.type === 'sub-form') {
//       traverseContainerWidgets(w.widgetList, handler)
//     } else if (w.category === 'container') {  //自定义容器
//       traverseContainerWidgets(w.widgetList, handler)
//     }
//   })
// }
export function traverseContainerWidgets(e, o) {
  !e || e.map(t=>{
      t.category === "container" && o(t),
      t.type === "grid" ? t.cols.map(r=>{
          traverseContainerWidgets(r.widgetList, o)
      }
      ) : t.type === "table" ? t.rows.map(r=>{
          r.cols.map(n=>{
              traverseContainerWidgets(n.widgetList, o)
          }
          )
      }
      ) : t.type === "tab" ? t.tabs.map(r=>{
          traverseContainerWidgets(r.widgetList, o)
      }
      ) : (t.type === "sub-form" || t.type === "grid-sub-form" || t.category === "container") && traverseContainerWidgets(t.widgetList, o)
  }
  )
}
export function traverseAllWidgets(widgetList, handler) {
  if (!widgetList) {
    return
  }

  widgetList.map(w => {
    handler(w)

    if (w.type === 'grid') {
      w.cols.map(col => {
        handler(col)
        traverseAllWidgets(col.widgetList, handler)
      })
    } else if (w.type === 'table') {
      w.rows.map(row => {
        row.cols.map(cell => {
          handler(cell)
          traverseAllWidgets(cell.widgetList, handler)
        })
      })
    } else if (w.type === 'tab') {
      w.tabs.map(tab => {
        traverseAllWidgets(tab.widgetList, handler)
      })
    } else if (w.type === 'sub-form' || w.type === "grid-sub-form") {
      traverseAllWidgets(w.widgetList, handler)
    } else if (w.category === 'container') {  //自定义容器
      traverseAllWidgets(w.widgetList, handler)
    }
  })
}

function handleWidgetForTraverse(widget, handler) {
  if (!!widget.category) {
    traverseFieldWidgetsOfContainer(widget, handler)
  } else if (widget.formItemFlag) {
    handler(widget)
  }
}

/**
 * 遍历容器内的字段组件
 * @param con
 * @param handler
 */
export function traverseFieldWidgetsOfContainer(con, handler) {
  if (con.type === 'grid') {
    con.cols.forEach(col => {
      col.widgetList.forEach(cw => {
        handleWidgetForTraverse(cw, handler)
      })
    })
  } else if (con.type === 'table') {
    con.rows.forEach(row => {
      row.cols.forEach(cell => {
        cell.widgetList.forEach(cw => {
          handleWidgetForTraverse(cw, handler)
        })
      })
    })
  } else if (con.type === 'tab') {
    con.tabs.forEach(tab => {
      tab.widgetList.forEach(cw => {
        handleWidgetForTraverse(cw, handler)
      })
    })
  } else if (con.type === 'sub-form' || con.type === "grid-sub-form") {
    con.widgetList.forEach(cw => {
      handleWidgetForTraverse(cw, handler)
    })
  } else if (con.category === 'container') {  //自定义容器
    con.widgetList.forEach(cw => {
      handleWidgetForTraverse(cw, handler)
    })
  }
}

export function handleContainerTraverse(e, o, t) {
  !!e.category && e.category === "container" ? traverseWidgetsOfContainer(e, o, t) : e.formItemFlag && o(e)
}
export function traverseWidgetsOfContainer(e, o, t) {
  e.category === "container" && t(e),
  e.type === "grid" ? e.cols.forEach(r=>{
      r.widgetList.forEach(n=>{
          handleContainerTraverse(n, o, t)
      }
      )
  }
  ) : e.type === "table" ? e.rows.forEach(r=>{
      r.cols.forEach(n=>{
          n.widgetList.forEach(l=>{
              handleContainerTraverse(l, o, t)
          }
          )
      }
      )
  }
  ) : e.type === "tab" ? e.tabs.forEach(r=>{
      r.widgetList.forEach(n=>{
          handleContainerTraverse(n, o, t)
      }
      )
  }
  ) : e.type === "sub-form" || e.type === "grid-sub-form" ? e.widgetList.forEach(r=>{
      handleContainerTraverse(r, o, t)
  }
  ) : e.category === "container" && e.widgetList.forEach(r=>{
      handleContainerTraverse(r, o, t)
  }
  )
}


/**
 * 获取所有字段组件
 * @param widgetList
 * @returns {[]}
 */
export function getAllFieldWidgets(widgetList) {
  if (!widgetList) {
    return []
  }

  let result = []
  let handlerFn = (w) => {
    result.push({
      type: w.type,
      name: w.options.name,
      field: w
    })
  }
  traverseFieldWidgets(widgetList, handlerFn)

  return result
}

/**
 * 获取所有容器组件
 * @param widgetList
 * @returns {[]}
 */
export function getAllContainerWidgets(widgetList) {
  if (!widgetList) {
    return []
  }

  let result = []
  let handlerFn = (w) => {
    result.push({
      type: w.type,
      name: w.options.name,
      container: w
    })
  }
  traverseContainerWidgets(widgetList, handlerFn)

  return result
}
export function getFieldWidgetByName(e, o, t) {
  if (!e)
      return null;
  let r = null;
  return traverseFieldWidgets(e, l=>{
      l.options.name === o && (r = l)
  }
  , null, t),
  r
}
export function getFieldWidgetById(e, o, t) {
  if (!e)
      return null;
  let r = null;
  return traverseFieldWidgets(e, l=>{
      l.id === o && (r = l)
  }
  , null, t),
  r
}
export function getContainerWidgetByName(e, o) {
  if (!e)
      return null;
  let t = null;
  return traverseContainerWidgets(e, n=>{
      n.options.name === o && (t = n)
  }
  ),
  t
}
export function copyToClipboard(content, clickEvent, $message, successMsg, errorMsg) {
  const clipboard = new Clipboard(clickEvent.target, {
    text: () => content
  })

  clipboard.on('success', () => {
    $message.success(successMsg)
    clipboard.destroy()
  })

  clipboard.on('error', () => {
    $message.error(errorMsg)
    clipboard.destroy()
  })

  clipboard.onClick(clickEvent)
}

export function getQueryParam(variable) {
  let query = window.location.search.substring(1);
  let vars = query.split("&")
  for (let i=0; i<vars.length; i++) {
    let pair = vars[i].split("=")
    if(pair[0] == variable) {
      return pair[1]
    }
  }

  return undefined;
}

export function getDefaultFormConfig() {
  return {
    modelName: 'formData',
    refName: 'vForm',
    rulesName: 'rules',
    labelWidth: 80,
    labelPosition: 'left',
    size: '',
    labelAlign: 'label-left-align',
    cssCode: '',
    customClass: [],
    functions: '',  //全局函数
    layoutType: 'PC',
    jsonVersion: 3,

    onFormCreated: '',
    onFormMounted: '',
    onFormDataChange: '',
  }
}

export function buildDefaultFormJson() {
  return {
    widgetList: [],
    formConfig: deepClone( getDefaultFormConfig() )
  }
}
export function cloneFormConfigWithoutEventHandler(e) {
  let o = deepClone(e);
  return o.onFormCreated = "",
  o.onFormMounted = "",
  o.onFormDataChange = "",
  o.onFormValidate = "",
  o
}
export function translateOptionItems(e, o, t, r) {
  if (o === "cascader")
      return deepClone(e);
  let n = [];
  return !!e && e.length > 0 && e.forEach(l=>{
      l.hasOwnProperty("disabled") ? n.push({
          label: l[t],
          value: l[r],
          disabled: l.disabled
      }) : n.push({
          label: l[t],
          value: l[r]
      })
  }
  ),
  n
}
export function assembleAxiosConfig(e, o, t) {
  let r = {};
  return !e || e.length <= 0 || (e.map(n=>{
      n.type === "String" ? r[n.name] = String(n.value) : n.type === "Number" ? r[n.name] = Number(n.value) : n.type === "Boolean" ? n.value.toLowerCase() === "false" || n.value === "0" ? r[n.name] = !1 : n.value.toLowerCase() === "true" || n.value === "1" ? r[n.name] = !0 : r[n.name] = null : n.type === "Variable" && (r[n.name] = evalFn(n.value, o, t))
  }
  ),
  console.log("test DSV: ", o),
  console.log("test VFR: ", t)),
  r
}
export function buildRequestConfig(e, o, t, r) {
  let n = {};
  return e.requestURLType === "String" ? n.url = e.requestURL : n.url = evalFn(e.requestURL, o, t),
  n.method = e.requestMethod,
  n.headers = assembleAxiosConfig(e.headers, o, t),
  n.params = assembleAxiosConfig(e.params, o, t),
  n.data = assembleAxiosConfig(e.data, o, t),
  new Function("config","isSandbox","DSV","VFR",e.configHandlerCode).call(null, n, r, o, t)
}
export async function runDataSourceRequest(e, o, t, r, n) {
  try {
      let l = buildRequestConfig(e, o, t, r)
        , i = await axios.request(l);
      return new Function("result","isSandbox","DSV","VFR",e.dataHandlerCode).call(null, i, r, o, t)
  } catch (l) {
      let i = new Function("error","isSandbox","DSV","$message","VFR",e.errorHandlerCode);
      return console.error(l),
      i.call(null, l, r, o, n, t)
  }
}
export function getDSByName(e, o) {
  let t = null;
  return !!o && !!e.dataSources && e.dataSources.forEach(r=>{
      r.uniqueName === o && (t = r)
  }
  ),
  t || console.error("DS not found: " + o),
  t
}