<template>
  <dao-setting-layout>
    <template slot="layout-title">部署策略</template>
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">
          <span>亲和性</span>
        </div>
        <div slot="content">
          <dao-radio-group>
            <dao-radio v-model="type" label="none">
              无
            </dao-radio>
            <dao-radio v-model="type" label="affinity">
              容器组亲和性
            </dao-radio>
            <dao-radio v-model="type" label="antiAffinity">
              容器组反亲和性
            </dao-radio>
          </dao-radio-group>
        </div>
      </dao-setting-item>
      <dao-setting-item v-show="type !== 'none'">
        <div slot="content">
          <dao-code-mirror
            mode="json"
            v-model="jsonConfig">
          </dao-code-mirror>
        </div>
        <p slot="content-helper">
          <a href="https://kubernetes.io/docs/concepts/configuration/assign-pod-node/#inter-pod-affinity-and-anti-affinity-beta-feature" target="_blank">
            更多"亲和性与反亲和性"的信息
          </a>
        </p>
      </dao-setting-item>
    </dao-setting-section>
  </dao-setting-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import { camelCase } from 'lodash';
import DaoCodeMirror from '@/view/components/config/code-mirror.vue';

export default Vue.extend({
  name: 'AffinitySection',

  inject: ['$validator'],

  props: {
    affinity: { type: String, default: 'none' },
    config: { type: String, default: '' },
  },

  components: {
    DaoCodeMirror,
  },

  data() {
    return {
      stringifyJSON: '',
    };
  },

  computed: {
    type: {
      get(): string {
        return this.affinity;
      },
      set(type: string) {
        this.$emit('update:affinity', type);
      },
    },
    jsonConfig: {
      get(): string {
        return this.stringifyJSON;
      },
      set(config: string) {
        this.$emit('update:config', config);
      },
    },
  },

  watch: {
    affinity: {
      immediate: true,
      handler() {
        this.updateAffinityConfig();
      },
    },
  },

  methods: {
    updateAffinityConfig() {
      if (this.type === 'null') {
        this.stringifyJSON = '';
        return;
      }

      const podAffinityType = camelCase(['pod', this.type].join(' '));
      this.stringifyJSON = JSON.stringify({
        [podAffinityType]: {
          preferredDuringSchedulingIgnoredDuringExecution: [{
            weight: 100,
            podAffinityTerm: {
              labelSelector: {
                matchExpressions: [{
                  key: 'appbind/[InstanceName]',
                  operator: 'In',
                  values: [
                    'true',
                  ],
                }],
              },
              topologyKey: 'kubernetes.io/hostname',
            },
          }],
        },
      }, null, 2);
    },
  },
});
</script>
