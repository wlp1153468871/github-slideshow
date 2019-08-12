<template>
  <dao-dialog
    :visible.sync="isShow"
    @closed="onClosed"
    header="下载文件">

    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">请输入路径</div>
        <div slot="content">
          <dao-input
            icon-inside
            name="path"
            v-validate="'required|absolute_path'"
            :message="veeErrors.first('path')"
            :status="veeErrors.has('path') ? 'error' : ''"
            data-vv-as="路径"
            v-model="path">
          </dao-input>
        </div>
      </dao-setting-item>
    </dao-setting-section>

    <div slot="footer">
      <button
        class="dao-btn ghost"
        @click="isShow = false">
        取消
      </button>
      <save-button
        class="dao-btn blue"
        text="确定"
        :saving="isWaiting"
        @click="onSaveFile">
      </save-button>
    </div>
  </dao-dialog>
</template>

<script>
import { nth } from 'lodash';
import { saveAs } from 'file-saver';
import PodService from '@/core/services/pod.service';

export default {
  name: 'file-save-in-container',

  props: {
    visible: { type: Boolean, default: false },
    container: { type: Object, default: () => ({}) },
    podTemplate: { type: Object, default: () => ({}) },
  },

  data() {
    return {
      path: '',
      isWaiting: false,
    };
  },

  computed: {
    isShow: {
      set(val) {
        this.$emit('close', val);
      },
      get() {
        return this.visible;
      },
    },
  },

  methods: {
    onSaveFile() {
      this.$validator.validateAll().then(valid => {
        if (valid) {
          this.saveFile();
        }
      });
    },

    saveFile() {
      this.isWaiting = true;
      PodService.saveFile({
        pod: this.podTemplate.metadata.name,
        containerName: this.container.name,
        path: this.path,
      })
        .then(res => {
          const fileName = nth(this.path.split('/'), 1);
          saveAs(res, `${fileName}-${Date.now()}.tar`);
        })
        .finally(() => {
          this.isShow = false;
          this.isWaiting = false;
        });
    },

    onClosed() {
      this.path = '';
      this.$validator.reset();
    },
  },
};
</script>
