<template>
  <div>
    <d-alert v-if="objrefs.length" :show-icon="true">
      <template #message>
        <div style="display: flex;">
          该 {{ kind }} 正在被资源
          <resource-link
            :key="index"
            v-for="(item, index) in objrefs"
            :kind="item.kind"
            :name="item.name"
          >
          </resource-link>
          &nbsp;所使用，所以您无法删除该 {{ kind }}。
        </div>
      </template>
    </d-alert>
    <div class="volume-overview instance-overview">
      <div class="info-column">
        <!-- 基本信息 -->
        <div class="ins-setting-card">
          <div class="ins-card-title">
            基本信息
          </div>
          <div class="ins-card-body">
            <div class="ins-info-item" v-for="(value, key) in information.basic" :key="key">
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
                <span v-if="pvc.spec && pvc.spec.volumeName">
                  <span v-if="pvc.status.capacity['storage']">
                    {{ pvc.status.capacity['storage'] | usage_with_units('storage') }}
                  </span>
                  <span v-if="!pvc.status.capacity['storage']">unknown</span>
                </span>
                <span v-if="pvc.spec && !pvc.spec.volumeName">
                  <span>-</span>
                </span>
              </span>
            </div>
            <div class="ins-info-item">
              <span class="info-item-label">
                请求容量
              </span>
              <span class="info-item-content">
                <span v-if="pvc.spec && pvc.spec.resources.requests['storage']">
                  {{ pvc.spec.resources.requests['storage'] | usage_with_units('storage') }}
                </span>
                <span v-if="pvc.spec && !pvc.spec.resources.requests['storage']"
                  ><em>none</em></span
                >
              </span>
            </div>
            <div class="ins-info-item">
              <span class="info-item-label">
                读取模式
              </span>
              <span class="info-item-content">
                {{ !pvc.spec ? '' : pvc.spec.accessModes | access_modes }}
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
              <a href="javascript:void(0)" @click="$emit('change-tab', 'jobs')">
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
  </div>
</template>

<script>
import { RESOURCE_TYPE } from '@/core/constants/resource';
import JobsPanel from './jobs';

export default {
  name: 'OverviewPanel',

  components: {
    JobsPanel,
  },

  data() {
    return {
      kind: RESOURCE_TYPE.PERSISTENT_VOLUME_CLAIM,
    };
  },

  props: {
    pvc: { type: Object, default: () => ({}) },
    objrefs: { type: Array, default: () => [] },
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
<style scoped lang="scss">
.volume-overview {
  margin-top: 15px;
}
</style>
