<template>
  <div class="page-catalog">
    <template v-if="catalogAvailable">
      <div class="empty-state-message" v-if="zone.syncStatus === SYNC_STATUS.UNSYNC">
        <img :src="emptyImg" alt="暂无服务同步" />
        <p class="hint-title">暂无任何服务</p>
        <p class="hint-desc">
          点击【同步服务目录】按钮，系统将会自动同步当前集群上已经安装好的所有Broker 服务，同步成功的服务可在
          <router-link
          :to="{
            name: 'manage.service.list',
          }"
        >
          服务管理
        </router-link>
          页面中进行查看和管理。
        </p>
        <button class="dao-btn blue" @click="$emit('syncService', 'catalog')">
          <span class="text">同步服务目录</span>
        </button>
      </div>

      <div class="panel-manage" v-if="zone.syncStatus === SYNC_STATUS.SYNCED">
        <div class="panel-manage-header" ref="panelHeader" :class="{ active: headerActive }">
          <button
            v-if="$can('platform.serviceBroker.create')"
            class="dao-btn blue has-icon"
            @click="addBroker"
          >
            <svg class="icon">
              <use xlink:href="#icon_plus-circled"></use>
            </svg>
            <span class="text">添加 Broker</span>
          </button>
          <div v-if="!$can('platform.serviceBroker.create')"></div>
          <div>
            <dao-input v-model="keyword" search placeholder="请输入搜索内容"> </dao-input>
            <button class="dao-btn white refresh-btn" @click="$emit('refresh')">
              <svg class="icon">
                <use xlink:href="#icon_update"></use>
              </svg>
            </button>
          </div>
        </div>
        <div class="panel-manage-content" v-if="brokers.length">
          <div class="panel-manage-body">
            <div
              class="card-broker"
              :class="{ active: value === broker }"
              v-for="(broker, index) in brokers"
              :key="broker.id"
              @click="showDetails($event, broker)"
            >
              <div class="card-broker-title">
                <div class="title-desc">
                  <p>{{ broker.name }}</p>
                  <dao-dropdown
                    trigger="hover"
                    :append-to-body="false"
                    placement="bottom-start"
                    v-if="$can('platform.serviceBroker.delete')"
                  >
                    <svg class="icon icon-more">
                      <use xlink:href="#icon_more"></use>
                    </svg>
                    <dao-dropdown-menu slot="list">
                      <dao-dropdown-item @click="unbindBroker(broker, index)">
                        解除绑定
                      </dao-dropdown-item>
                    </dao-dropdown-menu>
                  </dao-dropdown>
                </div>
                <p class="service-amount">共 {{ broker.brokerServices.length }} 个服务</p>
              </div>
              <time>{{ broker.createdAt | unix_date }}</time>
            </div>
          </div>
        </div>
        <div class="empty-state-message" v-else>
          <p class="hint-title">{{ keyword ? '搜索结果为空' : '当前可用区还没有Broker服务接入，如需使用请点击【添加 Broker】按钮进行添加' }}</p>
        </div>
      </div>
    </template>

    <div class="empty-state-message" v-else>
      <p class="hint-title">服务目录不可用</p>
      <p class="hint-desc">{{ zone.catalogAvailable | catalog_status }}</p>
    </div>

    <div class="fixed-bottom-panels">
      <dao-panel size="l" :visible.sync="panelVisible">
        <dao-panel-item heading="Broker 详情">
          <button
            v-if="$can('platform.zone.sync')"
            style="margin-bottom: 15px;"
            class="dao-btn blue"
            @click="$emit('syncService', 'broker')"
          >
            同步服务
          </button>
          <dao-table-view ref="tableView" :rows="filteredService" :config="tConfig">
          </dao-table-view>
        </dao-panel-item>
      </dao-panel>
    </div>

    <!--dialog start-->
    <add-broker-dialog :zone-id="zone.id" :visible="dialogConfigs.addBroker.visible" @close="close">
    </add-broker-dialog>
    <!--dialog end-->
  </div>
</template>

