<!-- <template>
  <el-col class="grid-cell" :class="[customClass]" v-bind="layoutProps" :style="colHeightStyle"
          :key="widget.id" v-show="!widget.options.hidden">
    <template v-if="!!widget.widgetList && (widget.widgetList.length > 0)">
      <template v-for="(subWidget, swIdx) in widget.widgetList">
        <template v-if="'container' === subWidget.category">
          <component :is="getComponentByContainer(subWidget)" :widget="subWidget" :key="swIdx" :parent-list="widget.widgetList"
                          :index-of-parent-list="swIdx" :parent-widget="widget">
            <template v-for="slot in Object.keys($slots)" v-slot:[slot]="scope">
              <slot :name="slot" v-bind="scope"/>
            </template>
          </component>
        </template>
        <template v-else>
          <component :is="subWidget.type + '-widget'" :field="subWidget" :designer="null" :key="swIdx" :parent-list="widget.widgetList"
                        :index-of-parent-list="swIdx" :parent-widget="widget">
            <template v-for="slot in Object.keys($slots)" v-slot:[slot]="scope">
              <slot :name="slot" v-bind="scope"/>
            </template>
          </component>
        </template>
      </template>
    </template>
    <template v-else>
      <el-col>
        <div class="blank-cell"><span class="invisible-content">{{i18nt('render.hint.blankCellContent')}}</span></div>
      </el-col>
    </template>
  </el-col>
</template> -->
<template>
  <el-col
    :class="['grid-cell', customClass]"
    v-bind="layoutProps"
    :style="colHeightStyle"
    v-show="!widget.options.hidden"
  >
    <template v-if="widget.widgetList && widget.widgetList.length > 0">
      <template v-for="(item, index) in widget.widgetList" :key="index">
        <component
          v-if="item.category === 'container'"
          :is="getComponentByContainer(item)"
          :widget="item"
          :parent-list="widget.widgetList"
          :index-of-parent-list="index"
          :parent-widget="widget"
          :sub-form-row-id="subFormRowId"
          :sub-form-row-index="subFormRowIndex"
          :sub-form-col-index="subFormColIndex"
        >
          <template v-for="(_, slot) in $slots" :key="slot" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope" />
          </template>
        </component>
        <component
          v-else
          :is="item.type + '-widget'"
          :field="item"
          :designer="null"
          :parent-list="widget.widgetList"
          :index-of-parent-list="index"
          :parent-widget="widget"
          :sub-form-row-id="subFormRowId"
          :sub-form-row-index="subFormRowIndex"
          :sub-form-col-index="subFormColIndex"
        >
          <template v-for="(_, slot) in $slots" :key="slot" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope" />
          </template>
        </component>
      </template>
    </template>
    <el-col v-else>
      <div class="blank-cell">
        <span class="invisible-content">{{ i18nt('render.hint.blankCellContent') }}</span>
      </div>
    </el-col>
  </el-col>
</template>
<script>
  import emitter from '@/utils/emitter'
  import i18n from "../../../utils/i18n"
  import refMixin from "../../../components/form-render/refMixin"
  import FieldComponents from '@/components/form-designer/form-widget/field-widget/index'

  export default {
    name: "GridColItem",
    componentName: 'ContainerItem',
    mixins: [emitter, i18n, refMixin],
    components: {
      ...FieldComponents,
    },
    props: {
      widget: Object,
      parentWidget: Object,
      parentList: Array,
      indexOfParentList: Number,

      colHeight: {
        type: String,
        default: null
      },
      subFormRowIndex: {
            type: Number,
            default: -1
        },
        subFormColIndex: {
            type: Number,
            default: -1
        },
        subFormRowId: {
            type: String,
            default: ""
        }
    },
    inject: ['refList', 'globalModel', 'getFormConfig', 'previewState'],
    data() {
      return {
        layoutProps: {
          span: this.widget.options.span,
          md: this.widget.options.md || 12,
          sm: this.widget.options.sm || 12,
          xs: this.widget.options.xs || 12,
          offset: this.widget.options.offset || 0,
          push: this.widget.options.push || 0,
          pull: this.widget.options.pull || 0,
        }
      }
    },
    computed: {
      formConfig() {
        return this.getFormConfig()
      },

      customClass() {
        return this.widget.options.customClass || ''
      },

      colHeightStyle() {
        return !!this.colHeight ? {height: this.colHeight + 'px'} : {}
      },

    },
    created() {
      this.initLayoutProps()
      this.initRefList()
      this.callSetHidden()
    },
    methods: {
      // initLayoutProps() {
      //   if (!!this.widget.options.responsive) {
      //     if (!!this.previewState) {
      //       this.layoutProps.md = undefined
      //       this.layoutProps.sm = undefined
      //       this.layoutProps.xs = undefined

      //       let lyType = this.formConfig.layoutType
      //       if (lyType === 'H5') {
      //         this.layoutProps.span = this.widget.options.xs || 12
      //       } else if (lyType === 'Pad') {
      //         this.layoutProps.span = this.widget.options.sm || 12
      //       } else {
      //         this.layoutProps.span = this.widget.options.md || 12
      //       }
      //     } else {
      //       this.layoutProps.span = undefined
      //     }
      //   } else {
      //     this.layoutProps.md = undefined
      //     this.layoutProps.sm = undefined
      //     this.layoutProps.xs = undefined
      //   }
      // },
      initLayoutProps() {
            if (this.widget.options.responsive)
                if (this.previewState) {
                    this.layoutProps.md = void 0,
                    this.layoutProps.sm = void 0,
                    this.layoutProps.xs = void 0;
                    let e = this.formConfig.layoutType;
                    e === "H5" ? this.layoutProps.span = this.widget.options.xs || 12 : e === "Pad" ? this.layoutProps.span = this.widget.options.sm || 12 : this.layoutProps.span = this.widget.options.md || 12
                } else
                    this.layoutProps.span = void 0;
            else
                this.layoutProps.md = void 0,
                this.layoutProps.sm = void 0,
                this.layoutProps.xs = void 0
        },
        callSetHidden() {
            this.widget.options.hidden === !0 && this.setHidden(!0)
        },
        setHidden(e) {
            this.widget.options.hidden = e;
            let o = t=>{
                let r = t.options.name
                  , n = this.getWidgetRef(r);
                e && !!n && !!n.clearFieldRules && n.clearFieldRules(),
                !e && !!n && !!n.buildFieldRules && n.buildFieldRules()
            }
            ;
            traverseFieldWidgetsOfContainer(this.widget, o)
        }
    }
  }
</script>

<style lang="scss" scoped>
  .blank-cell {
    font-style: italic;
    color: #cccccc;

    span.invisible-content {
      opacity: 0;
    }
  }
</style>
