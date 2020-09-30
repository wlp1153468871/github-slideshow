<template>
    <div class="partFirst">
      <div class="blockInfo">
        <div class="application">
          <information></information>
        </div>
        <div class="other">
          <div class="other-work">
            <information></information>
          </div>
          <div class="other-container">
            <information></information>
          </div>
        </div>
      </div>
      <div class="lineChart" ref="lineChart" style="width: 50%;height: 280px"></div>
      <div class="newsStep"></div>
    </div>
</template>

<script>
import echarts from 'echarts';
import Information from '../../components/information';

export default {
  name: 'first',
  components: { Information },
  data() {
    return {

    };
  },
  mounted() {
    const lineChart = echarts.init(this.$refs.lineChart);
    lineChart.setOption({
      title: {
        text: '操作历史记录',
        textStyle: {
          color: '#3D444F',
          fontFamily: '苹方-简 中粗体',
          fontSize: 12,
        },
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: ['09:00', '09:15', '09:30', '09:45'],
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
      series: [
        {
          name: '邮件营销',
          type: 'line',
          stack: '总量',
          areaStyle: {},
          data: [120, 132, 101, 134, 90, 230, 210],
        },
      ],
    });
  },
};
</script>

<style scoped lang="scss">
.partFirst {
  display: flex;
  justify-content: space-between;
  height: 280px;
  .lineChart {
    border: 1px solid #E4E7ED;
    background-color: #fff;
  }
  .blockInfo {
    width: 23.5%;
    height: 100%;
    /*background-color: #ffaa00;*/
    .application {
      width: 100%;
      height: 132px;
      overflow: hidden;
      background-color: #fff;
    }
    .other {
      width: 100%;
      height: 132px;
      display: flex;
      justify-content: space-between;
      margin-top: 16px;
      .other-work, .other-container {
        width: 48%;
      }
    }
  }
  .newsStep {
    width: 23.5%;
    height: 100%;
    background-color: #f0c2c0;
  }
}
</style>
