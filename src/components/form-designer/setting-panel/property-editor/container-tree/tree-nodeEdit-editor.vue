<template>
  <el-form-item :label="i18nt('designer.setting.nodeEdit')">
    <el-switch v-model="optionModel.nodeEdit"></el-switch>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n"

  export default {
    name: "tree-nodeEdit-editor",
    mixins: [i18n],
    props: {
      designer: Object,
      selectedWidget: Object,
      optionModel: Object,
    },
  }
</script>

<style scoped>

</style>
