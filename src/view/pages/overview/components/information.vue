<template>
  <div class="informationBlock">
    <div class="block-name">{{form.name}}</div>
    <div class="block-info" v-if="needType == 'number'">
      <div class="blockInfo-num">
        <p class="number">{{form.count}}</p>
        <p class="text">{{form.describe}}</p>
      </div>
      <div class="blockInfo-image" v-if="needImg">
        <img :src="form.imgUrl" alt="stack"/>
      </div>
    </div>
    <div class="block-step" v-if="needType == 'step'">
      <p class="step-text">使用率22%，共130个</p>
      <dao-progress type="usage" :progress="0.22"></dao-progress>
      <div class="step-direction">
        <div><span class="deep-dot"></span>已使用28个</div>
        <div><span class="shallow-dot"></span>可用101个</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'information',
  props: {
    needImg: {
      type: Boolean,
      default: false,
    },
    needType: {
      type: String,
      default: 'number',
    },
    form: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
    };
  },
  methods: {
    getSrc() {
      return import(this.form.imgUrl);
    },
  },
};
</script>

<style scoped lang="scss">
.informationBlock {
  border: 1px solid #F1F3F6;
  font-size: 12px;
  background-color: #FFFFFF;
  font-family: 苹方-简 常规体;
  box-sizing: content-box;
  .block-name {
    color: #3D444F;
    font-weight: 600;
    border-bottom: 2px solid #EDF0F5;
    padding: 10px;
  }
  .block-info {
    display: flex;
    justify-content: space-between;
    padding: 0px 16px 15px 16px;
    align-items: center;
    .blockInfo-num {
      .number {
        color: #3D444F;
        font-size: 30px;
        font-weight: 600;
      }
      .text {
        color: #9BA3AF;
        font-family: 苹方-简 常规体;
        font-size: 14px;
      }
    }
    .blockInfo-image {
      width: 58px;
      height: 58px;
      border-radius: 50%;
      border: 4px solid #EDF0F5;
      /*text-align: center;*/
      /*vertical-align: middle;*/
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 21px;
        height: 21px;
      }
    }
  }
  .block-step {
    padding: 16px;
    text-align: center;
    .step-text {
      font-size: 14px;
      color: #3D444F;
      margin-bottom: 10px;
    }
    .step-direction {
      font-size: 12px;
      color: #9BA3AF;
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      .deep-dot, .shallow-dot {
        display: inline-block;
        width: 8px;
        height: 8px;
        margin-right: 5px;
      }
      .deep-dot {
        background-color: #3890FF;
      }
      .shallow-dot {
        background-color: #EBF3FF;
      }
    }
  }
}
</style>
