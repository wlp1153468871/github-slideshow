import Vue from 'vue';
import { REFRESH_COUNT } from '@/core/constants/constants';

const saveRefreshTime = () => {
  const nowTime = new Date();
  const lastRefreshTime = Vue.ls.get('refreshTime')
    ? new Date(Vue.ls.get('refreshTime'))
    : new Date(-1);

  if (lastRefreshTime >= nowTime) {
    nowTime.setSeconds(nowTime.getSeconds() + REFRESH_COUNT);
    Vue.ls.set('refreshTime', nowTime.toString());
  } else {
    Vue.ls.set('refreshTime', new Date(-1).toString());
  }
};

export default saveRefreshTime;
