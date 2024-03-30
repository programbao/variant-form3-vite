<template>
  <div>
    <el-form-item v-if="optionModel.formulaEnabled" :label="i18nt('designer.setting.formula')"></el-form-item>
    <el-form-item v-if="optionModel.formulaEnabled" label-width="0">
      <el-tooltip :content="formulaForView" effect="light" placement="top">
        <el-input v-model="formulaForView" readonly>
          <template #append>
            <el-button @click="editFormula" icon="el-icon-edit"></el-button>
          </template>
        </el-input>
      </el-tooltip>
    </el-form-item>

    <el-dialog
      v-model="formulaDialogVisible"
      :title="i18nt('designer.hint.formulaSetting')"
      class="small-padding-dialog"
      draggable
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :destroy-on-close="true"
      :append-to-body="false"
      width="70%"
      ref="colFormulaDialog"
    >
      <template #footer>
        <div class="dialog-footer">
          <el-button size="default" type="primary" @click="saveFormula">{{ i18nt('designer.hint.confirm') }}</el-button>
          <el-button size="default" @click="formulaDialogVisible = false">{{ i18nt('designer.hint.cancel') }}</el-button>
        </div>
      </template>

      <el-row>
        <el-col :span="24">
          <div class="editor">
            <div class="editor-top">
              <el-row>
                <el-col :span="22">
                  <div style="font-weight: bold">{{ optionModel.label }} =</div>
                </el-col>
                <el-col :span="2">
                  <el-button size="small" @click="clearFormula" type="danger" plain>{{ i18nt('designer.hint.formulaClear') }}</el-button>
                </el-col>
              </el-row>
              <div ref="cmRef" style="height: 110px; width: 100%"></div>
            </div>
            <div class="editor-bottom">
              <el-button
                v-for="(op, index) in operate"
                :key="index"
                @click="insertSymbol(op)"
                size="default"
              >{{ op }}</el-button>
            </div>
          </div>
        </el-col>
      </el-row>

      <el-row style="margin: 10px">
        <el-col :span="6">
          <div class="group-item-left">
            <div class="item-header">{{ i18nt('designer.hint.formulaWidgetList') }}</div>
            <el-input v-model="filterText" :placeholder="i18nt('designer.hint.formulaSearch')" clearable></el-input>
            <div class="item-body-left">
              <el-tree
                ref="fieldTree"
                :data="fieldTreeData"
                :filter-node-method="filterNode"
                @node-click="insertField"
              >
                <template #default="{ node, data }">
                  <span class="custom-tree-node">
                    <el-tooltip :content="node.label" effect="dark" placement="right">
                      <span>{{ node.label }}</span>
                    </el-tooltip>
                  </span>
                </template>
              </el-tree>
            </div>
          </div>
        </el-col>

        <el-col :span="6">
          <el-row>
            <el-col :span="24">
              <div class="group-item-right-top">
                <div class="item-header">{{ i18nt('designer.hint.formulaFunctionList') }}</div>
                <div class="function-list">
                  <el-collapse v-model="funcActiveCollapseNames">
                    <el-collapse-item
                      v-for="(funcGroup, index) in funcList"
                      :key="index"
                      :title="i18nt(funcGroup.fClass)"
                      :name="index"
                    >
                      <div
                        v-for="(func, idx) in funcGroup.flist"
                        :key="idx"
                        class="field-item"
                        @click="insertFunction(func.fName + '(')"
                        @mouseenter="showIntro(i18nt(func.fName), i18nt(funcGroup.fClass), i18nt(func.fIntro))"
                        @mouseleave="resetIntro"
                      >
                        <span>{{ func.fName }}</span>
                        <el-tag :type="getClass(func.fType)">{{ i18nt(func.fType) }}</el-tag>
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="12">
          <div class="group-item-right-bottom">
            <div class="item-header">{{ introTitle }}</div>
            <div class="item-body-right-bottom">
              <ul>
                <li v-if="introduction.title !== ''" style="font-size: 16px; color: #0a5d7c">{{ introduction.title }}</li>
                <li>
                  <div class="intro-content" v-html="introduction.content"></div>
                </li>
              </ul>
            </div>
          </div>
        </el-col>
      </el-row>

    </el-dialog>
  </div>
</template>

