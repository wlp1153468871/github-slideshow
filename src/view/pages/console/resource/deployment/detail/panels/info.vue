<template>
  <div class="row">
    <div class="col-md-6">
      <div class="panel-resource">
        <h3>基本信息</h3>
        <div class="panel-resource-content content-bordered">
          <div class="dl-horizontal dl-bordered">
            <dl>
              <div class="dl-item">
                <dt>Selectors:</dt>
                <dd>
                  <selectors :selector="deployment.spec.selector"></selectors>
                </dd>
              </div>
              <div class="dl-item">
                <dt>实例数:</dt>
                <dd>
                  <span>{{deployment.spec.replicas}} replica
                    <span v-if="deployment.spec.replicas !== 1">s</span>
                  </span>
                  <span v-if="autoscalers.length">
                    (autoscaled)
                    <el-tooltip
                      content="自动水平扩展"
                      placement="top">
                      <svg class="icon text-muted" style="height: 12px;">
                        <use xlink:href="#icon_info-line"></use>
                      </svg>
                    </el-tooltip>
                  </span>
                  <template v-else>
                    <button
                      v-if="$can('deployment.update', 'deployment')"
                      class="dao-btn mini blue"
                      @click="visible = true">弹性扩展
                    </button>
                  </template>
                  <div v-if="deployment.status.updatedReplicas">
                    {{deployment.status.updatedReplicas}} up to date
                  </div>
                  <div v-if="replicasExtraInfo">
                    <span v-if="availableReplicas">{{availableReplicas}} available
                      <span v-if="unavailableReplicas">,</span>
                    </span>
                    <span v-if="unavailableReplicas">{{unavailableReplicas}} unavailable</span>
                  </div>
                </dd>
              </div>
              <div class="dl-item" v-if="autoscalers.length">
                <dt>HPA:</dt>
                <dd>
                  <div v-for="(hpa, index) in autoscalers" :key="index">
                    {{ hpa.metadata.name }}
                    <button
                      style="margin-left: 3px;"
                      v-if="$can('deployment.update', 'deployment')"
                      class="dao-btn btn-sm mini blue"
                      @click="updateHPA(hpa)">编辑
                    </button>
                    <button
                      style="margin-left: 0;"
                      v-if="$can('deployment.delete', 'deployment')"
                      class="dao-btn btn-sm mini red"
                      @click="confirmDeleteHPA(hpa.metadata.name)">删除
                    </button>
                  </div>
                </dd>
              </div>
              <div class="dl-item" v-if="deployment.spec.strategy">
                <dt>策略（Strategy）：</dt>
                <dd>
                  {{deployment.spec.strategy.type | sentence_case}}
                </dd>
              </div>
              <div class="dl-item" v-if="deployment.spec.strategy.rollingUpdate">
                <dt>Max Unavailable：</dt>
                <dd>
                  {{deployment.spec.strategy.rollingUpdate.maxUnavailable}}
                </dd>
              </div>
              <div class="dl-item" v-if="deployment.spec.strategy.rollingUpdate">
                <dt>Max Surge：</dt>
                <dd>
                  {{deployment.spec.strategy.rollingUpdate.maxSurge}}
                </dd>
              </div>
              <div class="dl-item">
                <dt>Min Ready：</dt>
                <dd>
                  {{deployment.spec.minReadySeconds || 0}} sec
                </dd>
              </div>
              <div class="dl-item">
                <dt>Revision History Limit：</dt>
                <dd>
                  {{deployment.spec.revisionHistoryLimit || 2}}
                </dd>
              </div>
              <div class="dl-item">
                <dt>Progress Deadline：</dt>
                <dd>
                  {{deployment.spec.progressDeadlineSeconds || 600}} sec
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
      <div class="panel-resource container-content">
        <h3>Containers</h3>
        <div class="panel-resource-content">
          <div
            v-if="detailed && !hasHealthChecks(deployment)"
            class="alert alert-info">
            <div class="alert-description">
              <svg class="icon">
                <use xlink:href="#icon_warning-line"></use>
              </svg>
              <span v-if="deployment.spec.template.spec.containers.length === 1">
                Container
                &nbsp;{{deployment.spec.template.spec.containers[0].name}}
                &nbsp;does not have health checks
              </span>
              <span v-if="deployment.spec.template.spec.containers.length > 1">
                Not all containers have health checks
              </span>
              to ensure your application is running correctly.
            </div>
          </div>

          <div class="pod-template-container">
            <div
              :key="index"
              v-for="(container, index) in deployment.spec.template.spec.containers">

              <pod-template-container
                :pod-template="deployment.spec.template"
                :container="container"
                :images-by-docker-reference="imagesByDockerReference"
                :builds="builds"
                :detailed="true">
              </pod-template-container>
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
            v-if="deployment.spec.template.spec.volumes"
            :volumes="deployment.spec.template.spec.volumes">
          </volumes>
          <div v-else>暂无</div>
        </div>
      </div>
    </div>

    <dao-dialog
      :visible.sync="visible"
      header="修改实例数"
      @before-open="initReplicas"
      @confirm="confirmScale">

      <dao-setting-section>
        <dao-setting-item>
          <div slot="label">实例数</div>
          <div slot="content">
            <dao-input
              icon-inside
              v-model="replicas"
              type="text"
              name="replicas"
              v-validate="{
                required: true,
                numeric: true,
              }"
              :class="veeErrors.has('replicas') ? 'error' : ''"
              :status="veeErrors.has('replicas') ? 'error' : ''"
              :message="veeErrors.first('replicas')"
              data-vv-as="实例数">
            </dao-input>
          </div>
        </dao-setting-item>
      </dao-setting-section>
      <div slot="footer">
        <button
          class="dao-btn ghost"
          @click="visible = false">
          取消
        </button>
        <button
          class="dao-btn blue"
          @click="confirmScale">
          确定
        </button>
      </div>
    </dao-dialog>

    <edit-yaml-dialog
      header="更新 HPA"
      :value="selectedHPA"
      :visible.sync="dialogConfigs.hpaEdit"
      @update="updateHPAByYaml">
    </edit-yaml-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { get as getValue } from 'lodash';
import Volumes from '@/view/components/resource/volumes/volumes';
import HPAMixin from '@/view/mixins/hpa';

export default {
  name: 'InfoPanel',

  components: { Volumes },

  mixins: [HPAMixin],

  props: {
    deployment: { type: Object, default: () => ({}) },
    imagesByDockerReference: { type: Object, default: () => ({}) },
    builds: { type: Object, default: () => ({}) },
    detailed: { type: Boolean, default: false },
    autoscalers: { type: Array, default: () => [] },
  },

  data() {
    const { name: deploymentName } = this.$route.params;
    return {
      visible: false,
      deploymentName,
      replicas: 0,
    };
  },

  computed: {
    ...mapState(['space', 'zone']),

    availableReplicas() {
      return getValue(this.deployment, 'status.availableReplicas');
    },

    unavailableReplicas() {
      return getValue(this.deployment, 'status.unavailableReplicas');
    },

    replicasExtraInfo() {
      return this.availableReplicas || this.unavailableReplicas;
    },
  },

  methods: {
    scale() {
      this.$emit('scale', this.replicas);
      this.visible = false;
    },

    initReplicas() {
      this.replicas = this.deployment.spec.replicas;
    },

    confirmScale() {
      this.$validator.validateAll().then(valid => {
        if (valid) this.scale();
      });
    },
  },
};
</script>

<style lang="scss">
.container-content {
  margin-top: 10px;
}
</style>
