<template>
  <dao-dialog
    :config="config"
    :visible.sync="isShow"
    @dao-dialog-close="onClose"
    @dao-dialog-cancel="onClose"
    @dao-dialog-confirm="onConfirm"
  >
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">选择服务</div>
        <div slot="content">
          <dao-select v-model="serviceId" placeholder="选择服务" no-data-text="没有符合条件的服务">
            <dao-option v-for="item in serviceOptions" :key="item.key" :value="item.id">
              {{ getServiceInfo(item) }}
            </dao-option>
          </dao-select>
        </div>
      </dao-setting-item>
    </dao-setting-section>
    <div slot="footer">
      <button class="dao-btn ghost" @click="onClose">
        取消
      </button>
      <save-button
        class="blue"
        text="确定"
        :disabled="creating || !serviceId"
        :saving="creating"
        @click="onConfirm"
      >
      </save-button>
    </div>
  </dao-dialog>
</template>

<script>
import { first, differenceBy, get as getValue } from 'lodash';
import dialog from '@/view/mixins/dialog';

export default {
  name: 'AddServiceDialog',
  extends: dialog('添加服务', {
    closeOnClickOutside: false,
  }),
  props: {
    services: { type: Array, default: () => [] },
    usedServices: { type: Array, default: () => [] },
    creating: { type: Boolean, default: false },
  },
  data() {
    return {
      serviceId: '',
    };
  },
  watch: {
    serviceOptions(options) {
      const option = first(options);
      if (option && option.id) {
        this.serviceId = option.id;
      }
    },
  },
  computed: {
    serviceOptions() {
      return differenceBy(this.services, this.usedServices, 'id');
    },
  },
  methods: {
    getZoneName(service) {
      return getValue(service, 'zone.name', 'Error');
    },

    getServiceInfo(service) {
      return `${service.name}(${this.getZoneName(service)})`;
    },

    onConfirm() {
      if (this.serviceOptions.length) {
        const service = this.serviceOptions.find(x => x.id === this.serviceId);
        this.$emit('create', service);
      }
      this.onClose();
    },

    dialogWillClose() {
      this.serviceId = '';
    },
  },
};
</script>
