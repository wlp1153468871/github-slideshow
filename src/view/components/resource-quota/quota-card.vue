<template>
  <li class="quota-card">
    <div class="quota-card-title">
      <big>{{type}}</big>
      <small>剩余 <big> {{ hard- subHard | byte2gib(type) }} </big>{{unit}}</small>
    </div>
    <div>
      <small>{{subScope}} <big> {{ subHard | byte2gib(type)}} </big>{{unit}}</small>
      <small> / {{scope}} <big> {{ hard | byte2gib(type)}} </big>{{unit}}</small>
    </div>
    <dao-progress
      type="usage"
      :progress="subHard / hard"
    >
    </dao-progress>
  </li>
</template>

<script>
import { byte2gib } from '@/core/utils/gib2byte';

export default {
  name: 'quota-card',
  props: {
    type: { type: String, default: 'CPU' },
    hard: { type: String, default: '0' },
    subHard: { type: String, default: '0' },
    scope: { type: String, default: '范围' },
    subScope: { type: String, default: '次级范围' },
    unit: { type: String, default: '单位' },
  },
  filters: {
    byte2gib(btye, type = 'CPU') {
      return byte2gib(btye, type);
    },
  },
};
</script>

<style lang="scss" scoped>
.quota-card {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  min-width: 450px;
  height: 100px;
  padding: 10px 20px;
  margin: 0 30px 15px 0;
  background-color: #fff;
  border: solid 1px #e6e9ef;
  border-radius: 3px;

  &:last-child {
    margin-right: 0;
  }
  big {
    color: #3d444f;
    font-size: 20px;
    font-weight: 600;
    line-height: 1.5;
  }
  small {
    color: #9ba3af;
    font-size: 12px;
    line-height: 1.17;
  }
  .quota-card-title {
    display: flex;
    justify-content: space-between;
  }
}
</style>
