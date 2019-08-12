<template>
  <dao-dialog
    class="edit-yaml"
    :header="header"
    size="lg"
    :footer="{confirmText}"
    :visible.sync="isShow"
    @before-open="init"
    @cancel="$emit('close')"
    @confirm="$emit('confirm')">
    <dao-setting-section>
      <dao-code-mirror v-model="yamlData" read-only></dao-code-mirror>
    </dao-setting-section>
  </dao-dialog>
</template>

<script>
import DaoCodeMirror from '@/view/components/config/code-mirror';

export default {
  name: 'yaml-preview-dialog',

  components: {
    DaoCodeMirror,
  },

  props: {
    value: [String, Object],
    visible: Boolean,
    confirmText: { type: String, default: '确认' },
    header: {
      type: String,
      default: '预览 YAML',
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
        this.yamlData =
          typeof value === 'string' ? value : this.$jsyaml.safeDump(value);
      } catch (e) {
        // eslint-disable
        this.$noty.error('Yaml 格式不对');
      }
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
