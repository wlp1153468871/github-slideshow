<template>
  <div :class="['mini-item', stateClass]">
    <div :class="['left', stateClass]">
      <slot name="left"></slot>
    </div>
    <div class="right">
      <slot>
        <div class="operation">
          <slot name="right-title"></slot>
          <slot class="right-des" name="right-des"></slot>
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MiniTimelineItem',
  props: {
    btnShow: { type: Boolean, default: false },
    btnText: { type: String, default: '' },
    state: { type: String, default: '' },
  },
  data() {
    return {
      stateClsMap: {
        succeed: 'success',
        failed: 'error',
        started: 'text-primary',
        timeOut: 'warning',
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

<style lang="scss">
@import '~daoColor';

.timeline .mini-item {
  position: relative;
  display: flex;
  padding: 3px 0;
  margin-right: -10px;
  margin-left: -10px;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 22px;
    display: block;
    width: 1px;
    border-right: 1px solid #e9ebef;
  }
  .left {
    position: relative;
    width: 20px;
    padding-right: 25px;
    font-size: 14px;
    line-height: 1.5;
    text-align: right;
    &:after {
      content: '';
      position: absolute;
      top: 6px;
      right: -6px;
      display: block;
      width: 11px;
      height: 11px;
      background-color: #fff;
      border: 2px solid;
      border-radius: 50%;
    }
    &.success {
      color: #22c36a;
    }
    &.error {
      color: #f1483f;
    }
    &.warning {
      color: rgb(190, 163, 10);
    }
    &.text-primary {
      color: $blue !important;
    }
  }
  .right {
    width: 100%;
    padding-left: 15px;
    .operation {
      margin-bottom: 5px;
      font-size: 14px;
    }
    .operation {
      display: flex;
      justify-content: space-between;
      height: 24px;
      line-height: 24px;
    }
    .right-des {
      color: #99a1ad;
    }
  }
}
</style>
