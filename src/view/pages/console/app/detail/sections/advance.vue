<template>
  <dao-setting-layout>
    <dao-setting-section>
      <dao-setting-item>
        <template slot="label">
          删除应用
        </template>
        <template slot="content">
          <p class="delete-notice">
            删除应用需要谨慎操作，这是一个不可逆的操作。
          </p>
          <button
            @click="removeConfirm()"
            class="dao-btn red">
            删除应用
          </button>
        </template>
      </dao-setting-item>
    </dao-setting-section>
  </dao-setting-layout>
</template>

<script>
import InstanceService from '@/core/services/instance.service';
import { SERVICE_TYPES } from '@/core/constants/constants';

export default {
  name: 'AdvancePanel',

  props: {
    instance: { type: Object, default: () => ({}) },
  },

  methods: {
    ensureRemove() {
      this.$tada
        .confirm({
          title: '删除应用',
          text: `您确定要删除应用 ${this.instance.name} 吗？`,
        })
        .then(willDelete => {
          if (willDelete) {
            this.deleteApp(this.instance);
          }
        });
    },

    deleteApp(instance) {
      InstanceService.deleteInstance(instance.id).then(() => {
        this.$noty.success('删除应用成功');
        this.$router.push({
          name: 'console.applications',
        });
      });
    },

    removeConfirm() {
      const { instance } = this;
      InstanceService.getInstance(instance.id).then(item => {
        const binds = item.binding_instances || [];
        const deployments = [];
        binds.forEach(bind => {
          const isDeployment =
            bind.service_type === SERVICE_TYPES.DEPLOYMENT_SERVICE;
          const { name } = bind.params || {};
          if (isDeployment && name) deployments.push(name);
        });
        if (deployments.length) {
          this.$tada.confirm({
            title: '删除应用',
            text: `应用 ${instance.name} 存在与 Route ${deployments.join('，')} 的绑定关系，请您先完成删除 Route 或者解绑操作。`,
            primaryText: '确认',
            dangerMode: false,
          });
        } else {
          this.ensureRemove();
        }
      });
    },
  },
};
</script>
