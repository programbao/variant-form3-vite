<template>
  <div id="app">
    <VFormDesigner
      ref="vfDesignerRef"
      :global-dsv="globalDsv"
      :field-list-data="fieldListData"
      @FieldWidgetUsed="handleFWU"
      @FieldWidgetRemoved="handleFWR"
      @FormJsonUpdated="handleFJU"
    >
      <!--
      <template #customToolButtons>
        <el-button type="text" @click="doTest">测试btn</el-button>
      </template>
      -->
    </VFormDesigner>
  </div>
</template>

<script>
import VFormDesigner from './components/form-designer/index.vue'

export default {
  name: 'App',
  components: {
    VFormDesigner
  },
  data() {
    return {
      formJson: {
        widgetList: [],
        formConfig: {
          modelName: 'formData',
          refName: 'vForm',
          rulesName: 'rules',
          labelWidth: 80,
          labelPosition: 'left',
          size: '',
          labelAlign: 'label-left-align',
          cssCode: '',
          customClass: '',
          functions: '',
          layoutType: 'PC',
          onFormCreated: '',
          onFormMounted: '',
          onFormDataChange: '',
          onFormValidate: ''
        }
      },
      formData: {},
      optionData: {},
      designerConfig: {
        metadataLib: !1
      },
      fieldListData: {
        fieldList: [
          
        ],
        subFormList: [
          
        ]
      },
      globalDsv: {
        testApiHost: 'http://www.test.com/api'
      }
    }
  },
  computed: {
    //
  },
  methods: {
    doTest() {
      let fieldList = this.$refs.vfDesignerRef.getFieldWidgets(null, true)
      console.log('test', fieldList)
    },
    changeThemePrimaryColor() {
            const e = document.getElementsByTagName("body")[0];
            e.style.setProperty("--vf-color-primary", "red"),
            e.style.setProperty("--el-color-primary", "red")
        },
        handleFWU(e) {
            console.info(e)
        },
        handleFWR(e) {
            console.info(e)
        },
        handleFJU(e) {
            console.warn("form json updated...", e)
        }
  }
}
</script>

<style lang="scss">
#app {
  height: 100%;
}
</style>
