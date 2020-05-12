<template>
  <div class="pod-template">
    <p class="pod-container-name">{{ container.name }}</p>
    <button
      v-if="podTemplate.metadata.name"
      style="float: right;"
      class="dao-btn blue mini btn-sm"
      @click="openFileSaveDialog"
    >
      下载文件
    </button>

    <div v-if="container.image" class="pod-template-image icon-row">
      <div class="icon-wrap">
        <svg class="icon">
          <use xlink:href="#icon_docker-image"></use>
        </svg>
      </div>
      <div class="pod-template-detail word-break">
        <span class="pod-template-key">Image:</span>
        <span>
          {{ container.image | image_stream_name }}
        </span>
      </div>
    </div>

    <div
      v-if="
        detailed &&
        ((container.command && container.command.length) ||
          (container.args && container.args.length))
      "
      class="icon-row"
    >
      <div class="icon-wrap">
        <svg class="icon">
          <use xlink:href="#icon_console"></use>
        </svg>
      </div>
      <div class="pod-template-detail word-break">
        <span class="pod-template-key">Command:</span>
        <span>
          <code class="command">
            <truncate-long-text
              :content="content"
              :limit="80"
              :newline-limit="1"
              keywords="python3"
              :expandable="true"
              :use-word-boundary="false"
            ></truncate-long-text>
          </code>
        </span>
      </div>
    </div>

    <div v-if="container.ports && container.ports.length > 0" class="pod-template-ports icon-row">
      <div class="icon-wrap">
        <svg class="icon">
          <use xlink:href="#icon_ports"></use>
        </svg>
      </div>
      <div class="pod-template-detail word-break">
        <span class="pod-template-key">Ports:</span>
        <span v-for="(port, index) in containerPorts" :key="index">
          <span class="nowrap">{{ port.containerPort }}/{{ port.protocol }}</span>
          <span v-if="port.name">
            <span class="nowrap">({{ port.name }})</span>
          </span>
          <span v-if="port.hostPort">
            <span class="nowrap">
              <span class="port-icon">&#8594;</span>
              {{ port.hostPort }}
            </span>
          </span>
          <span v-if="index === container.ports.length - 1">,</span>
        </span>
        <span v-if="!detailed && container.ports.length >= 2">
          and {{ container.ports.length - 1 }}
          <span v-if="container.ports.length > 2">others</span>
          <span v-if="container.ports.length === 2">other</span>
        </span>
      </div>
    </div>

    <div
      v-if="detailed && container.volumeMounts"
      v-for="(mount, mountIndex) in container.volumeMounts"
      class="icon-row"
      :key="mountIndex"
    >
      <div class="icon-wrap">
        <svg class="icon">
          <use xlink:href="#icon_inbox"></use>
        </svg>
      </div>
      <div class="pod-template-detail word-break">
        <span class="pod-template-key">Mount:</span>
        <span>
          {{ mount.name }}
          <template v-if="mount.subPath">, subpath {{ mount.subPath }}</template>
          <svg class="icon text-muted">
            <use xlink:href="#icon_arrow-right"></use>
          </svg>
          {{ mount.mountPath }}
          <small class="text-muted">
            ({{ mount | volume_mount_mode(podTemplate.spec.volumes) }})
          </small>
        </span>
      </div>
    </div>

    <div v-if="detailed && displayCPU" class="icon-row">
      <div class="icon-wrap">
        <svg class="icon">
          <use xlink:href="#icon_cpu"></use>
        </svg>
      </div>
      <div class="pod-template-detail">
        <span class="pod-template-key">CPU:</span>
        <span>
          <template v-if="hasContainerResourceCPU">
            {{ container.resources.requests.cpu | usage_with_units('cpu') }}
            to {{ container.resources.limits.cpu | usage_with_units('cpu') }}
          </template>
          <template v-if="hasContainerResourceLimitsCPU">
            ,{{ container.resources.limits.cpu | usage_with_units('cpu') }} limit
          </template>
          <template v-if="hasContainerResourceRequestsCPU">
            ,{{ container.resources.requests.cpu | usage_with_units('cpu') }} requested
          </template>
        </span>
      </div>
    </div>

    <div v-if="detailed && displayMemory" class="icon-row">
      <div class="icon-wrap">
        <svg class="icon">
          <use xlink:href="#icon_ram-memory"></use>
        </svg>
      </div>
      <div class="pod-template-detail">
        <span class="pod-template-key">Memory:</span>
        <span>
          <template v-if="hasContainerResourceMemory">
            {{ container.resources.requests.memory | usage_with_units('memory') }}
            to {{ container.resources.limits.memory | usage_with_units('memory') }}
          </template>
          <template v-if="hasContainerResourceLimitsMemory">
            ,{{ container.resources.limits.memory | usage_with_units('memory') }} limit
          </template>
          <template v-if="hasContainerResourceRequestsMemory">
            ,{{ container.resources.requests.memory | usage_with_units('memory') }} requested
          </template>
        </span>
      </div>
    </div>

    <div v-if="detailed && container.readinessProbe" class="icon-row">
      <div class="icon-wrap">
        <svg class="icon">
          <use xlink:href="#icon_probe"></use>
        </svg>
      </div>
      <div class="pod-template-detail">
        <span class="pod-template-key">Readiness Probe:</span>
        <probe :probe="container.readinessProbe"></probe>
      </div>
    </div>

    <div v-if="detailed && container.livenessProbe" class="icon-row">
      <div class="icon-wrap">
        <svg class="icon">
          <use xlink:href="#icon_probe"></use>
        </svg>
      </div>
      <div class="pod-template-detail">
        <span class="pod-template-key">Liveness Probe:</span>
        <probe :probe="container.livenessProbe"></probe>
      </div>
    </div>

    <file-save-in-container
      :visible="dialogs.saveFile"
      :pod-template="podTemplate"
      :container="container"
      @close="dialogs.saveFile = false"
    >
    </file-save-in-container>
  </div>
