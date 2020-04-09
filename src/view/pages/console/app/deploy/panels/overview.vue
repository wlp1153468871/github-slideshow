<template>
  <div class="container app-overview">
    <dao-setting-layout>
      <template slot="layout-title">订购确认</template>
      <dao-setting-section>
        <dao-setting-item>
          <div slot="content" class="overview-detail">
            <div class="basic-detail ins-setting-card">
              <h3 class="ins-card-title">基本配置</h3>
              <table class="ins-card-body">
                <tbody>
                  <tr class="ins-info-item" v-for="(item, index) in basic" :key="index">
                    <td class="info-item-label">{{ item[0] }}</td>
                    <td class="info-item-content">{{ item[1] }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="adavance-detail ins-setting-card">
              <h3 class="ins-card-title">参数设置</h3>
              <table class="ins-card-body">
                <tbody>
                  <tr class="ins-info-item" v-for="(item, index) in advance" :key="index">
                    <td class="info-item-label">{{ item[0] }}</td>
                    <td class="info-item-content">{{ item[1] }}</td>
                  </tr>
                  <tr class="ins-info-item">
                    <td class="info-item-label">
                      <div>环境变量</div>
                    </td>
                    <td class="info-item-content">
                      <div v-if="!envs.length">暂无</div>
                      <table class="envs-table" v-if="envs.length">
                        <thead>
                          <tr>
                            <th style="width: 25%;">键</th>
                            <th style="width: 25%;">值</th>
                            <th>来源</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(env, index) in envs" :key="index">
                            <td>{{ env.key }}</td>
                            <td>{{ env.value }}</td>
                            <td>{{ env.source }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr class="ins-info-item">
                    <td class="info-item-label">
                      <div>Config Map</div>
                    </td>
                    <td class="info-item-content">
                      <div v-if="!configFiles.length">暂无</div>
                      <p v-for="(config, index) in configFiles" :key="index">{{ config }}</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </dao-setting-item>
      </dao-setting-section>
    </dao-setting-layout>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { ENV_SOURCE } from '@/core/constants/constants';

export default {
  name: 'OverviewPanel',

  props: {
    app: { type: Object, default: () => ({}) },
  },

  computed: {
    ...mapState(['zone', 'org', 'space', 'quotaDict']),

    basic() {
      const { repository = '', deployfile = {}, deployMode, monitor, hpa } = this.app;
      const basic = [
        ['地域', this.zone.area_name],
        ['环境', this.zone.env_name],
        ['租户', this.org.name],
        ['项目组', this.space.name],
        ['监控', monitor ? '开' : '关'],
        ['HPA', hpa ? '开' : '关'],
      ];
      if (deployMode === 'image') {
        basic.unshift(['镜像地址', repository]);
      } else {
        basic.unshift(['war包文件名', deployfile.name]);
      }

      return basic;
    },

    configFiles() {
      const { configFiles = [] } = this.app;
      return configFiles.map(c => c.source);
    },

    advance() {
      const { quotaDict } = this;
      const { name, version, port, plan = {}, cmd, args, affinity } = this.app;
      const affinityObj = {
        none: '无',
        affinity: '亲和性',
        antiAffinity: '反亲和性',
      };
      const advance = [
        ['应用名', name],
        ['应用版本', version],
        ['内部端口', port],
        ['亲和性', affinityObj[affinity]],
      ];
      const resourceLimits = [];
      Object.entries(plan.limits || []).forEach(([key, kv]) => {
        const dict = quotaDict[key] || {};
        resourceLimits.push([
          `${dict.name || key.toUpperCase()}限制`,
          `${kv.value} ${kv.unit.toUpperCase()}`,
        ]);
      });

      const resourceRequests = [];
      Object.entries(plan.requests || []).forEach(([key, kv]) => {
        const dict = quotaDict[key] || {};
        resourceRequests.push([
          `${dict.name || key.toUpperCase()}预留`,
          `${kv.value} ${kv.unit.toUpperCase()}`,
        ]);
      });
      advance.push(...resourceLimits, ...resourceRequests);

      if (cmd !== '') {
        advance.push(['启动命令', cmd], ['启动参数', args]);
      }
      return advance;
    },

    envs() {
      let { envs = [] } = this.app;
      const envFromFile = type => {
        return [ENV_SOURCE.CONFIG, ENV_SOURCE.SECRET].includes(type);
      };
      const envFromAllFile = type => {
        return [ENV_SOURCE.CONFIG_FILE, ENV_SOURCE.SECRET_FILE].includes(type);
      };
      const getKey = env => {
        if (envFromAllFile(env.type)) return '--';
        return env.name;
      };
      const getVal = env => {
        if (envFromFile(env.type)) return env.value.value;
        return env.value;
      };
      const getSource = env => {
        if (envFromFile(env.type)) return env.value.name;
        if (envFromAllFile(env.type)) return env.name;
        return '--';
      };
      envs = envs.map(env => {
        return {
          key: getKey(env),
          value: getVal(env),
          source: getSource(env),
        };
      });
      return envs;
    },
  },
};
</script>

<style lang="scss">
.app-overview {
  .overview-detail {
    display: flex;
    flex-direction: row;
    h3 {
      border-bottom: 1px solid #d8d8d8;
    }

    & > div {
      flex: 1;

      &.basic-detail {
        padding-right: 10px;
      }

      &.adavance-detail {
        padding-left: 10px;
      }
    }
  }
}

// TOOD(jerry) remove it
.ins-setting-card {
  width: 100%;
  padding: 0 15px;
  margin-top: 0;
  margin-bottom: 16px;
  color: #3d444f;
  font-size: 14px;
  font-weight: 400;
  line-height: 1;

  &.ins-setting-card-box {
    background-color: #fff;
    box-shadow: 0 1px 4px rgba(204, 209, 217, 0.3);
    border: 1px solid #e4e7ed;
    border-radius: 4px;
  }

  .ins-card-title {
    display: flex;
    justify-content: space-between;
    height: 35px;
    font-size: 14px;
    line-height: 35px;
    border-bottom: 1px solid #e6e8ed;
  }

  .ins-card-body {
    width: 100%;
    padding: 6px 0;
  }

  .ins-info-item {
    display: flex;
    flex-direction: row;
    padding: 3px 5px;
    color: #3b424d;
    line-height: 24px;

    .info-item-label {
      width: 88px;
      min-width: 88px;
      margin-right: 20px;
      color: #99a1ad;
    }

    .info-item-content {
      display: inline-block;
      width: 100%;
      word-wrap: break-word;
      word-break: break-all;
    }
  }
}
</style>
