<template>
  <div class="loading-balance">
    <div class="balance-tabs">
      <span
        v-for="(tab, index) in tabs"
        :key="index"
        :class="{ active: index === selected }"
        @click="selectBalance(index)"
      >
        {{ tab }}
      </span>
    </div>

    <service-panel v-if="selected === 'fourLayer'" :services="services"> </service-panel>

    <route-panel v-else :routes="routes"> </route-panel>
  </div>
</template>

<script>
import ServicePanel from '../sections/service';
import RoutePanel from '../sections/route';

export default {
  name: 'BalancePanel',

  components: {
    ServicePanel,
    RoutePanel,
  },

  props: {
    services: { type: Array, default: () => [] },
    routes: { type: Array, default: () => [] },
  },

  data() {
    const tabs = {
      fourLayer: '四层负载均衡',
      sevenLayer: '七层负载均衡',
    };
    return {
      tabs,
      selected: 'fourLayer',
    };
  },

  methods: {
    selectBalance(index) {
      this.selected = index;
    },
  },
};
</script>

<style lang="scss">
.loading-balance {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  .balance-tabs {
    position: absolute;
    top: 5px;

    > span {
      cursor: pointer;
      display: inline-block;
      text-align: center;
      color: rgb(89, 95, 105);
      padding: 2px 8px;
      border-radius: 4px;

      &:first-child {
        margin-right: 10px;
      }

      &:hover,
      &.active {
        background: rgb(204, 209, 217);
      }
    }
  }
}
</style>
