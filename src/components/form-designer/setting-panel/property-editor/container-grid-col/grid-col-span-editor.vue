<template>
  <div>
    <el-form-item  :label="i18nt('designer.setting.colSpanTitle')"></el-form-item>
      <el-form-item :label-width="0" v-if="!optionModel.responsive">
        <!-- <el-input-number v-model.number="optionModel.span" :min="1" :max="24"
                        style="width: 100%"></el-input-number> -->
        <el-slider v-model.number="optionModel.span" :max="24" :step="2" show-stops show-input></el-slider>
      </el-form-item>
      <el-form-item :label-width="0" :label="i18nt('designer.setting.colSpanTitle') + '(PC)'"
                    v-if="!!optionModel.responsive && (formConfig.layoutType === 'PC')">
        <el-input-number v-model.number="optionModel.md" :min="1" :max="24"
                        style="width: 100%"></el-input-number>
      </el-form-item>
      <el-form-item :label="i18nt('designer.setting.colSpanTitle') + '(Pad)'"
                    v-if="!!optionModel.responsive && (formConfig.layoutType === 'Pad')">
        <el-input-number v-model.number="optionModel.sm" :min="1" :max="24"
                        style="width: 100%"></el-input-number>
      </el-form-item>
      <el-form-item :label="i18nt('designer.setting.colSpanTitle') + '(H5)'"
                    v-if="!!optionModel.responsive && (formConfig.layoutType === 'H5')">
        <el-input-number v-model.number="optionModel.xs" :min="1" :max="24"
                        style="width: 100%"></el-input-number>
      </el-form-item>
  </div>
</template>

<script>
  import i18n from "@/utils/i18n";

  export default {
    name: "grid-col-span-editor",
    mixins: [i18n],
    props: {
      designer: Object,
      selectedWidget: Object,
      optionModel: Object,
    },
    computed: {
      formConfig() {
        return this.designer.formConfig
      },


    },
    data() {
        return {
            marks: {
                4: "1/6",
                6: "1/4",
                8: "1/3",
                12: "1/2",
                16: "2/3",
                18: "3/4"
            }
        }
    },
  }
</script>

<style scoped>
:deep(.el-form-item) .el-form-item__content{
  margin-left: 0 !important;
}
:deep(.el-form-item) .el-slider__input {
  width: 90px;
}
</style>
