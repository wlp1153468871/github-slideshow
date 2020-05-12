<template>
  <div id="monitor-application">
    <!--<circle-loading v-if="loading"></circle-loading>-->
    <template>
      <el-form
        :inline="true"
        class="demo-form-inline form-panel"
        v-loading="loading"
        :model="filters"
      >
        <el-form-item label="应用">
          <el-select
            filterable
            size="small"
            :disabled="false"
            v-model="filters.app"
            value-key="name"
            placeholder=""
            @change="onClickApp"
          >
            <el-option
              :value="app"
              :label="app.name"
              v-for="app in applications"
              :key="app.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-select
            filterable
            size="small"
            :disabled="false"
            v-model="filters.kind"
            placeholder=""
            @change="onClickKind"
          >
            <el-option :value="k" :label="k" v-for="k in kinds" :key="k"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="实例">
          <el-select
            filterable
            size="small"
            :disabled="!instances.length"
            v-model="filters.instance"
            value-key="name"
            placeholder=""
            @change="onClickInstance"
          >
            <el-option :value="i" :label="i.name" v-for="i in instances" :key="i.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="pod">
          <el-select
            filterable
            size="small"
            :disabled="!pods.length"
            v-model="filters.pod"
            value-key="name"
            placeholder=""
            @change="onClickPod"
          >
            <el-option
              :value="pod"
              :label="pod.name"
              v-for="pod in pods"
              :key="pod.name"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template v-if="instancesExisted">
        <el-form
          :inline="true"
          class="demo-form-inline form-panel timeRangePanel"
          v-loading="loadings.iframe"
        >
          <el-form-item label="">
            <slot name="prefix">
              <i class="el-icon-time timeRangeIcon"></i>
            </slot>
            <el-select
              filterable
              size="small"
              v-model="timeRange"
              placeholder=""
              @change="onClickTimeRange"
            >
              <el-option
                :value="t"
                :label="t"
                v-for="(t, index) in timeRanges"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <iframe class="monitor-frame" :src="url" frameborder="0"> </iframe>
      </template>
      <p v-else class="empty-message">您选择的类型没有开启监控或没有任何实例</p>
    </template>
  </div>
</template>
<script src="./applications.js"></script>
<style lang="scss">
@import './applications.scss';
</style>
