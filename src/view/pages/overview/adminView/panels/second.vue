<template>
    <div class="part-second">
      <div class="progress-cpu">
        <div class="cpu">
          <information
            :form="cpuObj"
            :need-type="cpuObj.needType"
            :need-img="cpuObj.needImg"></information>
        </div>
        <div class="memory">
          <information
            :form="memoryObj"
            :need-type="memoryObj.needType"
            :need-img="memoryObj.needImg"></information>
        </div>
      </div>
      <div class="topRate-cpu">
        <information
          :form="topRateObj"
          :need-img="topRateObj.needImg"
          :need-type="topRateObj.needType"></information>
      </div>
      <div class="warn-info">
        <information
          :form="warnInfoObj"
          :need-img="warnInfoObj.needImg"
          :need-type="warnInfoObj.needType"></information>
      </div>
    </div>
</template>

<script>
import Information from '../../components/information';

export default {
  name: 'second',
  components: { Information },
  data() {
    return {
      cpuObj: {
        name: 'cpu使用率',
        used: 28,
        total: 129,
        toBeUse: 101,
        needType: 'progress',
        needImg: false,
      },
      memoryObj: {
        name: '内存使用率',
        used: 100,
        total: 150,
        toBeUse: 50,
        needType: 'progress',
        needImg: false,
      },
      topRateObj: {
        name: 'cpu使用率 Top 5',
        needType: 'useRate',
        needImg: false,
      },
      warnInfoObj: {
        name: '告警信息',
        needImg: false,
        needType: 'steps',
      },
    };
  },
};
</script>

<style scoped lang="scss">
.part-second {
  display: flex;
  justify-content: space-between;
  .progress-cpu {
    width: 31.9%;
    height: 280px;
    background-color: transparent;
    .cpu {
      margin-bottom: 16px;
    }
  }
  .topRate-cpu, .warn-info {
    width: 31.9%;
    height: 280px;
    background-color: #fff;
    border-radius: 4px;
  }
}
</style>
