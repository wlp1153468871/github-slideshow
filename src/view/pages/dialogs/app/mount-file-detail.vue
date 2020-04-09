<template>
  <dao-dialog
    :config="config"
    :visible.sync="isShow"
    @dao-dialog-close="onClose"
    @dao-dialog-cancel="onClose"
    @dao-dialog-confirm="onConfirm"
  >
    <dao-setting-layout>
      <dao-setting-section v-for="(config, index) in configs" :key="index">
        <dao-setting-item>
          <div slot="label">{{ config[0] }}</div>
          <div slot="content">
            {{ config[1] }}
          </div>
        </dao-setting-item>
      </dao-setting-section>
      <dao-setting-section>
        <dao-setting-item>
          <div slot="label">子路径</div>
          <div slot="content">
            <dao-info-sheet :table="items"></dao-info-sheet>
          </div>
        </dao-setting-item>
      </dao-setting-section>
    </dao-setting-layout>
    <div slot="footer">
      <button class="dao-btn ghost" @click="onClose">
        取消
      </button>
    </div>
  </dao-dialog>
</template>

<script>
import Vue from 'vue';
import dialog from '@/view/mixins/dialog';

export default {
  name: 'MountFileDetailDialog',

  extends: dialog('挂载 Config Map 详情'),

  props: {
    row: { type: Object, default: () => ({}) },
  },

  data() {
    const configFileFilter = Vue.filter('config_file');
    const fileModeFilter = Vue.filter('file_mode');
    return {
      configFileFilter,
      fileModeFilter,
    };
  },

  computed: {
    configs() {
      return [
        ['类型', this.configFileFilter(this.row.type)],
        ['文件名称', this.row.source],
        ['容器路径', this.row.mountpath],
        ['模式', this.fileModeFilter(this.row.readonly)],
      ];
    },
    items() {
      return {
        head: ['键', '子路径'],
        body: this.row.items,
      };
    },
  },
};
</script>
