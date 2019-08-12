<template>
  <div class="console-status-bar">
    <section class="versatile-bar">
      <dao-select
        class="zone-select"
        v-model="zoneId"
        @change="switchZone"
        :append-to-body="false"
        placeholder="可用区"
        no-data-text="无选项">
        <dao-option-group
          v-for="zones in zoneList"
          :key="zones.text"
          :label="zones.text + ' 数据中心'">
          <dao-option
            v-for="item in zones.children"
            :key="item.id"
            :value="item.id"
            :label="item.name">
          </dao-option>
        </dao-option-group>
      </dao-select>
    </section>
  </div>
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
        this.zoneId = zone.id;
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
        name: 'console.dashboard',
      });
    },
  },
};
</script>

<style lang="scss">
@import "~daoColor";
$logo-bg: #25282d;
$status-bar-height: 32px;
$status-bar-bg-color: #f5f7fa;
$radial-blue-border: #c1ddff;

@mixin status-bar-round() {
  width: 36px;
  height: 36px;
  border-radius: 18px;
}

.console-status-bar {
  display: flex;
  height: $status-bar-height;
  background-color: $status-bar-bg-color;
  border-bottom: $white-dark 1px solid;

  svg {
    width: 16px;
    height: 16px;

    fill: currentColor;
  }
  section {
    border-right: $white-dark 1px solid;
    &.versatile-bar {
      flex: 1;
      color: $black-light;
      line-height: $status-bar-height;
    }
    .zone-select {
      width: 150px;
      margin-left: 20px;
      background-color: transparent;
      // reset dao-select
      .dao-select-main {
        .dao-select-switch {
          background-image: none;
          border: none;
          border-radius: 0;
        }
      }
      .dao-select-popper {
        overflow-y: auto;
        max-height: 300px;
        box-shadow: 0 18px 19px 0 rgba(55, 59, 65, .54);
        border-radius: 0;
        .checkmark {
          height: 16px;
        }
        .dao-select-category-label {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        &::-webkit-scrollbar {
          width: 0;
        }
      }
    }
  }
}
</style>
