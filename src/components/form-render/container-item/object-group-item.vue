<template>
  <container-item-wrapper :widget="widget">
    <div
      :key="widget.id"
      class="object-group-container"
      v-show="!widget.options.hidden"
    >
      <template v-for="(subWidget, swIdx) in widget.widgetList">
        <template v-if="'container' === subWidget.category">
          <component
            :is="getComponentByContainer(subWidget)"
            :widget="subWidget"
            :key="swIdx"
            :parent-list="tab.widgetList"
            :index-of-parent-list="swIdx"
            :parent-widget="widget"
            :parent-object-name="widget.options.objectName"
            :sub-form-row-id="subFormRowId"
            :sub-form-row-index="subFormRowIndex"
            :sub-form-col-index="subFormColIndex"
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
            :is="subWidget.type + '-widget'"
            :field="subWidget"
            :key="swIdx"
            :index-of-parent-list="swIdx"
            :parent-widget="widget"
            :sub-form-row-id="subFormRowId"
            :sub-form-row-index="subFormRowIndex"
            :sub-form-col-index="subFormColIndex"
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
    </div>
  </container-item-wrapper>
</template>

<script>
import emitter from '@/utils/emitter'
import i18n from '../../../utils/i18n'
import refMixin from '../../../components/form-render/refMixin'
import ContainerItemWrapper from './container-item-wrapper'
import containerItemMixin from './containerItemMixin'
import FieldComponents from '@/components/form-designer/form-widget/field-widget/index'

export default {
  name: 'object-group-item',
  componentName: 'ContainerItem',
  mixins: [emitter, i18n, refMixin, containerItemMixin],
  components: {
    ContainerItemWrapper,
    ...FieldComponents,
  },
  props: {
    widget: Object,
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
      default: ''
    },
    parentObjectName: {
      type: String,
      default: ''
    }
  },
  provide() {
    return {
      getObjectFieldFlag: () => !0,
      getObjectName: () => this.widget.options.objectName
    }
  },
  inject: ['refList', 'globalModel'],
  data() {
    return {}
  },
  created() {
    this.initRefList(), this.handleOnCreated()
  },
  mounted() {
    this.handleOnMounted()
  },
  methods: {
    handleOnCreated() {
      this.widget.options.onCreated &&
        new Function(this.widget.options.onCreated).call(this)
    },
    handleOnMounted() {
      this.widget.options.onMounted &&
        new Function(this.widget.options.onMounted).call(this)
    }
  }
}
</script>

<style lang="scss" scoped>
// .object-group-container {
//   border: 2px dashed #cccccc;
// }

// .object-group-container.selected {
//   outline: 2px solid var(--vf-color-primary, #409eff) !important;
// }

.object-group-container .object-group {
  min-height: 28px;
}
</style>
