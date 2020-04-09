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
    unChooseInstances() {
      return this.instances.filter(ins => !ins.choose);
    },
    chooseInstances() {
      return this.instances.filter(ins => ins.choose);
    },
  },
  created() {
    this.instances = this.updateInstances(this.originInstances);
  },
  methods: {
    addInstances() {
      if (!this.originInstances.length) {
        this.$noty.error('请先添加实例');
        return;
      }
      this.dialogOn = true;
    },
    onDeleteInstances(id) {
      this.instances.find(r => r.id === id).choose = false;
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
        this.instances.find(i => i.id === cdd.id).choose = true;
      });
      this.resetCandidates();
    },
    onClose() {
      this.resetCandidates();
    },
    sendInstances() {
      return this.chooseInstances;
    },
  },
  watch: {
    originInstances(val) {
      this.instances = this.updateInstances(val);
    },
  },
};
