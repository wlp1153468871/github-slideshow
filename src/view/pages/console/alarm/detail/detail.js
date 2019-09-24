import { ALARM_CONFIG, RULE_STATIC } from '@/core/constants/alarm';
import { MONITOR_KIND_MAP, MONITOR_ALARM_TYPE } from '@/core/constants/constants';
import AlarmService from '@/core/services/alarm.service.ts';
import MonitorInstancesGetter from '@/view/mixins/monitor-instances-getter';
import { mapState } from 'vuex';
import { pick, cloneDeep } from 'lodash';

import InstancesTable from '../new-add/instances-table/instances-table.vue';
import EmailTable from '../new-add/email-table/email-table.vue';

export default {
  data() {
    return {
      rule: {},
      id: this.$route.params.id,
      subScope: '',
      metric: {},
      rulesStatic: RULE_STATIC,
      scope: {
        changeView: false,
        monitorAll: false,
        instances: [],
      },
      loadings: {
        instances: false,
        receivers: false,
        submitUpdae: false,
        submitRemove: false,
      },
      email: {
        changeView: false,
        receivers: [],
      },
      detail: {
        changeView: false,
        threshold: [],
        for: [],
        description: '',
      },
    };
  },
  async created() {
    await this.initAll();
  },
  computed: {
    ...mapState(['zone']),
    resource() {
      return {
        ...ALARM_CONFIG,
        links: [
          ...ALARM_CONFIG.links,
          {
            text: `${this.rule ? `${this.rule.name}` : ''}`,
          },
        ],
        description: `可用区：${this.zone.area_name}-${this.zone.env_name}`,
      };
    },
    cViewReceivers() {
      return this.email.receivers.filter(r => r.choose);
    },
    cViewScope() {
      return this.scope.instances.filter(r => r.choose);
    },
    isService() {
      return this.rule.ruleType === MONITOR_ALARM_TYPE.SERVICE;
    },
  },
  components: {
    InstancesTable,
    EmailTable,
  },
  methods: {
    async initAll() {
      const { rules } = await AlarmService.getAllAlarmRules();
      this.rule = rules.find(rule => rule.id === this.id);
      this.subScope = this.isService
        ? this.rule.scope[0].type
        : MONITOR_KIND_MAP[this.rule.scope[0].type];
      try {
        this.metric = await this.getMetric(this.rule);
      } finally {
        this.initScope();
        this.initReceivers();
        this.initDetail();
      }
    },
    async initReceivers() {
      const receivers = this.rule.emails.map(r => r.email);
      const receiversPre = await this.composeReceiverInfo();
      if (typeof receiversPre === 'boolean' && !receiversPre.status) {
        this.email.receivers = this.rule.emails
          .map(({ user: username, email }) => ({ email, username, choose: true }));
      } else {
        this.email.receivers = receiversPre.map(r => {
          const choose = receivers.includes(r.email);
          return { ...r, choose };
        });
      }
      this.updateChangeView(this.email);
    },
    async initDetail() {
      const { threshold, description } = this.rule;
      this.detail = {
        ...this.detail,
        threshold,
        for: this.rule.for,
        description,
      };
      this.updateChangeView(this.detail);
    },
    async initScope() {
      const { scope: [scopeEx] } = this.rule;
      const params = this.isService
        ? { serviceId: this.getServiceId(scopeEx) }
        : { deployType: MONITOR_KIND_MAP[scopeEx.type] };
      const instances = await this.initiateInstances({ type: this.rule.ruleType, ...params });
      this.scope.instances = this.wrapInstances(instances);
      this.scope.monitorAll = !this.rule.scope.length;
      this.updateChangeView(this.scope);
    },
    updateChangeView(prop, state = false) {
      prop.changeView = state;
    },
    onClickScope() {
      this.scope.changeView = true;
    },
    onClickEmail() {
      this.email.changeView = true;
    },
    onClickDetail() {
      this.detail.changeView = true;
    },
    wrapInstances(instances) {
      const choosedInstances = this.rule.scope.map(s => s.name);
      return instances.map(i => {
        const choose = choosedInstances.includes(i.name);
        return { ...i, choose };
      });
    },
    // all depend on the [rule] data
    getServiceId(scope) {
      const { services } = this.$store.state;
      const { services: [{ id }] } = services
        .filter(s => s.monitor)
        .find(({ services: [s] }) => s.name === scope.type);
      return id;
    },
    getMetric({ metricId }) {
      return AlarmService.getAtomById(metricId);
    },
    combineRule() {
      const emails = this.$refs.emailTable;
      const scopes = this.$refs.instanceTable;
      const rule = cloneDeep(this.rule);

      if (this.detail.changeView) {
        Object.assign(rule, pick(this.detail, ['threshold', 'for', 'description']));
      }
      if (this.email.changeView) {
        const emailPre = emails.sendEmails();
        rule.emails = emailPre.length
          ? emailPre.map(({ username: user, email }) => ({ user, email }))
          : [];
      }
      if (this.scope.changeView) {
        const scopePre = scopes.sendInstances();
        if (!this.scope.monitorAll) {
          rule.scope = scopePre.length
            ? scopePre.map(i => ({ name: i.name, type: this.rule.scope[0].type }))
            : [];
        }
      }

      return rule;
    },
    async validateWithNoty(rule) {
      const vD = await this.$validator.validateAll();
      const vScope = !!rule.scope.length;
      const vEmail = !!rule.emails.length;
      if (!vScope) {
        this.$noty.error('请勾选至少一个作用实例');
      }
      if (!vEmail) {
        this.$noty.error('请勾选至少一个收件人');
      }
      return vD && vScope && vEmail;
    },
    async onConfirm() {
      const rule = this.combineRule();
      if (!(await this.validateWithNoty(rule))) {
        return;
      }
      try {
        this.loadings.submitUpdate = true;
        await AlarmService.putAlarmRules({ rules: [rule] });
        this.$noty.success('修改成功');
        this.initAll();
      } finally {
        this.loadings.submitUpdate = false;
      }
    },
    async onRemove() {
      if (await this.$tada.confirm({
        title: '删除规则',
        text: `您确定要删除 规则 ${this.rule.name} 吗？`,
      })) {
        try {
          this.loadings.submitRemove = true;
          await AlarmService.deleteAlarmRules(this.rule.id);
          this.$noty.success('删除成功');
          this.$router.push({ name: 'console.alarm' });
        } finally {
          this.loadings.submitRemove = false;
        }
      }
    },
  },
  mixins: [MonitorInstancesGetter],
};
