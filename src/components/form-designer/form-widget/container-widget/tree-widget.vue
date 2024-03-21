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
    <el-container
      :key="widget.id"
      class="tree-container"
      :class="{ selected: selected }"
      @click.stop="selectWidget(widget)"
    >
      <el-main style="align-items: baseline">
        <el-input
          v-if="widget.options.filter"  
          :size="widget.options.size"
          :placeholder="i18nt('designer.setting.enterForQuery')"
          v-model="filterText"
        />
        <el-button-group>
          <el-button
            type="primary"
            v-if="widget.options.expandRetractAllNode"
            :size="widget.options.size"
            plain
            round
            @click="() => expandAllNodes()"
            >{{ i18nt('designer.setting.expandRetractAllNode') }}</el-button
          >
          <el-button
            v-if="widget.options.selectClearAllNode"
            type="primary"
            :size="widget.options.size"
            plain
            round
            @click="() => checkAllNodes()"
            >{{ i18nt('designer.setting.selectClearAllNode') }}</el-button
          >
        </el-button-group>
        <el-tree
          ref="tree"
          v-model="filterText"
          :size="widget.options.size"
          :disabled="widget.options.disabled"
          :readonly="widget.options.readonly"
          :data="widget.options.treeData"
          :placeholder="widget.options.placeholder"
          :props="defaultProps"
          :lazy="widget.options.lazy"
          :node-key="'id'"
          :filter="widget.options.filter"
          :current-node-key="currentKey"
          :show-checkbox="widget.options.showCheckBox"
          :expand-on-click-node="widget.options.expandOnClickNode"
          :default-expand-all="widget.options.defaultExpandAllNode"
          :draggable="widget.options.draggable"
          :check-strictly="widget.options.checkStrictly"
          :filter-node-method="filterNode"
        >
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              <span>{{ node.label }}</span>
              <span v-if="widget.options.nodeEdit">
                <el-button
                  type="primary"
                  :size="widget.options.size"
                  link
                  @click="append(data)"
                  >{{ i18nt('designer.setting.add') }}</el-button
                >
                <el-button
                  type="primary"
                  :size="widget.options.size"
                  link
                  style="margin-left: 8px"
                  @click="remove(node, data)"
                  >{{ i18nt('designer.setting.delete') }}</el-button
                >
              </span>
            </span>
          </template>
        </el-tree>
      </el-main>
    </el-container>
  </container-wrapper>
</template>

<script>
import i18n from '@/utils/i18n'
import containerMixin from '@/components/form-designer/form-widget/container-widget/containerMixin'
import ContainerWrapper from '@/components/form-designer/form-widget/container-widget/container-wrapper'
import refMixinDesign from '@/components/form-designer/refMixinDesign'
let id = 1e3
export default {
  name: 'tree-widget',
  componentName: 'TreeWidget',
  mixins: [i18n, containerMixin, refMixinDesign],
  inject: ['refList'],
  components: {
    ContainerWrapper
  },
  props: {
    widget: Object,
    parentWidget: Object,
    parentList: Array,
    indexOfParentList: Number,
    designer: Object
  },
  computed: {
    selected() {
      return this.widget.id === this.designer.selectedId
    },

    customClass() {
      return this.widget.options.customClass || ''
    }
  },
  data() {
    return {
      isExpanded: !0,
      isChecked: !1,
      currentKey: '',
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    filterText(e) {
      this.$refs.tree.filter(e)
    }
  },
  created() {
    this.initRefList()
  },
  mounted() {
    //
  },
  methods: {
    append(e) {
      this.$prompt(
        this.i18nt('designer.setting.inputNodeName'),
        this.i18nt('designer.setting.tips'),
        {
          confirmButtonText: this.i18nt('designer.hint.confirm'),
          cancelButtonText: this.i18nt('designer.hint.cancel')
        }
      )
        .then(({ value: o }) => {
          const t = {
            id: id++,
            label: o,
            children: []
          }
          e.children || (e.children = []), e.children.push(t)
        })
        .catch((o) => {
          console.error(o)
        })
    },
    remove(e, o) {
      this.$confirm(
        this.i18nt('designer.setting.deleteNode'),
        this.i18nt('designer.setting.tips'),
        {
          confirmButtonText: this.i18nt('designer.hint.confirm'),
          cancelButtonText: this.i18nt('designer.hint.cancel'),
          type: 'warning'
        }
      )
        .then(() => {
          const t = e.parent,
            r = t.data.children || t.data,
            n = r.findIndex((l) => l.id === o.id)
          r.splice(n, 1),
            this.$message({
              type: 'success',
              message: '\u5220\u9664\u6210\u529F!'
            })
        })
        .catch((t) => {
          console.error(t)
        })
    },
    filterNode(e, o) {
      return e ? o.label.indexOf(e) !== -1 : !0
    },
    setNodeExpanded(e, o) {
      e.expanded = o
      for (let t = 0; t < e.childNodes.length; t++)
        (e.childNodes[t].expanded = o),
          e.childNodes[t].childNodes.length > 0 &&
            this.setNodeExpanded(e.childNodes[t], o)
    },
    setNodeChecked(e, o) {
      e.checked = o
      for (let t = 0; t < e.childNodes.length; t++)
        (e.childNodes[t].checked = o),
          e.childNodes[t].childNodes.length > 0 &&
            this.setNodeChecked(e.childNodes[t], o)
    },
    getNativeTree() {
      return this.$refs.tree
    },
    setTreeData(e) {
      ;(this.widget.options.treeData = e), (this.currentKey = e[0].id)
    },
    getTreeData() {
      return this.widget.options.treeData
    },
    expandAllNodes(e) {
      ;(this.isExpanded = e || !this.isExpanded),
        this.setNodeExpanded(this.$refs.tree.store.root, this.isExpanded)
    },
    checkAllNodes(e) {
      ;(this.isChecked = e || !this.isChecked),
        this.setNodeChecked(this.$refs.tree.store.root, this.isChecked)
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-container {
  //padding: 5px;
  margin: 2px;

  .form-widget-list {
    min-height: 28px;
  }
}

.tree-container.selected {
  outline: 2px solid $--color-primary !important;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
