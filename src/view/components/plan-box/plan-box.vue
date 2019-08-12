<template>
  <div class="service-spec-grid">
    <div class="service-spec-grid-wrap">
      <dao-dropdown
        class="setting-btn-wrapper"
        trigger="click"
        :append-to-body="true"
        placement="bottom-end">
        <div class="dao-btn has-icon ghost setting-btn">
          <svg class="icon"><use xlink:href="#icon_setting"></use></svg>
        </div>
        <dao-dropdown-menu slot="list">
          <dao-dropdown-item @click="editPlanDialog()">编辑</dao-dropdown-item>
          <dao-dropdown-item @click="deletePlanConfirm()">删除</dao-dropdown-item>
        </dao-dropdown-menu>
      </dao-dropdown>
      <div class="service-spec-grid-name">{{ plan.name }}</div>
      <div class="service-spec-grid-desc">{{ plan.description }}</div>
      <div
        class="service-spec-grid-quota"
        v-for="quota in plan.quota_requires"
        :key="quota.name">
        {{ quota.require }} {{ quota.unit }}  {{ quota.name }}
      </div>
      <div
        class="service-spec-grid-bullet"
        v-for="bullet in plan.bullets"
        :key="bullet">
        {{ bullet }}
      </div>
    </div>
    <div class="use-btn-wrapper">
      <div
        class="dao-btn ghost"
        v-if="plan.available"
        @click="disablePlan()">
        立即下架
      </div>
      <div
        class="dao-btn blue"
        v-if="!plan.available"
        @click="enablePlan()">
        立即上架
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlanBox',
  props: {
    plan: { type: Object, default: () => ({}) },
  },
  methods: {
    disablePlan() {
      this.$emit('disable', this.plan);
    },

    enablePlan() {
      this.$emit('enable', this.plan);
    },

    editPlanDialog() {
      this.$emit('edit', this.plan);
    },

    deletePlanConfirm() {
      this.$emit('delete', this.plan);
    },
  },
};
</script>

<style lang="scss">
@import "~daoColor";
$side-padding: 8px;

.service-spec {
  &-grid {
    flex: none;
    width: calc(100% / 3);
    min-width: calc(100% / 3);
    max-width: calc(100% / 3);
    padding: 0 $side-padding 20px;
    &:nth-child(3n+1) {
      padding-right: $side-padding * 2;
      padding-left: 0;
    }
    &:nth-child(3n) {
      padding-right: 0;
      padding-left: $side-padding * 2;
    }
    &-wrap {
      position: relative;
      width: 100%;
      padding: 30px 5px;
      text-align: center;
      background-color: $white;
      border: 1px solid $white-dark;
      border-bottom: none;
      border-top-right-radius: 4px;
      border-top-left-radius: 4px;
      .setting-btn-wrapper {
        position: absolute;
        top: 5px;
        right: 5px;
        .dao-dropdown-menu {
          width: 160px;
        }
      }
      .setting-btn {
        padding: 6px;
      }
      & + .use-btn-wrapper {
        background-color: $white;
        .dao-btn {
          width: 100%;
          box-shadow: 2px 0 4px rgba(204, 209, 217, .3);
          border-top-right-radius: 0;
          border-top-left-radius: 0;
          &.ghost {
            border: 1px solid $white-dark;
          }
        }
      }
    }
    &-name {
      color: $black-dark;
      font-size: 16px;
      font-weight: 500;
      line-height: 32px;
    }
    &-desc {
      padding-bottom: 20px;
      color: $grey-dark;
      font-size: 12px;
    }
    &-quota,
    &-bullet {
      color: $black-light;
      font-size: 13px;
      line-height: 24px;
    }
  }
}
</style>
