<template>
  <ul class="quota-cards">
    <div class="action">
      <slot name="action"> </slot>
      <button
        v-if="showRefresh"
        class="dao-btn"
        style="margin-left: 10px;"
        @click="$emit('refresh')"
      >
        <svg class="icon">
          <use xlink:href="#icon_update"></use>
        </svg>
      </button>
    </div>
    <quota-card
      type="CPU"
      unit="Core"
      :hard="hard.cpu"
      :sub-hard="subHard.cpu"
      :scope="scope"
      :sub-scope="subScope"
    >
    </quota-card>
    <quota-card
      type="内存"
      unit="G"
      :hard="hard.memory"
      :sub-hard="subHard.memory"
      :scope="scope"
      :sub-scope="subScope"
    >
    </quota-card>
    <quota-card
      type="存储"
      unit="G"
      :hard="hard.storage"
      :sub-hard="subHard.storage"
      :scope="scope"
      :sub-scope="subScope"
    >
    </quota-card>
  </ul>
</template>

<script>
import QuotaCard from './quota-card.vue';

export default {
  name: 'quota-cards',
  props: ['scope', 'subScope', 'hard', 'subHard', 'showRefresh'],
  components: {
    QuotaCard,
  },
};
</script>

<style lang="scss" scoped>
.quota-cards {
  display: flex;
  flex-wrap: wrap;
  position: relative;
  list-style: none;
  margin-bottom: 15px;
  .action {
    position: absolute;
    right: 10px;
    top: -40px;
  }
}
</style>
