<template>
  <el-form-item prop="name" :rules="nameRequiredRule">
    <template #label>
      <span>{{i18nt('designer.setting.uniqueName')}}
        <el-tooltip effect="light" :content="i18nt('designer.setting.editNameHelp')">
          <svg-icon icon-class="el-info" /></el-tooltip>
      </span>
    </template>
    <template v-if="!!selectedWidget.category || noFieldList">
      <el-input type="text" v-model="optionModel.name" :readonly="widgetNameReadonly" @change="updateWidgetNameAndRef"></el-input>
    </template>
    <template v-else>
      <el-select v-model="optionModel.name" allow-create filterable :disabled="widgetNameReadonly" @change="updateWidgetNameAndRef"
                 :title="i18nt('designer.setting.editNameHelp')">
        <el-option v-for="(sf, sfIdx) in serverFieldList" :key="sfIdx" :label="sf.label" :value="sf.name"></el-option>
      </el-select>
    </template>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n"
  import {isEmptyStr} from "@/utils/util"
  import SvgIcon from "@/components/svg-icon/index";

  export default {
    name: "name-editor",
    mixins: [i18n],
    components: {
      SvgIcon
    },
    props: {
      designer: Object,
      selectedWidget: Object,
      optionModel: Object,
    },
    inject: ["getServerFieldList", "getDesignerConfig"],
    data() {
        return {
            nameRequiredRule: [{
                // required: true,
                // message: "name required"
            }]
        }
    },
    computed: {
        serverFieldList() {
            return this.getServerFieldList()
        },
        noFieldList() {
            return !this.serverFieldList || this.serverFieldList.length <= 0
        },
        widgetNameReadonly() {
            return !!this.getDesignerConfig().widgetNameReadonly || !!this.selectedWidget.nameReadonly
        }
    },
    methods: {
        updateWidgetNameAndRef(e) {
            let o = this.designer.selectedWidgetName;
            if (isEmptyStr(e)) {
                this.selectedWidget.options.name = o,
                this.$message.info(this.i18nt("designer.hint.nameRequired"));
                return
            }
            if (this.designer.formWidget) {
                if (this.designer.formWidget.getWidgetRef(e)) {
                    this.selectedWidget.options.name = o,
                    this.$message.info(this.i18nt("designer.hint.duplicateName") + e);
                    return
                }
                let r = this.designer.formWidget.getWidgetRef(o);
                if (!!r && !!r.registerToRefList) {
                    r.registerToRefList(o);
                    let n = this.getLabelByFieldName(e);
                    this.designer.updateSelectedWidgetNameAndLabel(this.selectedWidget, e, n)
                }
            }
        },
        getLabelByFieldName(e) {
            for (let o = 0; o < this.serverFieldList.length; o++)
                if (this.serverFieldList[o].name === e)
                    return this.serverFieldList[o].label;
            return null
        }
    }
  }
</script>

<style lang="scss" scoped>

</style>
