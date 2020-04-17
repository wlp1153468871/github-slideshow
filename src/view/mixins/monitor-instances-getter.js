import SpaceService from '@/core/services/space.service';
import { MONITOR_ALARM_TYPE } from '@/core/constants/constants';
import MonitorSelector from '@/view/mixins/monitor-selector';

export default {
  methods: {
    // ready for instances when created;
    async initiateInstances({ type, deployType, serviceId }) {
      switch (type) {
        case MONITOR_ALARM_TYPE.APP:
          return this.passApplication(deployType);
        case MONITOR_ALARM_TYPE.CONTAINTER:
          return this.passContainer(deployType);
        case MONITOR_ALARM_TYPE.SERVICE:
          return this.passService(serviceId);
        default:
          return [];
      }
    },
    passApplication(deployType) {
      return this.clickFilterFrame(
        async () => this.fetchInstancesBasedKind(deployType),
        this.insLoading,
      );
    },
    passContainer(deployType) {
      return this.passApplication(deployType);
    },
    async passService(serviceId) {
      return this.clickFilterFrame(async () => {
        const instance = await SpaceService.getInstances(serviceId);
        return instance.map(({ name, id }) => ({ name, id }));
      }, this.insLoading);
    },
    insLoading(val) {
      this.loadings.instances = val;
    },
    // orgid data - compose
    async composeReceiverInfo() {
      const list = await SpaceService.getMembers();
      return list.map(({ email, username }) => ({
        email,
        username,
        choose: false,
      }));
    },
  },
  mixins: [MonitorSelector],
};
