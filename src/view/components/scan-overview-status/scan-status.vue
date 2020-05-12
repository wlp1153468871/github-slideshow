<template>
  <span class="description">
    <svg :style="{ fill: color }" class="icon scan-status" v-if="icon">
      <use :xlink:href="icon"></use>
    </svg>
    <span class="description">{{ text }}</span>
  </span>
</template>

<script>
import { get as getValue } from 'lodash';

export default {
  name: 'scanStatus',

  props: {
    status: String,
  },
  data() {
    return {
      statusDict: {
        unScan: {
          text: '未扫描',
        },
        pending: {
          text: '等待中',
        },
        maxSeverity: {
          icon: '#icon_info-line',
          color: '#d52218',
          text: '严重漏洞',
        },
        middleSeverity: {
          icon: '#icon_warning-line',
          color: '#f7b32b',
          text: '中等漏洞',
        },
        lowSeverity: {
          icon: '#icon_warning-line',
          color: '#f0dbb1',
          text: '较低漏洞',
        },
        unKnowSeverity: {
          icon: '##icon_question-mark',
          color: '#3d444f',
          text: '未知漏洞',
        },

        noSeverity: {
          icon: '#icon_success-line',
          color: '#25d475',
          text: '没有漏洞',
        },
      },
    };
  },

  computed: {
    color() {
      return getValue(this.statusDict[this.status], 'color');
    },
    icon() {
      return getValue(this.statusDict[this.status], 'icon');
    },
    text() {
      return getValue(this.statusDict[this.status], 'text');
    },
  },
};
</script>

<style lang="scss" scoped>
.icon.scan-status {
  width: 14px;
  height: 14px;
  margin-right: 5px;
}
// .text {
//   width: 56px;
//   height: 20px;
//   font-size: 14px;
//   color: rgba(0,0,0,0.85);
// }
</style>
