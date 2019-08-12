<template>
  <dao-dialog
    :config="config"
    :visible.sync="isShow"
    @dao-dialog-close="onClose"
    @dao-dialog-cancel="onClose"
    @dao-dialog-confirm="onConfirm">
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">选择服务</div>
        <div slot="content">
          <dao-select
            v-model="serviceId"
            placeholder="选择服务"
            no-data-text="没有符合条件的服务">
            <dao-option
              v-for="item in serviceOptions"
              :key="item.key"
              :value="item.id">
              {{ item.name }}（{{ item.zone.name }}）
            </dao-option>
          </dao-select>
        </div>
      </dao-setting-item>
    </dao-setting-section>
    <div slot="footer">
      <button
        class="dao-btn ghost"
        @click="onClose">
        取消
      </button>
      <button
        class="dao-btn blue"
        @click="onConfirm">
        确定
      </button>
    </div>
  </dao-dialog>
</template>

<script>
import { differenceBy } from 'lodash';
import dialog from '@/view/mixins/dialog';

export default {
  name: 'AddServiceDialog',

  extends: dialog('添加服务'),

  props: {
    services: { type: Array, default: () => [] },
    usedServices: { type: Array, default: () => [] },
  },

  data() {
    return {
      serviceId: '',
    };
  },

  computed: {
    serviceOptions() {
      return differenceBy(this.services, this.usedServices, 'id').filter(service => service.available === 'available');
    },
  },

  methods: {
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
