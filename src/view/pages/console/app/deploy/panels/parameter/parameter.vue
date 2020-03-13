<template>
  <div class="container app-paramter">
    <!-- 选择镜像 -->
    <image-section
      @model-changed="onModelChanged"
      @deploy-mode-changed="onDeployModeChanged">
    </image-section>

    <!-- 租户 / 项目组 -->
    <space-zone-section>
    </space-zone-section>

    <!-- 名称 -->
    <name-section
      :space="space"
      :name.sync="form.name"
      :deployment-kind.sync="form.deploymentKind"
      :version.sync="form.version"
      :repository="form.repository"
      :deploy-mode="form.deployMode">
    </name-section>

    <!-- 规格 -->
    <plan-section
      :plan.sync="form.plan">
    </plan-section>

    <!-- 部署策略 -->
    <affinity-section
      :affinity.sync="form.affinity"
      :config.sync="form.affinityConfig">
    </affinity-section>

    <!-- 容器配置 -->
    <pod-section
      @pod-model="onModelChanged"
      ref="podPanel">
    </pod-section>

    <!-- 负载均衡 -->
    <route-section
      :using-route.sync="form.autoRoute"
      :expose-kind.sync="form.exposeKind"
      :hostname.sync="form.hostname"
      :port.sync="form.port"
      :path.sync="form.path"
      :domain="inrouterDomain">
    </route-section>

    <!-- 存储卷 -->
    <volume-section
      :space="space"
      :zone="zone"
      :volumes.sync="form.volumes">
    </volume-section>

    <dao-setting-layout>
      <template slot="layout-title">环境配置</template>
      <!--环境配置-->
      <env-section
        :config-maps="configMaps"
        :secrets="secrets"
        v-model="form.envs">
      </env-section>
    </dao-setting-layout>

    <dao-setting-layout>
      <template slot="layout-title">挂载 Config Map</template>
      <!--挂载 Config Map -->
      <mount-file-section
        :config-maps="configMaps"
        :secrets="secrets"
        v-model="form.configFiles">
      </mount-file-section>
    </dao-setting-layout>

    <!-- 启动参数 -->
    <command-section
      :cmd.sync="form.cmd"
      :args.sync="form.args">
    </command-section>

    <dao-setting-layout>
      <template slot="layout-title">监控开关</template>
      <!--监控 -->
      <dao-setting-section>
        <div slot="label">
          <span>监控开关</span>
        </div>
        <div slot="content">
          <dao-switch
            v-model="form.monitor">
          </dao-switch>
        </div>
      </dao-setting-section>
    </dao-setting-layout>

    <dao-setting-layout>
      <template slot="layout-title">HPA开关</template>
      <!--监控 -->
      <dao-setting-section>
        <div slot="label">
          <span>HPA开关</span>
        </div>
        <div slot="content">
          <dao-switch
            v-model="form.hpa">
          </dao-switch>
        </div>
      </dao-setting-section>
    </dao-setting-layout>
  </div>
</template>

<script src="./parameter.js"></script>

<style lang="scss">
.app-paramter {
  .cm-s-material.CodeMirror {
    height: 350px;
  }
}
</style>
