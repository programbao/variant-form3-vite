<template>
  <el-form-item
    label="onDialogOpened"
    label-width="150px"
  >
    <el-button
      type="info"
      icon="el-icon-edit"
      plain
      round
      :class='[eventHandled ? "button-text-highlight" : ""]'
      @click="editEventHandler('onDialogOpened', eventParams)"
    >
      {{ i18nt('designer.setting.addEventHandler') }}</el-button
    >
  </el-form-item>
</template>

<script>
import i18n from '@/utils/i18n'
import eventMixin from '@/components/form-designer/setting-panel/property-editor/event-handler/eventMixin'

export default {
  name: 'onDialogOpened-editor',
  mixins: [i18n, eventMixin],
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object,
    eventHandled: {
      type: Boolean,
      default: !1
    }
  },
  data() {
    return {
      eventParams: []
    }
  }
}
</script>

<style scoped></style>
