<template>
  <dao-setting-layout>
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">删除租户</div>
        <div slot="content">
          <p class="delete-notice">
            删除租户需要谨慎操作，这是一个不可逆的操作。
          </p>
          <dao-tooltip
            content="租户中存在用户，无法删除租户"
            :disabled="!users.length"
            placement="right"
          >
            <button
              @click="deleteOrgConfirm()"
              :disabled="Boolean(users.length)"
              class="dao-btn red"
            >
              删除
            </button>
          </dao-tooltip>
        </div>
      </dao-setting-item>
    </dao-setting-section>
  </dao-setting-layout>
</template>

<script>
import table from '@/view/mixins/table';

export default {
  name: 'OverviewSeniorPanel',
  extends: table('id', 10, 'updated_at'),
  props: {
    users: { type: Array, default: () => [] },
    org: { type: Object, default: () => ({}) },
  },
  methods: {
    deleteOrgConfirm() {
      this.$tada
        .confirm({
          title: '删除租户',
          text: `您确定要删除租户 ${this.org.name} 吗？`,
          primaryText: '删除',
        })
        .then(willDel => {
          if (willDel) {
            this.$emit('delete');
          }
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
