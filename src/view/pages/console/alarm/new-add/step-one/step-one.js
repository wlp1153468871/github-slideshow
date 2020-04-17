import { cloneDeep } from 'lodash';
import { mapState } from 'vuex';

import AlarmService from '@/core/services/alarm.service';
import MonitorInstancesGetter from '@/view/mixins/monitor-instances-getter';

import { MONITOR_ALARM_TYPE } from '@/core/constants/constants';
import { RULE_STATIC } from '@/core/constants/alarm';

import InstancesTable from '../instances-table/instances-table.vue';

export default {
  props: {
    params: { type: Object, required: true },
  },
  data() {
    return {
      rules: [],
      currentRules: [],
      chooseRules: [],
      rulesStatic: RULE_STATIC,
      loadings: {
        rules: false,
        receivers: false,
        instances: false,
      },
      searchRulesKey: '',
      receiverInfo: [],
      receiverCandidates: [],
      receiverDialogOn: false,
      instancesMonitor: {
        instances: [],
        monitorAll: false,
      },
    };
  },
  components: {
    InstancesTable,
  },
  computed: {
    ...mapState(['services']),
    unChooseReceiverInfo() {
      return this.receiverInfo.filter(info => !info.choose);
    },
    chooseReceiverInfo() {
      return this.receiverInfo.filter(info => info.choose);
    },
  },

  async created() {
    const metrics = await this.getMetric(this.params.type);
    this.rules = this.mapRules(metrics);
    this.currentRules = cloneDeep(this.rules);
    this.receiverInfo = await this.composeReceiverInfo();
    this.instancesMonitor.instances = await this.initiateInstances(this.params);
  },
  methods: {
    onChooseRules(val) {
      this.chooseRules = val;
      const ids = this.chooseRules.map(r => r.id);
      this.currentRules.forEach(r => {
        r.choosed = ids.includes(r.id);
      });
    },
    mapRules(rules) {
      return rules.map(rule => ({ ...rule, ruleName: '', choosed: false }));
    },
    onSearch() {
      this.currentRules = this.rules.filter(rule =>
        rule.name.toLowerCase().includes(this.searchRulesKey.toLowerCase()),
      );
    },
    onDeleteReceiver(email) {
      this.receiverInfo.find(r => r.email === email).choose = false;
    },
    onAddReceiver() {
      if (!this.receiverInfo.length) {
        this.$noty.error('请先添加项目成员');
        return;
      }
      this.receiverDialogOn = true;
    },
    mapAddReceivers(candidateEmails) {
      return this.receiverInfo.map(r => {
        const choose = candidateEmails.includes(r.email) ? true : r.choose;
        return { ...r, choose };
      });
    },
    // just do adding
    onConfirmReceivers() {
      this.receiverInfo = this.mapAddReceivers(this.receiverCandidates.map(rc => rc.email));
      this.receiverCandidates = [];
    },
    onCloseReceivers() {
      this.receiverCandidates = [];
    },
    loading(key, value) {
      this.loadings[key] = value;
    },
    updateInstances(instancesMonitor) {
      this.instancesMonitor.instances = instancesMonitor;
    },
    getMetric(type) {
      switch (type) {
        case MONITOR_ALARM_TYPE.APP:
          return AlarmService.getAppAtom();
        case MONITOR_ALARM_TYPE.CONTAINTER:
          return AlarmService.getContainerAtom();
        case MONITOR_ALARM_TYPE.SERVICE:
          return AlarmService.getServiceAtom(this.params.serviceName);
        default:
          return [];
      }
    },
    getInstances() {
      const { monitorAll, instances } = this.instancesMonitor;
      if (monitorAll) {
        return instances;
      }
      return this.$refs.instanceTable.sendInstances();
    },
    sendRules() {
      const { chooseRules } = this;
      return {
        chooseRules,
        receiverInfo: this.chooseReceiverInfo,
        instances: this.getInstances(),
      };
    },
  },
  mixins: [MonitorInstancesGetter],
};
