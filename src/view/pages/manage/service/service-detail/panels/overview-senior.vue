<template>
  <dao-setting-layout>
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">删除服务</div>
        <div slot="content">
          <p class="delete-notice">
            删除服务需要谨慎操作，这是一个不可逆的操作。
          </p>
          <dao-tooltip
            content="该服务正在使用，无法删除服务"
            :disabled="!service.length"
            placement="right">
            <button
              @click="confirmRemove()"
              :disabled="service.length"
              class="dao-btn red">
              删除
            </button>
          </dao-tooltip>
        </div>
      </dao-setting-item>
    </dao-setting-section>
  </dao-setting-layout>
</template>

<script>
import ServiceService from '@/core/services/service.service';

export default {
  name: 'SeniorPanel',
  props: {
    service: { type: Object, default: () => ({}) },
  },
  methods: {
    confirmRemove() {
      this.$tada
        .confirm({
          title: '删除服务',
          text: `您确定要删除服务 ${this.service.name} 吗？`,
          primaryText: '删除',
        })
        .then(willDel => {
          if (willDel) {
            this.removeService();
          }
        });
    },

    removeService() {
      ServiceService.removeService(this.service.id).then(() => {
        this.$noty.success('删除服务成功');
        this.$router.push({
          name: 'manage.service.list',
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.delete-notice {
  margin-bottom: 10px;
  font-weight: 600;
}
</style>
