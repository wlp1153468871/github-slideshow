<template>
  <div>
    <circle-loading v-if="loading.page"></circle-loading>
    <template v-else>
      <resource-header :resource="resource">

        <template #status v-if="status === 'approving'">
          <labels highLight :labels="{'状态': '审批中'}"></labels>
        </template>
        <template #labels>
          <labels :labels="labels"></labels>
        </template>

        <template
          v-if="$can('update') || $can('delete')"
          #action-buttons>
          <dao-dropdown
            trigger="click"
            :append-to-body="true"
            placement="bottom-end">
            <button class="dao-btn ghost has-icon">
              操作
              <svg class="icon">
                <use xlink:href="#icon_caret-down"></use>
              </svg>
            </button>

            <template #list>
              <dao-dropdown-menu>
                <dao-dropdown-item
                  v-if="$can('update')"
                  @click="yamlVisible = true">
                  <span>更新</span>
                </dao-dropdown-item>
                <dao-dropdown-item
                  v-if="$can('update')"
                  @click="onRestartClick">
                  <span>重启</span>
                </dao-dropdown-item>
                <dao-dropdown-item
                  v-if="$can('delete')"
                  class="dao-dropdown-item-red dao-dropdown-item-hover-red"
                  @click="onDeleteClick">
                  <span>删除</span>
                </dao-dropdown-item>
              </dao-dropdown-menu>
            </template>
          </dao-dropdown>
          <button
            class="dao-btn csp-table-update-btn"
            @click="loadData"
            style="margin-left: 10px">
            <svg class="icon">
              <use xlink:href="#icon_update"></use>
            </svg>
          </button>
        </template>
      </resource-header>

      <el-tabs
        v-model="tab"
        @tab-click="handleTabClick">
        <el-tab-pane
          :label="TABS.INFO.label"
          :name="TABS.INFO.name"
          :lazy="true">
          <info-panel
            :images-by-docker-reference="imagesByDockerReference"
            :projectName="projectName"
            :dc="dc"
            :autoscalers="autoscalers"
            @extend="onExtend"
            @refresh="loadData">
          </info-panel>
        </el-tab-pane>
        <el-tab-pane
          :label="TABS.PODS.label"
          :name="TABS.PODS.name"
          :lazy="true">
          <pods-panel
            :spaceId="space.id"
            :zone="zone.id"
            :name="this.name"></pods-panel>
        </el-tab-pane>
        <!-- 实时日志 -->
        <el-tab-pane
          lazy
          :label="TABS.LOG.label"
          :name="TABS.LOG.name">
          <log-panel
            v-if="tab === TABS.LOG.name"
            type="deploymentConfig">
          </log-panel>
        </el-tab-pane>

        <!-- 历史日志 -->
        <el-tab-pane :label="TABS.OFFLINE_LOG.label" :name="TABS.OFFLINE_LOG.name">
          <log-offline-panel
            type="deploymentConfig">
          </log-offline-panel>
        </el-tab-pane>
        <el-tab-pane
          :label="TABS.ENV.label"
          :name="TABS.ENV.name"
          :lazy="true">
          <env-panel
            :dcEnv="dcEnv"
            @envUpdate="onEnvUpdate"></env-panel>
        </el-tab-pane>
        <el-tab-pane
          :label="TABS.EVENT.label"
          :name="TABS.EVENT.name"
          :lazy="true">
          <events-table
            v-if="tab === TABS.EVENT.name"
            :loading="loading.event"
            :events="events"
            @refresh="getEvents">
          </events-table>
        </el-tab-pane>
        <el-tab-pane
          :label="TABS.HISTORY.label"
          :name="TABS.HISTORY.name"
          :lazy="true">
          <history-panel
            :dc="dc"
            @rollback="loadData"
            :name="this.name"></history-panel>
        </el-tab-pane>
        <el-tab-pane
          :label="TABS.OPERATING_DATA.label"
          :name="TABS.OPERATING_DATA.name"
          :lazy="true">
          <operating-data
            v-if="tab === TABS.OPERATING_DATA.name"
            :name="name">
          </operating-data>
        </el-tab-pane>
        <el-tab-pane
          v-if="pods.length"
          :label="TABS.MONITOR.label"
          :name="TABS.MONITOR.name"
          :lazy="true">
          <monitor-panel
            v-if="tab === TABS.MONITOR.name"
            :pods="pods"
            :name="name">
          </monitor-panel>
        </el-tab-pane>
      </el-tabs>
    </template>
    <edit-yaml-dialog
      :visible.sync="yamlVisible"
      :value="dc"
      @update="updateByYaml"
      @close="yamlVisible = false"
    ></edit-yaml-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { isEmpty, get, cloneDeep, set } from 'lodash';
import { RESOURCE } from '@/core/constants/resource';
import DCService from '@/core/services/deployment-config.service';
import HPAService from '@/core/services/hpa.service';
import { MONITOR_ALL_PODS, POLL_INTERVAL } from '@/core/constants/constants';
import EditYamlDialog from '@/view/components/yaml-edit/edit-yaml';

// panels
import OperatingData from '@/view/components/log/operating-data';
import LogOfflinePanel from '@/view/components/log/log-offline.vue';
import LogPanel from '@/view/components/log/log.vue';
import InfoPanel from './panels/info';
import PodsPanel from './panels/pods';
import EnvPanel from './panels/env';
import HistoryPanel from './panels/history';
import MonitorPanel from './panels/monitor';


