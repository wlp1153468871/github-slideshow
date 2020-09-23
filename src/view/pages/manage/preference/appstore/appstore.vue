<template>
  <div class="appstore" v-if="$can('platform.settings.assets')">
    <dao-setting-layout>
      <div slot="layout-title">
        服务市场介绍
      </div>
      <div slot="layout-title-helper">您可以在这里修改产品的名称以及页脚等文案的内容</div>
      <dao-setting-section>
        <div slot="label">服务市场介绍</div>
        <div slot="content">
          <textarea
            icon-inside
            v-model="simpleStr"
            class="dao-control"
            type="text"
            placeholder="例: 欢迎来到 gCloud 服务市场。"
            name="name"
            :message="veeErrors.first('name')"
            :status="veeErrors.has('name') ? 'error' : ''"
            v-validate="'max:80'"
            data-vv-as="服务市场介绍"
          >
          </textarea>
          <button class="dao-btn blue" :disabled="!isValidForm" @click="updateSimpleInfo">
            <span class="text">保存</span>
          </button>
        </div>
      </dao-setting-section>
    </dao-setting-layout>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import SystemService from '@/core/services/system.service';

export default {
  name: 'AppStoreSetting',
  data() {
    return {
      simpleStr: '',
    };
  },

  computed: {
    ...mapState(['helpURLDict', 'simpleInfo']),
    isValidForm() {
      return !this.veeErrors.any();
    },
  },

  created() {
    if (this.$can('platform.settings.assets')) {
      this.simpleStr = this.simpleInfo;
    } else {
      this.$noty.error('您暂无外观设置权限');
    }
  },

  methods: {
    updateSimpleInfo() {
      new Promise(res => {
        res();
      })
        .then(() => {
          return SystemService.updateSystemSettings({
            helpURLDict: this.helpURLDict,
            simpleInfo: this.simpleStr,
          });
        })
        .then(() => {
          return this.$store.dispatch('loadSystemSettings');
        })
        .then(() => {
          this.$noty.success('更新完成成功');
        });
    },
  },
};
</script>

<style lang="scss">
.appstore {
  textarea {
    height: 100px !important;
  }
  .dao-control {
    width: 100% !important;
  }
  .dao-btn {
    margin-left: 0 !important;
  }
}
</style>
