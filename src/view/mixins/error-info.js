import { find } from 'lodash';
import ErrorInfo from '@/view/pages/dialogs/instance/error-info';
import InstanceService from '@/core/services/instance.service';

export default {
  name: 'ErrorInfo',
  components: {
    ErrorInfo,
  },
  data() {
    return {
      selectedInstanceInfo: '',
      dialogConfigs: {
        errorInfo: { visible: false },
      },
    };
  },
  methods: {
    showErrorInfo(status, instance) { // eslint-disable-line
      if (!/_failed$/.test(instance.status)) return;

      const instanceId = instance.id;
      // 查询第一条错误记录
      InstanceService.getLogs(instanceId, 1, 0)
        .then(events => {
          const selectedInstance = find(events, { status: 'failed' });
          if (selectedInstance) {
            this.selectedInstanceInfo = selectedInstance.description;
            this.openErrorInfoDialog();
          }
        });
    },

    openErrorInfoDialog() {
      this.dialogConfigs.errorInfo.visible = true;
    },
  },
};
