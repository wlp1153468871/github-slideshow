<template>
  <div class="volume-overview instance-overview">
    <div class="info-column">
      <!-- 基本信息 -->
      <div class="ins-setting-card">
        <div class="ins-card-title">
          基本信息
        </div>
        <div class="ins-card-body">
          <div
            class="ins-info-item"
            v-for="(value, key) in information.basic"
            :key="key">
            <span class="info-item-label text-lowercase">
              {{ key }}
            </span>
            <span class="info-item-content">
              {{ value }}
            </span>
          </div>
        </div>
      </div>
      <!-- 配置信息 -->
      <div class="ins-setting-card">
        <div class="ins-card-title">
          配置信息
        </div>
        <div class="ins-card-body">
          <div class="ins-info-item">
            <span class="info-item-label">
              存储容量
            </span>
            <span class="info-item-content">
              <span v-if="pvc.spec.volumeName">
                <span v-if="pvc.status.capacity['storage']">
                  {{pvc.status.capacity['storage'] | usage_with_units('storage')}}
                </span>
                <span v-if="!pvc.status.capacity['storage']">unknown</span>
              </span>
              <span v-if="!pvc.spec.volumeName">
                <span>-</span>
              </span>
            </span>
          </div>
          <div class="ins-info-item">
            <span class="info-item-label">
              Requested Capacity
            </span>
            <span class="info-item-content">
              <span v-if="pvc.spec.resources.requests['storage']">
                {{pvc.spec.resources.requests['storage'] | usage_with_units('storage')}}
              </span>
              <span v-if="!pvc.spec.resources.requests['storage']"><em>none</em></span>
            </span>
          </div>
          <div class="ins-info-item">
            <span class="info-item-label">
              读取模式
            </span>
            <span class="info-item-content">
              {{pvc.spec.accessModes | access_modes}}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="detail-column">
      <div class="ins-setting-card">
        <div class="ins-card-title">
          <span>操作记录</span>
          <span>
            <a
              href="javascript:void(0)"
              @click="$emit('change-tab', 'jobs')">
              查看更多 >
            </a>
          </span>
        </div>
        <div class="ins-card-body">
          <event-list :jobs="jobs"></event-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import JobsPanel from './jobs';

export default {
  name: 'OverviewPanel',

  components: {
    JobsPanel,
  },

  props: {
    pvc: { type: Object, default: () => ({}) },
    information: {
      type: Object,
      default: () => {
        return {
          basic: {},
        };
      },
    },
    jobs: { type: Array, default: () => [] },
  },
};
</script>
