<template>
  <dao-dialog
    class="edit-env-dialog"
    header="环境配置 | 引用完整 Config Map"
    :visible.sync="isShow"
    @before-open="init"
    @closed="onClosed">
    <dao-setting-layout>
      <dao-setting-section>
        <dao-setting-item>
          <div slot="label">类型</div>
          <!-- <div slot="content">
            <dao-select
              @change="onTypeChanged"
              v-model="formModel.type"
              placeholder="type">
              <dao-option
                v-for="item in types"
                :key="item.value"
                :value="item.value"
                :label="item.label">
              </dao-option>
            </dao-select>
          </div> -->
          <div slot="content">
            <dao-radio-group @change.native="onTypeChanged">
              <dao-radio
                v-model="formModel.type"
                :label="item.value"
                v-for="(item, index) in types"
                :key="index">
                {{item.label}}
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
              v-model="formModel.name"
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
          <div slot="label">前缀</div>
          <div slot="content">
            <dao-input
              icon-inside
              v-model="formModel.value"
              placeholder="可选，例: MYSQL"
              name="value"
              :message="veeErrors.first('value')"
              :status="veeErrors.has('value') ? 'error' : ''"
              v-validate="'env_variables_name'"
              data-vv-as="前缀">
            </dao-input>
          </div>
        </dao-setting-item>
      </dao-setting-section>
    </dao-setting-layout>

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
import { first, get as getValue } from 'lodash';
import { ENV_SOURCE } from '@/core/constants/constants';

export default {
  name: 'EditEnvFileDialog',

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
      types: [
        {
          value: ENV_SOURCE.CONFIG_FILE,
          label: 'Config Map',
        },
        {
          value: ENV_SOURCE.SECRET_FILE,
          label: 'Secret',
        },
      ],
      formModel: {
        type: ENV_SOURCE.CONFIG_FILE,
        name: null,
      },
    };
  },

  methods: {
    init() {
      this.formModel = {
        ...this.formModel,
        name: getValue(first(this.files), 'metadata.name'),
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
        type: ENV_SOURCE.CONFIG_FILE,
        name: null,
      };
    },

    onTypeChanged() {
      this.formModel.name = getValue(first(this.files), 'name');
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
      return !this.veeErrors.any();
    },

    files() {
      let result = [];
      if (this.formModel.type === ENV_SOURCE.CONFIG_FILE) {
        result = this.configMaps;
      } else if (this.formModel.type === ENV_SOURCE.SECRET_FILE) {
        result = this.secrets;
      }
      return result;
    },
  },
};
</script>