<script>
import tableView from '@/view/mixins/table-view';
import { CATALOG_STATUS, SYNC_STATUS } from '@/core/constants/constants';
import AddBrokerDialog from '@/view/pages/dialogs/zone/add-broker';
import BrokerService from '@/core/services/broker.service';
// dialogs
import emptyImg from '@/assets/images/empty.png';

const { AVAILABLE } = CATALOG_STATUS;

export default {
  name: 'ManagePanel',
  extends: tableView('id', 10, 'name'),
  components: {
    AddBrokerDialog,
  },

  props: {
    zone: Object,
    value: Object,
    loading: Boolean,
  },

  data() {
    return {
      SYNC_STATUS,
      emptyImg,
      dialogConfigs: {
        addBroker: { visible: false },
      },
      headerActive: false,
      keyword: '',
      panelVisible: false,
      serviceStatus: 'all',
      types: [
        { label: '全部', value: 'all' },
        { label: '已上架', value: true },
        { label: '未上架', value: false },
      ],
      brokerServices: [],
    };
  },

  created() {
    this.initTableView();
  },

  methods: {
    showDetails(event, broker) {
      const isCard =
        event.target.nodeName.toUpperCase() === 'SVG' ||
        event.target.nodeName.toUpperCase() === 'USE' ||
        event.target.className.indexOf('dao-dropdown-item') > -1;
      if (isCard) return;
      this.$emit('input', broker);
      this.brokerServices = broker.brokerServices;

      this.panelVisible = true;
    },

    close(refresh) {
      if (refresh) {
        this.$emit('refresh');
      }
      this.dialogConfigs.addBroker.visible = false;
    },

    addBroker() {
      this.dialogConfigs.addBroker.visible = true;
    },

    removeBroker(brokerId, index) {
      BrokerService.removeBroker(this.zone.id, brokerId)
        .then(() => {
          this.$noty.success('解绑 Broker 成功');
          this.zone.brokers.splice(index, 1);
          if (brokerId === this.value.id) {
            this.panelVisible = false;
            this.$emit('input', null);
          }
        })
        .catch();
    },

    // 解除绑定
    unbindBroker(broker, index) {
      BrokerService.isDeletable(this.zone.id, broker.id).then(res => {
        if (res.deletable) {
          this.$tada
            .confirm({
              title: '解绑 Broker',
              text: `您确定要解绑 ${broker.name} 吗？`,
            })
            .then(willDel => {
              if (willDel) this.removeBroker(broker.id, index);
              this.panelVisible = false;
            });
        } else {
          this.$tada.confirm({
            title: '无法解绑 Broker',
            text: `Broker「${broker.name}」已存在服务实例，请先删除服务实例！`,
            dangerMode: false,
            primaryText: '确认',
          });
        }
      });
    },

    initTableView() {
      this.setTableConfig({
        hideToolbar: true,
      });
      // const onClick = service => {
      //   this.$router.push({
      //     name: 'manage.broker-service.detail',
      //     params: { service: service.id },
      //   });
      // };

      this.setTableProps([
        {
          id: 'name',
          name: '服务名称',
          value: 'name',
          // type: 'goto',
          // other: { onClick },
        },
        {
          id: 'planCount',
          name: '规格数',
          value: 'planCount',
        },
        {
          id: 'createdAt',
          name: '创建时间',
          value: 'createdAt',
          filter: 'unix_date',
        },
      ]);
    },
  },

  computed: {
    catalogAvailable() {
      return this.zone.catalogAvailable === AVAILABLE;
    },

    zoneId() {
      return this.zone.id;
    },

    brokers() {
      return this.zone.brokers.filter(broker => broker.name.includes(this.keyword));
    },

    filteredService() {
      if (!this.value) return [];
      return this.value.brokerServices;
    },
  },

  watch: {
    zone(value) {
      if (value.syncStatus === 'syncing') {
        this.$emit('syncService', 'catalog', true);
      }
    },
  },
};
</script>

<style lang="scss">
@import './manage';
</style>
