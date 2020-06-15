<template>
  <div>
    <circle-loading v-if="loading.page"></circle-loading>
    <template v-else>
      <resource-header :resource="resource">
        <template #status v-if="status === 'approving'">
          <labels highLight :labels="{ 状态: '审批中' }"></labels>
        </template>
        <template #labels>
          <labels :labels="labels"></labels>
        </template>

        <template #action-buttons>
          <dao-dropdown
            v-if="$can('statefulSet.update') || $can('statefulSet.delete')"
            trigger="click"
            :append-to-body="true"
            placement="bottom-end"
          >
            <button class="dao-btn ghost has-icon">
              操作
              <svg class="icon">
                <use xlink:href="#icon_caret-down"></use>
              </svg>
            </button>

            <dao-dropdown-menu slot="list">
              <dao-dropdown-item v-if="$can('statefulSet.update')" @click="onUpdateClick">
                <span>更新</span>
              </dao-dropdown-item>
              <dao-dropdown-item
                v-if="$can('statefulSet.delete')"
                class="dao-dropdown-item-red dao-dropdown-item-hover-red"
                @click="onDeleteClick"
              >
                <span>删除</span>
              </dao-dropdown-item>
            </dao-dropdown-menu>
          </dao-dropdown>
          <button
            class="dao-btn csp-table-update-btn"
            @click="onRefresh"
            style="margin-left: 10px;"
          >
            <svg class="icon">
              <use xlink:href="#icon_update"></use>
            </svg>
          </button>
        </template>
      </resource-header>

      <el-tabs v-model="tab" @tab-click="handleTabClick">
        <el-tab-pane :label="TABS.INFO.label" :name="TABS.INFO.name" lazy>
          <info-panel
            :images-by-docker-reference="imagesByDockerReference"
            :projectName="name"
            :statefulset="statefulset"
            @extend="onExtend"
          >
          </info-panel>
        </el-tab-pane>
        <el-tab-pane :label="TABS.PODS.label" :name="TABS.PODS.name" lazy>
          <pods-panel :spaceId="space.id" :zone="zone.id" :name="this.name"></pods-panel>
        </el-tab-pane>
        <!-- 实时日志 -->
        <el-tab-pane
          lazy
          :label="TABS.LOG.label"
          :name="TABS.LOG.name"
          v-if="$can('pod.container.get')"
        >
          <log-panel v-if="tab === TABS.LOG.name" type="statefulSet"> </log-panel>
        </el-tab-pane>

        <!-- 历史日志 -->
        <el-tab-pane
          lazy
          :label="TABS.OFFLINE_LOG.label"
          :name="TABS.OFFLINE_LOG.name"
          v-if="$can('pod.container.get')"
        >
          <log-offline-panel v-if="tab === TABS.OFFLINE_LOG.name" type="statefulSet">
          </log-offline-panel>
        </el-tab-pane>
        <el-tab-pane :label="TABS.ENV.label" :name="TABS.ENV.name" lazy>
          <env-panel :ssEnv="statefulsetEnv" @envUpdate="onEnvUpdate"> </env-panel>
        </el-tab-pane>
        <el-tab-pane :label="TABS.EVENT.label" :name="TABS.EVENT.name" lazy>
          <events-table
            v-if="tab === TABS.EVENT.name"
            :loading="loading.event"
            :events="events"
            @refresh="getEvents"
          >
          </events-table>
        </el-tab-pane>
        <el-tab-pane
          :label="TABS.OPERATING_DATA.label"
          :name="TABS.OPERATING_DATA.name"
          :lazy="true"
        >
          <operating-data :name="name"></operating-data>
        </el-tab-pane>
        <el-tab-pane
          v-if="pods.length"
          :label="TABS.MONITOR.label"
          :name="TABS.MONITOR.name"
          :lazy="true"
        >
          <monitor-panel v-if="tab === TABS.MONITOR.name" :pods="pods" :name="name">
          </monitor-panel>
        </el-tab-pane>
      </el-tabs>
    </template>
    <edit-yaml-dialog
      :visible.sync="yamlVisible"
      :value="statefulset"
      @update="updateByYaml"
      @close="yamlVisible = false"
    ></edit-yaml-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { get, set, cloneDeep, isEmpty } from 'lodash';
import { RESOURCE_TYPE } from '@/core/constants/resource';
import { MONITOR_ALL_PODS } from '@/core/constants/constants';
import ResourceMixin from '@/view/mixins/resource';

import StatefulSetService from '@/core/services/stateful-set.service.ts';
import EditYamlDialog from '@/view/components/yaml-edit/edit-yaml.vue';
import OperatingData from '@/view/components/log/operating-data';

