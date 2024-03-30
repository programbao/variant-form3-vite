import {isNotNull, generateId} from "@/utils/util";
import {genVue2JS} from "@/utils/vue2js-generator";
import {beautifierOpts} from "@/utils/beautifierLoader";
import {genVue3JS} from "@/utils/vue3js-generator";

export function buildClassAttr(ctn, defaultClass) {
  const cop = ctn.options
  let gridClassArray = []
  !!defaultClass && gridClassArray.push(defaultClass)
  !!cop.customClass && (cop.customClass.length > 0) && gridClassArray.push(cop.customClass.join(' '))
  return gridClassArray.length > 0 ? `class="${gridClassArray.join(' ')}"` : ''
}
export function getCustomLabel(e) {
  let o = [];
  return e.options.labelIconClass ? (o.push('<span class="custom-label">'),
  e.options.labelIconPosition === "front" ? o.push(`<el-tooltip content="${e.options.labelTooltip}" effect="light"><i class="${e.options.labelIconClass}"></i></el-tooltip>${e.options.label}`) : o.push(`<i class="${e.options.labelIconClass}"></i>${e.options.label}`),
  o.push("</span>")) : o.push(`<span title="${e.options.labelTooltip || ""}">${e.options.label}</span>`),
  o.join("")
}
export function emptyAttr(e, o) {
  return o ? `${e}="${o}"` : ""
}
function getLabelAlign(e, o) {
  return o.options.labelAlign || e.options.labelAlign
}
function buildSubFormFieldWidget(e, o, t, r=!1) {
  let n = e.options;
  n.labelHidden || n.label,
  n.labelHidden || n.labelWidth && "" + n.labelWidth,
  n.labelTooltip && "" + n.labelTooltip,
  "" + n.name;
  let l = [];
  !!n.required && l.push("required"),
  !!n.customClass && n.customClass.length > 0 && l.push(n.customClass.join(" ")),
  n.labelAlign ? n.labelAlign !== "label-left-align" && l.push(n.labelAlign) : e.formItemFlag && o.labelAlign !== "label-left-align" && l.push(o.labelAlign),
  e.formItemFlag || l.push("static-content-item");
  let i = `<template #label><span class="custom-label">${n.labelIconPosition === "front" ? n.labelTooltip ? `<el-tooltip content="${n.labelTooltip}" effect="light"><i class="${n.labelIconClass}"></i></el-tooltip>${n.label}` : `<i class="${n.labelIconClass}"></i>${n.label}` : n.labelTooltip ? `${n.label}<el-tooltip content="${n.labelTooltip}" effect="light"><i class="${n.labelIconClass}"></i></el-tooltip>` : `${n.label}<i class="${n.labelIconClass}"></i>`}
</span></template>`;
  !n.labelIconClass && (i = "");
  const a = elTemplates[e.type] ? elTemplates[e.type](e, o, t) : null;
  return e.formItemFlag,
  n.hidden,
  `${i} ${a}`
}
// const containerTemplates = {  //容器组件属性
//   'grid': (ctn, formConfig) => {
//     const gridClassAttr = buildClassAttr(ctn)
//     const gridTemplate =
// `<el-row ${gridClassAttr}>
// ${ctn.cols.map(col => {
//   const colOpt = col.options
//   const spanAttr = !!colOpt.responsive ? '' : `:span="${colOpt.span}"`
//   const mdAttr = !colOpt.responsive ? '' : `:md="${colOpt.md}"`
//   const smAttr = !colOpt.responsive ? '' : `:sm="${colOpt.sm}"`
//   const xsAttr = !colOpt.responsive ? '' : `:xs="${colOpt.xs}"`
//   const offsetAttr = !!colOpt.offset ? `:offset="${colOpt.offset}"` : ''
//   const pushAttr = !!colOpt.push ? `:push="${colOpt.push}"` : ''
//   const pullAttr = !!colOpt.pull ? `:pull="${colOpt.pull}"` : ''
//   const colClassAttr = buildClassAttr(col, 'grid-cell')
//   return `<el-col ${spanAttr} ${mdAttr} ${smAttr} ${xsAttr} ${offsetAttr} ${pushAttr} ${pullAttr} ${colClassAttr}>
//     ${col.widgetList.map(cw => {
//         if (cw.category === 'container') {
//           return buildContainerWidget(cw, formConfig)
//         } else {
//           return buildFieldWidget(cw, formConfig)
//         }
//       }).join('')
//     }
//     </el-col>`
//   }).join('')
// }
// </el-row>`

//     return gridTemplate
//   },

//   'table': (ctn, formConfig) => {
//     const tableClassAttr = buildClassAttr(ctn, 'table-layout')
//     const tableTemplate =
// `<div class="table-container">
//   <table ${tableClassAttr}><tbody>
//   ${ctn.rows.map(tr => {
//       return `<tr>${
//           tr.cols.filter(td => !td.merged).map(td => {
//             const tdOpt = td.options
//             const tdClassAttr = buildClassAttr(td, 'table-cell')
//             const colspanAttr = (!isNaN(tdOpt.colspan) && (tdOpt.colspan !== 1)) ? `colspan="${tdOpt.colspan}"` : ''
//             const rowspanAttr = (!isNaN(tdOpt.rowspan) && (tdOpt.rowspan !== 1)) ? `rowspan="${tdOpt.rowspan}"` : ''

//             let tdStyleArray = []
//             !!tdOpt.cellWidth && tdStyleArray.push('width: ' + tdOpt.cellWidth + ' !important')
//             !!tdOpt.cellHeight && tdStyleArray.push('height: ' + tdOpt.cellHeight + ' !important')
//             let tdStyleAttr = (tdStyleArray.length > 0) ? `style="${tdStyleArray.join(';')}"` : ''

//             return `<td ${tdClassAttr} ${colspanAttr} ${rowspanAttr} ${tdStyleAttr}>${td.widgetList.map(tw => {
//                           if (tw.category === 'container') {
//                             return buildContainerWidget(tw, formConfig)
//                           } else {
//                             return buildFieldWidget(tw, formConfig)
//                           }
//                         }).join('')
//                         }
//                     </td>`
//           }).join('')
//       }</tr>`
//     }).join('')
//   }
//   </tbody></table>
// </div>`
//     return tableTemplate
//   },

