<template>
    <div class="steps">
      <div v-for="(item, index) in stepsData" :key="index" class="steps-item">
        <div class="item-info">
          <p class="description">{{item.description}}</p>
          <p class="timer">{{item.timer}}</p>
          <div :class="{ 'dot': true, 'failed': !item.status }"></div>
          <div class="whiteBlock" v-if="index === 0"></div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'steps',
  data() {
    return {
      stepsData: [{
        description: '部署实例成功',
        timer: '5分钟前',
        status: 1,
      }, {
        description: '部署实例成功',
        timer: '两个小时前',
        status: 1,
      }, {
        description: '部署实例失败',
        timer: '09-21 11：32',
        status: 0,
      }, {
        description: '部署实例成功',
        timer: '09-20 11：32',
        status: 1,
      }],
    };
  },
};
</script>

<style scoped lang="scss">
.steps {
  font-family: 苹方-简 常规体;
  text-align: left;
  .steps-item {
    position: relative;
    .item-info {
      border-left: 1px solid #E4E7ED;
      padding-left: 10px;
      margin-left: 10px;
      padding-top: 10px;

      position: relative;
      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #22C36A;
        border: 1px solid #fff;

        margin-right: 12px;
        margin-top: 10px;

        position: absolute;
        left: -4.5px;
        top: 9px;
        z-index: 99;
      }
      .failed {
        background-color: #F1483F;
      }
      .description {
        color: #3D444F;
        font-size: 14px;
      }
      .timer {
        color: #9BA3AF;
        font-size: 10px;
      }
      .whiteBlock {
        width: 2px;
        height: 18px;
        background-color: #fff;
        position: absolute;
        left: -2px;
        top: 0px;
      }
    }
  }
}
</style>
