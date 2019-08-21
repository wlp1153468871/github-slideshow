<template>
  <dao-dialog
    class="edit-yaml"
    :header="header"
    size="lg"
    :footer="{confirmText}"
    :visible.sync="isShow"
    @before-open="init"
    @opened="$emit('opened')"
    @cancel="onClose"
    @confirm="onConfirm">
    <dao-setting-section>
      <dao-code-mirror v-model="yamlData" :read-only="readOnly"></dao-code-mirror>
    </dao-setting-section>
    <div slot="footer">
      <button
        class="dao-btn ghost"
        @click="onClose">
        取消
      </button>
      <button
        class="dao-btn blue"
        @click="tryConfirm">
        确定
      </button>
    </div>
  </dao-dialog>
</template>

<script>
import DaoCodeMirror from '@/view/components/config/code-mirror.vue';
import { isEmpty } from 'lodash';

export default {
  name: 'EditYamlDialog',

  components: {
    DaoCodeMirror,
  },

  props: {
    value: [String, Object],
    visible: Boolean,
    readOnly: Boolean,
    confirmText: String,
    header: {
      type: String,
      default: '编辑 YAML',
    },
  },

  data() {
    return {
      yamlData: '',
    };
  },

  methods: {
    init() {
      this.stringifyValue(this.value);
    },

    stringifyValue(value) {
      try {
        if (isEmpty(value)) {
          return;
        }
        this.yamlData = (typeof value === 'string')
          ? value
          : this.$jsyaml.safeDump(value);
      } catch (e) { // eslint-disable
        this.$noty.error('Yaml 格式不对');
      }
    },

    tryConfirm() {
      this.$tada.confirm({
        title: '保存 YAML',
        text: '您确定需要保存此 YAML 吗？',
        dangerMode: false,
        primaryText: '确认',
      }).then(ok => {
        if (ok) {
          this.onConfirm();
          this.onClose();
        } else {
          this.onClose();
        }
      });
    },

    onConfirm() {
      try {
        const yaml = (typeof this.value === 'string')
          ? this.yamlData
          : this.$jsyaml.safeLoad(this.yamlData);
        this.$emit('update', yaml);
      } catch (e) {
        this.$noty.error('Yaml 格式不对');
      }
    },

    onClose() {
      this.isShow = false;
      this.$emit('close');
    },
  },

  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.stringifyValue(val);
      },
    },
  },

  computed: {
    isShow: {
      set(val) {
        this.$emit('update:visible', val);
      },
      get() {
        return this.visible;
      },
    },
  },
};
</script>

<style lang="scss">
.edit-yaml {
  .dao-setting-section {
    padding: 0;
  }
}
</style>
