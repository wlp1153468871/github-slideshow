import { cloneDeep } from 'lodash';

export default {
  data() {
    return {
      candidates: [],
      instances: [],
      dialogOn: false,
    };
  },
  props: {
    originInstances: { type: Array, required: true },
  },
  computed: {
    unChooseReceiverInfo() {
      return this.instances.filter(ins => !ins.choose);
    },
    chooseReceiverInfo() {
      return this.instances.filter(ins => ins.choose);
    },
  },
  created() {
    this.instances = this.updateInstances(this.originInstances);
  },
  methods: {
    onAddReceiver() {
      this.dialogOn = true;
    },
    onDeleteReceiver(email) {
      this.instances.find(r => r.email === email).choose = false;
    },
    updateInstances(instances, choose = false) {
      if (!instances.length) {
        return [];
        // 支持更新实例
      } else if (instances.some(i => typeof i.choose === 'boolean')) {
        return cloneDeep(instances);
      }
      return cloneDeep(instances).map(ins => ({ ...ins, choose }));
    },
    resetCandidates() {
      this.candidates = [];
    },
    onConfirm() {
      this.candidates.forEach(cdd => {
        this.instances.find(i => i.email === cdd.email).choose = true;
      });
      this.resetCandidates();
    },
    onClose() {
      this.resetCandidates();
    },
    sendEmails() {
      return this.chooseReceiverInfo;
    },
  },
  watch: {
    originInstances(val) {
      this.instances = this.updateInstances(val);
    },
  },
};
