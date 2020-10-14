<template>
    <div class="doughnut">
      <div id="main" ref="myChart" style="width: 100px;height:100px;"></div>
    </div>
</template>

<script>
import echarts from 'echarts';

export default {
  name: 'doughDemo',
  data() {
    return {

    };
  },
  mounted() {
    const myChart = echarts.init(this.$refs.myChart);
    const option = {
      series: [
        {
          type: 'pie',
          radius: ['50%', '70%'],
          hoverAnimation: false,
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
      color: ['#3890FF', '#E4E7ED'],
    };
    myChart.setOption(option);
  },
};
</script>

<style scoped lang="scss">
  .doughnut {
    display: inline-block;
    background-color: #ffa39e;
  }
</style>
