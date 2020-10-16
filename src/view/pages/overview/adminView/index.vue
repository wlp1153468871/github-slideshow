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
    <div class="overview-info">
      <div class="colony">
        <colony-panels></colony-panels>
      </div>
      <div class="colony-info">
        <colonyInfo></colonyInfo>
      </div>
    </div>
  </div>
</template>

<script>
import colonyPanels from './panels/colony';
import colonyInfo from './panels/colonyInfo';

export default {
  name: 'index',
  components: {
    colonyPanels,
    colonyInfo,
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
  .overview-info {
    display: flex;
    justify-content: space-between;
    height: 600px;
    margin-top: 20px;
    .colony {
      width: 23.8%;
      height: 200px;
    }
    .colony-info {
      width: 74.6%;
      height: 400px;
    }
  }
}
.overView::-webkit-scrollbar {
  display: none;
}
</style>
