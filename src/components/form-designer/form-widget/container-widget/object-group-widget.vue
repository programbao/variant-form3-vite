<!--
/**
 * author: vformAdmin
 * email: vdpadmin@163.com
 * website: https://www.vform666.com
 * date: 2021.08.18
 * remark: 如果要分发VForm源码，需在本文件顶部保留此文件头信息！！
 */
-->

<template>
  <container-wrapper
    :designer="designer"
    :widget="widget"
    :parent-widget="parentWidget"
    :parent-list="parentList"
    :index-of-parent-list="indexOfParentList"
  >
    <div
      :key="widget.id"
      class="object-group-container"
      :class="{ selected: selected }"
      @click.stop="selectWidget(widget)"
    >
      <div class="object-group">
        <draggable
          :list="widget.widgetList"
          item-key="id"
          v-bind="{ group: 'dragGroup', ghostClass: 'ghost', animation: 400 }"
          tag="div"
          :component-data="{ name: 'fade', class: 'object-group-drag-drop-zone' }"
          handle=".drag-handler"
          @add="(evt) => onContainerDragAdd(evt, widget.widgetList)"
          @update="onContainerDragUpdate"
          :move="checkContainerMove"
        >
          <template #item="{ element: subWidget, index: swIdx }">
              <template v-if="'container' === subWidget.category">
                <component
                  :is="subWidget.type + '-widget'"
                  :widget="subWidget"
                  :designer="designer"
                  :key="subWidget.id"
                  :parent-list="widget.widgetList"
                  :index-of-parent-list="swIdx"
                  :parent-widget="widget"
                ></component>
              </template>
              <template v-else>
                <component
                  :is="subWidget.type + '-widget'"
                  :field="subWidget"
                  :designer="designer"
                  :key="subWidget.id"
                  :parent-list="widget.widgetList"
                  :index-of-parent-list="swIdx"
                  :parent-widget="widget"
                  :design-state="true"
                ></component>
              </template>
          </template>
        </draggable>
      </div>
    </div>
  </container-wrapper>
</template>

<script>
import i18n from '@/utils/i18n'
import containerMixin from '@/components/form-designer/form-widget/container-widget/containerMixin'
import ContainerWrapper from '@/components/form-designer/form-widget/container-widget/container-wrapper'
import refMixinDesign from '@/components/form-designer/refMixinDesign'
import FieldComponents from '@/components/form-designer/form-widget/field-widget/index'

export default {
  name: 'object-group-widget',
  componentName: 'ContainerWidget',
  mixins: [i18n, containerMixin, refMixinDesign],
  inject: ['refList'],
  components: {
    ContainerWrapper,
    ...FieldComponents
  },
  props: {
    widget: Object,
    parentWidget: Object,
    parentList: Array,
    indexOfParentList: Number,
    designer: Object
  },
  provide() {
    return {
      getObjectFieldFlag: () => !0,
      getObjectName: () => this.widget.options.objectName
    }
  },
  computed: {
    selected() {
      return this.widget.id === this.designer.selectedId
    },

    customClass() {
      return this.widget.options.customClass || ''
    }
  },
  watch: {
    //
  },
  created() {
    this.initRefList()
  },
  mounted() {
    //
  },
  methods: {
    checkContainerMove(e) {
      return !0
    },
    toggleCard() {
      this.widget.options.folded = !this.widget.options.folded
    },
    setFolded(e) {
      this.widget.options.folded = !!e
    }
  }
}
</script>

<style lang="scss" scoped>
.object-group-container {
  border: 2px dashed #cccccc;
}

.object-group-container.selected {
  outline: 2px solid var(--vf-color-primary, #409eff) !important;
}

.object-group-container .object-group {
  min-height: 28px;
}
</style>
