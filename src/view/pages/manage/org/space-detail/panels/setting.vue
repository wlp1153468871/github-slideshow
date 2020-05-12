<template>
  <dao-setting-layout>
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">删除项目组</div>
        <div slot="content">
          <p class="delete-notice">
            删除项目组需要谨慎操作，这是一个不可逆的操作。
          </p>
          <dao-tooltip
            content="项目组中存在用户，无法删除项目组"
            :disabled="!users.length"
            placement="right"
          >
            <button @click="deleteConfirm()" :disabled="Boolean(users.length)" class="dao-btn red">
              删除
            </button>
          </dao-tooltip>
        </div>
      </dao-setting-item>
    </dao-setting-section>
  </dao-setting-layout>
</template>

<script>
export default {
  name: 'SettingPanel',
  props: {
    users: { type: Array, default: () => [] },
    space: { type: Object, default: () => ({}) },
  },
  methods: {
    deleteConfirm() {
      this.$tada
        .confirm({
          title: '删除项目组',
          text: `您确定要删除项目组 ${this.space.name} 吗？`,
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
