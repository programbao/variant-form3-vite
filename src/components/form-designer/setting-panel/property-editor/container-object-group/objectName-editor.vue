<template>
  <el-form-item
    prop="objectName"
  >
    <template #label>
      <span
        >{{ i18nt('designer.setting.objectName') }}
        <el-tooltip
          effect="light"
          :content="i18nt('designer.setting.objectNameHelp')"
        >
          <svg-icon icon-class="el-info"
        /></el-tooltip>
      </span>
    </template>
    <template #default>
      <el-input
        type="text"
        v-model="optionModel.objectName"
        @onFocus="handleObjectNameFocus"
        @change="checkObjectName"
      ></el-input>
    </template>
  </el-form-item>
</template>

<script>
import i18n from '@/utils/i18n'
import SvgIcon from '@/components/svg-icon/index'
import { trimEx } from '@/utils/util'
export default {
  name: 'objectName-editor',
  mixins: [i18n],
  components: {
    SvgIcon
  },
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object
  },
  data() {
    return {
      oldObjName: '',
      objectNameRequiredRule: [
        {
          required: !0,
          objectName: 'name required'
        }
      ]
    }
  },
  methods: {
    handleObjectNameFocus(e) {
      this.oldObjName = this.selectedWidget.options.objectName
    },
    checkObjectName(e) {
      if (isEmptyStr(e)) {
        ;(this.selectedWidget.options.objectName = this.oldObjName),
          this.$message.info(this.i18nt('designer.hint.objectNameRequired'))
        return
      }
      let o = e.trim()
      ;(o = trimEx(o, '.')), (this.selectedWidget.options.objectName = o)
    }
  }
}
</script>

<style scoped></style>