//   'tab': (ctn, formConfig) => {
//     const tabClassAttr = buildClassAttr(ctn)
//     const vModel = ctn.tabs && (ctn.tabs.length > 0) ? `v-model="${ctn.options.name}ActiveTab"` : ''
//     const tabTemplate =
// `<div class="tab-container">
//   <el-tabs ${vModel} type="${ctn.displayType}" ${tabClassAttr}>
//     ${ctn.tabs.map(tab => {
//       const tabOpt = tab.options
//       const disabledAttr = (tabOpt.disabled === true) ? `disabled` : ''
//       return `<el-tab-pane name="${tabOpt.name}" label="${tabOpt.label}" ${disabledAttr}>
//         ${tab.widgetList.map(tw => {
//           if (tw.category === 'container') {
//             return buildContainerWidget(tw, formConfig)
//           } else {
//             return buildFieldWidget(tw, formConfig)
//           }
//         }).join('')
//       }</el-tab-pane>`
//     }).join('')}
//   </el-tabs>
// </div>`

//     return tabTemplate
//   },

//   'sub-form': (ctn, formConfig) => {
//     //TODO:
//   },

// }
const rowId = ()=>`id${generateId()}`
  , containerTemplates = {
    grid: (e,o,t=!1)=>`<el-row ${buildClassAttr(e)}>
${e.cols.map(l=>{
        const i = l.options
          , a = i.responsive ? "" : `:span="${i.span}"`
          , s = i.responsive ? `:md="${i.md}"` : ""
          , d = i.responsive ? `:sm="${i.sm}"` : ""
          , c = i.responsive ? `:xs="${i.xs}"` : ""
          , u = i.offset ? `:offset="${i.offset}"` : ""
          , m = i.push ? `:push="${i.push}"` : ""
          , f = i.pull ? `:pull="${i.pull}"` : ""
          , g = buildClassAttr(l, "grid-cell");
        return `<el-col ${a} ${s} ${d} ${c} ${u} ${m} ${f} ${g}>
    ${l.widgetList.map(v=>v.category === "container" ? buildContainerWidget(v, o, t) : buildFieldWidget(v, o, t)).join("")}
    </el-col>`
    }
    ).join("")}
</el-row>`,
    table: (e,o,t=!1)=>`<div class="table-container">
  <table ${buildClassAttr(e, "table-layout")}><tbody>
  ${e.rows.map(l=>`<tr>${l.cols.filter(i=>!i.merged).map(i=>{
        const a = i.options
          , s = buildClassAttr(i, "table-cell")
          , d = !isNaN(a.colspan) && a.colspan !== 1 ? `colspan="${a.colspan}"` : ""
          , c = !isNaN(a.rowspan) && a.rowspan !== 1 ? `rowspan="${a.rowspan}"` : "";
        let u = [];
        !!a.cellWidth && u.push("width: " + a.cellWidth + " !important"),
        !!a.cellHeight && u.push("height: " + a.cellHeight + " !important");
        let m = u.length > 0 ? `style="${u.join(";")}"` : "";
        return `<td ${s} ${d} ${c} ${m}>${i.widgetList.map(f=>f.category === "container" ? buildContainerWidget(f, o, t) : buildFieldWidget(f, o, t)).join("")}
                    </td>`
    }
    ).join("")}</tr>`).join("")}
  </tbody></table>
</div>`,
    tab: (e,o,t=!1)=>{
        const r = buildClassAttr(e);
        return `<div class="tab-container">
  <el-tabs ${e.tabs && e.tabs.length > 0 ? `v-model="${e.options.name}ActiveTab"` : ""} type="${e.displayType}" ${r}>
    ${e.tabs.map(i=>{
            const a = i.options
              , s = a.disabled === !0 ? "disabled" : "";
            return `<el-tab-pane name="${a.name}" label="${a.label}" ${s}>
        ${i.widgetList.map(d=>d.category === "container" ? buildContainerWidget(d, o, t) : buildFieldWidget(d, o, t)).join("")}</el-tab-pane>`
        }
        ).join("")}
  </el-tabs>
</div>`
    }
    ,
    "sub-form": (e,o,t=!1)=>{
        const r = buildClassAttr(e);
        return `<div class="container-wrapper"  ${emptyAttr("class", r)}>
      <div key="${e.id}" class="sub-form-container">
        <el-row class="header-row">
        <div class="action-header-column">
          <span class="action-label">\u64CD\u4F5C</span>
          <el-button round type="primary" size="mini" class="action-button" @click="addSubFormRow('${e.id}')" title="\u65B0\u589E\u884C">\u65B0\u589E${t ? ' <Plus style="width:1em; height:1em;" />' : '<i class="el-icon-plus el-icon-right"></i>'}
          </el-button>
        </div>

          ${e.widgetList.map(l=>`<div key="${l.id + "thc"}" class="field-header-column"
           
            ${emptyAttr("class", (getLabelAlign(e, l),
        l.options.required ? "is-required" : ""))}
            style="width: ${l.options.columnWidth}">
              ${getCustomLabel(l)}                        
            </div>`).join("")}
        </el-row>   

        ${(()=>{
            let l = [];
            return l.push(`<el-row class="sub-form-row" v-for="(subWidget,sfrIdx) in formData.${e.id}" :key="sfrIdx">`),
            l.push(`<div class="sub-form-action-column hide-label">
            <div class="action-button-column">
              <el-button circle type="" ${t ? 'icon="Plus"' : 'icon="el-icon-circle-plus-outline"'} @click="insertSubFormRow('${e.id}',sfrIdx)"
                         title="\u63D2\u5165\u884C"></el-button>
              <el-button circle type="" ${t ? 'icon="Delete"' : 'icon="el-icon-delete"'} @click="deleteSubFormRow('${e.id}',sfrIdx)"
                         title="\u5220\u9664\u884C"></el-button>
              <span class="row-number-span">#{{sfrIdx+1}}</span>
            </div>
          </div>`),
            e.widgetList.map((i,a)=>{
                l.push(`<div class="sub-form-table-column hide-label" key="${i.id + "tc" + rowId()}"  style="width: ${i.options.columnWidth}">`),
                l.push(buildSubFormFieldWidget(i, o, e)),
                l.push("</div>")
            }
            ),
            l.push("</el-row>"),
            l.join("")
        }
        )()} 
      </div> 
    </div>`
    }
    ,
    "grid-sub-form": (e,o,t=!1)=>{
        const r = buildClassAttr(e);
        return `<div class="container-wrapper"  ${emptyAttr("class", r)}>
      <div key="${e.id}" class="sub-form-container">
        <el-row class="header-row">
        <div class="grid-sub-form action-header-column">
          <span class="action-label">\u64CD\u4F5C</span>
          <el-button  round type="primary" size="mini" class="action-button" @click="addSubFormRow('${e.id}')" 
          title="\u65B0\u589E\u884C">\u65B0\u589E${t ? ' <Plus style="width:1em; height:1em;" />' : '<i class="el-icon-plus el-icon-right"></i>'}
          </el-button>
        </div>
        </el-row>

        ${(()=>{
            letl = [];
            return l.push(`<div class="grid-sub-form sub-form-row" v-for="(subWidget,sfrIdx) in formData.${e.id}" :key="sfrIdx">`),
            l.push(`<div class="grid-sub-form sub-form-action-column hide-label">
            <div class="action-button-column">
              <el-button circle type="" ${t ? 'icon="Plus"' : 'icon="el-icon-circle-plus-outline"'} @click="insertSubFormRow('${e.id}',sfrIdx)"
                         title="\u63D2\u5165\u884C"></el-button>
              <el-button circle type="" ${t ? 'icon="Delete"' : 'icon="el-icon-delete"'} @click="deleteSubFormRow('${e.id}',sfrIdx)"
                         title="\u5220\u9664\u884C"></el-button>
              <span class="row-number-span">#{{sfrIdx+1}}</span>
            </div>
          </div>`),
            l.push('<div class="grid-sub-form grid-sub-form-data-row">'),
            e.widgetList.map(i=>{
                l.push(containerTemplates.grid(i, o, e, t))
            }
            ).join(""),
            l.push("  </div>"),
            l.push("</div>"),
            l.join("")
        }
        )()} 
      </div> 
    </div>`
    }
    ,
    "data-table": (e,o,t=!1)=>{
        const r = buildClassAttr(e, "container-wrapper")
          , n = ()=>e.options.buttonsColumnFixed === void 0 ? "right" : e.options.buttonsColumnFixed ? e.options.buttonsColumnFixed : !1
          , l = ()=>e.options.smallPagination ? "prev, pager, next" : "total, prev, pager, next, jumper";
        return `<div ${r}>
    <el-table ref="dataTable" :data="formData.${e.id}.tableData" ${emptyAttr("class", e.options.customClass.toString().replace(/,/g, " "))}
								height="${e.options.tableHeight}" :style="{width: '${e.options.tableWidth}'}"
								:border="${e.options.border}" :show-summary="${e.options.showSummary}"
								size="${e.options.tableSize}" :stripe="${e.options.stripe}"
                :highlight-current-row="${!e.options.showCheckBox}"              
								:cell-style="{padding: '${e.options.rowSpacing + "px 0"} '}" >

      ${(()=>e.options.showIndex ? ' <el-table-column  type="index" width="50" fixed="left"></el-table-column>' : "")()}
     
      ${(()=>e.options.showCheckBox ? `<el-table-column type="selection" :width="${e.options.showSummary ? 55 : 50}"  fixed="left"></el-table-column>` : "")()}


      ${(()=>{
            let a = [];
            return e.options.tableColumns.forEach((s,d)=>{
                a.push(`<el-table-column 
                      prop="${s.prop}"
                      label="${s.label}"
                      ${emptyAttr(":sortable", s.sortable)}
                      ${s.fixed ? "fixed" : ":fixed"}="${s.fixed ? s.fixed : "false"}"
                      align="${s.align ? s.align : "center"}"
                      :formatter="formatterValue"
                      ${emptyAttr("format", s.format)}
                      :show-overflow-tooltip="true"
                      :min-width="${s.width}"
                      >`),
                s.formatS === "render" && !!s.render ? (a.push(`<template ${t ? '#default="scope">' : 'slot-scope="scope">'}`),
                a.push("\u81EA\u5B9A\u4E49render"),
                a.push("</template>")) : s.formatS ? (a.push(`<template ${t ? '#default="scope">' : 'slot-scope="scope">'}`),
                a.push(`<span>{{formatterValue(scope.row, formData.${e.id}.tableColumns[${d}], scope.row['${s.prop}'])}}</span>`),
                a.push("</template>")) : (a.push(`<template ${t ? '#default="scope">' : 'slot-scope="scope">'}`),
                a.push(`<span>{{scope.row['${s.prop}']}}</span>`),
                a.push("</template>")),
                a.push("</el-table-column>")
            }
            ),
            a.join("")
        }
        )()}

      
      ${(()=>e.options.showButtonsColumn ? `
            <el-table-column fixed="${n()}"
                            class-name="data-table-buttons-column" align="'center'"
                            label="${e.options.buttonsColumnTitle}"
                            :width="${e.options.buttonsColumnWidth}">
              <template #default="scope">
                  ${(()=>{
            leta = [];
            for (lets = 0; s < e.options.operationButtons.length; s++) {
                letd = e.options.operationButtons[s];
                d.hidden || a.push(`<el-button type="${d.type}" size="${d.size}" :round="${d.round}"
                          :disabled="${d.disabled}"
                          :class="['${"data-table-" + d.name + "-button"}']">${d.label}</el-button>`)
            }
            return a.join("")
        }
        )()}
              </template>
            </el-table-column>
        ` : "")()}

			</el-table>

      ${(()=>{
            if (e.options.showPagination)
                return `
              <el-pagination :small="${e.options.smallPagination}"
                            ${t ? 'current-page="1"' : ':current-page="1"'}
                            :page-sizes="[10,20,50,100]"
                            :page-size="10"
                            layout="${l()}"
                            :total="${e.options.tableData.length}">
              </el-pagination>
         `
        }
        )()}

    </div>`
    }
};
export function buildContainerWidget(widget, formConfig) {
  return containerTemplates[widget.type] ? containerTemplates[widget.type](widget, formConfig) : null
}