export default {
  name: 'Resource-Deployment-Config',

  components: {
    OperatingData,
    LogOfflinePanel,
    LogPanel,
    EditYamlDialog,
    InfoPanel,
    PodsPanel,
    EnvPanel,
    HistoryPanel,
    MonitorPanel,
  },

  data() {
    const TABS = {
      LOG: { label: '实时日志', name: 'log' },
      OFFLINE_LOG: { label: '离线日志', name: 'offline-log' },
      INFO: { label: '概览', name: 'info' },
      PODS: { label: '容器组', name: 'pods' },
      ENV: { label: '环境变量', name: 'env' },
      EVENT: { label: '事件', name: 'event' },
      HISTORY: { label: '历史版本', name: 'history' },
      OPERATING_DATA: { label: '操作记录', name: 'operating-data' },
      MONITOR: { label: '查看监控', name: 'viewing-monitor' },
    };

    const { name } = this.$route.params;

    return {
      resource: {
        ...RESOURCE.DEPLOYMENT_CONFIG,
        links: [
          {
            text: RESOURCE.DEPLOYMENT_CONFIG.name,
            route: { name: 'resource.deployments' },
          },
          { text: name },
        ],
      },
      name,
      TABS,
      tab: TABS.INFO.name,
      loading: {
        page: true,
        tabs: true,
        event: true,
      },
      dc: {}, // deployment config
      secrets: {},
      configMaps: {},
      yamlVisible: false,
      containers: [],
      isEmpty,
      jobs: [],
      status: '',
      imagesByDockerReference: {}, // TODO: fix this
      events: [],
      autoscalers: [],
      pods: [],
    };
  },

  computed: {
    ...mapState(['space', 'zone']),

    dcEnv() {
      return get(this.dc, 'spec.template.spec.containers') || [];
    },
    projectName() {
      return get(this.dc, 'metadata.namespace', '');
    },
    labels() {
      return get(this.dc, 'metadata.labels', {});
    },
  },

  created() {
    this.loadData();
  },

  // destroyed() {
  //   this.unsetPolling();
  // },

  methods: {
    poll() {
      this.pollTimer = setTimeout(() => {
        clearTimeout(this.pollTimer);
        Promise.all([this.getDeployment(), this.listHPA()])
          .then(() => {
            this.poll();
          });
      }, POLL_INTERVAL);
    },
    unsetPolling() {
      clearTimeout(this.pollTimer);
    },
    onRefresh() {
      this.getDeployment();
    },

    loadData() {
      this.loading.page = true;
      this.loading.tabs = true;
      Promise.all([this.getDeployment(), this.listHPA(), this.fetchPods()]).finally(() => {
        this.loading.page = false;
        this.loading.tabs = false;
      });
    },

    getDeployment() {
      return DCService.get(this.space.id, this.zone.id, this.name)
        .then(dc => {
          this.dc = dc.originData;
          this.status = dc.status;
        })
        .catch(() => {
          this.$noty.error('Deployment Config 不存在');
        });
    },

    listHPA() {
      return HPAService.list().then(res => {
        this.autoscalers = HPAService.filterHPA(
          res.items,
          'DeploymentConfig',
          this.name,
        );
      });
    },

    async fetchPods() {
      const res = await DCService.getPodList(this.space.id, this.zone.id, this.name);
      this.pods = get(res, 'originData.items', []).map(({ metadata }) => metadata);
      if (this.pods.length > 1) {
        this.pods.unshift({ name: MONITOR_ALL_PODS });
      }
    },

    handleTabClick(tab) {
      const tabName = tab.name;
      if (tabName === this.TABS.EVENT.name) {
        this.getEvents();
      }
    },

    getEvents() {
      this.loading.event = true;
      DCService.getEventsAndLatestHistoryEvents(this.space.id, this.zone.id, this.name)
        .then(res => {
          this.events = res || [];
        })
        .finally(() => {
          this.loading.event = false;
        });
    },

    updateByYaml(updatedDeploymentConfig) {
      this.loading.tabs = true;
      DCService.put(
        this.space.id,
        this.zone.id,
        this.name,
        updatedDeploymentConfig,
      )
        .then(() => {
          return this.getDeployment();
        })
        .then(() => {
          if (this.status === 'approving') {
            this.$noty.success('创建审批成功');
          } else {
            this.$noty.success('更新成功');
          }
        })
        .finally(() => {
          this.loading.tabs = false;
        });
    },

    onRestartClick() {
      this.loading.tabs = true;
      DCService.restart(this.space.id, this.zone.id, this.name)
        .then(() => {
          return this.getDeployment();
        })
        .then(() => {
          this.$noty.success('重启成功');
        })
        .finally(() => {
          this.loading.tabs = false;
        });
    },

    onDeleteClick() {
      this.$tada
        .confirm({
          title: '删除',
          text: `
          确定要删除 Deployment Config ${this.name}吗？
        `,
          primaryText: '确定',
          dangerMode: false,
        })
        .then(willAgree => {
          if (!willAgree) return;
          this.DeleteDC();
        });
    },

    DeleteDC() {
      this.loading.page = true;
      DCService.delete(this.space.id, this.zone.id, this.name).then(() => {
        this.$noty.success('删除成功');
        this.$router.push(RESOURCE.DEPLOYMENT_CONFIG.route);
      });
    },

    onEnvUpdate(env) {
      const newYaml = cloneDeep(this.dc);
      set(newYaml, 'spec.template.spec.containers', env);
      this.updateByYaml(newYaml);
    },

    onExtend(replicas) {
      this.loading.tabs = true;
      DCService.updateReplica(this.space.id, this.zone.id, this.name, replicas)
        .then(() => {
          return this.getDeployment();
        })
        .then(() => {
          if (this.status === 'approving') {
            this.$noty.success('创建审批成功');
          } else {
            this.$noty.success('更新成功');
          }
        })
        .finally(() => {
          this.loading.tabs = false;
        });
    },
  },
};
</script>
