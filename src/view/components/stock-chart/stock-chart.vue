<template>
  <div ref="chart" class="chart-hold">
    <svg class="loading-icon rotating">
      <use xlink:href="#icon_circle-rotate"></use>
    </svg>
  </div>
</template>

<script>
import { defaultsDeep as setOps } from 'lodash';

let Highcharts = null;

export default {
  name: 'StockChart',
  props: {
    option: { type: Object, default: () => ({}) },
    queue: { type: Array, default: () => [] },
  },
  created() {
    Highcharts = window.Highcharts; // eslint-disable-line
  },
  data() {
    return {
      datas: [],
      chart: '',
      skip: true,
      chartCount: 0,
      firstInit: false,
    };
  },
  watch: {
    queue(item) {
      const { chartCount } = this;
      const { skip } = this;

      if (item && item.length > 10 && !this.firstInit) {
        this.chartCount = item[0].length;
        const orginizedNew = this.reorgnizeArr(item);
        this.chart = this.buildChart(orginizedNew, this.option);
        this.$emit('clear');
        this.skip = false;
        this.firstInit = true;
      }

      if (!(item.length === 0 || skip)) {
        this.$emit('clear');
        let i = 0;
        item.forEach(e => e.forEach(p => {
          if (i >= chartCount) return;
          if (i !== chartCount - 1) {
            this.chart.series[i].addPoint(p, false, true);
          } else {
            this.chart.series[i].addPoint(p, true, true);
          }
          i += 1;
        }));
      }
    },
  },
  mounted() {
    const item = this.queue;

    if (item && item.length > 10 && !this.firstInit) {
      this.chartCount = item[0].length;
      const orginizedNew = this.reorgnizeArr(item);
      this.chart = this.buildChart(orginizedNew, this.option);
      this.$emit('clear');
      this.skip = false;
      this.firstInit = true;
    }
  },
  computed: {
    options() {
      const { datas } = this;

      return {
        chart: {
          renderTo: this.$el,
          type: 'areaspline',
          animation: Highcharts.svg, // don't animate in old IE
          marginRight: 10,
        },
        credits: {
          enabled: 0,
        },
        title: {
          text: undefined,
        },
        xAxis: {
          type: 'datetime',
          tickPixelInterval: 150,
        },
        yAxis: {
          gridLineWidth: 0,
          title: null,
          reversedStacks: false,
          plotLines: [{
            value: 0,
            width: 1,
            color: '#808080',
          }],
          min: 0,
          endOnTick: false,
          minRange: 0.15,
          lineWidth: 1,
        },
        exporting: {
          enabled: false,
        },
        series: datas,
        plotOptions: {
          areaspline: {
            stacking: null,
            marker: {
              radius: 1.1,
            },
            lineWidth: 1,
            states: {
              hover: {
                lineWidth: 1,
              },
            },
            threshold: null,
          },
        },
      };
    },
  },
  methods: {
    buildChart(datas, opts) {
      const series = datas.map((e, i) => ({
        data: e,
        name: opts.labels[i],
      }));

      const chartOpts = Object.assign(this.options, { series });
      const config = setOps(opts, chartOpts);

      return new Highcharts.chart(config); // eslint-disable-line
    },
    reorgnizeArr([points, ...rest], flag = true, arr) {
      if (points === undefined) {
        return arr;
      } else if (flag) {
        return this.reorgnizeArr(rest, false, points.map(e => [e]));
      }
      points.forEach((e, i) => arr[i].push(e));
      return this.reorgnizeArr(rest, false, arr);
    },
  },
};
</script>

<style lang="scss">
.chart-hold {
  width: 100%;
  height: 340px;

  .loading-icon {
    width: 100%;
    height: 60px;
    margin-top: 150px;
    transform-origin: 50% 50%;
    animation: rotate 1.1s infinite linear;

    fill: #5d9cec;
  }
}
</style>