</template>

<script>
import Vue from 'vue';
import { orderBy, has } from 'lodash';
import FileSaveInContainer from '@/view/components/resource/file-save-in-container/file-save-in-container';

export default {
  name: 'PodTemplateContainer',

  props: {
    container: { type: Object },
    podTemplate: { type: Object },
    imagesByDockerReference: { type: Object, default: () => ({}) },
    builds: { type: Object, default: () => ({}) },
    detailed: { type: Boolean, default: () => ({}) },
  },

  components: {
    FileSaveInContainer,
  },

  data() {
    return {
      dialogs: {
        saveFile: false,
      },
    };
  },

  computed: {
    hasContainerResourceCPU() {
      return this.hasContainerResourceRequestsCPU && this.hasContainerResourceLimitsCPU;
    },

    hasContainerResourceRequestsCPU() {
      return has(this.container, 'resources.requests.cpu');
    },

    hasContainerResourceLimitsCPU() {
      return has(this.container, 'resources.limits.cpu');
    },

    displayCPU() {
      return (
        this.hasContainerResourceCPU ||
        this.hasContainerResourceRequestsCPU ||
        this.hasContainerResourceLimitsCPU
      );
    },

    hasContainerResourceMemory() {
      return this.hasContainerResourceRequestsMemory && this.hasContainerResourceLimitsMemory;
    },

    hasContainerResourceRequestsMemory() {
      return has(this.container, 'resources.requests.memory');
    },

    hasContainerResourceLimitsMemory() {
      return has(this.container, 'resources.limits.memory');
    },

    displayMemory() {
      return (
        this.hasContainerResourceMemory ||
        this.hasContainerResourceRequestsMemory ||
        this.hasContainerResourceLimitsMemory
      );
    },

    content() {
      return Vue.filter('entrypoint')(
        this.container,
        this.imagesByDockerReference[this.container.image],
      );
    },

    containerPorts() {
      const limit = this.detailed ? undefined : 1;

      if (this.container.ports) {
        return Vue.filter('limit_to_or_all')(orderBy(this.container.ports, 'containerPort'), limit);
      }
      return [];
    },
  },

  methods: {
    openFileSaveDialog() {
      this.dialogs.saveFile = true;
    },
  },
};
</script>

<style lang="scss">
.pod-template {
  font-size: 12px;
  line-height: 1.66666667;

  .pod-container-name {
    font-size: 14px;
    margin-bottom: 4px;
  }

  .icon-row {
    border-left: 3px solid #f1f1f1;
    display: flex;
    padding: 2px 0 0 2px;

    .icon-wrap {
      width: 12px;
      height: 12px;
      text-align: center;
      width: 30px;
      color: #888;
    }
  }

  .pod-template-detail {
    display: flex;
    flex: 1 1 0%;
    min-width: 0;

    .pod-template-key {
      flex-shrink: 0;
      font-weight: 600;
      margin-right: 3px;
    }
  }
}
</style>