function getElAttrs(widget, formConfig) {  //获取El组件属性
  let wop = widget.options
  return {
    vModel: `v-model="${formConfig.modelName}.${wop.name}"`,
    readonly: wop.readonly ? `readonly="true"` : '',
    disabled: wop.disabled ? `:disabled="true"` : '',
    size: !!wop.size ? `size="${wop.size}"` : '',
    type: !!wop.type ? `type="${wop.type === 'number' ? 'text' : wop.type}"` : '',
    showPassword: !!wop.showPassword ? `:show-password="${wop.showPassword}"` : '',
    placeholder: !!wop.placeholder ? `placeholder="${wop.placeholder}"` : '',
    rows: (isNotNull(wop.rows) && !isNaN(wop.rows)) ? `rows="${wop.rows}"` : '',
    clearable: !!wop.clearable ? 'clearable' : '',
    minlength: (isNotNull(wop.minLength) && !isNaN(wop.minLength)) ? `:minlength="${wop.minLength}"` : '',
    maxlength: (isNotNull(wop.maxLength) && !isNaN(wop.maxLength)) ? `:maxlength="${wop.maxLength}"` : '',
    showWordLimit: !!wop.showWordLimit ? `:show-word-limit="true"`: '',
    prefixIcon: !!wop.prefixIcon ? `prefix-icon="${wop.prefixIcon}"` : '',
    suffixIcon: !!wop.suffixIcon ? `suffix-icon="${wop.suffixIcon}"` : '',
    controlsPosition: wop.controlsPosition === 'right' ? `controls-position="right"` : '',
    min: (isNotNull(wop.min) && !isNaN(wop.min)) ? `:min="${wop.min}"` : '',
    max: (isNotNull(wop.max) && !isNaN(wop.max)) ? `:max="${wop.max}"` : '',
    precision: (isNotNull(wop.precision) && !isNaN(wop.precision)) ? `:precision="${wop.precision}"` : '',
    step: (isNotNull(wop.step) && !isNaN(wop.step)) ? `:step="${wop.step}"` : '',
    filterable: !!wop.filterable ? `filterable` : '',
    allowCreate: !!wop.allowCreate ? `allow-create` : '',
    defaultFirstOption: (!!wop.filterable && !!wop.allowCreate) ? `default-first-option` : '',
    multiple: !!wop.multiple ? `multiple` : '',
    multipleLimit: (!isNaN(wop.multipleLimit) && (wop.multipleLimit > 0)) ? `:multiple-limit="${wop.multipleLimit}"` : '',
    automaticDropdown: !!wop.automaticDropdown ? `automatic-dropdown` : '',
    remote: !!wop.remote ? `remote` : '',
    format: !!wop.format ? `format="${wop.format}"` : '',
    valueFormat: !!wop.valueFormat ? `value-format="${wop.valueFormat}"` : '',
    editable: !!wop.editable ? `:editable="${wop.editable}"` : '',
    startPlaceholder: !!wop.startPlaceholder ? `start-placeholder="${wop.startPlaceholder}"` : '',
    endPlaceholder: !!wop.endPlaceholder ? `end-placeholder="${wop.endPlaceholder}"` : '',

    activeText: !!wop.activeText ? `active-text="${wop.activeText}"` : '',
    inactiveText: !!wop.inactiveText ? `inactive-text="${wop.inactiveText}"` : '',
    activeColor: !!wop.activeColor ? `active-color="${wop.activeColor}"` : '',
    inactiveColor: !!wop.inactiveColor ? `inactive-color="${wop.inactiveColor}"` : '',
    switchWidth: (!isNaN(wop.switchWidth) && (wop.switchWidth !== 40)) ? `:width="${wop.switchWidth}"` : '',

    rateMax: (!isNaN(wop.max) && (wop.max !== 5)) ? `:max="${wop.max}"` : '',
    lowThreshold: (!isNaN(wop.lowThreshold) && (wop.lowThreshold !== 2)) ? `:low-threshold="${wop.lowThreshold}"` : '',
    highThreshold: (!isNaN(wop.highThreshold) && (wop.highThreshold !== 4)) ? `:high-threshold="${wop.highThreshold}"` : '',
    allowHalf: !!wop.allowHalf ? `allow-half` : '',
    showText: !!wop.showText ? `show-text` : '',
    showScore: !!wop.showScore ? `show-score` : '',

    sliderMin: (!isNaN(wop.min) && (wop.min !== 0)) ? `:min="${wop.min}"` : '',
    sliderMax: (!isNaN(wop.max) && (wop.max !== 100)) ? `:max="${wop.max}"` : '',
    sliderStep: (!isNaN(wop.step) && (wop.step !== 1)) ? `:step="${wop.step}"` : '',
    sliderRange: !!wop.range ? `range` : '',
    sliderVertical: !!wop.vertical ? `vertical` : '',

    uploadAction: !!wop.uploadURL ? `action="${wop.uploadURL}"` : '',
    withCredentials: !!wop.withCredentials ? `with-credentials` : '',
    multipleSelect: !!wop.multipleSelect ? `multiple` : '',
    showFileList: !!wop.showFileList ? `show-file-list` : '',
    limit: !isNaN(wop.limit) ? `:limit="${wop.limit}"` : '',
    uploadTipSlotChild: !!wop.uploadTip ? `<template #tip><div class="el-upload__tip">${wop.uploadTip}</div></template>` : '',
    pictureUploadIconChild: `<template #default><i class="el-icon-plus"></i></template>`,
    fileUploadIconChild: `<template #default><i class="el-icon-plus"></i></template>`,

    buttonType: !!wop.type ? `type="${wop.type}"` : '',
    buttonPlain: !!wop.plain ? `plain` : '',
    buttonRound: !!wop.round ? `round` : '',
    buttonCircle: !!wop.circle ? `circle` : '',
    buttonIcon: !!wop.icon ? `icon="${wop.icon}"` : '',

    contentPosition: (!!wop.contentPosition && (wop.contentPosition !== 'center')) ? `content-position="${wop.contentPosition}"` : '',

    appendButtonChild: !!wop.appendButton ? `<template #append><el-button class="${wop.buttonIcon}" ${!!wop.appendButtonDisabled ? 'disabled' : ''}></el-button></template>` : '',
  }
}

