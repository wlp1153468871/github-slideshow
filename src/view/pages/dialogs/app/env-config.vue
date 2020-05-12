<template>
  <dao-dialog
    class="edit-env-dialog"
    header="环境配置 | 环境变量"
    :visible.sync="isShow"
    @before-open="init"
    @closed="onClosed"
  >
    <dao-setting-layout>
      <dao-setting-section>
        <dao-setting-item>
          <div slot="label">类型</div>
          <div slot="content">
            <dao-radio-group @change.native="onTypeChanged">
              <dao-radio
                v-model="formModel.type"
                :label="item.value"
                v-for="(item, index) in types"
                :key="index"
              >
                {{ item.label }}
              </dao-radio>
            </dao-radio-group>
          </div>
        </dao-setting-item>
      </dao-setting-section>

      <dao-setting-section>
        <dao-setting-item>
          <div slot="label">键</div>
          <div slot="content">
            <dao-input
              icon-inside
              name="name"
              data-vv-as="键"
              placeholder="键: 例如 MYSQL_ADDRESS"
              :message="veeErrors.first('name')"
              :status="veeErrors.has('name') ? 'error' : ''"
              v-validate="'required|env_variables_name'"
              v-model="formModel.name"
            >
            </dao-input>
          </div>
        </dao-setting-item>
      </dao-setting-section>

      <dao-setting-section>
        <dao-setting-item>
          <div slot="label">值</div>
          <div slot="content">
            <template v-if="formModel.type === ENV_SOURCE.DEFAULT">
              <dao-input
                icon-inside
                name="value"
                data-vv-as="值"
                placeholder="值: 例如 localhost:3306"
                :message="veeErrors.first('value')"
                :status="veeErrors.has('value') ? 'error' : ''"
                v-validate="'required'"
                v-model="formModel.value.value"
              >
              </dao-input>
            </template>

            <div class="select-group" v-else>
              <dao-select with-search @change="onFileNameChanged" v-model="formModel.value.name">
                <dao-option
                  v-for="item in files"
                  :key="item.id"
                  :value="item.metadata.name"
                  :label="item.metadata.name"
                >
                </dao-option>
              </dao-select>
              <dao-select with-search v-if="formModel.value.name" v-model="formModel.value.value">
                <dao-option v-for="item in keys" :key="item" :value="item" :label="item">
                </dao-option>
              </dao-select>
            </div>
          </div>
        </dao-setting-item>
      </dao-setting-section>
    </dao-setting-layout>
    <div slot="footer">
      <button class="dao-btn ghost" @click="onClose">
        取消
      </button>
      <button class="dao-btn blue" :disabled="!valid" @click="onConfirm">
        添加
      </button>
    </div>
  </dao-dialog>
</template>

<script>
import { isEmpty, find, cloneDeep } from 'lodash';
import { ENV_SOURCE } from '@/core/constants/constants';

export default {
  name: 'EditEnvDialog',

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
      ENV_SOURCE,
      formModel: {
        type: ENV_SOURCE.DEFAULT,
        name: null,
        value: {
          name: null,
          value: null,
        },
      },
      types: [
        {
          label: '普通环境变量',
          value: ENV_SOURCE.DEFAULT,
        },
        {
          label: '选择单个 Config Map 值',
          value: ENV_SOURCE.CONFIG,
        },
        {
          label: '选择单个 Secret 值',
          value: ENV_SOURCE.SECRET,
        },
      ],
      keys: [],
    };
  },

  methods: {
    onTypeChanged() {
      this.formModel.value = {
        name: null,
        value: null,
      };
    },

    onFileNameChanged(val) {
      // TODO(jerry) 这么处理有点慢
      const config = find(this.files, x => x.metadata.name === val);
      if (config) {
        this.keys = Object.keys(config.data);
        this.formModel.value.value = '';
      }
    },

    init() {
      this.formModel = cloneDeep({ ...this.formModel, ...this.model });
      if (this.model && this.model.type === ENV_SOURCE.DEFAULT) {
        this.formModel.value = {
          name: null,
          value: this.model.value,
        };
      }
    },

    onConfirm() {
      if (this.formModel.type === ENV_SOURCE.DEFAULT) {
        this.formModel.value = this.formModel.value.value;
      }
      this.$emit('finish', this.formModel);
    },

    onClose() {
      this.$emit('close');
    },

    onClosed() {
      this.formModel = {
        type: ENV_SOURCE.DEFAULT,
        name: null,
        value: {
          name: null,
          value: null,
        },
      };
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

    isCreate() {
      return isEmpty(this.model);
    },

    valid() {
      return this.formModel.name && this.formModel.value.value && !this.veeErrors.any();
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

<style lang="scss">
.edit-env-dialog {
  .select-group {
    display: flex;
    justify-content: space-between;

    .dao-select {
      width: 48%;
    }
  }
}
</style>
