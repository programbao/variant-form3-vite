<template>
  <div>
    <el-form-item :label="i18nt('designer.setting.customClass')">
      <el-select
        v-model="optionModel.customClass"
        @update:modelValue="val => optionModel.customClass = val"
        multiple
        filterable
        allow-create
        default-first-option
      >
        <el-option
          v-for="item, index in cssClassList"
          :key="index"
          :label="item"
          :value="item"
        />
      </el-select>
    </el-form-item>

    <el-form-item :label="i18nt('designer.setting.dsEnabled')">
      <el-switch
        v-model="optionModel.dsEnabled"
        @update:modelValue="val => optionModel.dsEnabled = val"
      />
    </el-form-item>

    <el-form-item v-if="optionModel.dsEnabled" :label="i18nt('designer.setting.dsName')">
      <el-select
        v-model="optionModel.dsName"
        @update:modelValue="val => optionModel.dsName = val"
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

    <el-form-item v-if="optionModel.dsEnabled" :label="i18nt('designer.setting.dataSetName')">
      <el-select
        v-model="optionModel.dataSetName"
        @update:modelValue="val => optionModel.dataSetName = val"
        filterable
        clearable
      >
        <el-option
          v-for="(item, index) in dataSetList"
          :key="index"
          :title="item.remark"
          :label="item.name"
          :value="item.name"
        />
      </el-select>
    </el-form-item>
  </div>
</template>

<script>
  import i18n from "@/utils/i18n"
  import {deepClone} from "@/utils/util";

  export default {
    name: "tree-customClass-editor",
    mixins: [i18n],
    props: {
      designer: Object,
      selectedWidget: Object,
      optionModel: Object,
    },
    data() {
        return {
            cssClassList: [],
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
    created() {
        this.cssClassList = deepClone(this.designer.getCssClassList()),
        this.designer.handleEvent("form-css-updated", e=>{
            this.cssClassList = e
        }
        )
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
