<template>
  <div class="colonyInfo-panels">
    <div class="part-one">
      <part-first></part-first>
    </div>
    <div class="part-tow">
      <part-second></part-second>
    </div>
    <div class="part-three">
      <part-third></part-third>
    </div>
  </div>
</template>

<script>
import partFirst from './first';
import partSecond from './second';
import partThird from  './third';

export default {
  name: 'colonyInfo',
  components: {
    partSecond,
    partFirst,
    partThird,
  },
};
</script>

<style scoped lang="scss">
.colonyInfo-panels {
  .part-one, .part-tow, .part-three {
    margin-bottom: 16px;
   }
}
</style>
