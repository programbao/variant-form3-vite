
<template>
  <el-form-item v-if="optionModel.keyNameEnabled" label>
    <template #label>
      <span>{{ i18nt('designer.setting.keyName') }} </span>
      <el-tooltip effect="light" :content="i18nt('designer.setting.keyNameHelp')">
        <svg-icon icon-class="el-info"></svg-icon>
      </el-tooltip>
    </template>
    <el-input v-model="optionModel.keyName" type="text"></el-input>
  </el-form-item>
</template>
<script>
  import i18n from "@/utils/i18n"
  import propertyMixin from "@/components/form-designer/setting-panel/property-editor/propertyMixin"
  import SvgIcon from '@/components/svg-icon'

  export default {
    name: "keyName-editor",
    mixins: [i18n],
    components: {
        SvgIcon
    },
    props: {
        designer: Object,
        selectedWidget: Object,
        optionModel: Object
    },
    watch: {}
  }
</script>

<style scoped>

</style>
