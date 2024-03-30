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
      class="sub-form-container" 
      :class="{ selected: selected }"
      @click.stop="selectWidget(widget)"
    >
      <div class="grid-sub-form">
        <draggable
          v-model="widget.widgetList"
          item-key="id"
          v-bind="{ group: 'dragGroup', ghostClass: 'ghost', animation: 400 }"
          tag="div"
          :component-data="{
            name: 'fade',
            class: 'grid-sub-form-drag-drop-zone'
          }"
          handle=".drag-handler"
          @add="onSubFormDragAdd($event, widget.widgetList)"
          @end="onSubFormDragEnd"
          @update="onContainerDragUpdate"
          :move="checkContainerMove"
        >
          <template #item="{ element, index }">
            <component
              v-if="element.category === 'container'"
              :is="`${element.type}-widget`"
              :widget="element"
              :designer="designer"
              :key="element.id"
              :parent-list="widget.widgetList"
              :index-of-parent-list="index"
              :parent-widget="widget"
            />
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
  name: 'grid-sub-form-widget',
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
            getSubFormFieldFlag: ()=>!0,
            getSubFormName: ()=>this.widget.options.name
        }
    },
    computed: {
        selected() {
            return this.widget.id === this.designer.selectedId
        },
        customClass() {
            return this.widget.options.customClass || ""
        }
    },
    watch: {},
    created() {
        this.initRefList()
    },
    mounted() {},
    methods: {
        onSubFormDragAdd(e, o) {
            const t = e.newIndex;
            o[t] && this.designer.setSelected(o[t]),
            this.designer.emitHistoryChange(),
            console.log("test", "onSubFormDragAdd"),
            this.designer.emitEvent("field-selected", this.widget)
        },
        onSubFormDragEnd(e) {
            console.log("sub form drag end: ", e)
        }
    }
}
</script>

<style lang="scss" scoped>


.sub-form-container {
    padding: 8px;
    border: 1px dashed #336699
}

.sub-form-container .grid-sub-form {
    min-height: 68px
}

.sub-form-container .grid-sub-form .grid-sub-form-drag-drop-zone {
  min-height: 68px
}

.sub-form-container .sub-form-table div.sub-form-table-column {
    display: inline-block
}

.sub-form-container .ghost {
    content: "";
    font-size: 0;
    height: 74px;
    width: 1px;
    box-sizing: border-box;
    display: inline-block;
    background: var(--vf-color-primary, #409EFF);
    border: 2px solid var(--vf-color-primary, #409EFF);
    outline-width: 0;
    padding: 0;
    margin: 0;
    overflow: hidden
}

.sub-form-container.selected {
    outline: 2px solid var(--vf-color-primary, #409EFF)!important
}

</style>
