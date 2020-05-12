<template>
  <li class="quota-card">
    <div class="quota-card-title">
      <span>{{ item.name }} 总量</span>
      <span v-if="item.limit">已使用 {{ (item.used / item.limit) | percent }}</span>
      <span v-else>已使用 {{ item.used }} {{ item.unit }}</span>
    </div>
    <div class="quota-card-content">
      <big>{{ item.limit | otherwise('不限额度') }}</big>
      <small v-if="item.limit || item.limit === 0">{{ item.unit }}</small>
      <small v-if="item.limit || item.limit === 0">
        / 剩余 {{ (item.limit - item.used) | floor(1) }} {{ item.unit }}
      </small>
      <dao-progress type="usage" :progress="item.used / item.limit"> </dao-progress>
    </div>
  </li>
</template>

<script>
export default {
  name: 'QuotaCard',
  props: {
    item: { type: Object, default: () => ({}) },
  },
};
</script>
