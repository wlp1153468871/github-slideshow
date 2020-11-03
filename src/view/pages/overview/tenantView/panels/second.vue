<template>
    <div class="partSecond">
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
        <div class="cpu-top">
          <information
          :form="topRateObj"
          :need-img="topRateObj.needImg"
          :need-type="topRateObj.needType"></information>
        </div>
        <div class="memory-top">
          <information
            :form="memoryRateObj"
            :need-img="memoryRateObj.needImg"
            :need-type="memoryRateObj.needType"></information>
        </div>
      </div>
      <div class="steps-cpu">
        <information
          :form="stepsObj"
          :need-img="stepsObj.needImg"
          :need-type="stepsObj.needType"></information>
      </div>
    </div>
</template>

<script>
import information from '../../components/information';

export default {
  name: 'second',
  components: {
    information,
  },
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
      stepsObj: {
        name: '告警信息',
        needType: 'steps',
        needImg: false,
      },
      topRateObj: {
        name: 'cpu使用率 Top 5',
        needType: 'useRate',
        needImg: false,
      },
      memoryRateObj: {
        name: '内存使用率 Top 5',
        needType: 'useRate',
        needImg: false,
      },
    };
  },
};
</script>

<style scoped lang="scss">
.partSecond {
  display: flex;
  justify-content: space-between;
  height: 280px;
  .progress-cpu {
    width: 23.5%;
    height: 100%;
    /*background-color: #ffaa00;*/
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    .cpu {
      height: 132px;
      /*background-color: #ffa39e;*/
    }
    .memory {
      height: 132px;
      /*background-color: #ffa39e;*/
    }
  }
  .topRate-cpu {
    width: 50%;
    height: 280px;
    /*background-color: #ffa39e;*/
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .cpu-top {
      width: 52%;
      height: 100%;
      background-color: #fff;
      border-radius: 4px;
    }
    .memory-top {
      width: 45%;
      height: 100%;
      background-color: #fff;
      border-radius: 4px;
    }
  }
  .steps-cpu {
    width: 23.5%;
    height: 100%;
    background-color: #fff;
    border-radius: 4px;
  }
}
</style>
