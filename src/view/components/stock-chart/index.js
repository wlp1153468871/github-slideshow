import StockChartComponent from './stock-chart';

export default resolve => {
  if (window.Highcharts) {
    resolve(StockChartComponent);
  } else {
    Promise.all([
      import(/* webpackChunkName: "highcharts" */ /* webpackMode: "lazy" */ 'highcharts'),
      import(/* webpackChunkName: "highcharts" */ /* webpackMode: "lazy" */ 'highcharts/modules/exporting'),
    ]).then(res => {
      const [highcharts, exporting] = res;
      window.Highcharts = highcharts;
      exporting(window.Highcharts);
      window.Highcharts.setOptions({
        global: {
          useUTC: false,
        },
      });
      resolve(StockChartComponent);
    });
  }
};