function buildRadioChildren(widget, formConfig) {
  let wop = widget.options
  const childTag = !!wop.buttonStyle ? 'el-radio-button' : 'el-radio'
  const borderAttr = !!wop.border ? `border` : ''
  const styleAttr = `style="{display: ${wop.displayStyle}}"`
  return `<${childTag} v-for="(item, index) in ${wop.name}Options" :key="index" :label="item.value"
          :disabled="item.disabled" ${borderAttr} ${styleAttr}>{{item.label}}</${childTag}>`
}

function buildCheckboxChildren(widget, formConfig) {
  let wop = widget.options
  const childTag = !!wop.buttonStyle ? 'el-checkbox-button' : 'el-checkbox'
  const borderAttr = !!wop.border ? `border` : ''
  const styleAttr = `style="{display: ${wop.displayStyle}}"`
  return `<${childTag} v-for="(item, index) in ${wop.name}Options" :key="index" :label="item.value"
          :disabled="item.disabled" ${borderAttr} ${styleAttr}>{{item.label}}</${childTag}>`
}

function buildSelectChildren(widget, formConfig) {
  let wop = widget.options
  const childTag = 'el-option'
  return `<${childTag} v-for="(item, index) in ${wop.name}Options" :key="index" :label="item.label"
          :value="item.value" :disabled="item.disabled"></${childTag}>`
}

