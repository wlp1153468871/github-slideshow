<template>
  <div class="overView">
    <div class="overview-head">
      <div class="head-text">仪表盘</div>
      <div class="head-search">
        可用区：
        <dao-select
          v-model="availabilityZone"
          placeholder="选择可用区">
          <dao-option
            v-for="item in zoneOptions"
            :key="item.value"
            :value="item.value"
            :label="item.text">
          </dao-option>
        </dao-select>
      </div>
    </div>
    <part-first></part-first>
  </div>
</template>

<script>
import partFirst from './panels/first';

export default {
  name: 'index',
  components: {
    partFirst,
  },
  data() {
    return {
      availabilityZone: '',
      zoneOptions: [{
        value: 'k8s',
        text: 'k8s',
      }],
    };
  },
};
</script>

<style scoped lang="scss">
.overView {
  padding: 24px 20px;
  /*background-color: #FBFCFD;*/
  min-width: 1080px;
  .overview-head {
    display: flex;
    justify-content: space-between;
    color: #3D444F;
    font-family: 苹方-简 常规体;
    .head-text {
      font-size: 20px;
    }
    .head-search {
      font-size: 14px;
    }
  }
}
</style>
