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
            :disabled="!space.length"
            placement="right"
          >
            <button
              @click="deleteOrgConfirm()"
              :disabled="Boolean(space.length)"
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
export default {
  name: 'SeniorPanel',
  props: {
    space: { type: Object, default: () => ({}) },
  },
  methods: {
    deleteOrgConfirm() {
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
