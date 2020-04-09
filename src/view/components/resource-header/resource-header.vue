<template>
  <div class="resource-header">
    <div class="resource-info">
      <service-logo v-if="selfDefined" :src="resource.logo"> </service-logo>
      <svg class="logo" v-else>
        <use :xlink:href="resource.logo"></use>
      </svg>
      <div class="resource-status">
        <div class="name-time">
          <breadcrumb :links="resource.links"></breadcrumb>
          <el-tooltip class="item" effect="dark" content="查看帮助文档" placement="right">
            <a target="_blank" v-if="helpUrl" :href="helpUrl" class="help-link">
              <svg class="icon">
                <use xlink:href="#icon_question"></use>
              </svg>
            </a>
          </el-tooltip>
          <div class="time">
            <slot name="creationTime"></slot>
          </div>
        </div>
        <div class="status-label">
          <div class="status">
            <slot name="status"></slot>
          </div>
          <slot name="labels"></slot>
        </div>
        <div class="description">
          <slot name="description"></slot>
        </div>
      </div>
    </div>
    <div class="action-buttons">
      <slot name="action-buttons"></slot>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  name: 'ResourceHeader',

  props: {
    selfDefined: {
      type: Boolean,
      default: false,
    },
    resource: { type: Object },
  },

  computed: {
    helpUrl() {
      return this.resource.helpUrl || Vue.filter('help_url')(this.resource.kind);
    },
  },
};
</script>

<style lang="scss">
.resource-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  color: #363636;
  border-bottom: 1px solid #e4e7ed;
  background-color: #fff;

  .help-link {
    margin-left: 5px;
  }

  .resource-info {
    display: flex;

    .logo {
      flex-shrink: 0;
      height: 54px;
      width: 54px;
    }

    h1 {
      font-size: 16px;
      line-height: 24px;
      color: #3d444f;
      font-weight: 600;
    }
  }

  .name-time {
    display: flex;
    align-items: center;

    .time {
      margin-left: 20px;
      font-size: 12px;
      font-weight: 400;
      color: #9c9c9c;
    }
  }

  .resource-status {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 12px;
  }

  .status-label {
    display: flex;
    margin-top: 5px;
  }

  .status {
    display: flex;
    align-items: center;
    font-size: 14px;
  }

  .action-buttons {
    flex-shrink: 0;
  }

  .description {
    font-size: 20px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 28px;
    font-weight: bold;
  }
}
</style>
