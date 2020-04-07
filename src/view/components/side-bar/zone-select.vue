<template>
  <el-select
    class="zone-select"
    v-model="zoneId"
    @change="switchZone"
    placeholder="可用区"
    no-data-text="无选项">
    <el-option-group
      v-for="zones in zoneList"
      :key="zones.text"
      :label="zones.text + ' 数据中心'">
      <el-option
        v-for="item in zones.children"
        :key="item.id"
        :value="item.id"
        :label="item.name">
      </el-option>
    </el-option-group>
  </el-select>
</template>

<script>
import { mapState } from 'vuex';
import { groupBy, forEach } from 'lodash';

export default {
  name: 'ConsoleStatusBar',

  data() {
    return {
      zoneId: '',
    };
  },

  watch: {
    zone: {
      immediate: true,
      handler(zone) {
        if (zone) {
          this.zoneId = zone.id;
        }
      },
    },
  },

  computed: {
    ...mapState(['zone', 'zones']),

    zoneList() {
      const zoneMap = groupBy(this.zones, 'area_name');
      const zoneList = [];
      forEach(zoneMap, (envs, name) => {
        zoneList.push({
          text: name,
          children: envs,
        });
      });
      return zoneList;
    },
  },

  methods: {
    switchZone(zoneId) {
      const zone = this.zones.find(x => x.id === zoneId);
      this.$store.dispatch('switchZone', { zone });
      this.$tada(`切换区域到 ${zone.name}`, {
        buttons: false,
        timer: 1000,
      });
      this.updateRouter();
    },

    updateRouter() {
      // network
      this.$router.push({
        name: 'console.gateway',
      });
    },
  },
};
</script>

<style lang="scss">
@import '~daoColor';

.zone-select {
  .el-input__inner {
    color: #e4e7ed;
  }
}
</style>