// panels
import LogOfflinePanel from '@/view/components/log/log-offline.vue';
import LogPanel from '@/view/components/log/log.vue';
import MonitorPanel from '@/view/pages/console/resource/deployment-config/detail/panels/monitor.vue';
import InfoPanel from './panels/info';
import PodsPanel from './panels/pods';
import EnvPanel from './panels/env';

export default {
  name: 'StatefulSetDetail',

  components: {
    LogOfflinePanel,
    LogPanel,
    EditYamlDialog,
    InfoPanel,
    PodsPanel,
    EnvPanel,
    OperatingData,
    MonitorPanel,
  },

  mixins: [ResourceMixin(RESOURCE_TYPE.STATEFUL_SET)],

  data() {
    const TABS = {
      LOG: { label: '实时日志', name: 'log' },
      OFFLINE_LOG: { label: '离线日志', name: 'offline-log' },
      INFO: { label: '概览', name: 'info' },
      PODS: { label: '容器组', name: 'pods' },
      ENV: { label: '环境变量', name: 'env' },
      EVENT: { label: '事件', name: 'event' },
      OPERATING_DATA: { label: '操作记录', name: 'operating-data' },
      MONITOR: { label: '查看监控', name: 'viewing-monitor' },
    };

    const { name } = this.$route.params;

    return {
      name,
      TABS,
      tab: TABS.INFO.name,
      loading: {
        page: true,
        tabs: true,
        event: true,
      },
      status: '',
      statefulset: {},
      isEmpty,
      yamlVisible: false,
      imagesByDockerReference: {},
      events: [],
      pods: [],
    };
  },

  computed: {
    ...mapState(['space', 'zone']),
    statefulsetEnv() {
      return get(this.statefulset, 'spec.template.spec.containers') || [];
    },
    labels() {
      return get(this.statefulset, 'metadata.labels', {});
    },
  },

  created() {
    this.getStatefulSet();
  },

  methods: {
    onRefresh() {
      this.getStatefulSet();
    },

    handleTabClick(tab) {
      const tabName = tab.name;
      if (tabName === this.TABS.EVENT.name) {
        this.getEvents();
      }
    },

    getEvents() {
      this.loading.event = true;
      StatefulSetService.getEventList(this.space.id, this.zone.id, this.name)
        .then(res => {
          this.events = res.originData.items || [];
        })
        .finally(() => {
          this.loading.event = false;
        });
    },

    gotoTab(tab) {
      if (tab === 'events') {
        this.switchTab(this.TABS.EVENTS);
      }
    },
    getStatefulSetService() {
      return StatefulSetService.get(this.space.id, this.zone.id, this.name)
        .then(statefulset => {
          this.statefulset = statefulset.originData;
          this.status = statefulset.status;
        })
        .catch(() => {
          this.$noty.error('Stateful Set 不存在');
          this.goBack();
        });
    },
    getStatefulSet() {
      this.loading.page = true;
      this.loading.tabs = true;
      return Promise.all([this.getStatefulSetService(), this.fetchPods()]).finally(() => {
        this.loading.page = false;
        this.loading.tabs = false;
      });
    },

    onUpdateClick() {
      this.yamlVisible = true;
    },

    updateByYaml(updatedStatefulSet) {
      this.loading.tabs = true;
      StatefulSetService.put(this.space.id, this.zone.id, this.name, updatedStatefulSet)
        .then(() => {
          return this.getStatefulSet();
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

    onDeleteClick() {
      this.$tada
        .confirm({
          title: '删除',
          text: `
          确定要删除 Stateful Set ${this.name}吗？
        `,
          primaryText: '确定',
          dangerMode: false,
        })
        .then(willAgree => {
          if (!willAgree) return;
          this.DeleteStatefulSet();
        });
    },

    DeleteStatefulSet() {
      this.loading.page = true;
      StatefulSetService.delete(this.space.id, this.zone.id, this.name).then(() => {
        this.$noty.success('开始执行删除操作');
        this.goBack();
      });
    },

    onEnvUpdate(env) {
      const newYaml = cloneDeep(this.statefulset);
      set(newYaml, 'spec.template.spec.containers', env);
      this.updateByYaml(newYaml);
    },

    onExtend(replicas) {
      this.loading.tabs = true;
      StatefulSetService.updateReplica(this.space.id, this.zone.id, this.name, replicas)
        .then(() => {
          return this.getStatefulSet();
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
    async fetchPods() {
      const res = await StatefulSetService.getPodList(this.space.id, this.zone.id, this.name);
      this.pods = get(res, 'originData.items', []).map(({ metadata }) => metadata);
      if (this.pods.length > 1) {
        this.pods.unshift({ name: MONITOR_ALL_PODS });
      }
    },
  },
};
</script>