const elTemplates = {  //字段组件属性
  'input': (widget, formConfig) => {
    const {vModel, readonly, disabled, size, type, showPassword, placeholder, clearable,
      minlength, maxlength, showWordLimit, prefixIcon, suffixIcon, appendButtonChild} = getElAttrs(widget, formConfig)
    return `<el-input ${vModel} ${readonly} ${disabled} ${size} ${type} ${showPassword} ${placeholder} ${clearable}
            ${minlength} ${maxlength} ${showWordLimit} ${prefixIcon} ${suffixIcon}>${appendButtonChild}</el-input>`
  },

  'textarea': (widget, formConfig) => {
    const {vModel, readonly, disabled, size, type, showPassword, placeholder, rows, clearable,
      minlength, maxlength, showWordLimit} = getElAttrs(widget, formConfig)
    return `<el-input type="textarea" ${vModel} ${readonly} ${disabled} ${size} ${type} ${showPassword} ${placeholder}
            ${rows} ${clearable} ${minlength} ${maxlength} ${showWordLimit}></el-input>`
  },

  'number': (widget, formConfig) => {
    const {vModel, disabled, size, type, showPassword, placeholder, controlsPosition, min, max, precision, step
      } = getElAttrs(widget, formConfig)
    return `<el-input-number ${vModel} class="full-width-input" ${disabled} ${size} ${type} ${showPassword}
            ${placeholder} ${controlsPosition} ${min} ${max} ${precision} ${step}></el-input-number>`
  },

  'radio': (widget, formConfig) => {
    const {vModel, disabled, size} = getElAttrs(widget, formConfig)
    const radioOptions = buildRadioChildren(widget, formConfig)
    return `<el-radio-group ${vModel} ${disabled} ${size}>${radioOptions}</el-radio-group>`
  },

  'checkbox': (widget, formConfig) => {
    const {vModel, disabled, size} = getElAttrs(widget, formConfig)
    const checkboxOptions = buildCheckboxChildren(widget, formConfig)
    return `<el-checkbox-group ${vModel} ${disabled} ${size}>${checkboxOptions}</el-checkbox-group>`
  },

  'select': (widget, formConfig) => {
    const {vModel, disabled, size, clearable, filterable, allowCreate, defaultFirstOption, automaticDropdown,
      multiple, multipleLimit, remote, placeholder} = getElAttrs(widget, formConfig)
    const selectOptions = buildSelectChildren(widget, formConfig)
    return `<el-select ${vModel} class="full-width-input" ${disabled} ${size} ${clearable} ${filterable}
            ${allowCreate} ${defaultFirstOption} ${automaticDropdown} ${multiple} ${multipleLimit} ${placeholder}
            ${remote}>${selectOptions}</el-select>`
  },

  'time': (widget, formConfig) => {
    const {vModel, readonly, disabled, size, placeholder, clearable, format, editable
      } = getElAttrs(widget, formConfig)
    return `<el-time-picker ${vModel} class="full-width-input" ${readonly} ${disabled} ${size} ${format}
            value-format="HH:mm:ss" ${placeholder} ${clearable} ${editable}></el-time-picker>`
  },

  'time-range': (widget, formConfig) => {
    const {vModel, readonly, disabled, size, startPlaceholder, endPlaceholder, clearable, format, editable
      } = getElAttrs(widget, formConfig)
    return `<el-time-picker is-range ${vModel} class="full-width-input" ${readonly} ${disabled} ${size} ${format}
            value-format="HH:mm:ss" ${startPlaceholder} ${endPlaceholder} ${clearable} ${editable}></el-time-picker>`
  },

  'date': (widget, formConfig) => {
    const {vModel, readonly, disabled, size, type, placeholder, clearable, format, valueFormat, editable
      } = getElAttrs(widget, formConfig)
    return `<el-date-picker ${vModel} ${type} class="full-width-input" ${readonly} ${disabled} ${size} ${format}
              ${valueFormat} ${placeholder} ${clearable} ${editable}></el-date-picker>`
  },

  'date-range': (widget, formConfig) => {
    const {vModel, readonly, disabled, size, type, startPlaceholder, endPlaceholder, clearable, format, valueFormat, editable
      } = getElAttrs(widget, formConfig)
    return `<el-date-picker is-range ${vModel} ${type} class="full-width-input" ${readonly} ${disabled} ${size} ${format}
            ${valueFormat} ${startPlaceholder} ${endPlaceholder} ${clearable} ${editable}></el-date-picker>`
  },

  'switch': (widget, formConfig) => {
    const {vModel, disabled, activeText, inactiveText, activeColor, inactiveColor, switchWidth
      } = getElAttrs(widget, formConfig)
    return `<el-switch ${vModel} ${disabled} ${activeText} ${inactiveText} ${activeColor} ${inactiveColor}
            ${switchWidth}></el-switch>`
  },

  'rate': (widget, formConfig) => {
    const {vModel, disabled, rateMax, lowThreshold, highThreshold, allowHalf, showText,
      showScore} = getElAttrs(widget, formConfig)
    return `<el-rate ${vModel} ${disabled} ${rateMax} ${lowThreshold} ${highThreshold} ${allowHalf}
            ${showText} ${showScore}></el-rate>`
  },

  'color': (widget, formConfig) => {
    const {vModel, disabled, size
      } = getElAttrs(widget, formConfig)
    return `<el-color-picker ${vModel} ${disabled} ${size}></el-color-picker>`
  },

  'slider': (widget, formConfig) => {
    const {vModel, disabled, sliderMin, sliderMax, sliderStep, sliderRange, sliderVertical
      } = getElAttrs(widget, formConfig)
    return `<el-slider ${vModel} ${disabled} ${sliderMin} ${sliderMax} ${sliderStep} ${sliderRange}
            ${sliderVertical}></el-slider>`
  },

  'picture-upload': (widget, formConfig) => {
    const {vModel, disabled, uploadAction, withCredentials, multipleSelect, showFileList, limit,
      uploadTipSlotChild, pictureUploadIconChild} = getElAttrs(widget, formConfig)
    let wop = widget.options
    return `<el-upload :file-list="${wop.name}FileList" :headers="${wop.name}UploadHeaders" :data="${wop.name}UploadData" 
            ${disabled} ${uploadAction} list-type="picture-card" ${withCredentials} ${multipleSelect} ${showFileList} 
            ${limit}>${uploadTipSlotChild} ${pictureUploadIconChild}</el-upload>`
  },

  'file-upload': (widget, formConfig) => {
    const {vModel, disabled, uploadAction, withCredentials, multipleSelect, showFileList, limit,
      uploadTipSlotChild, fileUploadIconChild} = getElAttrs(widget, formConfig)
    let wop = widget.options
    return `<el-upload :file-list="${wop.name}FileList" :headers="${wop.name}UploadHeaders" :data="${wop.name}UploadData" 
            ${disabled} ${uploadAction} list-type="picture-card" ${withCredentials} ${multipleSelect} ${showFileList} 
            ${limit}>${uploadTipSlotChild} ${fileUploadIconChild}</el-upload>`
  },

  'rich-editor': (widget, formConfig) => {
    const {vModel, disabled, placeholder
    } = getElAttrs(widget, formConfig)
    return `<vue-editor ${vModel} ${disabled} ${placeholder}></vue-editor>`
  },

  'cascader': (widget, formConfig) => {
    const {vModel, disabled, size, clearable, filterable, placeholder} = getElAttrs(widget, formConfig)
    let wop = widget.options
    const optionsAttr = `:options="${wop.name}Options"`
    return `<el-cascader ${vModel} class="full-width-input" ${optionsAttr} ${disabled} ${size} ${clearable}
            ${filterable} ${placeholder}></el-cascader>`
  },

  'static-text': (widget, formConfig) => {
    return `<div>${widget.options.textContent}</div>`
  },

  'html-text': (widget, formConfig) => {
    return `<div v-html="${widget.options.htmlContent}"></div>`
  },

  'button': (widget, formConfig) => {
    const {buttonType, buttonPlain, buttonRound, buttonCircle, buttonIcon, disabled} = getElAttrs(widget, formConfig)
    return `<el-button ${buttonType} ${buttonPlain} ${buttonRound} ${buttonCircle} ${buttonIcon}
            ${disabled}>${widget.options.label}</el-button>`
  },

  'divider': (widget, formConfig) => {
    const {contentPosition} = getElAttrs(widget, formConfig)
    return `<el-divider direction="horizontal" ${contentPosition}></el-divider>`
  },

}

