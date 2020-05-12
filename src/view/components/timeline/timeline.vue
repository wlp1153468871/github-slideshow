<template>
  <div class="timeline">
    <slot>
      <empty-state :title="emptyTitle"></empty-state>
    </slot>
  </div>
</template>

<script>
export default {
  name: 'Timeline',
  props: {
    emptyTitle: { type: String, default: '' },
  },
};
</script>

<style lang="scss">
@import '~daoColor';

.timeline .item {
  position: relative;
  display: flex;
  padding-top: 10px;
  padding-bottom: 0;
  margin-right: -10px;
  margin-left: -10px;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 120px;
    display: block;
    width: 1px;
    border-right: 1px solid #e9ebef;
  }
  .left {
    position: relative;
    width: 120px;
    padding-right: 25px;
    font-size: 16px;
    line-height: 1.5;
    text-align: right;
    &:after {
      content: '';
      position: absolute;
      top: 6px;
      right: -9px;
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
    &.text-primary {
      color: $blue !important;
    }
  }
  .right {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    flex: 1;
    padding-bottom: 10px;
    padding-left: 25px;
    border-bottom: 1px solid #e9ebef;
    .operation {
      margin-bottom: 5px;
      font-size: 16px;
    }
    .operation,
    .text-muted {
      height: 24px;
      line-height: 24px;
    }
  }
  .errorClass.right {
    padding-bottom: 30px;
  }
  .btn-group {
    position: absolute;
    bottom: 10px;
    margin-right: 30px;
  }
}
</style>
