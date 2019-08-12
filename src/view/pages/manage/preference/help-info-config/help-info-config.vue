<template>
  <div>
    <dao-setting-layout>
      <div slot="layout-title">帮助信息设置</div>
      <dao-setting-section v-if="helpURLDictIsEmpty">
        无帮助信息
      </dao-setting-section>
      <dao-setting-section v-for="h in helpURLDict" :key="h.key">
        <dao-setting-item>
          <div slot="label">{{h.name}}</div>
          <div slot="content">
            <dao-input
              :disabled="loading"
              v-model="h.url"
              placeholder="例: example.com/auth/realms/dsp">
            </dao-input>
          </div>
        </dao-setting-item>
      </dao-setting-section>

      <dao-setting-section>
        <button
          class="dao-btn blue"
          :disabled="loading"
          @click="onSave">
          <dao-spin v-if="loading" color="white"></dao-spin>
          保存
        </button>
        <button
          class="dao-btn"
          :disabled="loading"
          @click="onReset">
          重置
        </button>
      </dao-setting-section>
    </dao-setting-layout>
  </div>
</template>

<script>
import { cloneDeep, isEmpty } from 'lodash';
import SystemService from '@/core/services/system.service';

export default {
  name: 'UsersDirectory',
  data() {
    return {
      helpURLDict: cloneDeep(this.$store.state.helpURLDict),
      loading: false,
    };
  },
  computed: {
    helpURLDictIsEmpty() {
      return isEmpty(this.helpURLDict);
    },
  },
  methods: {
    onSave() {
      new Promise(res => {
        this.loading = true;
        res();
      })
        .then(() => {
          return SystemService.updateSystemSettings({ helpURLDict: this.helpURLDict });
        })
        .then(() => {
          return this.$store.dispatch('loadSystemSettings');
        })
        .then(() => {
          this.$noty.success('更新成功');
        })
        .finally(() => {
          this.helpURLDict = cloneDeep(this.$store.state.helpURLDict);
          this.loading = false;
        });
    },
    onReset() {
      this.helpURLDict = cloneDeep(this.$store.state.helpURLDict);
    },
  },
};
</script>
