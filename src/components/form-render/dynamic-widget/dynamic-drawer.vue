<template>
  <el-drawer
    ref="drawerRef"
    :title="newTitle"
    v-model="drawerVisible"
    class="dynamic-drawer"
    append-to-body
    destroy-on-close
    :size="options.size"
    :modal="options.showModal"
    :direction="options.direction"
    :show-close="options.showClose"
    :close-on-click-modal="options.closeOnClickModal"
    :close-on-press-escape="options.closeOnPressEscape"
    :before-close="handleBeforeClose"
    @close="handleCloseEvent"
    @opened="handleOpenedEvent"
  >
    <template #default>
      <VFormRender
        ref="dFormRef"
        :form-json="formJson"
        :option-data="testOptionData"
        :global-dsv="globalDsv"
        :parent-form="parentFormRef"
        :disabled-mode="options.disabledMode"
        :dynamic-creation="true"
      >
        <!-- 递归传递插槽！！！ -->
        <!-- <template
            v-for="slot in Object.keys($slots)"
            v-slot:[slot]="scope"
          >
            <slot
              :name="slot"
              v-bind="scope"
            />
          </template> -->
      </VFormRender>
    </template>
    <template #footer>
      <div style="float: right">
        <el-button
          v-if="!options.cancelButtonHidden"
          @click="handleCancelClick"
          >{{ cancelBtnLabel }}</el-button
        >
        <el-button
          type="primary"
          v-if="!options.okButtonHidden"
          @click="handleOkClick"
          >{{ okBtnLabel }}</el-button
        >
      </div>
    </template>
  </el-drawer>
</template>

<script>
import i18n from '@/utils/i18n'
// import VFormRender from '@/components/form-render/index'
export default {
  name: 'dynamic-drawer',
  mixins: [i18n],
  // components: {
  //   VFormRender
  // },
  props: {
    options: {
      type: Object,
      default: () => ({})
    },
    formJson: {
      type: Object
    },
    formData: {
      type: Object,
      default: () => ({})
    },
    optionData: {
      type: Object,
      default: () => ({})
    },
    globalDsv: {
      type: Object,
      default: () => ({})
    },
    parentFormRef: {
      type: Object,
      default: null
    },
    extraData: {
      type: Object,
      default: () => ({})
    },
    wrapperId: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      drawerVisible: !1
    }
  },
  computed: {
    cancelBtnLabel() {
      return (
        this.options.cancelButtonLabel || this.i18nt('designer.hint.cancel')
      )
    },
    okBtnLabel() {
      return this.options.okButtonLabel || this.i18nt('designer.hint.confirm')
    },
    newTitle() {
      return this.title || this.options.title
    }
  },
  created() {},
  mounted() {},
  beforeDestroy() {
    this.parentFormRef.setChildFormRef(null)
  },
  methods: {
    show() {
      return (
        (this.drawerVisible = !0),
        this.$nextTick(() => {
          this.$refs.dFormRef.setFormData(this.formData),
            this.$nextTick(() => {
              this.options.readMode && this.$refs.dFormRef.setReadMode(!0)
            }),
            this.$refs.dFormRef.setDialogOrDrawerRef(this),
            this.parentFormRef.setChildFormRef(this.$refs.dFormRef)
        }),
        this
      )
    },
    close() {
      ;(this.options.onDrawerBeforeClose &&
        new Function(this.options.onDrawerBeforeClose).call(this) === !1) ||
        ((this.drawerVisible = !1),
        this.$refs.drawerRef.handleClose(),
        setTimeout(this.deleteWrapperNode, 150))
    },
    deleteWrapperNode() {
      let e = document.getElementById(
        'vf-dynamic-drawer-wrapper' + this.wrapperId
      )
      e && document.body.removeChild(e)
    },
    handleBeforeClose(e) {
      if (this.options.onDrawerBeforeClose) {
        let t = new Function(this.options.onDrawerBeforeClose).call(this)
        return t === !1 ? t : e()
      }
      return e()
    },
    handleCloseEvent() {
      ;(this.drawerVisible = !1), setTimeout(this.deleteWrapperNode, 150)
    },
    handleOpenedEvent() {
      this.options.onDrawerOpened &&
        new Function(this.options.onDrawerOpened).call(this)
    },
    handleCancelClick() {
      ;(this.options.onCancelButtonClick &&
        new Function(this.options.onCancelButtonClick).call(this) === !1) ||
        ((this.drawerVisible = !1), setTimeout(this.deleteWrapperNode, 150))
    },
    handleOkClick() {
      ;(this.options.onOkButtonClick &&
        new Function(this.options.onOkButtonClick).call(this) === !1) ||
        ((this.drawerVisible = !1), setTimeout(this.deleteWrapperNode, 150))
    },
    getParentFormRef() {
      return this.parentFormRef
    },
    getTopFormRef() {
      if (!this.parentFormRef.parentForm) return this.parentFormRef
      let e = this.parentFormRef
      for (; e.parentForm; ) e = e.parentForm
      return e
    },
    getFormRef() {
      return this.$refs.dFormRef
    },
    getWidgetRef(e, o = !1) {
      return this.$refs.dFormRef.getWidgetRef(e, o)
    },
    getExtraData() {
      return this.extraData
    }
  }
}
</script>

<style scoped></style>