export function buildFieldWidget(widget, formConfig) {
  let wop = widget.options
  const label = wop.labelHidden ? '' : wop.label
  const labelWidthAttr = wop.labelHidden ? `label-width="0"` : (!!wop.labelWidth ? `label-width="${wop.labelWidth}px"` : '')
  const labelTooltipAttr = wop.labelTooltip ? `title="${wop.labelTooltip}"` : ''
  const propAttr = `prop="${wop.name}"`

  let classArray = []
  !!wop.required && classArray.push('required')
  !!wop.customClass && (wop.customClass.length > 0) && classArray.push(wop.customClass.join(' '))
  if (!!wop.labelAlign) {
    wop.labelAlign !== 'label-left-align' && classArray.push(wop.labelAlign)
  } else if (!!widget.formItemFlag) {
    //classArray.push(formConfig.labelAlign || 'label-left-align')
    formConfig.labelAlign !== 'label-left-align' && classArray.push(formConfig.labelAlign)
  }
  if (!widget.formItemFlag) {
    classArray.push('static-content-item')
  }
  const classAttr = (classArray.length > 0) ? `class="${classArray.join(' ')}"` : ''

  let customLabelDom =
`<template #label><span class="custom-label">${wop.labelIconPosition === 'front' ?
  (!!wop.labelTooltip ?
      `<el-tooltip content="${wop.labelTooltip}" effect="light"><i class="${wop.labelIconClass}"></i></el-tooltip>${wop.label}` :
      `<i class="${wop.labelIconClass}"></i>${wop.label}`
  )
  :
  (!!wop.labelTooltip ?
      `${wop.label}<el-tooltip content="${wop.labelTooltip}" effect="light"><i class="${wop.labelIconClass}"></i></el-tooltip>` :
      `${wop.label}<i class="${wop.labelIconClass}"></i>`
  )
}
</span></template>`
  !wop.labelIconClass && (customLabelDom = '')

  const fwDom = elTemplates[widget.type] ? elTemplates[widget.type](widget, formConfig) : null
  const isFormItem = !!widget.formItemFlag
  const vShowAttr = !!wop.hidden ? `v-show="false"` : ''
  return isFormItem ?
`<el-form-item label="${label}" ${labelWidthAttr} ${labelTooltipAttr} ${propAttr} ${classAttr}>
  ${customLabelDom}
  ${fwDom}
</el-form-item>`
      :
`<div ${classAttr} ${vShowAttr}>${fwDom}</div>`
}

