export default function getConfig(el, series, Highcharts) {
  return {
    chart: {
      renderTo: el,
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
    series,
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
}
