<!--Created by Max on 2018-12-26.-->
<template>
  <div class="panel-finish dao-setting-layout">
    <div v-if="type === RESULT_TYPES.SUCCESS">
      <div class="confirm-icon">
        <svg>
          <use xlink:href="#icon_checkmark"></use>
        </svg>
      </div>
      <div class="tip">
        <h3>已完成订购</h3>
        <p>您可以在 <a @click="gotoDetail">Route 详情页面</a> 查看</p>
      </div>
    </div>
    <div v-if="type === RESULT_TYPES.APPROVAL">
      <div class="confirm-icon">
        <svg>
          <use xlink:href="#icon_checkmark"></use>
        </svg>
      </div>
      <div class="tip">
        <h3>您的请求已提交审批</h3>
        <p>您可以在 <a @click="gotoList">审批请求页面</a> 查看具体的审批进度</p>
      </div>
    </div>
    <div v-if="type === RESULT_TYPES.ERROR">
      <div class="confirm-icon wrong">
        <svg>
          <use xlink:href="#icon_cross"></use>
        </svg>
      </div>
      <div class="tip">
        <h3>订购失败</h3>
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
    route: { type: Object, default: () => ({}) },
    error: { type: Object, default: () => ({}) },
    isCreating: { type: Boolean, default: false },
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
      return this.route.is_need_approval ? this.RESULT_TYPES.APPROVAL : this.RESULT_TYPES.SUCCESS;
    },

    errorMsg() {
      const { data = {} } = this.error;
      return data.error_info;
    },
  },

  methods: {
    gotoDetail() {
      this.$router.push({
        name: 'resource.routes.detail',
        params: {
          name: this.route.name,
        },
      });
    },

    gotoList() {
      this.$router.push({
        name: 'console.approval.list',
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
    padding: 11px;
    margin: 0 auto;
    background-color: #22c36a;
    border-radius: 50%;
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
      margin: 0 auto;
      font-size: 28px;
    }
    p,
    pre {
      padding: 12px 0;
      margin: 0 auto;
      color: #9ba3af;
      font-size: 14px;
      line-height: 20px;
      text-align: center;
      white-space: normal;
    }

    .mailto {
      display: inline-block;
      margin-top: 10px;
    }
  }
}
</style>
