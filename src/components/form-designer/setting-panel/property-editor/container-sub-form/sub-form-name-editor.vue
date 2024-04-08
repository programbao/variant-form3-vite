<template>
  <el-form-item
    prop="name"
  >
    <template #label>
      <span>{{ i18nt('designer.setting.uniqueName') }}</span>
      <el-tooltip
        effect="light"
        :content="i18nt('designer.setting.editNameHelp')"
      >
        <svg-icon icon-class="el-info"></svg-icon>
      </el-tooltip>
    </template>
    <template #default>
      <template v-if="noSubFormList">
        <el-input
          v-model="optionModel.name"
          :readonly="widgetNameReadonly"
          @change="updateWidgetNameAndRef"
        ></el-input>
      </template>
      <template v-else>
        <el-select
          v-model="optionModel.name"
          allow-create
          filterable
          :disabled="widgetNameReadonly"
          @change="updateWidgetNameAndRef"
          :title="i18nt('designer.setting.editNameHelp')"
        >
        <el-option 
          v-for="(item, index) in serverSubFormList"
          :key="index"
          :label="item.label"
          :value="item.name"
        >
        </el-option>
      </el-select>
      </template>
    </template>
  </el-form-item>
</template>

<script>
import i18n from '@/utils/i18n'
import SvgIcon from '@/components/svg-icon/index'

export default {
  name: 'sub-form-name-editor',
  mixins: [i18n],
  components: {
    SvgIcon
  },
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object
  },
  inject: ['getServerSubFormList', 'getDesignerConfig'],
  data() {
    return {
    }
  },
  computed: {
    serverSubFormList() {
      return this.getServerSubFormList()
    },
    noSubFormList() {
      return !this.serverSubFormList || this.serverSubFormList.length <= 0
    },
    widgetNameReadonly() {
      return !!this.getDesignerConfig().widgetNameReadonly
    }
  },
  methods: {
    updateWidgetNameAndRef(e) {
      let o = this.designer.selectedWidgetName
      if (isEmptyStr(e)) {
        ;(this.selectedWidget.options.name = o),
          this.$message.info(this.i18nt('designer.hint.nameRequired'))
        return
      }
      if (this.designer.formWidget) {
        if (this.designer.formWidget.getWidgetRef(e)) {
          ;(this.selectedWidget.options.name = o),
            this.$message.info(this.i18nt('designer.hint.duplicateName') + e)
          return
        }
        let r = this.designer.formWidget.getWidgetRef(o)
        if (!!r && !!r.registerToRefList) {
          r.registerToRefList(o)
          let n = this.getLabelByFieldName(e)
          this.designer.updateSelectedWidgetNameAndLabel(
            this.selectedWidget,
            e,
            n
          )
        }
      }
    },
    getLabelByFieldName(e) {
      for (let o = 0; o < this.serverSubFormList.length; o++)
        if (this.serverSubFormList[o].name === e)
          return this.serverSubFormList[o].label
      return null
    }
  }
}
</script>

<style lang="scss" scoped>
.radio-group-custom {
  :deep(.el-radio-button__inner) {
    padding-left: 12px;
    padding-right: 12px;
  }
}
</style>