function genTemplate(formConfig, widgetList, vue3Flag = false) {
  const submitAttr = !!vue3Flag ? `@submit.prevent` : `@submit.native.prevent`
  let childrenList = []
  widgetList.forEach(wgt => {
    if (wgt.category === 'container') {
      childrenList.push( buildContainerWidget(wgt, formConfig) )
    } else {
      childrenList.push( buildFieldWidget(wgt, formConfig) )
    }
  })

  const formTemplate =
`  <el-form :model="${formConfig.modelName}" ref="${formConfig.refName}" :rules="${formConfig.rulesName}"
    label-position="${formConfig.labelPosition}" label-width="${formConfig.labelWidth}px" size="${formConfig.size || 'default'}"
    ${submitAttr}>
  ${!!childrenList ? childrenList.join('\n') : ''}
</el-form>`

  return formTemplate
}

// const genGlobalCSS = function (formConfig) {
//   const globalCssTemplate =
// `  .el-input-number.full-width-input, .el-cascader.full-width-input {
//     width: 100% !important;
//   }
  
//   .el-form-item--medium {
//     .el-radio {
//       line-height: 36px !important;
//     }
  
//     .el-rate{
//       margin-top: 8px;
//     }
//   }

//   .el-form-item--small {
//     .el-radio {
//       line-height: 32px !important;
//     }
  
//     .el-rate{
//       margin-top: 6px;
//     }
//   }

//   .el-form-item--mini {
//     .el-radio {
//       line-height: 28px !important;
//     }
  
//     .el-rate{
//       margin-top: 4px;
//     }
//   }
  
//   .clear-fix:before, .clear-fix:after {
//     display: table;
//     content: "";
//   }

//   .clear-fix:after {
//     clear: both;
//   }

//   .float-right {
//     float: right;
//   }

// ${formConfig.cssCode}`

//   return globalCssTemplate
// }

// const genScopedCSS = function (formConfig, vue3Flag = false) {
//   //const vDeep = !!vue3Flag ? `::v-deep` : `:deep`
//   const cssTemplate =
// `  div.table-container {
//     table.table-layout {
//       width: 100%;
//       table-layout: fixed;
//       border-collapse: collapse;
      
//       td.table-cell {
//         display: table-cell;
//         height: 36px;
//         border: 1px solid #e1e2e3;
//       }
//     }
//   }
  
//   div.tab-container {
//   }
  
//   .label-left-align ${!!vue3Flag ? `:deep(.el-form-item__label)` : `::v-deep .el-form-item__label`} {
//     text-align: left;
//   }

//   .label-center-align ${!!vue3Flag ? `:deep(.el-form-item__label)` : `::v-deep .el-form-item__label`} {
//     text-align: center;
//   }

//   .label-right-align ${!!vue3Flag ? `:deep(.el-form-item__label)` : `::v-deep .el-form-item__label`} {
//     text-align: right;
//   }
  
//   .custom-label {
//   }
  
//   .static-content-item {
//     min-height: 20px;
//     display: flex;
//     align-items: center;

//     ${!!vue3Flag ? `:deep(.el-divider--horizontal)` : `::v-deep .el-divider--horizontal`} {
//       margin: 0;
//     }
//   }`

