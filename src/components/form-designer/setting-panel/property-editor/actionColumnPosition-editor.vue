<template>
  <el-form-item :label="i18nt('designer.setting.actionColumnPosition')">
    <el-radio-group class="radio-group-custom" v-model="optionModel.actionColumnPosition">
      <el-radio-button value="left">{{ i18nt("designer.setting.leftAlign") }}</el-radio-button>
      <el-radio-button value="right">{{ i18nt("designer.setting.rightAlign") }}</el-radio-button>
    </el-radio-group>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n"

  export default {
    name: "actionColumnPosition-editor",
    mixins: [i18n],
    props: {
      designer: Object,
      selectedWidget: Object,
      optionModel: Object,
    },
    computed: {
        noLabelSetting() {
            return this.selectedWidget.type === "static-text" || this.selectedWidget.type === "html-text"
        }
    }
  }
</script>

<style scoped lang="scss">
 .radio-group-custom {
      :deep(.el-radio-button__inner) {
        padding-left: 12px;
        padding-right: 12px;
      }
    }
</style>
