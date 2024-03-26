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
      class="drawer-container"
      :class="{ selected: selected }"
      @click.stop="selectWidget(widget)"
    >
      <draggable
        :list="widget.widgetList"
        item-key="id"
        v-bind="{ group: 'dragGroup', ghostClass: 'ghost', animation: 400 }"
        handle=".drag-handler"
        @onEnd="(evt) => onDrawerDragEnd(evt, widget.widgetList)"
        @add="(evt) => onDrawerDragAdd(evt, widget.widgetList)"
        @update="onDrawerDragUpdate"
        :move="checkContainerMove"
      >
        <template #item="{ element: subWidget, index: swIdx }">
          <div class="vf-drawer-drop-zone">
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
          </div>
        </template>
      </draggable>
    </div>
  </container-wrapper>
</template>

<script>
import i18n from '@/utils/i18n'
import ContainerWrapper from '@/components/form-designer/form-widget/container-widget/container-wrapper'
import refMixinDesign from '@/components/form-designer/refMixinDesign'
import FieldComponents from '@/components/form-designer/form-widget/field-widget/index'

export default {
  name: 'vf-drawer-widget',
  componentName: 'VfDialogWidget',
  mixins: [i18n, refMixinDesign],
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
  data() {
    return {}
  },
  computed: {
    selected() {
      return this.widget.id === this.designer.selectedId
    },
    customClass() {
      return this.widget.options.customClass || ''
    }
  },
  created() {
    this.initRefList()
  },
  mounted() {
    //
  },
  methods: {
    onDrawerDragEnd(e, o) {},
    onDrawerDragAdd(e, o) {
      const t = e.newIndex
      o[t] && this.designer.setSelected(o[t]),
        this.designer.emitHistoryChange(),
        this.designer.emitEvent('field-selected', this.widget)
    },
    onDrawerDragUpdate() {
      this.designer.emitHistoryChange()
    },
    selectWidget(e) {
      console.log('id: ' + e.id), this.designer.setSelected(e)
    },
    checkContainerMove(e) {
      return this.designer.checkWidgetMove(e)
    },
    selectParentWidget() {
      this.parentWidget
        ? this.designer.setSelected(this.parentWidget)
        : this.designer.clearSelected()
    },
    moveUpWidget() {
      this.designer.moveUpWidget(this.parentList, this.indexOfParentList)
    },
    moveDownWidget() {
      this.designer.moveDownWidget(this.parentList, this.indexOfParentList)
    },
    removeWidget() {
      if (this.parentList) {
        let e = null
        this.parentList.length === 1
          ? this.parentWidget && (e = this.parentWidget)
          : this.parentList.length === 1 + this.indexOfParentList
          ? (e = this.parentList[this.indexOfParentList - 1])
          : (e = this.parentList[this.indexOfParentList + 1]),
          this.$nextTick(() => {
            this.parentList.splice(this.indexOfParentList, 1),
              this.designer.setSelected(e),
              this.designer.emitHistoryChange()
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.drawer-container {
    width: 100%;
    min-height: 120px;
    border: 2px dashed #cccccc;
    position: relative
}

.drawer-container .vf-drawer-drop-zone {
    min-height: 58px
}

.drawer-container>div:first-child {
    min-height: 58px
}

.drawer-container.selected {
    outline: 2px solid var(--vf-color-primary, #409EFF)!important
}
</style>
