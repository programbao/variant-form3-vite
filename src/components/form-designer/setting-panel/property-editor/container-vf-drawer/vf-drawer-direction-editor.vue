<template>
  <el-form-item :label="i18nt('designer.setting.drawDirection')">
    <el-radio-group v-model="optionModel.direction" class="radio-group-custom">
      <el-radio-button value="rtl">
        <el-icon><Back /></el-icon>
      </el-radio-button>
      <el-radio-button value="ltr">
        <el-icon><Right /></el-icon>
      </el-radio-button>
      <el-radio-button value="ttb">
        <el-icon><Bottom /></el-icon>
      </el-radio-button>
      <el-radio-button value="btt">
        <el-icon><Top /></el-icon>
      </el-radio-button>
    </el-radio-group>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n"
  import { Back, Right, Bottom, Top } from "@element-plus/icons-vue";

  export default {
    name: "vf-drawer-direction-editor",
    mixins: [i18n],
    components: {
      Back,
      Right,
      Bottom,
      Top
    },
    props: {
      designer: Object,
      selectedWidget: Object,
      optionModel: Object,
    },
  }
</script>

<style scoped>

</style>
