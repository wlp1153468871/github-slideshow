<template>
  <div>
    <div
      class="instance-overview"
      v-if="informations.length || basicInformations.length"
      >
      <div class="info-column" v-if="basicInformations.length">
        <!-- 基本信息 -->
        <div class="ins-setting-card">
          <div class="ins-card-title">
            基本信息
          </div>
          <div class="ins-card-body">
            <div
              class="ins-info-item"
              v-for="info in basicInformations"
              :key="info.name">
              <span class="info-item-label text-uppercase">
                {{ info.name }}
              </span>
              <span class="info-item-content">
                {{ info.value }}
              </span>
            </div>
          </div>
        </div>
        <!-- 配置信息 -->
        <div class="ins-setting-card" v-if="informations.length">
          <div class="ins-card-title">
            配置信息
          </div>
          <div class="ins-card-body">
            <div
              class="ins-info-item"
              v-for="info in informations"
              :key="info.name">
              <span class="info-item-label text-uppercase">
                {{ info.name | instance_detail }}
              </span>
              <span
                class="info-item-content"
                v-if="info.type === INFO_TYPE.STRING">
                {{ info.value }}
              </span>
              <a
                class="info-item-content"
                v-if="info.type === INFO_TYPE.LINK"
                target="_blank"
                :href="info.value">
                {{ info.value }}
              </a>
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
                @click="$emit('more', 'events')">
                查看更多 >
              </a>
            </span>
          </div>
          <div class="ins-card-body">
            <event-list :jobs="events"></event-list>
          </div>
        </div>
      </div>
    </div>
    <empty-state
      v-if="!informations.length && !basicInformations.length"
      :title="this.status | instance_status">
    </empty-state>
  </div>
</template>

<script>
import EventPanel from './events';

export default {
  name: 'OverviewPanel',

  components: {
    EventPanel,
  },

  props: {
    basicInformations: { type: Array, default: () => [] },
    informations: { type: Array, default: () => [] },
    status: { type: String, default: '' },
    events: { type: Array, default: () => [] },
  },

  created() {},

  data() {
    return {
      INFO_TYPE: {
        STRING: 'string',
        LINK: 'link',
        MARKDOWN: 'markdown',
      },
    };
  },
  computed: {
    basic() {
      return [];
    },
  },
};
</script>
