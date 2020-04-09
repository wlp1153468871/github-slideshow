<template>
  <div :class="['item', stateClass]">
    <div :class="['left', stateClass]">
      <slot name="left"></slot>
    </div>
    <div class="right" :class="{ errorClass: isError }">
      <slot>
        <div>
          <div class="operation">
            <slot name="right-title"></slot>
          </div>
          <div class="text-muted">
            <slot name="right-des"></slot>
          </div>
        </div>
        <div class="btn-group">
          <a v-if="btnShow" class="blue" @click="handleClick()">
            {{ btnText }}
          </a>
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TimelineItem',
  props: {
    btnShow: { type: Boolean, default: false },
    isError: { type: Boolean, default: false },
    btnText: { type: String, default: '' },
    state: { type: String, default: '' },
  },
  data() {
    return {
      stateClsMap: {
        succeed: 'success',
        failed: 'error',
        started: 'text-primary',
      },
    };
  },
  computed: {
    stateClass() {
      return this.stateClsMap[this.state] || '';
    },
  },
  methods: {
    handleClick(id) {
      this.$emit('btn-event', id);
    },
  },
};
</script>
