<!-- <template>
  <container-item-wrapper :widget="widget">

    <el-row :key="widget.id" :gutter="widget.options.gutter" class="grid-container"
            :class="[customClass]"
            :ref="widget.id" v-show="!widget.options.hidden">
      <template v-for="(colWidget, colIdx) in widget.cols" :key="colIdx">
        <grid-col-item :widget="colWidget" :parent-list="widget.cols"
                       :index-of-parent-list="colIdx" :parent-widget="widget"
                       :col-height="widget.options.colHeight">
          <template v-for="slot in Object.keys($slots)" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope"/>
          </template>
        </grid-col-item>
      </template>
    </el-row>

  </container-item-wrapper>
</template> -->
<template>
  <container-item-wrapper :widget="widget">
    <template v-if="!widget.options.hidden">
      <el-row
        :key="widget.id"
        :gutter="widget.options.gutter"
        :class="['grid-container', customClass]"
        :ref="widget.id"
      >
        <grid-col-item
          v-for="(col, index) in widget.cols"
          :key="index"
          :widget="col"
          :parent-list="widget.cols"
          :index-of-parent-list="index"
          :parent-widget="widget"
          :col-height="widget.options.colHeight"
          :sub-form-row-id="subFormRowId"
          :sub-form-row-index="subFormRowIndex"
          :sub-form-col-index="subFormColIndex"
        >
          <template v-for="slot in Object.keys($slots)" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope"/>
          </template>
        </grid-col-item>
      </el-row>
    </template>
  </container-item-wrapper>
</template>
<script>
  import emitter from '@/utils/emitter'
  import i18n from "../../../utils/i18n"
  import refMixin from "../../../components/form-render/refMixin"
  import ContainerItemWrapper from './container-item-wrapper'
  import GridColItem from './grid-col-item'
  import containerItemMixin from "./containerItemMixin"

  export default {
    name: "vf-grid-item", //grid-item跟VueGridLayout全局注册组件重名，故特殊处理！！
    componentName: 'ContainerItem',
    mixins: [emitter, i18n, refMixin, containerItemMixin],
    components: {
      ContainerItemWrapper,
      GridColItem,
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
          default: ""
      }
    },
    inject: ['refList', 'sfRefList', 'globalModel'],
    created() {
      this.initRefList()
    },
    mounted() {

    },
    beforeUnmount() {
      this.unregisterFromRefList()
    },
    methods: {

    },
  }
</script>

<style lang="scss" scoped>

</style>
