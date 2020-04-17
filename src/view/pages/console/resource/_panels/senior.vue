<template>
  <dao-setting-layout>
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">删除实例</div>
        <div slot="content">
          <p class="delete-notice">
            删除实例需要谨慎操作，这是一个不可逆的操作。
          </p>
          <button @click="removeConfirm" class="dao-btn red">
            删除
          </button>
        </div>
      </dao-setting-item>
    </dao-setting-section>
  </dao-setting-layout>
</template>

<script>
import { get as getVal } from 'lodash';

export default {
  name: 'SeniorPanel',

  props: {
    instance: { type: Object, default: () => ({}) },
  },

  methods: {
    removeConfirm() {
      const name = getVal(this.instance, 'metadata.name') || getVal(this.instance, 'name');

      this.$tada
        .confirm({
          title: '删除实例',
          text: `您确定要删除实例 ${name} 吗？`,
        })
        .then(ok => {
          if (ok) {
            this.$emit('delete', this.instance);
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
