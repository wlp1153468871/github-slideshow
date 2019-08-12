<template>
  <div :class="['labels', highLight && 'high-light']" v-if="hasLabels">
    <template v-for="(labelValue, labelKey, index) in labels">
      <div
        :key="index"
        class="label-pair"
        v-if="!limit || index < limit">
        <span class="label truncate ">{{labelKey}}</span>
        <span class="label truncate">{{labelValue}}</span>
      </div>
    </template>
    <button
      class="dao-btn blue mini more-labels"
      @click="limit = null"
      v-show="showMore">
      更多...
    </button>
  </div>

</template>

<script>
import hashSize from '@/view/filters/hash-size.filter';

export default {
  name: 'Labels',

  props: {
    labels: { type: Object, required: true, default: () => ({}) },
    highLight: { type: Boolean, default: false },
  },

  data() {
    return {
      limit: 3,
    };
  },

  computed: {
    hasLabels() {
      return hashSize(this.labels) > 0;
    },

    showMore() {
      return this.limit && this.limit < hashSize(this.labels);
    },
  },
};
</script>

<style lang="scss">
.labels {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: -10px;

  .label-pair {
    display: flex;
    margin-bottom: 10px;
    margin-right: 10px;

    .label {
      border: 1px solid #e0e2e6;
      border-radius: 3px;
      padding: 0 6px;
      height: 20px;
      line-height: 18px;
      color: #3d444f;
      font-size: 12px;

      &:nth-of-type(1) {
        border-right-width: 0;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        background-color: #e0e2e6;
      }

      &:nth-of-type(2) {
        border-left-width: 0;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        background-color: #f5f7fa;
      }
    }
  }

  .dao-btn.more-labels {
    vertical-align: middle;
    height: 20px;
    line-height: 18px;
    padding: 0 7px;
    font-size: 12px;
  }

  &.high-light .label:nth-of-type(1){
    background-color: #3890ff;
    color: white;
  }
}
</style>
