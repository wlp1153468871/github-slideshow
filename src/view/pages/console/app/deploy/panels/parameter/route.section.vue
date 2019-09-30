<template>
  <dao-setting-layout>
    <template slot="layout-title">负载均衡</template>
    <dao-setting-section>
      <div slot="label">
        <span>创建访问域名</span>
        <label-tip text="为应用创建一个访问域名, 可用于版本灰度发布。创建成功后将生成一个和应用同名的 Route 或者 Ingress"></label-tip>
      </div>
      <div slot="content">
        <dao-switch
          :with-notice="true"
          v-model="autoRoute">
        </dao-switch>
      </div>
    </dao-setting-section>

    <dao-setting-section v-if="autoRoute">
      <template #label>
        <span>资源对象</span>
        <label-tip text="提供负载均衡的资源对象"></label-tip>
      </template>
      <template #content>
        <dao-select
          v-model="_exposeKind">
          <dao-option
            v-for="option in exposeKinds"
            :key="option.name"
            :value="option.kind"
            :label="option.kind">
          </dao-option>
        </dao-select>
      </template>
    </dao-setting-section>

    <dao-setting-section v-if="autoRoute">
      <template #label>访问域名</template>
      <template #content>
        <dao-input
          block
          icon-inside
          v-model="_hostname"
          name="host"
          placeholder="hostname"
          v-validate="'required|resource_name|max:63'"
          :message="veeErrors.first('host')"
          :status="veeErrors.has('host') ? 'error' : ''"
          data-vv-as="访问域名">
          <span slot="append" v-if="domain">.{{ domain }}</span>
        </dao-input>
      </template>
    </dao-setting-section>

    <dao-setting-section>
      <div slot="label">
        <span>容器端口</span>
      </div>
      <div slot="content">
        <dao-input
          icon-inside
          name="port"
          v-model="_port"
          :message="veeErrors.first('port')"
          :status="veeErrors.has('port') ? 'error' : ''"
          v-validate="'required|port'"
          data-vv-as="端口"
          placeholder="端口号；例如 80">
        </dao-input>
      </div>
    </dao-setting-section>

    <dao-setting-section>
      <div slot="label">
        <span>访问路径</span>
      </div>
      <div slot="content">
        <dao-input
          icon-inside
          name="path"
          v-model="_path"
          :message="veeErrors.first('path')"
          :status="veeErrors.has('path') ? 'error' : ''"
          v-validate="'required|absolute_path'"
          data-vv-as="访问路径">
        </dao-input>
      </div>
    </dao-setting-section>
  </dao-setting-layout>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'RouteSection',

  inject: ['$validator'],

  props: {
    usingRoute: { type: Boolean, default: true },
    hostname: { type: String, default: '' },
    port: { type: String, default: '80' },
    path: { type: String },
    domain: { type: String, default: '' },
    exposeKind: { type: String },
  },

  computed: {
    ...mapGetters(['exposeKinds']),

    autoRoute: {
      get() {
        return this.usingRoute;
      },
      set(usingRoute) {
        this.$emit('update:usingRoute', usingRoute);
      },
    },

    _hostname: {
      get() {
        return this.hostname;
      },
      set(hostname) {
        this.$emit('update:hostname', hostname);
      },
    },

    _port: {
      get() {
        return this.port;
      },
      set(port) {
        this.$emit('update:port', port);
      },
    },

    _path: {
      get() {
        return this.path;
      },
      set(path) {
        this.$emit('update:path', path);
      },
    },

    _exposeKind: {
      get() {
        return this.exposeKind;
      },
      set(kind) {
        this.$emit('update:exposeKind', kind);
      },
    },
  },
};
</script>
