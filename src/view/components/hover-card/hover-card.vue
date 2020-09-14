<template>
  <div class="hover-card">
    <dao-popover
      trigger="hover"
      :disabled="disabled"
      :popper-cls="['hover-card-popover', type === 'label' ? ['label-height'] : ['width-limit']]"
      :placement="placement"
    >
      <slot></slot>
      <div slot="content" class="hover-card-content">
        <div v-if="type === 'label'" class="hover-card-label">
          <div class="table-view-card-td-card">
            <div
              v-for="(labelValue, labelName) in data"
              :key="labelName"
              class="table-view-card-td-container"
            >
              <div class="table-view-card-td-value">
                {{ labelName }} {{ symbol }} {{ labelValue || nullValue }}
                <span></span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="type === 'taint'" class="hover-card-taint">
          <div class="table-view-card-td-card">
            <div v-for="(taint, index) in data" :key="index" class="table-view-card-td-container">
              <div class="table-view-card-td-value">
                {{ taint.key }}{{ taint.value ? '=' : '' }}{{ taint.value
                }}{{ taint.effect ? ':' : '' }}{{ taint.effect }}
                <span></span>
              </div>
            </div>
            <div v-if="data.length === 0" class="table-view-card-td-container">
              <div class="table-view-card-td-value">
                {{ nullValue }}
                <span></span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="type === 'value'" class="hover-card-value">
          <div class="table-view-card-td-card">
            <div v-for="(value, index) in data" :key="index" class="table-view-card-td-container">
              <div class="table-view-card-td-value">
                {{ value }}
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </dao-popover>
  </div>
</template>
<script>
import { isEmpty } from 'lodash';
export default {
  name: 'HoverCard',
  props: {
    data: {
      type: [Array, Object],
    },
    type: {
      type: String,
    },
    placement: {
      type: String,
    },
    symbol: {
      type: String,
      default: ':',
    },
  },
  data() {
    return {
      nullValue: '<空>',
    };
  },
  computed: {
    disabled() {
      if (isEmpty(this.data)) return true;
      return false;
    },
  },
};
</script>
<style lang="scss">
@import '~daoColor';
.hover-card {
  .dao-popover {
    display: block !important;
  }
}
.width-limit {
  .dao-popover-inner {
    min-width: 200px !important;
  }
}

.hover-card-popover {
  // 使 hover-card 与 table 的下边框对齐
  &[x-placement^='bottom'] {
    margin-top: 0px !important;
  }
  .dao-popover-arrow {
    display: none !important;
  }
  .dao-popover-inner {
    max-width: unset !important;
    .table-view-card-td-card {
      // 为了使 hover-card 的边框与 table 对齐
      padding-left: 0;
    }
  }
}
.label-height {
  &.dao-popover-popper {
    margin-top: 4px !important;
  }
}

.table-view-card-td-card {
  padding-left: 10px;
  .table-view-card-td-container {
    display: flex;
    color: $black-dark;
    &:not(:nth-child(1)) {
      margin-top: 10px;
    }
    .table-view-card-td-value {
      font-size: 12px;
      height: 20px;
      border-radius: 3px;
      border: 1px solid $white-dark;
      line-height: 20px;
      background-color: $white-light;
      display: inline-flex;
      padding: 0 6px;
      align-items: center;
      white-space: nowrap;
    }
    .table-view-card-td-number {
      font-size: 12px;
      height: 20px;
      line-height: 20px;
      color: $grey-dark;
      margin-left: 5px;
    }
  }
}
</style>
