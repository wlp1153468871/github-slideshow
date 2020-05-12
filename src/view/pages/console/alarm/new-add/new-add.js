import { FormWizard, TabContent } from 'vue-form-wizard';
import { mapState } from 'vuex';

import AlarmService from '@/core/services/alarm.service';
import { MONITOR_KIND_MAP_FLIP, MONITOR_ALARM_TYPE } from '@/core/constants/constants';

import StepOne from './step-one/step-one.vue';
import StepTwo from './step-two/step-two.vue';

export default {
  data() {
    const { deployType, type, serviceName, serviceId } = this.$route.query;
    return {
      rulesReady: {
        chooseRules: [],
        receiverInfo: [],
        instances: [],
      },
      params: {
        deployType,
        type,
        serviceName,
        serviceId,
      },
    };
  },
  computed: {
    ...mapState({
      rules: state => state.alarm.rules,
    }),
    bannerTip() {
      switch (this.params.type) {
        case MONITOR_ALARM_TYPE.APP:
          return '添加应用告警规则';
        case MONITOR_ALARM_TYPE.CONTAINTER:
          return '添加容器告警规则';
        case MONITOR_ALARM_TYPE.SERVICE:
          return `添加服务-${this.params.serviceName}告警规则`;
        default:
          return '';
      }
    },
    isService() {
      return this.params.type === MONITOR_ALARM_TYPE.SERVICE;
    },
  },
  methods: {
    async onComplete() {
      const rules = this.rulesReady.chooseRules.map(r => {
        return {
          name: r.ruleName,
          metricId: r.id,
          ruleType: this.params.type,
          threshold: r.threshold,
          for: r.for,
          description: r.description,
          emails: this.rulesReady.receiverInfo.map(({ username: user, email }) => ({
            user,
            email,
          })),
          scope: this.rulesReady.instances.map(({ kind, name }) => ({
            name,
            type: this.isService ? this.params.serviceName : MONITOR_KIND_MAP_FLIP[kind],
          })),
        };
      });
      await AlarmService.postRules({ rules });
      this.$noty.success('添加成功');
      this.$router.push({ name: 'console.alarm' });
      // then pages go !
    },
    onValidate(isValid, tabIndex) {
      if (isValid && tabIndex === 0) {
        this.rulesReady = this.$refs.okRules.sendRules();
      }
      return isValid;
    },
    async validate() {
      const validPre = await this.$refs.okRules.$validator.validate();
      const { chooseRules, receiverInfo, instances } = this.$refs.okRules.sendRules();
      const ruleNames = this.rules.map(rule => rule.name);
      if (!chooseRules.length) {
        this.$noty.error('请勾选至少一个规则');
        return false;
      } else if (chooseRules.some(r => ruleNames.includes(r.ruleName))) {
        const { ruleName } = chooseRules.find(r => ruleNames.includes(r.ruleName));
        this.$noty.error(`规则名${ruleName}已存在`);
        return false;
      } else if (new Set(chooseRules.map(r => r.ruleName)).size !== chooseRules.length) {
        const map = {};
        const { ruleName } = chooseRules.find(({ ruleName: key }) => {
          if (key in map) {
            return true;
          }
          map[key] = 'tag';
          return false;
        });
        this.$noty.error(`规则名${ruleName}重复`);
        return false;
      }
      if (!receiverInfo.length) {
        this.$noty.error('请勾选至少一个收件人');
        return false;
      }

      if (!instances.length) {
        this.$noty.error('请勾选至少一个作用实例');
        return false;
      }

      return validPre && !this.veeErrors.items.length;
    },
  },
  components: {
    FormWizard,
    TabContent,
    StepOne,
    StepTwo,
  },
};
