<template>
  <div class="panel-resource">
    <h3>Template</h3>

    <div class="panel-resource-content">
      <!-- Prompt to add health checks if missing. -->
      <div
        v-if="detailed && !hasHealthChecks(pod)"
        class="alert alert-info">
        <div class="alert-description">
          <svg class="icon">
            <use xlink:href="#icon_warning-line"></use>
          </svg>
          <span v-if="pod.spec.containers.length === 1">
          Container {{pod.spec.containers[0].name}} does not have health checks
          </span>
          <span v-if="pod.spec.containers.length > 1">
            Not all containers have health checks
          </span>
          to ensure your application is running correctly.
        </div>
      </div>

      <template v-if="hasContainers">
        <h4>Init Containers</h4>

        <div class="pod-template-container">
          <div
            class="pod-template-block"
            :key="index"
            v-for="(container, index) in pod.spec.initContainers">

            <pod-template-container
              :pod-template="pod"
              :container="container"
              :images-by-docker-reference="imagesByDockerReference"
              :builds="builds"
              :detailed="detailed">
            </pod-template-container>

          </div>
        </div>
      </template>

      <h4 v-if="detailed">Containers</h4>

      <div class="pod-template-container">
        <div
          :key="index"
          v-for="(container, index) in pod.spec.containers">

          <pod-template-container
            :pod-template="pod"
            :container="container"
            :images-by-docker-reference="imagesByDockerReference"
            :builds="builds"
            :detailed="detailed">
          </pod-template-container>

        </div>
      </div>

      <h4>Volumes</h4>

      <volumes
        v-if="pod.spec.volumes.length"
        :volumes="pod.spec.volumes">
      </volumes>

      <div v-else>暂无</div>
    </div>

  </div>
</template>

<script>
import hasHealthChecks from '@/view/filters/resource/has-health-checks.filter';
import Volumes from '@/view/components/resource/volumes/volumes';

export default {
  name: 'PodTemplatePanel',

  components: {
    Volumes,
  },

  props: {
    pod: { type: Object, default: () => ({}) },
    imagesByDockerReference: { type: Object, default: () => ({}) },
    builds: { type: Object, default: () => ({}) },
    detailed: { type: Boolean, default: false },
  },

  computed: {
    hasContainers() {
      return (
        this.detailed &&
        this.pod.spec.initContainers &&
        this.pod.spec.initContainers.length
      );
    },
  },

  methods: {
    hasHealthChecks,
  },
};
</script>
