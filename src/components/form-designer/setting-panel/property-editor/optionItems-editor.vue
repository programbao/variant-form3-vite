<!-- <template>
  <el-form-item label-width="0">
    <el-divider class="custom-divider-margin-top">{{i18nt('designer.setting.optionsSetting')}}</el-divider>
    <option-items-setting :designer="designer" :selected-widget="selectedWidget"></option-items-setting>
  </el-form-item>
</template> -->
<template>
  <template v-if="selectedWidget.options.areaDataEnabled">
    <el-form-item :label="i18nt('designer.setting.areaDataEnabled')">
      <el-switch v-model="optionModel.areaDataEnabled" disabled />
    </el-form-item>
  </template>

  <div v-if="selectedWidget.optionItemsReadonly" style="display: none"></div>

  <template v-else-if="!selectedWidget.options.areaDataEnabled">
    <el-form-item label-width="0">
      <el-divider class="custom-divider-margin-top">{{ i18nt('designer.setting.optionsSetting') }}</el-divider>
    </el-form-item>

    <el-form-item :label="i18nt('designer.setting.labelKeyName')">
      <el-input v-model="optionModel.labelKey" />
    </el-form-item>

    <el-form-item :label="i18nt('designer.setting.valueKeyName')">
      <el-input v-model="optionModel.valueKey" />
    </el-form-item>

    <el-form-item v-if="hasConfig('childrenKey')" :label="i18nt('designer.setting.childrenKeyName')">
      <el-input v-model="optionModel.childrenKey" />
    </el-form-item>

    <el-form-item :label="i18nt('designer.setting.dsEnabled')">
      <el-switch v-model="optionModel.dsEnabled" />
    </el-form-item>

    <template v-if="optionModel.dsEnabled">
      <el-form-item :label="i18nt('designer.setting.dsName')">
        <el-select
          v-model="optionModel.dsName"
          filterable
          clearable
          @change="getDataSetList"
        >
          <el-option
            v-for="(item, index) in dataSourceList"
            :key="index"
            :title="item.description"
            :label="item.uniqueName"
            :value="item.uniqueName"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="i18nt('designer.setting.dataSetName')">
        <el-select v-model="optionModel.dataSetName" filterable clearable>
          <el-option
            v-for="(item, index) in dataSetList"
            :key="index"
            :title="item.remark"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
    </template>

    <template v-else>
      <el-form-item label-width="0">
        <option-items-setting
          :designer="designer"
          :selected-widget="selectedWidget"
        />
      </el-form-item>
    </template>
  </template>
</template>
<script>
  import i18n from "@/utils/i18n"
  import OptionItemsSetting from "@/components/form-designer/setting-panel/option-items-setting"
  import propertyMixin from "@/components/form-designer/setting-panel/property-editor/propertyMixin"
  import { getDSByName } from '@/utils/util'

  export default {
    name: "optionItems-editor",
    mixins: [i18n, propertyMixin],
    props: {
      designer: Object,
      selectedWidget: Object,
      optionModel: Object,
    },
    components: {
      OptionItemsSetting,
    },
    data() {
        return {
            dataSetList: []
        }
    },
    computed: {
        dataSourceList() {
            return !this.designer.formConfig || !this.designer.formConfig.dataSources ? [] : this.designer.formConfig.dataSources
        }
    },
    watch: {
        selectedWidget: {
            handler(e, o) {
                !e || this.loadDataSet(e.options.dsName)
            },
            immediate: !0
        }
    },
    methods: {
        loadDataSet(e) {
            if (this.dataSetList.length = 0,
            !e)
                return;
            let o = getDSByName(this.designer.formConfig, e);
            !!o && !!o.dataSets && o.dataSets.forEach(t=>{
                this.dataSetList.push({
                    name: t.name,
                    remark: t.remark
                })
            }
            )
        },
        getDataSetList() {
            this.optionModel.dataSetName = "",
            this.loadDataSet(this.optionModel.dsName)
        }
    }
  }
</script>

<style scoped>

</style>
