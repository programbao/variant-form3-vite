<template>
  <container-item-wrapper :widget="widget">
    <el-container>
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
          @node-click="handleTreeNodeClick"
          @node-contextmenu="handleTreeNodeContextmenu"
          @check="handleTreeNodeCheck"
          @check-change="handleCheckChange"
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
  </container-item-wrapper>
</template>

<script>
import emitter from '@/utils/emitter'
import i18n from '../../../utils/i18n'
import refMixin from '../../../components/form-render/refMixin'
import ContainerItemWrapper from './container-item-wrapper'
import containerItemMixin from './containerItemMixin'

export default {
  name: 'TreeItem',
  componentName: 'ContainerItem',
  mixins: [emitter, i18n, refMixin, containerItemMixin],
  components: {
    ContainerItemWrapper
  },
  props: {
    widget: Object,
    parentWidget: Object,
    parentList: Array,
    indexOfParentList: Number,
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
    }
  },
  inject: [
    'refList',
    'sfRefList',
    'globalModel',
    'getFormConfig',
    'getGlobalDsv'
  ],
  data() {
    return {
      isExpanded: !0,
      isChecked: !1,
      currentKey: '',
      filterText: '',
      loadingFlag: !1,
      defaultProps: {
        children: 'children',
        label: 'label',
        disabled: this.isDisabled
      }
    }
  },
  computed: {
    formConfig() {
      return this.getFormConfig()
    }
  },
  watch: {
    filterText(e) {
      this.$refs.tree.filter(e)
    }
  },
  created() {
    this.initRefList(), this.handleOnCreated()
  },
  mounted() {
    this.widget.options.dsEnabled && this.loadDataFromDS({}),
      this.$nextTick(() => {
        this.handleOnMounted()
      })
  },
  beforeDestroy() {
    this.unregisterFromRefList()
  },
  methods: {
    isDisabled() {
      return this.widget.options.disabled
    },
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
            id: id$1++,
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
              message: this.i18nt('designer.setting.nodeDeleted')
            })
        })
        .catch((t) => {
          console.error(t)
        })
    },
    filterNode(e, o) {
      return e ? o.label.indexOf(e) !== -1 : !0
    },
    handleOnCreated() {
      this.widget.options.onCreated &&
        new Function(this.widget.options.onCreated).call(this)
    },
    handleOnMounted() {
      this.widget.options.onMounted &&
        new Function(this.widget.options.onMounted).call(this)
    },
    handleTreeNodeClick(e, o, t) {
      this.widget.options.onNodeClick &&
        new Function(
          'data',
          'node',
          'el',
          this.widget.options.onNodeClick
        ).call(this, e, o, t)
    },
    handleTreeNodeContextmenu(e, o, t, r) {
      this.widget.options.onNodeContextmenu &&
        new Function(
          'event',
          'data',
          'node',
          'el',
          this.widget.options.onNodeContextmenu
        ).call(this, e, o, t, r)
    },
    handleTreeNodeCheck(e, o) {
      this.widget.options.onNodeCheck &&
        new Function('data', 'treeState', this.widget.options.onNodeCheck).call(
          this,
          e,
          o
        )
    },
    handleCheckChange(e, o, t) {
      this.widget.options.onCheckChange &&
        new Function(
          'data',
          'checked',
          'indeterminate',
          this.widget.options.onCheckChange
        ).call(this, e, o, t)
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
      ;(this.widget.options.treeData = e),
        e && e.length > 0 && (this.currentKey = e[0].id)
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
    },
    setCheckedNodes(e) {
      this.$refs.tree.setCheckedNodes(e)
    },
    getCheckedNodes(e, o) {
      return this.$refs.tree.getCheckedNodes(e, o)
    },
    getCurrentNode() {
      return this.$refs.tree.getCurrentNode()
    },
    setCurrentNode(e) {
      return this.$refs.tree.setCurrentNode(e)
    },
    loadDataFromDS(e = {}, o = '') {
      let t = o || this.widget.options.dsName,
        r = this.widget.options.dataSetName,
        n = getDSByName(this.formConfig, t)
      if (n) {
        let l = this.getGlobalDsv() || {},
          i = new Object({})
        overwriteObj(i, l),
          overwriteObj(i, e),
          (i.widgetName = this.widget.options.name),
          (this.loadingFlag = !0),
          runDataSourceRequest(n, i, this.getFormRef(), !1, this.$message)
            .then((a) => {
              !!r && a.hasOwnProperty(r)
                ? this.setTreeData(a[r])
                : this.setTreeData(a),
                (this.loadingFlag = !1)
            })
            .catch((a) => {
              this.$message.error(a.message), (this.loadingFlag = !1)
            })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
