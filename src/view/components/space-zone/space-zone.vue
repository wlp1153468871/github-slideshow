<template>
  <div class="space-zone">
    <dao-setting-layout>
      <template #layout-title>租户 / 项目组</template>
      <dao-setting-section>
        <dao-setting-item>
          <div class="form-inline reset-margin" slot="content">
            <div class="form-group">
              <label class="input-name">租户</label>
              <dao-select
                :disabled="!isPlatformAdmin"
                v-model="selectedOrg"
                @change="switchSpace('org')"
                placeholder="请选择一个租户">
                <dao-option
                  v-for="org in orgs"
                  :key="org.id"
                  :value="org"
                  :label="org.name">
                </dao-option>
              </dao-select>
            </div>
            <div class="form-group">
              <label class="input-name">项目组</label>
              <dao-select
                :disabled="!isPlatformAdmin"
                v-model="selectedSpace"
                @change="switchSpace"
                placeholder="请选择项目组">
                <dao-option
                  v-for="space in selectedOrg.children"
                  :key="space.id"
                  :value="space"
                  :label="space.name">
                </dao-option>
              </dao-select>
            </div>
          </div>
        </dao-setting-item>
      </dao-setting-section>
    </dao-setting-layout>

    <dao-setting-layout>
      <template #layout-title>地域 / 环境</template>
      <dao-setting-section>
        <dao-setting-item>
          <template #label>地域</template>
          <template #content>

            <el-radio-group
              size="small"
              v-model="selectedArea"
              :disabled="!isPlatformAdmin"
              @change="switchArea">
              <el-radio-button
                :label="area"
                v-for="(area, index) in areas"
                :key="index">
              </el-radio-button>
            </el-radio-group>

          </template>
        </dao-setting-item>
      </dao-setting-section>
      <dao-setting-section>
        <dao-setting-item>
          <template #label>环境</template>
          <template #content>

            <el-radio-group
              size="small"
              v-model="selectedEnv"
              :disabled="!isPlatformAdmin"
              @change="switchEnv">
              <el-radio-button
                :label="env"
                v-for="(env, index) in envs"
                :key="index">
              </el-radio-button>
            </el-radio-group>

          </template>
        </dao-setting-item>
      </dao-setting-section>
    </dao-setting-layout>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { find, first } from 'lodash';

export default {
  name: 'space-zone',

  data() {
    return {
      selectedOrg: {},
      selectedSpace: {},
      selectedArea: {},
      selectedEnv: {},
      areas: [],
      envs: [],
    };
  },

  computed: {
    ...mapState(['orgs', 'org', 'spaces', 'space', 'zones', 'zone']),
    ...mapGetters(['isPlatformAdmin']),
  },

  created() {
    this.initAreasEnvs();
  },

  methods: {
    initAreasEnvs() {
      this.selectedOrg = find(this.orgs, { id: this.org.id });
      this.selectedSpace = find(this.org.children, { id: this.space.id });
      this.areas = this.zones
        .map(zone => zone.area_name)
        .filter((area, index, array) => array.indexOf(area) === index);
      this.envs = this.zones
        .filter(zone => zone.area_name === this.zone.area_name)
        .map(zone => zone.env_name)
        .filter((area, index, array) => array.indexOf(area) === index);
      this.selectedArea = this.zone.area_name;
      this.selectedEnv = this.zone.env_name;
    },

    switchSpace(type) {
      const { selectedOrg: org } = this;
      let { selectedSpace: space } = this;
      if (type === 'org') space = first(org.children);
      this.$store.dispatch('switchOrg', { org, space }).then(() => {
        this.linkToDashboard();
      });
    },

    switchArea() {
      const zone = find(this.zones, {
        area_name: this.selectedArea,
      });
      this.$store.dispatch('switchZone', { zone }).then(() => {
        this.linkToDashboard();
      });
    },

    switchEnv() {
      const zone = find(this.zones, {
        area_name: this.selectedArea,
        env_name: this.selectedEnv,
      });
      this.$store.dispatch('switchZone', { zone }).then(() => {
        this.linkToDashboard();
      });
    },

    linkToDashboard() {
      this.$router.push({
        name: 'console.gateway',
      });
    },
  },
};
</script>

<style lang="scss">
.space-zone {
  .form-inline {
    display: flex;

    .form-group {
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      label {
        font-size: 13px;
        line-height: 14px;
        color: #9ba3af;
        margin-bottom: 5px;
      }

      & + .form-group {
        border: none;
        margin-left: 10px;
      }
    }
  }
}
</style>
