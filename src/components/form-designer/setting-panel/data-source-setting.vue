<template>
  <div class="ds-list">
    <el-descriptions
      v-if="formConfig.dataSources && formConfig.dataSources.length > 0"
      v-for="(dataSource, index) in formConfig.dataSources"
      :key="index"
      column="1"
      size="small"
      border=""
    >
      <template #title>
        <span :title="dataSource.description">{{ dataSource.uniqueName }}</span>
      </template>
      <template #extra>
        <el-button
          type="primary"
          icon="el-icon-edit"
          plain
          circle
          size="small"
          @click="editDataSource(index)"
        ></el-button>
        <el-button
          type="danger"
          icon="el-icon-delete"
          plian
          circle
          size="small"
          @click="deleteDataSource(index)"
        ></el-button>
      </template>
      <el-descriptions-item>
        <template #label>
          <div :title="dataSource.requestURL">
            <el-icon><platform /></el-icon>
          </div>
        </template>
        {{ dataSource.requestURL }}
      </el-descriptions-item>
    </el-descriptions>
    <el-empty
      v-else
      :description="i18nt('designer.setting.noDataSource')"
    ></el-empty>
    <div class="ds-button-wrapper">
      <el-button-group>
        <el-button
          type="primary"
          icon="el-icon-plus"
          plain
          @click="addDataSource"
          >{{ i18nt('designer.setting.addDataSource') }}</el-button
        >
        <el-button
          icon="el-icon-bottom-left"
          plain
          :title="i18nt('designer.setting.importDataSource')"
          @click="importDataSource"
        ></el-button>
        <el-button
          icon="el-icon-top-right"
          plain
          :title="i18nt('designer.setting.exportDataSource')"
          @click="exportDataSource"
        ></el-button>
      </el-button-group>
    </div>
  </div>

  <!-- DataSource Setting Dialog -->
  <el-drawer
    :title="i18nt('designer.setting.dataSourceSetting')"
    direction="rtl"
    v-model="showDataSourceDialogFlag"
    :modal="true"
    :size="820"
    :destroy-on-close="true"
    :append-to-body="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="ds-setting-drawer header-small-mb"
  >
    <el-form
      ref="dsForm"
      :model="dsModel"
      :rules="formRules"
      label-width="160px"
      label-position="left"
      class="ds-form"
    >
      <el-form-item
        :label="i18nt('designer.setting.dsUniqueName')"
        prop="uniqueName"
      >
        <el-input v-model="dsModel.uniqueName"></el-input>
      </el-form-item>
      <el-row style="width: 100%">
        <el-col :span="20">
          <el-form-item
            :label="i18nt('designer.setting.dsRequestURL')"
            prop="requestURL"
          >
            <el-input v-model="dsModel.requestURL"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item
            label-width="0"
            prop="requestURLType"
            class="no-left-margin"
          >
            <el-select
              v-model="dsModel.requestURLType"
              :placeholder="i18nt('designer.setting.dsRequestURLType')"
            >
              <el-option
                :label="i18nt('designer.setting.dsURLStringType')"
                value="String"
              ></el-option>
              <el-option
                :label="i18nt('designer.setting.dsURLVariableType')"
                value="Variable"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        :label="i18nt('designer.setting.dsDescription')"
        prop="description"
      >
        <el-input
          v-model="dsModel.description"
          type="textarea"
          :rows="2"
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="i18nt('designer.setting.dsRequestMethod')"
        prop="requestMethod"
      >
        <el-radio-group v-model="dsModel.requestMethod">
          <el-radio-button label="get">get</el-radio-button>
          <el-radio-button label="post">post</el-radio-button>
          <el-radio-button label="put">put</el-radio-button>
          <el-radio-button label="delete">delete</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="i18nt('designer.setting.dsRequestHeaders')">
        <el-row
          v-for="(header, index) in dsModel.headers"
          :key="index"
          class="rh-row"
          :gutter="8"
        >
          <el-col :span="8">
            <el-form-item
              :prop="`headers.${index}.name`"
              :rules="nameRules"
              label-width="0"
            >
              <el-input
                v-model="header.name"
                :placeholder="
                  i18nt('designer.setting.dsRequestNameInputPlaceholder')
                "
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item
              :prop="`headers.${index}.type`"
              label-width="0"
            >
              <el-select
                v-model="header.type"
                :placeholder="
                  i18nt('designer.setting.dsRequestTypeInputPlaceholder')
                "
              >
                <el-option
                  :label="i18nt('designer.setting.dsRequestValueStringType')"
                  value="String"
                ></el-option>
                <el-option
                  :label="i18nt('designer.setting.dsRequestValueNumberType')"
                  value="Number"
                ></el-option>
                <el-option
                  :label="i18nt('designer.setting.dsRequestValueBooleanType')"
                  value="Boolean"
                ></el-option>
                <el-option
                  :label="i18nt('designer.setting.dsRequestValueVariableType')"
                  value="Variable"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              :prop="`headers.${index}.value`"
              :rules="valueRules"
              label-width="0"
            >
              <el-input
                v-model="header.value"
                :placeholder="
                  i18nt('designer.setting.dsRequestValueInputPlaceholder')
                "
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-button
              icon="el-icon-delete"
              plain
              circle
              @click="deleteRequestHeader(index)"
            ></el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-button
              link
              type="primary"
              icon="el-icon-plus"
              @click="addRequestHeader"
              >{{ i18nt('designer.setting.addRequestHeader') }}</el-button
            >
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item :label="i18nt('designer.setting.dsRequestParams')">
        <el-row
          v-for="(param, index) in dsModel.params"
          :key="index"
          class="rd-row"
          :gutter="8"
        >
          <el-col :span="8">
            <el-form-item
              :prop="`params.${index}.name`"
              :rules="nameRules"
              label-width="0"
            >
              <el-input
                v-model="param.name"
                :placeholder="
                  i18nt('designer.setting.dsRequestNameInputPlaceholder')
                "
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item
              :prop="`params.${index}.type`"
              label-width="0"
            >
              <el-select
                v-model="param.type"
                :placeholder="
                  i18nt('designer.setting.dsRequestTypeInputPlaceholder')
                "
              >
                <el-option
                  :label="i18nt('designer.setting.dsRequestValueStringType')"
                  value="String"
                ></el-option>
                <el-option
                  :label="i18nt('designer.setting.dsRequestValueNumberType')"
                  value="Number"
                ></el-option>
                <el-option
                  :label="i18nt('designer.setting.dsRequestValueBooleanType')"
                  value="Boolean"
                ></el-option>
                <el-option
                  :label="i18nt('designer.setting.dsRequestValueVariableType')"
                  value="Variable"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              :prop="`params.${index}.value`"
              :rules="valueRules"
              label-width="0"
            >
              <el-input
                v-model="param.value"
                :placeholder="
                  i18nt('designer.setting.dsRequestValueInputPlaceholder')
                "
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-button
              icon="el-icon-delete"
              plain
              circle
              @click="deleteRequestParam(index)"
            ></el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-button
              link
              type="primary"
              icon="el-icon-plus"
              @click="addRequestParam"
              >{{ i18nt('designer.setting.addRequestParam') }}</el-button
            >
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item :label="i18nt('designer.setting.dsRequestData')">
        <el-row
          v-for="(data, index) in dsModel.data"
          :key="index"
          class="rd-row"
          :gutter="8"
        >
          <el-col :span="8">
            <el-form-item
              :prop="`data.${index}.name`"
              :rules="nameRules"
              label-width="0"
            >
              <el-input
                v-model="data.name"
                :placeholder="
                  i18nt('designer.setting.dsRequestNameInputPlaceholder')
                "
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item
              :prop="`data.${index}.type`"
              label-width="0"
            >
              <el-select
                v-model="data.type"
                :placeholder="
                  i18nt('designer.setting.dsRequestTypeInputPlaceholder')
                "
              >
                <el-option
                  :label="i18nt('designer.setting.dsRequestValueStringType')"
                  value="String"
                ></el-option>
                <el-option
                  :label="i18nt('designer.setting.dsRequestValueNumberType')"
                  value="Number"
                ></el-option>
                <el-option
                  :label="i18nt('designer.setting.dsRequestValueBooleanType')"
                  value="Boolean"
                ></el-option>
                <el-option
                  :label="i18nt('designer.setting.dsRequestValueVariableType')"
                  value="Variable"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              :prop="`data.${index}.value`"
              :rules="valueRules"
              label-width="0"
            >
              <el-input
                v-model="data.value"
                :placeholder="
                  i18nt('designer.setting.dsRequestValueInputPlaceholder')
                "
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-button
              icon="el-icon-delete"
              plain
              circle
              @click="deleteRequestData(index)"
            ></el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-button
              link
              type="primary"
              icon="el-icon-plus"
              @click="addRequestData"
              >{{ i18nt('designer.setting.addRequestData') }}</el-button
            >
          </el-col>
        </el-row>
      </el-form-item>
      <el-tabs
        v-model="activeNames"
        type="border-card"
      >
        <el-tab-pane
          name="1"
          :label="i18nt('designer.setting.dsConfigHandlerTitle')"
        >
          <el-alert
            type="info"
            :closable="false"
            :title="'(config, isSandbox, DSV, VFR) => {'"
          ></el-alert>
          <code-editor
            mode="javascript"
            readonly="false"
            v-model="dsModel.configHandlerCode"
            ref="chEditor"
          ></code-editor>
          <el-alert
            type="info"
            :closable="false"
            :title="'}'"
          />
        </el-tab-pane>
        <el-tab-pane
          name="2"
          :label="i18nt('designer.setting.dsDataHandlerTitle')"
        >
          <el-alert
            type="info"
            :closable="false"
            :title="'(result, isSandbox, DSV, VFR) => {'"
          ></el-alert>
          <code-editor
            mode="javascript"
            readonly="false"
            v-model="dsModel.dataHandlerCode"
            ref="dhEditor"
          ></code-editor>
          <el-alert
            type="info"
            :closable="false"
            :title="'}'"
          ></el-alert>
        </el-tab-pane>
        <el-tab-pane
          name="3"
          :label="i18nt('designer.setting.dsErrorHandlerTitle')"
        >
          <el-alert
            type="info"
            :closable="false"
            :title="'(error, isSandbox, DSV, $message, VFR) => {'"
          ></el-alert>
          <code-editor
            mode="javascript"
            readonly="false"
            v-model="dsModel.errorHandlerCode"
            ref="ehEditor"
          ></code-editor>
          <el-alert
            type="info"
            :closable="false"
            :title="'}'"
          ></el-alert>
        </el-tab-pane>
        <el-tab-pane
          name="4"
          :label="i18nt('designer.setting.dataSetSettingTitle')"
        >
          <el-form-item :label="i18nt('designer.setting.dataSetEnabled')">
            <el-switch v-model="dsModel.dataSetEnabled"></el-switch>
          </el-form-item>
          <el-form-item
            v-if="dsModel.dataSetEnabled"
            :label="i18nt('designer.setting.dataSetSetting')"
            class="display-block"
          >
            <el-row
              v-for="(dataSet, index) in dsModel.dataSets"
              :key="index"
              class="rd-row"
              :gutter="8"
            >
              <el-col :span="7">
                <el-form-item
                  :prop="`dataSets.${index}.name`"
                  :rules="nameRules"
                  label-width="0"
                >
                  <el-input
                    v-model="dataSet.name"
                    :placeholder="
                      i18nt('designer.setting.dsRequestNameInputPlaceholder')
                    "
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  :prop="`dataSets.${index}.remark`"
                  label-width="0"
                >
                  <el-input
                    v-model="dataSet.remark"
                    :placeholder="
                      i18nt('designer.setting.dataSetRemarkInputPlaceholder')
                    "
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-button
                  icon="el-icon-delete"
                  plain
                  circle
                  @click="deleteDataSet(index)"
                ></el-button>
              </el-col>
            </el-row>
            <el-row
              class="rd-row"
              :gutter="8"
            >
              <el-col :span="6">
                <el-button
                  link
                  type="primary"
                  icon="el-icon-plus"
                  @click="addDataSet"
                  >{{ i18nt('designer.setting.addDataSet') }}</el-button
                >
              </el-col>
            </el-row>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button
          style="float: left"
          type="primary"
          plain
          @click="testDataSource"
          >{{ i18nt('designer.setting.testDataSource') }}</el-button
        >
        <el-button @click="showDataSourceDialogFlag = false">{{
          i18nt('designer.hint.cancel')
        }}</el-button>
        <el-button
          type="primary"
          @click="saveDataSource"
          >{{ i18nt('designer.hint.confirm') }}</el-button
        >
      </div>
    </template>
  </el-drawer>

  <!-- Test DataSource Dialog -->
  <div
    v-if="showTestDataSourceDialogFlag"
    v-drag="['.drag-dialog.el-dialog', '.drag-dialog .el-dialog__header']"
  >
    <el-dialog
      :title="i18nt('designer.setting.testDataSource')"
      v-model="showTestDataSourceDialogFlag"
      :show-close="true"
      class="drag-dialog small-padding-dialog"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :destroy-on-close="true"
    >
      <el-alert
        type="info"
        :closable="false"
        :title="i18nt('designer.setting.dsvTitle')"
      ></el-alert>
      <code-editor
        mode="json"
        readonly="false"
        v-model="dsvJson"
        class="dsv-json-editor"
      ></code-editor>
      <div class="footer-button">
        <el-button
          type="primary"
          @click="doDataSourceRequest"
          >{{ i18nt('designer.setting.executeDataSource') }}</el-button
        >
        <el-button
          type="primary"
          plain
          @click="clearRequestResult"
          >{{ i18nt('designer.setting.clearRequestResult') }}</el-button
        >
        <el-button @click="showTestDataSourceDialogFlag = false">{{
          i18nt('designer.hint.closePreview')
        }}</el-button>
      </div>
      <el-alert
        type="info"
        :closable="false"
        :title="i18nt('designer.setting.dsRequestResult')"
      ></el-alert>
      <code-editor
        mode="json"
        readonly="true"
        v-model="dsResultJson"
        ref="dsResultEditor"
      ></code-editor>
    </el-dialog>
  </div>

  <!-- Import DataSource Dialog -->
  <div
    v-if="showImportDSDialogFlag"
    v-drag="['.drag-dialog.el-dialog', '.drag-dialog .el-dialog__header']"
  >
    <el-dialog
      :title="i18nt('designer.setting.importDataSource')"
      v-model="showImportDSDialogFlag"
      :show-close="true"
      class="drag-dialog small-padding-dialog"
      center
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :destroy-on-close="true"
    >
      <el-alert
        type="info"
        :title="i18nt('designer.hint.importDSHint')"
        show-icon
        class="alert-padding"
      ></el-alert>
      <code-editor
        mode="json"
        readonly="false"
        v-model="importDSTemplate"
      ></code-editor>
      <el-switch
        v-model="clearOldDSFlag"
        style="margin-top: 10px"
        :active-text="i18nt('designer.setting.clearExistingDataSource')"
        :inactive-text="i18nt('designer.setting.remainExistingDataSource')"
      ></el-switch>
      <template #footer="{ dialogFooter }">
        <div class="dialog-footer-center">
          <el-button
            type="primary"
            @click="doImportDataSource"
            >{{ i18nt('designer.hint.import') }}</el-button
          >
          <el-button @click="showImportDSDialogFlag = false">{{
            i18nt('designer.hint.cancel')
          }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>

  <!-- Export DataSource Dialog -->
  <div
    v-if="showExportDSDialogFlag"
    v-drag="['.drag-dialog.el-dialog', '.drag-dialog .el-dialog__header']"
  >
    <el-dialog
      :title="i18nt('designer.setting.exportDataSource')"
      v-model="showExportDSDialogFlag"
      :show-close="true"
      class="drag-dialog small-padding-dialog"
      center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :destroy-on-close="true"
    >
      <el-tabs
        v-model="activeExportTab"
        type="border-card"
        class="no-box-shadow no-padding"
        @tab-click="handleExportTabClick"
      >
        <el-tab-pane
          :label="i18nt('designer.setting.selectDataSourceForExport')"
          name="setting"
        >
          <div
            class="export-ds-list"
            v-if="exportDSArray && exportDSArray.length > 0"
          >
            <el-descriptions
              v-for="(dataSource, index) in exportDSArray"
              :key="index"
              column="1"
              size="small"
              border=""
            >
              <template #title>
                <span :title="dataSource.description">{{
                  dataSource.uniqueName
                }}</span>
              </template>
              <template #extra>
                <el-checkbox
                  v-model="dataSource.checked"
                  @change="handleExportDSChange"
                  >{{
                    i18nt('designer.setting.dataSourceChecked')
                  }}</el-checkbox
                >
              </template>
              <el-descriptions-item>
                <template #label>
                  <div :title="dataSource.requestURL">
                    <el-icon><platform /></el-icon>
                  </div>
                </template>
                {{ dataSource.requestURL }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
          <el-empty
            v-else
            :description="i18nt('designer.setting.noDataSource')"
          ></el-empty>
        </el-tab-pane>
        <el-tab-pane
          :label="i18nt('designer.setting.previewDataSourceExportResult')"
          name="result"
        >
          <code-editor
            mode="json"
            readonly
            :modelValue="dsExportContent"
            @update:modelValue="dsExportContent = $event"
            ref="exportDSEditor"
          ></code-editor>
        </el-tab-pane>
      </el-tabs>
      <template #footer="{ dialogFooter }">
        <div class="dialog-footer-center">
          <el-button
            type="primary"
            class="copy-json-btn"
            :data-clipboard-text="dsRawExportContent"
            @click="copyDataSourceJson"
            >{{ i18nt('designer.hint.copyJson') }}</el-button
          >
          <el-button
            type=""
            @click="showExportDSDialogFlag = false"
            >{{ i18nt('designer.hint.closePreview') }}</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import CodeEditor from '@/components/code-editor/index'
import i18n from '@/utils/i18n'
import { Platform } from '@element-plus/icons-vue'
import {deepClone, generateId, copyToClipboard, runDataSourceRequest} from "@/utils/util"

export default {
  name: 'data-source-setting',
  mixins: [i18n],
  inject: ['getGlobalDsv'],
  components: {
    Platform,
    CodeEditor
  },
  props: {
    designer: Object,
    formConfig: Object
  },
  data() {
    return {
      activeNames: '2',
      dsModel: {
        dataSourceId: null,
        uniqueName: '',
        requestURL: '',
        requestURLType: 'String',
        description: '',
        headers: [],
        params: [],
        data: [],
        requestMethod: 'get',
        configHandlerCode: '  return config',
        dataHandlerCode: '  return result.data.data;',
        errorHandlerCode: '  $message.error(error.message);',
        dataSetEnabled: !1,
        dataSets: []
      },
      curEditDSIdx: -1,
      formRules: {
        uniqueName: [
          {
            required: !0,
            trigger: ['blur', 'change'],
            message: this.i18nt('designer.setting.fieldValueRequired')
          }
        ],
        requestURL: [
          {
            required: !0,
            trigger: ['blur', 'change'],
            message: this.i18nt('designer.setting.fieldValueRequired')
          }
        ],
        requestMethod: [
          {
            required: !0,
            trigger: ['blur', 'change'],
            message: this.i18nt('designer.setting.fieldValueRequired')
          }
        ]
      },
      nameRules: [
        {
          required: !0,
          trigger: ['blur', 'change'],
          message: this.i18nt('designer.setting.fieldValueRequired')
        }
      ],
      valueRules: [
        {
          required: !0,
          trigger: ['blur', 'change'],
          message: this.i18nt('designer.setting.fieldValueRequired')
        },
        {
          validator: this.validateValueInput,
          trigger: ['blur', 'change']
        }
      ],
      showDataSourceDialogFlag: !1,
      dsvJson: `{
  
}`,
      dsResultJson: '',
      showTestDataSourceDialogFlag: !1,
      showImportDSDialogFlag: !1,
      importDSTemplate: '',
      clearOldDSFlag: !1,
      showExportDSDialogFlag: !1,
      activeExportTab: 'setting',
      exportDSArray: [],
      dsExportContent: '',
      dsRawExportContent: ''
    }
  },
  methods: {
    validateValueInput(e, o, t) {
      let r = e.field,
        n = r.substring(0, r.indexOf('.')),
        l = Number(r.substring(r.indexOf('.') + 1, r.lastIndexOf('.'))),
        i = this.dsModel[n][l].type
      i === 'Number'
        ? isNaN(o)
          ? t(
              new Error(this.i18nt('designer.setting.dsRequestNumberTypeError'))
            )
          : t()
        : i === 'Boolean'
        ? o.toLowerCase() === 'true' ||
          o.toLowerCase() === 'false' ||
          o.toLowerCase() === 'null' ||
          o === '1' ||
          o === '0'
          ? t()
          : t(
              new Error(
                this.i18nt('designer.setting.dsRequestBooleanTypeError')
              )
            )
        : t()
    },
    addDataSource() {
      ;(this.curEditDSIdx = -1),
        (this.dsModel = new Object({})),
        (this.dsModel.dataSourceId = null),
        (this.dsModel.uniqueName = ''),
        (this.dsModel.requestURL = ''),
        (this.dsModel.requestURLType = 'String'),
        (this.dsModel.requestMethod = 'get'),
        (this.dsModel.description = ''),
        (this.dsModel.headers = []),
        (this.dsModel.params = []),
        (this.dsModel.data = []),
        (this.dsModel.configHandlerCode = '  return config'),
        (this.dsModel.dataHandlerCode = '  return result.data.data;'),
        (this.dsModel.errorHandlerCode = '  $message.error(error.message);'),
        (this.dsModel.dataSetEnabled = !1),
        (this.dsModel.dataSets = []),
        (this.showDataSourceDialogFlag = !0)
    },
    editDataSource(e) {
      ;(this.dsModel = deepClone(this.formConfig.dataSources[e])),
        this.dsModel.hasOwnProperty('dataSets') || (this.dsModel.dataSets = []),
        (this.curEditDSIdx = e),
        (this.showDataSourceDialogFlag = !0)
    },
    saveDataSource() {
      this.$refs.dsForm.validate((e, o) => {
        if (!e) {
          this.$message.error(this.i18nt('designer.setting.dsValidationError'))
          return
        }
        this.dsModel.dataSourceId =
          this.dsModel.dataSourceId || 'ds' + generateId()
        let t = this.dsModel.dataSourceId,
          r = this.dsModel.uniqueName,
          n = !1
        if (
          (this.formConfig.dataSources.map((l) => {
            l.uniqueName === r && l.dataSourceId !== t && (n = !0)
          }),
          n)
        ) {
          this.$message.error(
            this.i18nt('designer.setting.dsDuplicatedNameError')
          )
          return
        }
        this.curEditDSIdx >= 0
          ? (this.formConfig.dataSources.splice(
              this.curEditDSIdx,
              1,
              this.dsModel
            ),
            (this.showDataSourceDialogFlag = !1))
          : (this.formConfig.dataSources.push(this.dsModel),
            (this.showDataSourceDialogFlag = !1))
      })
    },
    deleteDataSource(e) {
      this.$confirm(
        this.i18nt('designer.setting.deleteDataSourceHint'),
        this.i18nt('render.hint.prompt'),
        {
          confirmButtonText: this.i18nt('render.hint.confirm'),
          cancelButtonText: this.i18nt('render.hint.cancel')
        }
      )
        .then(() => {
          this.formConfig.dataSources.splice(e, 1)
        })
        .catch((o) => {})
    },
    addRequestHeader() {
      this.dsModel.headers.push({
        name: '',
        type: 'String',
        value: ''
      })
    },
    deleteRequestHeader(e) {
      this.dsModel.headers.splice(e, 1)
    },
    addRequestParam() {
      this.dsModel.params.push({
        name: '',
        type: 'String',
        value: ''
      })
    },
    deleteRequestParam(e) {
      this.dsModel.params.splice(e, 1)
    },
    addRequestData() {
      this.dsModel.data.push({
        name: '',
        type: 'String',
        value: ''
      })
    },
    deleteRequestData(e) {
      this.dsModel.data.splice(e, 1)
    },
    testDataSource() {
      let e = this.getGlobalDsv() || {}
      ;(this.dsvJson = JSON.stringify(e, null, '  ')),
        (this.showTestDataSourceDialogFlag = !0)
    },
    async doDataSourceRequest() {
      let e = JSON.parse(this.dsvJson),
        o = await runDataSourceRequest(this.dsModel, e, null, !0, this.$message)
      this.$refs.dsResultEditor.setValue(JSON.stringify(o, null, '  '))
    },
    clearRequestResult() {
      this.$refs.dsResultEditor.setValue('')
    },
    addDataSet() {
      this.dsModel.dataSets.push({
        name: '',
        remark: ''
      })
    },
    deleteDataSet(e) {
      this.dsModel.dataSets.splice(e, 1)
    },
    importDataSource() {
      ;(this.importDSTemplate = ''), (this.showImportDSDialogFlag = !0)
    },
    doImportDataSource() {
      try {
        let e = JSON.parse(this.importDSTemplate)
        this.clearOldDSFlag &&
          this.formConfig.dataSources.splice(
            0,
            this.formConfig.dataSources.length
          ),
          (this.formConfig.dataSources = this.formConfig.dataSources.concat(e)),
          this.$message.success(this.i18nt('designer.hint.importJsonSuccess')),
          this.designer.emitHistoryChange(),
          (this.showImportDSDialogFlag = !1)
      } catch (e) {
        this.$message.error(e.message)
      }
    },
    exportDataSource() {
      ;(this.dsExportContent = ''),
        (this.dsRawExportContent = ''),
        this.exportDSArray.splice(0, this.exportDSArray.length),
        !!this.formConfig.dataSources &&
          this.formConfig.dataSources.length > 0 &&
          this.formConfig.dataSources.forEach((e) => {
            let o = deepClone(e)
            ;(o.checked = !1), this.exportDSArray.push(o)
          }),
        (this.showExportDSDialogFlag = !0)
    },
    copyDataSourceJson(e) {
      copyToClipboard(
        this.dsRawExportContent,
        e,
        this.$message,
        this.i18nt('designer.hint.copyJsonSuccess'),
        this.i18nt('designer.hint.copyJsonFail')
      )
    },
    handleExportDSChange(e) {
      let o = []
      this.exportDSArray.forEach((t) => {
        if (t.checked) {
          let r = deepClone(t)
          delete r.checked, o.push(r)
        }
      }),
        (this.dsExportContent = JSON.stringify(o, null, '  ')),
        (this.dsRawExportContent = JSON.stringify(o))
    },
    handleExportTabClick() {
      this.$nextTick(() => {
        this.$refs.exportDSEditor.setValue(this.dsExportContent)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.ds-list) .el-descriptions__content {
    width: 284px;
    overflow-x: hidden;
    margin-bottom: 15px;
    padding: 8px;
    background: #f5f7fa
}

:deep(.ds-list) .el-descriptions__title {
    font-weight: 400
}

:deep(.ds-list) .el-descriptions__label {
    width: 36px
}

.ds-button-wrapper {
    text-align: center;
    margin-top: 12px
}

:deep(.ds-form) .el-form-item.is-required>.el-form-item__label:before {
    content: ""!important;
    margin-right: 0!important
}

:deep(.ds-form) .el-form-item.is-required>.el-form-item__label:after {
    content: "*"!important;
    color: var(--el-color-danger);
    font-weight: 700
}

:deep(.no-left-margin) .el-form-item__content {
    margin-left: 0!important
}

.rh-row .el-col,.rd-row .el-col {
    margin: 5px 0
}

.ch-collapse .ace-editor {
    border: 1px solid #e1e2e3;
    min-height: 120px
}

.dh-collapse .ace-editor {
    border: 1px solid #e1e2e3;
    min-height: 220px
}

.eh-collapse .ace-editor {
    border: 1px solid #e1e2e3;
    min-height: 120px
}

.dsv-json-editor {
    margin-bottom: 12px
}

.dsv-json-editor .ace-editor {
    border: 1px solid #e1e2e3;
    min-height: 120px
}

 .ace-editor {
    border: 1px solid #e1e2e3
}

.footer-button {
    float: right;
    margin-bottom: 12px
}

:deep(.display-block) .el-form-item__content {
    display: block!important
}

.dialog-footer {
    margin-top: 15px
}

.dialog-footer-center {
    margin-top: 15px;
    text-align: center
}

:deep(.export-ds-list) .el-descriptions__content {
    overflow-x: hidden;
    margin-bottom: 15px;
    padding: 8px;
    background: #f5f7fa
}

:deep(.export-ds-list) .el-descriptions__title {
    font-weight: 400
}

:deep(.export-ds-list) .el-descriptions__label {
    width: 36px!important
}

</style>
