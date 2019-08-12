<template>
  <div class="env-section">
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">
          环境变量
        </div>
        <template slot="content">
          <table class="dao-table flexrow" v-if="env.rows.length">
            <thead>
            <tr>
              <th style="width: 20%;">
                <span>键</span>
              </th>
              <th style="width: 60%;">
                <span>值</span>
              </th>
              <th style="text-align: center; width: 20%;">
                <span>操作</span>
              </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(row, index) in env.rows" :key="row.name">
              <td style="width: 20%;">
                {{row.name}}
              </td>
              <td style="width: 60%;">
                {{row | config_map}}
              </td>
              <td style="width: 20%;" class="cell-operations">
                <svg class="icon icon-remove" @click="removeRow(index, 'env')">
                  <use xlink:href="#icon_cross"></use>
                </svg>
                <svg class="icon icon-edit" @click="editRow(index, 'env')">
                  <use xlink:href="#icon_pencil-edit"></use>
                </svg>
              </td>
            </tr>
            </tbody>
          </table>
          <button
            class="dao-btn blue mini has-icon"
            @click="addRow('env')">
            <svg class="icon">
              <use xlink:href="#icon_plus-circled"></use>
            </svg>
            <span class="text">添加</span>
          </button>
        </template>
      </dao-setting-item>
    </dao-setting-section>

    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">
          引用完整 Config Map
        </div>
        <template slot="content">
          <table class="dao-table flexrow" v-if="envFile.rows.length">
            <thead>
            <tr>
              <th style="width: 20%;">
                <span>名称</span>
              </th>
              <th style="width: 60%;">
                <span>前缀</span>
              </th>
              <th style="text-align: center; width: 20%;">
                <span>操作</span>
              </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(row, index) in envFile.rows" :key="row.name">
              <td style="width: 20%;">
                {{row | config_map}}
              </td>
              <td style="width: 60%;">
                {{row.value}}
              </td>
              <td style="width: 20%;" class="cell-operations">
                <svg class="icon icon-remove" @click="removeRow(index, 'envFile')">
                  <use xlink:href="#icon_cross"></use>
                </svg>
                <svg class="icon icon-edit" @click="editRow(index, 'envFile')">
                  <use xlink:href="#icon_pencil-edit"></use>
                </svg>
              </td>
            </tr>
            </tbody>
          </table>
          <button
            class="dao-btn mini blue has-icon"
            @click="addRow('envFile')">
            <svg class="icon">
              <use xlink:href="#icon_plus-circled"></use>
            </svg>
            <span class="text">添加</span>
          </button>
        </template>
      </dao-setting-item>
    </dao-setting-section>

    <edit-env-dialog
      :configMaps="configMaps"
      :secrets="secrets"
      :model="env.model"
      :visible="dialogs.env"
      @finish="finish($event, 'env')"
      @close="dialogs.env = false">
    </edit-env-dialog>

    <edit-env-file-dialog
      :configMaps="configMaps"
      :secrets="secrets"
      :model="envFile.model"
      :visible="dialogs.envFile"
      @finish="finish($event, 'envFile')"
      @close="dialogs.envFile = false">
    </edit-env-file-dialog>
  </div>
</template>

<script>
import { partition } from 'lodash';
import { ENV_SOURCE } from '@/core/constants/constants';
import EditEnvDialog from '@/view/pages/dialogs/app/env-config';
import EditEnvFileDialog from '@/view/pages/dialogs/app/env-config-file';

export default {
  name: 'SectionEnv',
  props: {
    value: { type: Array, default: () => [] },
    configMaps: { type: Array, default: () => [] },
    secrets: { type: Array, default: () => [] },
  },
  components: {
    EditEnvDialog,
    EditEnvFileDialog,
  },
  data() {
    return {
      ENV_SOURCE,
      dialogs: {
        env: false,
        envFile: false,
      },
      env: {
        rows: [],
        model: null,
        index: 0,
      },
      envFile: {
        rows: [],
        model: null,
        index: 0,
      },
    };
  },
  methods: {
    openModal(type) {
      this.dialogs[type] = true;
    },
    closeModal(type) {
      this.dialogs[type] = false;
    },
    /**
     * 添加一行数据
     * @param type The data is to operate with, 'env' or 'envFile'
     */
    addRow(type) {
      this[type].index = this[type].rows.length;
      this[type].model = null;
      this.openModal(type);
    },
    removeRow(index, type) {
      this[type].rows.splice(index, 1);
      this.$emit('input', [...this.env.rows, ...this.envFile.rows]);
    },
    editRow(index, type) {
      this[type].index = index;
      this[type].model = this[type].rows[index];
      this.openModal(type);
    },
    finish(model, type) {
      this.closeModal(type);
      this[type].rows.splice(this[type].index, 1, model);
      this.$emit('input', [...this.env.rows, ...this.envFile.rows]);
    },
  },
  created() {
    const envTypes = [ENV_SOURCE.DEFAULT, ENV_SOURCE.CONFIG, ENV_SOURCE.SECRET];
    const [envs, envFiles] = partition(this.value, ({ type }) => {
      return envTypes.indexOf(type) > -1;
    });
    this.env.rows = envs;
    this.envFile.rows = envFiles;
  },
};
</script>

<style lang="scss">
.env-section {
  & > .dao-setting-section {
    padding: 25px 20px 25px 0;
  }
}
</style>
