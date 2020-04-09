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
                  <selectors :selector="dc.spec.selector"></selectors>
                </dd>
              </div>
              <div class="dl-item">
                <dt>实例数:</dt>
                <dd>
                  <inline-extend
                    :autoscalers="autoscalers"
                    :data="dc"
                    :updateable="$can('update')"
                    @extend="replicas => $emit('extend', replicas)"
                  >
                  </inline-extend>
                  <span v-if="autoscalers.length">
                    (autoscaled)
                    <el-tooltip content="自动水平扩展" placement="top">
                      <svg class="icon text-muted" style="height: 12px;">
                        <use xlink:href="#icon_info-line"></use>
                      </svg>
                    </el-tooltip>
                  </span>
                  <div v-if="dc.status.updatedReplicas">
                    {{ dc.status.updatedReplicas }} up to date
                  </div>
                  <div v-if="dc.status.availableReplicas || dc.status.unavailableReplicas">
                    <span v-if="dc.status.availableReplicas">
                      {{ dc.status.availableReplicas }} available
                      <span v-if="dc.status.unavailableReplicas">,</span>
                    </span>
                    <span v-if="dc.status.unavailableReplicas"
                      >{{ dc.status.unavailableReplicas }} unavailable</span
                    >
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
                      v-if="$can('update')"
                      class="dao-btn btn-sm mini blue"
                      @click="updateHPA(hpa)"
                    >
                      编辑
                    </button>
                    <button
                      style="margin-left: 0;"
                      v-if="$can('delete')"
                      class="dao-btn btn-sm mini red"
                      @click="confirmDeleteHPA(hpa.metadata.name)"
                    >
                      删除
                    </button>
                  </div>
                </dd>
              </div>
              <div class="dl-item" v-if="dc.spec.strategy">
                <dt>策略（Strategy）：</dt>
                <dd>{{ dc.spec.strategy.type | sentence_case }}</dd>
              </div>
              <div class="dl-item" v-if="dc.spec.strategy.rollingParams">
                <dt>Max Unavailable：</dt>
                <dd>{{ dc.spec.strategy.rollingParams.maxUnavailable }}</dd>
              </div>
              <div class="dl-item" v-if="dc.spec.strategy.rollingParams">
                <dt>Max Surge：</dt>
                <dd>{{ dc.spec.strategy.rollingParams.maxSurge }}</dd>
              </div>
              <div class="dl-item">
                <dt>Min Ready：</dt>
                <dd>{{ dc.spec.minReadySeconds || 0 }} sec</dd>
              </div>
              <div class="dl-item">
                <dt>Revision History Limit：</dt>
                <dd>{{ dc.spec.revisionHistoryLimit || 2 }}</dd>
              </div>
              <div class="dl-item">
                <dt>Progress Deadline：</dt>
                <dd>{{ dc.spec.progressDeadlineSeconds || 600 }} sec</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
      <div class="panel-resource">
        <h3>容器</h3>
        <div class="panel-resource-content">
          <dso-alert v-if="detailed && !hasHealthChecks(dc)" type="warning">
            <slot>
              <template v-if="dc.spec.template.spec.containers.length === 1">
                Container {{ dc.spec.template.spec.containers[0].name }} does not have health checks
              </template>
              <template v-if="dc.spec.template.spec.containers.length > 1">
                Not all containers have health checks
              </template>
              to ensure your application is running correctly.
            </slot>
          </dso-alert>
          <h4>Containers</h4>

          <div class="pod-template-container">
            <div :key="index" v-for="(container, index) in dc.spec.template.spec.containers">
              <pod-template-container
                :pod-template="dc.spec.template"
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
            v-if="dc.spec.template.spec.volumes && dc.spec.template.spec.volumes.length"
            :volumes="dc.spec.template.spec.volumes"
          ></volumes>
          <div v-else>暂无</div>
        </div>
      </div>
      <div class="panel-resource">
        <h3>Triggers</h3>
        <div class="panel-resource-content">
          <triggers
            :projectName="projectName"
            :dcName="dc.metadata.name"
            v-if="dc.spec.triggers && dc.spec.triggers.length"
            :triggers="dc.spec.triggers"
          >
          </triggers>
          <div v-else>暂无</div>
        </div>
      </div>
    </div>

    <edit-yaml-dialog
      header="更新 HPA"
      :value="selectedHPA"
      :visible.sync="dialogConfigs.hpaEdit"
      @update="updateHPAByYaml"
    >
    </edit-yaml-dialog>
  </div>
</template>

<script>
import Volumes from '@/view/components/resource/volumes/volumes';
import Triggers from '@/view/components/resource/triggers/triggers';
import HPAMixin from '@/view/mixins/hpa';

export default {
  name: 'InfoPanel',

  components: { Volumes, Triggers },

  mixins: [HPAMixin],

  props: {
    dc: { type: Object, default: () => ({}) },
    projectName: { type: String },
    imagesByDockerReference: { type: Object, default: () => ({}) },
    builds: { type: Object, default: () => ({}) },
    detailed: { type: Boolean, default: false },
    autoscalers: { type: Array, default: () => [] },
  },
};
</script>

<style lang="scss"></style>
