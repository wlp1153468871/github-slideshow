<template>
    <div class="steps">
      <div class="dot"></div>
      <div>
        <p class="description">部署实例成功</p>
        <p class="timer">5分钟前</p>
      </div>
    </div>
</template>

<script>
export default {
  name: 'steps',
};
</script>

<style scoped lang="scss">
.steps {
  display: flex;
  justify-content: flex-start;
  height: 55px;
  font-family: 苹方-简 常规体;
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #22C36A;

    margin-right: 12px;
    margin-top: 10px;
    &::before {
      content: '';
      width: 1px;
      background-color: #aaaaaa;
      height: 20px;
    }
  }
  .warn {
    background-color: #F1483F;
  }
  .description {
    color: #3D444F;
    font-size: 14px;
  }
  .timer {
    color: #aaa;
    font-size: 10px;
  }
}
</style>
