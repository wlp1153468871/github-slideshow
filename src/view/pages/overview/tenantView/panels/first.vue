<template>
    <div class="partFirst">
      <div class="lineChart" ref="lineChart" style="width: 528px;height: 280px"></div>
    </div>
</template>

<script>
import echarts from 'echarts';

export default {
  name: 'first',
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
  .lineChart {
    border: 1px solid #E4E7ED;
    background-color: #fff;
  }
}
</style>
