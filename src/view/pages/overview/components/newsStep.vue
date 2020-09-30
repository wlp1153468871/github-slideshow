<template>
  <div class="newsStep">
    <div class="newsHead">审计日志</div>
    <div class="newsProcess">
      <dao-steps v-model="currentStep">
        <dao-step slot="step" index="1" title="部署实例成功"></dao-step>
        <dao-step slot="step" title="部署实例成功" :active="activeStepFun"></dao-step>
        <dao-step slot="step" title="部署实例失败"></dao-step>
        <dao-step slot="step" title="部署实例成功"></dao-step>
      </dao-steps>
    </div>
  </div>
</template>

<script>
export default {
  name: 'newsList',
  data() {
    return {
      currentStep: '',

    };
  },
  methods: {
    activeStepFun() {

    },
  },
};
</script>

<style scoped lang="scss">
.newsStep {
  font-family: 苹方-简 中粗体;
  .newsHead {
    padding: 10px;
    color: #3D444F;
    font-size: 12px;
    font-weight: 600;
    border: 2px solid #EDF0F5;
  }
  .newsProcess {
    padding: 0px 16px 12px 16px;
    .dao-steps .dao-step-title:after, .dao-steps .dao-substep:after {
      left: 4px;
    }
  }
  .dao-steps {
    .title {
      color: #3D444F!important;
    }
  }
}
</style>
