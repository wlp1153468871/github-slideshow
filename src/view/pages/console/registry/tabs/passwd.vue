<template>
  <div class="register-info">
    <template v-if="hasRegistry">
      <div class="info-detail">
        <span class="detail-key">镜像仓库地址</span>
        <span class="detail-value">{{ zone.registry.url }}</span>
      </div>
      <div class="info-detail">
        <span class="detail-key">镜像仓库用户名</span>
        <span class="detail-value">{{ registry.username }}</span>
      </div>
      <div class="info-detail">
        <span class="detail-key">镜像仓库密码</span>
        <span class="detail-value">{{ password }}</span>
        <button
          class="dao-btn blue"
          @click="passwordVisible = !passwordVisible">
          {{ passwordVisible? '隐藏' : '查看' }}
        </button>
      </div>
    </template>
    <p class="color-hint" v-else>暂无镜像仓库信息</p>
  </div>
</template>

<script>
import { isEmpty, replace } from 'lodash';
import RegistryService from '@/core/services/registry.service';
import { mapState } from 'vuex';

export default {
  name: 'RegistryPasswd',

  data() {
    return {
      registry: {},
      passwordVisible: false,
    };
  },

  computed: {
    ...mapState(['org', 'zone', 'space']),

    hasRegistry() {
      return !isEmpty(this.registry);
    },

    password() {
      if (!this.passwordVisible) {
        return replace(this.registry.password, /./g, '*');
      }
      return this.registry.password;
    },
  },

  created() {
    this.getRegistry();
  },

  methods: {
    getRegistry() {
      RegistryService.getOrgRegistrySecret(this.org.id, this.space.id)
        .then(res => {
          this.registry = res;
        })
        .catch(() => {
          this.$noty.error('获取镜像信息失败');
        });
    },
  },
};
</script>

<style lang="scss">
.register-info {
  padding: 15px 20px;
  background: #fff;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  overflow: hidden;
  margin: 0 auto;

  .color-hint {
    color: rgba(0, 0, 0, 0.45);
  }

  .info-detail {
    display: flex;
    align-items: center;
    color: #b0b0b9;
    margin: 15px 0;
  }

  .detail-key {
    display: inline-block;
    width: 130px;
  }

  .detail-value {
    display: block;
    line-height: 34px;
    width: 500px;
    height: 34px;
    padding-left: 10px;
    color: #2b3441;
    background-color: #f5f5f7;
    border-radius: 3px;
    margin: 0 20px;
  }
}
</style>
