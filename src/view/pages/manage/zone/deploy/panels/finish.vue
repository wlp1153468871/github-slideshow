<template>
  <div class="panel-finish dao-setting-layout">
    <div v-if="type === RESULT_TYPES.SUCCESS">
      <div class="confirm-icon">
        <svg>
          <use xlink:href="#icon_checkmark"></use>
        </svg>
      </div>
      <div class="tip">
        <h3>已完成{{ operationLabel }}</h3>
        <p>您可以在 <a @click="gotoDetail">可用区详情页面</a> 查看可用区相关信息
        </p>
      </div>
    </div>

    <div v-if="type === RESULT_TYPES.ERROR">
      <div class="confirm-icon wrong">
        <svg>
          <use xlink:href="#icon_cross"></use>
        </svg>
      </div>
      <div class="tip">
        <h3>{{ operationLabel }}失败</h3>
        <p>您可以在 <a @click="gotoBack()">回到第一步</a> 重新再创建一次</p>
        <p><b>错误信息:</b></p>
        <pre>{{ errorMsg }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
import { isEmpty } from 'lodash';

export default {
  name: 'panel-finish',

  props: {
    instance: { type: Object, default: () => ({}) },
    error: { type: Object, default: () => ({}) },
    operationLabel: { type: String },
  },

  data() {
    return {
      RESULT_TYPES: {
        SUCCESS: 'SUCCESS',
        ERROR: 'ERROR',
        APPROVAL: 'APPROVAL',
      },
    };
  },

  computed: {
    type() {
      if (!isEmpty(this.error)) {
        return this.RESULT_TYPES.ERROR;
      }
      return this.RESULT_TYPES.SUCCESS;
    },

    errorMsg() {
      const { data = {} } = this.error;
      return data.error_info;
    },
  },

  methods: {
    gotoDetail() {
      this.$router.push({
        name: 'manage.zone.detail',
        params: {
          zone: this.instance.id,
        },
      });
    },

    gotoList() {
      this.$router.push({
        name: 'manage.zone.list',
      });
    },

    gotoBack() {
      this.$emit('prev');
    },
  },
};
</script>

<style lang="scss">
.panel-finish {
  position: relative;
  padding: 100px 0;
  border-bottom: 1px solid #e4e7ed;
  .confirm-icon {
    width: 60px;
    height: 60px;
    margin: 0 auto;
    padding: 11px;
    border-radius: 50%;
    background-color: #22c36a;
    &.wrong {
      background-color: #f1483f;
    }
    svg {
      width: 40px;
      height: 40px;
      fill: #fff;
    }
  }
  .tip {
    margin: 20px auto;
    text-align: center;
    h3 {
      font-size: 28px;
      margin: 0 auto;
    }
    p,
    pre {
      font-size: 14px;
      line-height: 20px;
      margin: 0 auto;
      padding: 12px 0;
      text-align: center;
      white-space: normal;
      color: #9ba3af;
    }

    .mailto {
      display: inline-block;
      margin-top: 10px;
    }
  }
}
</style>
