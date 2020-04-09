<template>
  <div class="row">
    <div class="col-md-6">
      <div class="panel-resource">
        <h3>
          基本信息
        </h3>
        <div class="panel-resource-content content-bordered">
          <div class="dl-horizontal dl-bordered">
            <dl>
              <div class="dl-item">
                <dt>
                  状态（Status）：
                </dt>
                <dd>{{ deploymentStatusFormat(statefulset) || '暂无' }}</dd>
              </div>
              <div class="dl-item">
                <dt>实例数:</dt>
                <dd>
                  <inline-extend
                    :updateable="$can('statefulSet.update', 'statefulSet')"
                    :data="statefulset"
                    @extend="replicas => $emit('extend', replicas)"
                  ></inline-extend>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
      <div class="panel-resource">
        <h3>容器</h3>
        <div class="panel-resource-content">
          <h4>Containers</h4>

          <div class="pod-template-container">
            <div
              :key="index"
              v-for="(container, index) in statefulset.spec.template.spec.containers"
            >
              <pod-template-container
                :pod-template="statefulset.spec.template"
                :container="container"
                :images-by-docker-reference="imagesByDockerReference"
                :builds="builds"
                :detailed="true"
              ></pod-template-container>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-6">
      <div class="panel-resource">
        <h3>存储卷</h3>
        <div class="panel-resource-content">
          <volumes
            v-if="
              statefulset.spec.template.spec.volumes &&
              statefulset.spec.template.spec.volumes.length
            "
            :volumes="statefulset.spec.template.spec.volumes"
          ></volumes>
          <div v-else>暂无</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Volumes from '@/view/components/resource/volumes/volumes';

export default {
  name: 'InfoPanel',

  components: { Volumes },

  props: {
    statefulset: { type: Object, default: () => ({}) },
    projectName: { type: String },
    imagesByDockerReference: { type: Object, default: () => ({}) },
    builds: { type: Object, default: () => ({}) },
    detailed: { type: Boolean, default: false },
  },

  data() {
    return {};
  },

  methods: {
    // SECTION formats
    annotationFormat(resource, key) {
      return this.$options.filters.annotation(resource, key);
    },
    deploymentStatusFormat(statefulset) {
      if (this.annotationFormat(statefulset, 'deploymentCancelled')) {
        return 'Cancelled';
      }

      const status = this.annotationFormat(statefulset, 'deploymentStatus');
      if (!status && statefulset.spec.replicas > 0) {
        return 'Active';
      }

      return status;
    },
  },
};
</script>
