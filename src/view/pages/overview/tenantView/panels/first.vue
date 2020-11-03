<template>
    <div class="partFirst">
      <div class="blockInfo">
        <div class="application">
          <information
            :needType="infoObj.needType"
            :needImg="infoObj.needImg"
            :form="infoObj"></information>
        </div>
        <div class="other">
          <div class="other-work">
            <information
            :form="workObj"
            :need-img="workObj.needImg"
            :need-type="workObj.needType"></information>
          </div>
          <div class="other-container">
            <information
              :form="containerObj"
              :need-img="containerObj.needImg"
              :need-type="containerObj.needType"></information>
          </div>
        </div>
      </div>
      <div class="lineChart" ref="lineChart" style="width: 50%;height: 280px"></div>
      <div class="newsStep">
        <information
        :form="stepsObj"
        :need-img="stepsObj.needImg"
        :need-type="stepsObj.needType"></information>
      </div>
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
      infoObj: {
        name: '应用',
        count: 62,
        describe: '全部应用数',
        // eslint-disable-next-line global-require
        imgUrl: require('@/assets/images/overview/stack-fill.png'),
        needType: 'number',
        needImg: true,
      },
      workObj: {
        name: '工作负载',
        count: 24,
        describe: '工作负载数',
        needType: 'number',
        needImg: false,
      },
      containerObj: {
        name: '容器组',
        count: 16,
        describe: '容器组数',
        needType: 'number',
        needImg: false,
      },
      stepsObj: {
        name: '审计日志',
        needType: 'steps',
        needImg: false,
      },
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
        top: 10,
        left: 10,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: '#CCD1D9FF',
          },
        },
        // axisTick: {
        //
        // },
        axisLabel: {
          margin: 10,
          color: '#9BA3AFFF',
        },
        data: ['10/8', '10/8', '10/9', '10/10', '10/11', '10/12', '10/13'],
      },
      yAxis: {
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dotted',
            color: '#E4E6EB',
          },
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          margin: 10,
          // lineHeight: 100,
          color: '#9BA3AFFF',
        },
      },
      series: [
        {
          name: '邮件营销',
          type: 'line',
          stack: '总量',
          areaStyle: {},
          data: [200, 132, 101, 134, 90, 230, 210],
        },
      ],
      color: ['#3890FF', '#3890FF1A'],
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
    border-radius: 4px;
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
      border-radius: 4px;
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
    background-color: #fff;
    border-radius: 4px;
  }
}
</style>
