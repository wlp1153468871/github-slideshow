<template>
  <dao-dialog
    class="edit-env-dialog"
    header="挂载 Config Map"
    :visible.sync="isShow"
    @before-open="init"
    @closed="onClosed">
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">类型</div>
        <div slot="content">
          <dao-radio-group
            @change.native="onTypeChanged">
            <dao-radio
              v-model="formModel.type"
              :label="item.value"
              v-for="(item, index) in types"
              :key="index">
              {{ item.label }}
            </dao-radio>
          </dao-radio-group>
        </div>
      </dao-setting-item>
    </dao-setting-section>

    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">文件名称</div>
        <div slot="content">
          <dao-select
            with-search
            @change="onFileNameChanged"
            v-model="formModel.source"
            placeholder="name">
            <dao-option
              v-for="(item, index) in files"
              :key="index"
              :value="item.metadata.name"
              :label="item.metadata.name">
            </dao-option>
          </dao-select>
        </div>
      </dao-setting-item>
    </dao-setting-section>

    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">容器路径</div>
        <div slot="content">
          <dao-input
            icon-inside
            type="text"
            name="mountpath"
            data-vv-as="容器路径"
            placeholder="名称: 例如 SH"
            :message="veeErrors.first('mountpath')"
            :status="veeErrors.has('mountpath') ? 'error' : ''"
            v-validate="'required'"
            v-model="formModel.mountpath">
          </dao-input>
        </div>
      </dao-setting-item>
    </dao-setting-section>

    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">读写模式</div>
        <div slot="content">
          <dao-switch
            with-notice
            size="sm"
            :option="{ on: '可写', off: '只读' }"
            v-model="formModel.readonly">
          </dao-switch>
        </div>
      </dao-setting-item>
    </dao-setting-section>

    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">增加子路径</div>
        <div slot="content">
          <dao-editable-table
            :config="config"
            v-model="formModel.items"
            @valid="validChange">
          </dao-editable-table>
        </div>
      </dao-setting-item>
    </dao-setting-section>

    <div slot="footer">
      <button
        class="dao-btn ghost"
        @click="onClose">
        取消
      </button>
      <button
        class="dao-btn blue"
        :disabled="!valid"
        @click="onConfirm">
        添加
      </button>
    </div>
  </dao-dialog>
</template>

<script>
import { first, get as getValue, find } from 'lodash';
import { ENV_SOURCE } from '@/core/constants/constants';
import isAbsolutePath from '@/core/utils/is-absolute-path';

export default {
  name: 'MountFileDialog',

  props: {
    visible: Boolean,
    model: {
      type: Object,
      default: () => ({}),
    },
    configMaps: {
      type: Array,
      default: () => [],
    },
    secrets: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      keys: [],
      types: [
        {
          value: ENV_SOURCE.CONFIG,
          label: 'Config Map',
        },
        {
          value: ENV_SOURCE.SECRET,
          label: 'Secret',
        },
      ],
      formModel: {
        type: ENV_SOURCE.CONFIG,
        readonly: false,
        source: null,
      },
      tableValid: true,
      config: {
        header: ['键', '子路径'],
        body: [
          {
            type: 'select',
            name: 'key',
            options: [],
          },
          {
            type: 'input',
            name: 'subpath',
            default: '',
            validate(row) {
              if (row.subpath.trim() === '') {
                return '子路径不能为空';
              }
              if (isAbsolutePath(row.subpath)) {
                return '子路径必须是相对路径';
              }
              return true;
            },
          },
        ],
      },
      validationMessage: [],
    };
  },

  methods: {
    onTypeChanged() {
      this.formModel.source = getValue(first(this.files), 'name');
    },

    init() {
      this.formModel = {
        ...this.formModel,
        source: getValue(first(this.files), 'name'),
        ...this.model,
      };
    },

    onConfirm() {
      this.$emit('finish', this.formModel);
    },

    onClose() {
      this.$emit('close');
    },

    onClosed() {
      this.formModel = {
        type: ENV_SOURCE.CONFIG,
        readonly: false,
        source: null,
      };
    },

    validChange(val) {
      this.tableValid = val;
    },

    onFileNameChanged(name) {
      const config = find(this.files, x => x.metadata.name === name);
      if (config) {
        const keys = Object.keys(config.data);
        this.config.body[0].options = keys;
      }
    },
  },

  computed: {
    isShow: {
      set(val) {
        this.$emit('close', val);
      },
      get() {
        return this.visible;
      },
    },

    valid() {
      return this.formModel.mountpath
        && !this.veeErrors.any()
        && this.tableValid
        && this.isValidSubpath;
    },

    isValidSubpath() {
      const { items = [] } = this.formModel;
      return items.every(x => x.subpath && x.key);
    },

    files() {
      let result = [];
      if (this.formModel.type === ENV_SOURCE.CONFIG) {
        result = this.configMaps;
      } else if (this.formModel.type === ENV_SOURCE.SECRET) {
        result = this.secrets;
      }
      return result;
    },
  },
};
</script>
