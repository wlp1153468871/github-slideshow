<template>
  <div class="ins-rest-btns">
    <button
      class="dao-btn ghost"
      v-for="(btn, index) in btns.slice(0, restSize)"
      :key="index"
      @click="onClick(btn.id)"
    >
      {{ btn.name }}
    </button>
    <div class="dao-btn-group" v-if="btns.length > BREAK_LENGTH">
      <button class="dao-btn ghost">
        更多操作
      </button>
      <dao-dropdown trigger="click" :append-to-body="true" placement="bottom-end">
        <button class="dao-btn dao-icon ghost">
          <svg class="icon"><use xlink:href="#icon_down-arrow"></use></svg>
        </button>
        <dao-dropdown-menu slot="list">
          <dao-dropdown-item
            v-for="(btn, index) in btns.slice(restSize, btns.length)"
            :key="index"
            @click="onClick(btn.id)"
          >
            <span class="text">{{ btn.name }}</span>
          </dao-dropdown-item>
        </dao-dropdown-menu>
      </dao-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InstanceRestBtns',
  props: {
    btns: { type: Array, default: () => [] },
  },
  data() {
    return {
      BREAK_LENGTH: 3,
    };
  },
  computed: {
    restSize() {
      if (this.btns) {
        const btnLen = this.btns.length;
        return btnLen > this.BREAK_LENGTH ? this.BREAK_LENGTH : btnLen;
      }
      return 0;
    },
  },
  methods: {
    onClick(actionId) {
      this.$emit('click', actionId);
    },
  },
};
</script>

<style>
.ins-rest-btns {
  display: inline-block;
  margin-right: 8px;
}
</style>
