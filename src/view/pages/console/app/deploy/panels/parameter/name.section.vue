<template>
  <dao-setting-layout>
    <template slot="layout-title">基础配置</template>
    <dao-setting-section>
      <template slot="label">
        <span>应用名</span>
      </template>
      <template slot="content">
        <dao-input
          icon-inside
          type="text"
          name="name"
          placeholder="应用名"
          v-model.trim="_name"
          @blur="checkIsDuplicateName()"
          data-vv-as="应用名"
          v-validate="'required|namespace_code|dns_1035_label|min:6|max:20'"
          :message="veeErrors.first('name')"
          :status="veeErrors.has('name') ? 'error' : ''">
        </dao-input>
      </template>
      <template slot="content-helper" v-if="recommendNames.length">
        推荐应用名:
        <a
          href="javascript:void(0)"
          @click="name = rName"
          v-for="rName in recommendNames"
          :key="rName">
          {{ rName }}
        </a>
      </template>
    </dao-setting-section>

    <dao-setting-section v-if="isDeployByMode && repository">
      <dao-setting-item>
        <template slot="label">
          <span>镜像/版本号</span>
        </template>
        <template slot="content">
          {{ repository }}
        </template>
      </dao-setting-item>
    </dao-setting-section>

    <dao-setting-section>
      <dao-setting-item>
        <template slot="label">
          <span>应用版本</span>
        </template>
        <template slot="content">
          <dao-input
            icon-inside
            type="text"
            name="version"
            placeholder="应用版本"
            v-model="_version"
            v-validate="'required|namespace_code|min:2|max:20'"
            :message="veeErrors.first('version')"
            :status="veeErrors.has('version') ? 'error' : ''"
            data-vv-as="应用版本">
          </dao-input>
        </template>
      </dao-setting-item>
    </dao-setting-section>

    <dao-setting-section>
      <template #label>
        <span>资源对象</span>
        <label-tip text="作为部署应用的资源对象"></label-tip>
      </template>
      <template #content>
        <dao-select
          v-model="_deploymentKind">
          <dao-option
            v-for="option in deploymentKinds"
            :key="option.label"
            :value="option.value"
            :label="option.label">
          </dao-option>
        </dao-select>
      </template>
    </dao-setting-section>
  </dao-setting-layout>
</template>

<script>
import { first } from 'lodash';
import ApplicationService from '@/core/services/application.service';

export default {
  name: 'NameSection',

  inject: ['$validator'],

  props: {
    name: { type: String, default: '' },
    version: { type: String, default: '' },
    space: { type: Object, default: () => ({}) },
    repository: { type: String, default: 'demo/app:0.0.1' },
    deployMode: { type: String, default: '' },
    deploymentKind: { type: String },
  },

  data() {
    return {
      form: {
        name: '',
        version: '',
      },
      recommendNames: [],
      deploymentKinds: [
        { label: 'Deployment', value: 'Deployment' },
        { label: 'Deployment Config', value: 'DeploymentConfig' },
      ],
    };
  },

  computed: {
    isDeployByMode() {
      return this.deployMode === 'image';
    },

    _name: {
      get() {
        return this.name;
      },
      set(name) {
        this.$emit('update:name', name);
      },
    },

    _version: {
      get() {
        return this.version;
      },
      set(version) {
        this.$emit('update:version', version);
      },
    },

    _deploymentKind: {
      get() {
        return this.deploymentKind;
      },
      set(kind) {
        this.$emit('update:deploymentKind', kind);
      },
    },
  },

  methods: {
    checkIsDuplicateName() {
      if (this.veeErrors.has('name')) return;

      this.getRecommendedName(this._name).then(res => {
        // eslint-disable-line
        if (res.is_existed) {
          this._name = first(res.recommend_names); // eslint-disable-line
          this.recommendNames = res.recommend_names;
        }
      });
    },

    getRecommendedName(name) {
      return ApplicationService.getRecommendedName(
        this.space.id,
        name, // repository name
      );
    },
  },
};
</script>
