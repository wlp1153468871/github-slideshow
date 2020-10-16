<template>
  <div class="informationBlock">
    <div class="block-name" v-if="needHead">{{form.name}}</div>
<!--  number  -->
    <div class="block-info" v-if="needType == 'number'">
      <div class="blockInfo-num">
        <p class="number">{{form.count}}</p>
        <p class="text">{{form.describe}}</p>
      </div>
      <div class="blockInfo-image" v-if="needImg">
        <img :src="form.imgUrl" alt="stack"/>
      </div>
    </div>
<!--  progress  -->
    <div class="block-step" v-if="needType == 'progress'">
      <p class="step-text">使用率{{utilizationRate}}%，共{{form.total}}个</p>
      <dao-progress type="usage" :progress="percent"></dao-progress>
      <div class="step-direction">
        <div><span class="deep-dot"></span>已使用{{form.used}}个</div>
        <div><span class="shallow-dot"></span>可用{{form.toBeUse}}个</div>
      </div>
    </div>
<!--  steps  -->
    <div class="steps-container" v-if="needType == 'steps'">
      <steps></steps>
    </div>
<!--  useRate  -->
    <div class="use-rate" v-if="needType == 'useRate'">
      <div class="use-base" v-for="(item, index) in useRateData" :key="index">
        <div class="used" :style="{ width: item.percent}">
          <span>{{item.name}}</span>
        </div>
        <span class="percent">{{item.percent}}</span>
      </div>
    </div>
<!--  rank  -->
    <div
      :class="{ 'instance-rank': true, 'version-margin': form.needMargin || false }"
      v-if="needType == 'instanceRank'">
      <div class="instance-info" v-for="(item, index) in instanceData" :key="index">
        <span>{{item.name}}</span>
        <span v-if="item.count" style="color: #3D444F">{{item.count}}</span>
      </div>
    </div>
<!--  colonyInfo  -->
    <div class="colony-info" v-if="needType == 'colonyInfo'">
      <div class="instance-info" v-for="(item, index) in instanceData" :key="index">
        <div>
          <img class="colonyImg" :src="item.imgUrl" alt="图片"/>
          <span>{{item.zhName}}</span>
        </div>
        <span style="color: #3D444F">{{item.des}}</span>
      </div>
    </div>
<!--  pie  -->
    <div class="normal-rate" v-if="needType == 'needPie'">
      <div class="doughnut">
        <div id="main" ref="myChart" style="width: 100px;height:100px;"></div>
        <dev class="description">
          <p class="text">正常</p>
          <p class="number">{{form.normalNumber}}</p>
        </dev>
      </div>
      <div style="margin: 16px">
        <span class="normal"></span>
        {{form.normalNumber}}个应用正常
      </div>
      <div style="margin: 16px">
        <span class="warn"></span>
        {{form.total - form.normalNumber}}个应用异常
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts';
import steps from './steps';

const instanceData = [{
  name: 'APIServe',
  count: 12,
}, {
  name: 'APIServe',
  count: 12,
}, {
  name: 'APIServe',
  count: 12,
}, {
  name: 'APIServe',
  count: 12,
}];
export default {
  name: 'information',
  props: {
    needImg: {
      type: Boolean,
      default: false,
    },
    needType: {
      type: String,
      default: 'number',
    },
    needHead: {
      type: Boolean,
      default: true,
    },
    form: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  components: {
    steps,
  },
  data() {
    return {
      useRateData: [{
        name: 'application1',
        percent: '100%',
        count: 23,
      }, {
        name: 'application2',
        percent: '75%',
        count: 16,
      }, {
        name: 'application3',
        percent: '30%',
        count: 8,
      }, {
        name: 'application4',
        percent: '15%',
        count: 3,
      }, {
        name: 'application5',
        percent: '10%',
        count: 1,
      }],
      instanceData: this.form.instanceData || instanceData,
    };
  },
  mounted() {
    const myChart = echarts.init(this.$refs.myChart);
    const option = {
      series: [
        {
          type: 'pie',
          radius: ['80%', '100%'],
          hoverAnimation: false,
          legendHoverLink: false,
          label: {
            show: false,
            position: 'center',
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: 1450, name: '正常应用' },
            { value: 600, name: '异常应用' },
          ],
        },
      ],
      color: ['#3890FF', '#E4E7ED', '#E4E7ED'],
    };
    myChart.setOption(option);
  },
  computed: {
    utilizationRate() {
      return Math.ceil((this.form.used / this.form.total) * 100);
    },
    percent() {
      console.log(this.form.used / this.form.total, '1111');
      return this.form.used / this.form.total;
    },
  },
  methods: {
    getSrc() {
      return import(this.form.imgUrl);
    },
  },
};
</script>