<script>
  import i18n from "@/utils/i18n"

  export default {
    name: "formula-editor",
    mixins: [i18n],
    props: {
      designer: Object,
      selectedWidget: Object,
      optionModel: Object,
    },
    computed: {
        formulaForView() {
            const e = this.optionModel.formula.match(FORMULA_REG_EXP);
            if (!e)
                return this.optionModel.formula;
            let o = this.optionModel.formula;
            return e.forEach(t=>{
                const r = t.split(".")[1];
                o = o.replaceAll(t, r)
            }
            ),
            o
        }
    },
    watch: {
        filterText(e) {
            this.$refs.fieldTree.filter(e)
        }
    },
    data() {
        return {
            codeMirror: null,
            formula: "",
            tags: [],
            fieldTreeData: [],
            filterText: "",
            formulaDialogVisible: !1,
            operate: ["+", "-", "*", "/", "!=", "==", "<", ">", "<=", ">=", "(", ")", ","],
            insertNum: 0,
            insertStr: "",
            activeNames: ["1"],
            widgetSizes: [{
                label: this.i18nt("designer.hint.formulaSizeLarge"),
                value: "large"
            }, {
                label: this.i18nt("designer.hint.formulaSizeMedium"),
                value: "default"
            }, {
                label: this.i18nt("designer.hint.formulaSizeSmall"),
                value: "small"
            }, {
                label: this.i18nt("designer.hint.formulaSizeMini"),
                value: "small"
            }],
            introTitle: this.i18nt("designer.hint.formulaFunctionExplain"),
            introduction: {
                title: this.i18nt("designer.hint.formulaPleaseSelect"),
                content: '<span class="cg">' + this.i18nt("designer.hint.formulaSample") + '\uFF1A</span><span class="fname">SUM</span><span class="cg">(</span><span class="cs">' + this.i18nt("designer.hint.formulaPara") + '1</span><span class="cg">,</span><span class="cs">' + this.i18nt("designer.hint.formulaPara") + '2</span><span class="cg">)</span>'
            },
            funcList: formulas,
            funcActiveCollapseNames: [0]
        }
    },
    mounted() {},
    methods: {
        clearFormula(e) {
            this.formula = "",
            this.tags = [],
            this.codeMirror.dispatch({
                changes: {
                    from: 0,
                    to: this.codeMirror.state.doc.length,
                    insert: ""
                }
            })
        },
        deleteChar(e, o, t) {
            let r = -1;
            return e.replace(/a/g, n=>(r++,
            r === t ? "" : n))
        },
        filterNode(e, o) {
            return e ? o.label.indexOf(e) !== -1 : !0
        },
        loadFieldListToTree() {
            this.fieldTreeData.length = 0;
            const e = getAllFieldWidgets(this.designer.widgetList)
              , o = getAllContainerWidgets(this.designer.widgetList)
              , t = [];
            let r = [];
            const n = {};
            o.forEach(l=>{
                if (l.type === "sub-form" || l.type === "grid-sub-form") {
                    t.push(l.container);
                    const i = []
                      , a = s=>{
                        !!s.formItemFlag && s.type === "number" && i.push(s)
                    }
                    ;
                    traverseFieldWidgetsOfContainer(l.container, a),
                    n[l.container.options.name] = i,
                    r = r.concat(i)
                }
            }
            ),
            e.forEach(l=>{
                if (!r.find(i=>i.id === l.field.id)) {
                    const i = {
                        id: l.field.id,
                        name: l.field.options.name,
                        label: l.field.options.label,
                        type: l.field.type,
                        formItemFlag: !0
                    };
                    i.name !== this.optionModel.name && i.type === "number" && this.fieldTreeData.push(i)
                }
            }
            ),
            t.forEach(l=>{
                const i = {
                    id: l.id,
                    name: l.options.name,
                    label: l.options.label || l.options.name,
                    type: l.type,
                    formItemFlag: !1,
                    children: []
                };
                n[l.options.name].forEach(a=>{
                    const s = {
                        id: a.id,
                        name: a.options.name,
                        label: a.options.label,
                        type: a.type,
                        formItemFlag: !0
                    };
                    s.name !== this.optionModel.name && i.children.push(s)
                }
                ),
                this.fieldTreeData.push(i)
            }
            )
        },
        insertField(e, o, t) {
            if (e.formItemFlag) {
                let r = e.id
                  , n = "[" + e.label + "]";
                this.updateCodeMirror(r, n, "field")
            }
        },
        insertSymbol(e) {
            this.updateCodeMirror(e, e, null)
        },
        insertFunction(e) {
            const o = e.substring(0, e.length - 1);
            this.updateCodeMirror(o, o, "func")
        },
        updateCodeMirror(e, o, t=null) {
            if (t) {
                let r = {
                    field: e,
                    text: o,
                    type: t
                }
                  , n = r.field.length + r.text.length + r.type.length
                  , l = `{{${r.field}.${r.text}.${r.type}}}`;
                t === "func" ? (l += "()",
                n = n + 7) : n = n + 6,
                l && this.codeMirror.dispatch({
                    changes: {
                        from: this.codeMirror.state.selection.main.head,
                        to: this.codeMirror.state.selection.main.head,
                        insert: l
                    },
                    selection: {
                        anchor: this.codeMirror.state.selection.main.head + n
                    }
                })
            } else
                this.codeMirror.dispatch({
                    changes: {
                        from: this.codeMirror.state.selection.main.head,
                        to: this.codeMirror.state.selection.main.head,
                        insert: o
                    },
                    selection: {
                        anchor: this.codeMirror.state.selection.main.head + o.length
                    }
                })
        },
        removeStr(e) {
            let o = e.indexOf("[");
            if (o === -1)
                return e;
            let t = e.indexOf("]", o) + 1
              , r = e.substring(o, t)
              , n = e.split(r)
              , l = "";
            for (let i = 0; i < n.length; i++)
                l += n[i];
            return this.removeStr(l)
        },
        refreshFormula() {
            const e = this.optionModel.formula.match(FORMULA_REG_EXP);
            if (!e)
                return this.optionModel.formula;
            e.forEach(o=>{
                const t = o.split(".")[0]
                  , r = o.split(".")[2];
                if (r.substring(0, r.length - 2) === "func")
                    return;
                const l = t.substring(2, t.length)
                  , i = getFieldWidgetById(this.designer.widgetList, l, !1)
                  , a = i.options.label || i.options.name;
                this.optionModel.formula = this.optionModel.formula.replace(o, t + ".[" + a + "]." + r)
            }
            )
        },
        editFormula() {
            this.fieldTreeData.length = 0,
            this.designer.widgetList.forEach(o=>{
                this.optionModel.name !== o.id && this.loadFieldListToTree()
            }
            ),
            console.log("\u8BBE\u8BA1\u5668\u5B57\u6BB5===>", this.fieldTreeData),
            this.tags = deepClone(this.optionModel.formulaTags),
            this.refreshFormula();
            const e = this.optionModel.formula;
            this.formulaDialogVisible = !0,
            this.$nextTick(()=>{
                this.codeMirror = new EditorView({
                    state: EditorState.create({
                        doc: e,
                        extensions: [basicSetup, javascript(), [baseTheme, [], placeholders]]
                    }),
                    parent: this.$refs.cmRef
                }),
                console.log("\u7F16\u8F91\u5668\u5B9E\u4F8B==>", this.codeMirror)
            }
            )
        },
        saveFormula() {
            this.optionModel.formula = this.codeMirror.state.doc.text.join(""),
            this.formulaDialogVisible = !1
        },
        analysisFormula(e) {
            let o = e.indexOf("[");
            if (o === -1)
                return e;
            let t = e.indexOf("]", o) + 1
              , r = e.substring(o, t)
              , n = this.findTreeNodeByCnName(r);
            return n ? (e = e.replace(r, "{" + n + "}"),
            this.analysisFormula(e)) : (this.$message.error(r + " \u5B57\u6BB5\u65E0\u6CD5\u8BC6\u522B"),
            !1)
        },
        findTreeNodeByCnName(e) {
            let o = ""
              , t = ""
              , r = e.split("[")[1].split("]")[0]
              , n = r.split("-")[0]
              , l = r.split("-")[1]
              , i = this.fieldTreeData;
            for (let a = 0; a < i.length; a++) {
                let s = i[a].children;
                for (let d = 0; d < s.length; d++)
                    if (s[d].cnTitle === n) {
                        o = s[d].enTitle;
                        let c = s[d].children;
                        for (let u = 0; u < c.length; u++)
                            if (c[u].cnTitle === l)
                                return t = c[u].enTitle,
                                o + "-" + t
                    }
            }
            return null
        },
        getClass(e) {
            if (e === this.i18nt("designer.hint.formulaNumber"))
                return "warning";
            if (e === this.i18nt("designer.hint.formulaChar"))
                return "";
            if (e === this.i18nt("designer.hint.formulaObject"))
                return "danger"
        },
        resetIntro() {
            this.introTitle = this.i18nt("designer.hint.formulaFunctionExplain"),
            this.introduction = {
                title: this.i18nt("designer.hint.formulaPleaseSelect"),
                content: '<span class="cg">' + this.i18nt("designer.hint.formulaSample") + '\uFF1A</span><span class="fname">SUM</span><span class="cg">(</span><span class="cs">\u53C2\u65701</span><span class="cg">,</span><span class="cs">\u53C2\u65702</span><span class="cg">)</span>'
            }
        },
        showIntro(e, o, t) {
            t = '<span class="cg">' + t + "</span>",
            this.introduction = {
                title: o,
                content: t
            },
            this.introTitle = e
        },
        isValid(e) {
            let o = [], t = e.length, r = 0, n = 1, l;
            for (let i = 0; i < t && n; i++)
                switch (e[i]) {
                case "(":
                    o[r] = i,
                    r++;
                    break;
                case ")":
                    l = o[r - 1],
                    e[l] === "(" ? (o[r] = 0,
                    r--) : n = 0;
                    break;
                case "{":
                    o[r] = i,
                    r++;
                    break;
                case "}":
                    l = o[r - 1],
                    e[l] === "{" ? (o[r] = 0,
                    r--) : n = 0;
                    break;
                case "[":
                    o[r] = i,
                    r++;
                    break;
                case "]":
                    l = o[r - 1],
                    e[l] === "[" ? (o[r] = 0,
                    r--) : n = 0;
                    break
                }
            return r !== 0 && (n = 0),
            n !== 0
        }
      }
  }
</script>

<style scoped>

</style>
