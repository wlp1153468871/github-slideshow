<template>
  <div>
    <div v-if="envs.length > 0">
      <container-env-editor
        v-for="(container, index) in envs"
        :container="container"
        :key="container.name"
        :secrets="secrets"
        :ref="'ced-' + index"
        :editable="canEdit"
        :configMaps="configMaps"
        @envChange="onEnvChange"
      ></container-env-editor>
      <template v-if="canEdit">
        <button
          class="dao-btn"
          style="margin: 15px 0;"
          @click="onSave"
          :disabled="!changed"
          v-if="editable"
        >
          保存
        </button>
        <button class="dao-btn ghost" v-show="changed" @click="onReset" v-if="editable">
          重置
        </button>
      </template>
    </div>
    <div v-else>暂无容器组</div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash';
import ContainerEnvEditor from './container-env-editor.vue';

export default {
  name: 'EnvEditor',

  components: {
    ContainerEnvEditor,
  },

  props: {
    initEnvs: {
      type: Array,
      default: () => [],
    },
    // TODO: 确定是否要loading
    // loading: {
    //   type: Boolean,
    //   default: true
    // },
    secrets: {
      type: Object,
      default: () => ({}),
    },
    configMaps: {
      type: Object,
      default: () => ({}),
    },
    editable: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      changed: false,
      envs: cloneDeep(this.initEnvs),
    };
  },

  computed: {
    canEdit() {
      return this.editable;
    },
  },

  methods: {
    onSave() {
      this.$emit('envUpdate', this.envs);
    },
    onEnvChange() {
      this.changed = true;
    },
    onReset() {
      this.changed = false;
      this.envs = cloneDeep(this.initEnvs);
    },
  },
};
</script>
