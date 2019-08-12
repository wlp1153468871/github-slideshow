<template>
  <dao-dialog
    :config="config"
    :visible.sync="isShow"
    @dao-dialog-close="onClose"
    @dao-dialog-cancel="onClose"
    @dao-dialog-confirm="onConfirm">
    <dao-setting-layout>
      <dao-setting-section>
        <dao-setting-item>
          <div slot="label">存储卷名</div>
          <div slot="content">
            <dao-select v-model="name">
              <dao-option
                v-for="(item, idx) in volumes"
                :key="idx"
                :value="item.name"
                :label="item.name">
              </dao-option>
            </dao-select>
          </div>
        </dao-setting-item>
      </dao-setting-section>
      <dao-setting-section>
        <dao-setting-item>
          <div slot="label">容器路径</div>
          <div slot="content">
            <dao-input
              v-model="path">
            </dao-input>
          </div>
        </dao-setting-item>
      </dao-setting-section>
    </dao-setting-layout>
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
import dialog from '@/view/mixins/dialog';

export default {
  name: 'AddVolumeDialog',

  extends: dialog('关联存储卷'),

  props: {
    volumes: { type: Array, default: () => [] },
  },

  data() {
    return {
      path: '',
      name: '',
    };
  },

  watch: {
    volumes(volumes = []) {
      const volume = volumes[0] || {};
      this.name = volume.name;
      this.volumeId = volume.id;
    },
  },

  methods: {
    onConfirm() {
      // TODO(jerry) too much cost
      const vol = this.volumes.find(x => x.name === this.name);
      this.$emit('save', {
        name: this.name,
        path: this.path,
        id: vol.id,
      });
      this.onClose();
    },

    dialogWillClose() {
      this.path = '';
      this.name = '';
    },
  },
};
</script>
