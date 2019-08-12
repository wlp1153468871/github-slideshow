import PercentCircleComponent from './percent-circle';
import PieChartComponent from './pie-chart';
import ProgressDountComponent from './progress-dount';

export const PercentCircle = resolve => {
  import(/* webpackChunkName: "d3" */ /* webpackMode: "lazy" */ 'd3').then(d3 => {
    if (!window.d3) {
      window.d3 = d3;
    }
    resolve(PercentCircleComponent);
  });
};

export const PieChart = resolve => {
  import(/* webpackChunkName: "d3" */ /* webpackMode: "lazy" */ 'd3').then(d3 => {
    if (!window.d3) {
      window.d3 = d3;
    }
    resolve(PieChartComponent);
  });
};

export const ProgressDount = resolve => {
  import(/* webpackChunkName: "d3" */ /* webpackMode: "lazy" */ 'd3').then(d3 => {
    if (!window.d3) {
      window.d3 = d3;
    }
    resolve(ProgressDountComponent);
  });
};