//   return cssTemplate
// }
const genGlobalCSS = function(e) {
  return `  .el-input-number.full-width-input, .el-cascader.full-width-input {
  width: 100% !important;
}

.el-form-item--medium {
  .el-radio {
    line-height: 36px !important;
  }

  .el-rate{
    margin-top: 8px;
  }
}

.el-form-item--small {
  .el-radio {
    line-height: 32px !important;
  }

  .el-rate{
    margin-top: 6px;
  }
}

.el-form-item--mini {
  .el-radio {
    line-height: 28px !important;
  }

  .el-rate{
    margin-top: 4px;
  }
}

.clear-fix:before, .clear-fix:after {
  display: table;
  content: "";
}

.clear-fix:after {
  clear: both;
}

.float-right {
  float: right;
}

${e.cssCode}`
}
, genScopedCSS = function(e, o=!1) {
  return `  div.table-container {
  table.table-layout {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
    
    td.table-cell {
      display: table-cell;
      height: 36px;
      border: 1px solid #e1e2e3;
    }
  }
}

div.tab-container {
}

.label-left-align ${o ? ":deep(.el-form-item__label)" : "::v-deep .el-form-item__label"} {
  text-align: left;
}

.label-center-align ${o ? ":deep(.el-form-item__label)" : "::v-deep .el-form-item__label"} {
  text-align: center;
}

.label-right-align ${o ? ":deep(.el-form-item__label)" : "::v-deep .el-form-item__label"} {
  text-align: right;
}

.custom-label {
}

.static-content-item {
  min-height: 20px;
  display: flex;
  align-items: center;

  ${o ? ":deep(.el-divider--horizontal)" : "::v-deep .el-divider--horizontal"} {
    margin: 0;
  }
}`
}
, genSubformScopedCSS = function(e, o=!1) {
  return ` 
.sub-form-container {
  margin-bottom: 8px;
  text-align: left; //IE\u6D4F\u89C8\u5668\u5F3A\u5236\u5C45\u5DE6\u5BF9\u9F50

  ${o ? ":deep(.el-row)" : "::v-deep .el-row"}.header-row {
    padding: 0;
    display: flex;
  }
  
  ${o ? ":deep(.el-form-item)" : "::v-deep .el-form-item"} {
  margin-bottom: 0;
}
${o ? ":deep(.el-row)" : "::v-deep .el-row"}.sub-form-row {
    padding: 0;
    display: flex;

    .row-number-span {
      margin-left: 16px;
    }
  }
}

div.action-header-column {
  display: inline-block;
  width: 120px;
  border: 1px solid #e1e2e3;
  background: #f1f2f3;
  padding: 8px;

  .action-label {
    margin-right: 12px;
  }

  .action-button {
    padding-left: 8px;
    padding-right: 8px;
  }
}

div.field-header-column {
  display: inline-block;
  //overflow: hidden;
  //white-space: nowrap;  //\u6587\u5B57\u8D85\u51FA\u957F\u5EA6\u4E0D\u81EA\u52A8\u6362\u884C
  //text-overflow: ellipsis;  //\u6587\u5B57\u8D85\u51FA\u957F\u5EA6\u663E\u793A\u7701\u7565\u53F7
  border: 1px solid #e1e2e3;
  background: #f1f2f3;
  padding: 8px;

  span.custom-label i {
    margin: 0 3px;
  }
}

div.field-header-column.is-required:before {
  content: '*';
  color: #F56C6C;
  margin-right: 4px;
}

div.label-center-left {
  text-align: left;
}

div.label-center-align {
  text-align: center;
}

div.label-right-align {
  text-align: right;
}

div.sub-form-action-column {
  display: flex;
  align-items: center;
  width: 120px;
  border: 1px solid #e1e2e3;
  padding: 8px;

  ${o ? ":deep(.el-form-item)" : "::v-deep .el-form-item"} {
    margin-bottom: 0;
  }

  ${o ? ":deep(.el-button)" : "::v-deep .el-button"} {
    font-size: 18px;
    padding: 0;
    background: #DCDFE6;
    border: 4px solid #DCDFE6;
    height:30px;
    width:30px;
  }

}

div.sub-form-action-column.hide-label {
  ${o ? ":deep(.el-form-item__label)" : "::v-deep .el-form-item__label"} {
    display: none;
  }
}

div.sub-form-table-column {
  display: inline-block;
  //width: 200px;
  border: 1px solid #e1e2e3;
  padding: 8px;

  ${o ? ":deep(.el-form-item)" : "::v-deep .el-form-item"} {
    margin-left: 4px;
    margin-right: 4px;
    margin-bottom: 0;
  }

  ${o ? ":deep(.el-form-item__content)" : "::v-deep .el-form-item__content"} {
    margin-left: 0 !important;
  }
}

div.sub-form-table-column.hide-label {
  ${o ? ":deep(.el-form-item__label)" : "::v-deep .el-form-item__label"} {
    display: none;
  }
}
`
}
, genGridSubformScopedCSS = function(e, o=!1) {
  return ` 
.sub-form-container {
  ${o ? ":deep( div.grid-sub-form.sub-form-row)" : "::v-deep  div.grid-sub-form.sub-form-row"} {
    display:flex;
    align-items: center;
    border: 1px solid #e1e2e3;
  }
}

div.grid-sub-form.action-header-column {
  width: 100%;
}


div.grid-sub-form.sub-form-action-column {
  display: inline-block;
  align-items: center;
  justify-content: initial;
  text-align: center;
  border:initial;
  .action-button-column{
    display:flex;
    justify-content:space-between;

    .row-number-span{
      line-height:30px;
    }
  }
}

div.grid-sub-form.grid-sub-form-data-row {
  display: inline-block;
  width: 100%;
  border-left: 1px solid #e1e2e3;
  border-right: 1px solid #e1e2e3;
}
`
}
/**
 * 注册容器组件的代码生成器
 * @param containerType 容器类型，必须唯一
 * @param ctGenerator 代码生成器函数，接收两个参数(containerWidget, formConfig)，返回生成的容器组件代码
 */
export const registerCWGenerator = function (containerType, ctGenerator) {
  containerTemplates[containerType] = ctGenerator
}

/**
 * 注册字段组件的代码生成器
 * @param fieldType 字段类型，必须唯一
 * @param ftGenerator 代码生成器函数，接收两个参数(fieldWidget, formConfig)，返回生成的字段组件代码
 */
export const registerFWGenerator = function (fieldType, ftGenerator) {
  elTemplates[fieldType] = ftGenerator
}

// export const genSFC = function (formConfig, widgetList, beautifier, vue3Flag = false) {
//   const html = beautifier.html(genTemplate(formConfig, widgetList, vue3Flag), beautifierOpts.html)
//   const js = beautifier.js(!!vue3Flag ? genVue3JS(formConfig, widgetList): genVue2JS(formConfig, widgetList), beautifierOpts.js)
//   const globalCss = beautifier.css(genGlobalCSS(formConfig), beautifierOpts.css)
//   const scopedCss = beautifier.css(genScopedCSS(formConfig, vue3Flag), beautifierOpts.css)

//   return `<!-- 
// Codes Generated By VForm:
// https://www.vform666.com
// -->

// <template>
// ${html}
// </template>

// <script>
// ${js}
// </script>

// <style lang="scss">
// ${globalCss}
// </style>

// <style lang="scss" scoped>
// ${scopedCss}
// </style>`
// }
export const genSFC = function(e, o, t, r=!1) {
  const n = t.html(genTemplate(e, o, r), beautifierOpts.html)
    , l = t.js(r ? genVue3JS(e, o) : genVue2JS(e, o), beautifierOpts.js)
    , i = t.css(genGlobalCSS(e), beautifierOpts.css)
    , a = t.css(genScopedCSS(e, r), beautifierOpts.css);
  let s = ""
    , d = ""
    , c = o.find(u=>u.type === "sub-form");
  return c && (s = t.css(genSubformScopedCSS(e, r), beautifierOpts.css)),
  c = o.find(u=>u.type === "grid-sub-form"),
  c && (s = t.css(genSubformScopedCSS(e, r), beautifierOpts.css),
  d = t.css(genGridSubformScopedCSS(e, r), beautifierOpts.css)),
  `<!-- 
Codes Generated By VForm:
https://www.vform666.com
-->

<template>
${n}
</template>

<script>
${l}
<\/script>

<style lang="scss">
${i}
</style>

<style lang="scss" scoped>
${a}
${s}
${d}
</style>`
};