<style scoped lang="scss">
.informationBlock {
  border: 1px solid #fff;
  font-size: 12px;
  background-color: #FFFFFF;
  font-family: 苹方-简 常规体;
  box-sizing: content-box;
  border-radius: 4px;
  .block-name {
    color: #3D444F;
    font-weight: 600;
    border-bottom: 2px solid #EDF0F5;
    padding: 10px;
  }
  .block-info {
    display: flex;
    justify-content: space-between;
    padding: 0px 16px 15px 16px;
    align-items: center;
    .blockInfo-num {
      .number {
        color: #3D444F;
        font-size: 30px;
        font-weight: 600;
      }
      .text {
        color: #9BA3AF;
        font-family: 苹方-简 常规体;
        font-size: 14px;
      }
    }
    .blockInfo-image {
      width: 58px;
      height: 58px;
      border-radius: 50%;
      border: 4px solid #EDF0F5;
      /*text-align: center;*/
      /*vertical-align: middle;*/
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 21px;
        height: 21px;
      }
    }
  }
  .block-step {
    padding: 9px 16px;
    text-align: center;
    .step-text {
      font-size: 14px;
      color: #3D444F;
      margin-bottom: 10px;
    }
    .step-direction {
      font-size: 12px;
      color: #9BA3AF;
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      .deep-dot, .shallow-dot {
        display: inline-block;
        width: 8px;
        height: 8px;
        margin-right: 5px;
      }
      .deep-dot {
        background-color: #3890FF;
      }
      .shallow-dot {
        background-color: #EBF3FF;
      }
    }
  }
  .steps-container {
    padding: 5px 10px 10px 5px;
  }
  .use-rate {
    padding: 15px 16px;

    .use-base {
      height: 30px;
      border: 1px solid #EDF0F5;
      margin-bottom: 8px;
      position: relative;
      .used {
        height: 100%;
        background-color: rgba(56, 144, 255, 0.12);
        color: #3D444F;
        font-size: 12px;
        display: flex;
        align-items: center;
        span {
          margin-left: 8px;
        }
      }
      .percent {
        position: absolute;
        right: 8px;
        top: 5px;
      }
    }
  }
  .instance-rank {
    border-top: 1px solid #EDF0F5;
    .instance-info {
      line-height: 32px;
      padding: 0px 15px;
      color: #9BA3AF;
      font-size: 14px;
      display: flex;
      justify-content: space-between;
    }
  }
  .colony-info {
    border-top: 1px solid #EDF0F5;
    .instance-info {
      line-height: 29px;
      padding: 0px 15px;
      color: #9BA3AF;
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      .colonyImg {
        width: 14px;
        height: 16px;
        vertical-align: middle;
        margin-right: 9px;
      }
    }
  }
  .version-margin {
    margin-top: 47px;
    color: #EDF0F5FF;
    font-size: 14px;

  }
  .normal-rate {
    color: #9BA3AF;
    font-size: 12px;
    .doughnut {
      display: flex;
      justify-content: center;
      padding: 20px;

      position: relative;
      .description {
        position: absolute;
        left: 47%;
        top: 35%;
        .text {
          color: #9BA3AF;
          font-size: 12px;
          text-align: center;
        }
        .number {
          color: #3D444F;
          font-size: 16px;
          text-align: center;
          font-weight: 600;
        }
      }
    }
  }
  .normal {
    display: inline-block;
    width: 10px;
    height: 10px;
    background-color: #3890FF;
  }
  .warn {
    display: inline-block;
    width: 10px;
    height: 10px;
    background-color: #E4E7ED;
  }
}
</style>
