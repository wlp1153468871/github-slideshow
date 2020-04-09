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
import { ENV_SOURCE } from '@/core/constants/constants';
import dialog from '@/view/mixins/dialog';

export default {
  name: 'EnvDetailDialog',
  extends: dialog('环境变量详情'),
  props: {
    row: { type: Object, default: () => ({}) },
  },
  computed: {
    configs() {
      const configMap = Vue.filter('config_map');
      const isEnv = [ENV_SOURCE.DEFAULT, ENV_SOURCE.CONFIG, ENV_SOURCE.SECRET].includes(
        this.row.type,
      );
      if (isEnv) {
        return [
          ['键', this.row.name],
          ['值', configMap(this.row)],
        ];
      }
      return [
        ['文件名称', this.row.name],
        ['前缀', this.row.value],
      ];
    },
  },
};
</script>
