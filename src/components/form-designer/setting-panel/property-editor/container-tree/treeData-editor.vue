<template>
  <el-form-item :label="i18nt('designer.setting.treeDataEdit')">
    <el-button type="primary" plain round @click="openTreeDataEdit">{{ i18nt('designer.setting.editAction') }}</el-button>
    <div>
      <el-dialog 
        :title="i18nt('designer.setting.treeDataEdit')" 
        v-model="dataDialogVisible" 
        class="drag-dialog small-padding-dialog"
        width="75%" 
        show-close
        append-to-body
        :close-on-click-modal="!1"
        :close-on-press-escape="!1"
        :destroy-on-close="!0"
      >
        <code-editor mode="json" :readonly="false" v-model="treeDataOptions" :height="400"></code-editor>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dataDialogVisible = !1">{{ i18nt('designer.hint.cancel') }}</el-button>
          <el-button type="primary" @click="saveTreeData">{{ i18nt('designer.hint.confirm') }}</el-button>
        </span>
      </el-dialog>
    </div>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n";
  import CodeEditor from '@/components/code-editor/index'

  export default {
    name: "treeData-editor",
    mixins: [i18n],
    components: {
      CodeEditor,
    },
    props: {
        designer: Object,
        selectedWidget: Object,
        optionModel: Object
    },
    data() {
        return {
            dataDialogVisible: !1,
            treeDataOptions: []
        }
    },
    methods: {
        openTreeDataEdit() {
            this.dataDialogVisible = !0,
            this.treeDataOptions = JSON.stringify(this.optionModel.treeData, null, "  ")
        },
        saveTreeData() {
            try {
                this.optionModel.treeData = JSON.parse(this.treeDataOptions),
                this.dataDialogVisible = !1
            } catch (e) {
                this.$message.error(this.i18nt("designer.hint.invalidOptionsData") + e.message)
            }
        }
    }
  }
</script>

<style scoped>

</style>
