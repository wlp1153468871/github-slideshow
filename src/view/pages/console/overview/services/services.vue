<template>
  <div class="page-service-overview">
    <div class="tool-bar">
      <dao-input search v-model="keyword" placeholder="搜索服务名称..." @change="handleKeyword">
      </dao-input>
      <div class="layout-icon">
        <span
          :class="{ active: layoutType === LAYOUT_TYPES.CARD }"
          @click="toggleLayout(LAYOUT_TYPES.CARD)"
        >
          <svg class="icon">
            <use xlink:href="#icon_service-card"></use>
          </svg>
        </span>
        <span
          :class="{ active: layoutType === LAYOUT_TYPES.LIST }"
          @click="toggleLayout(LAYOUT_TYPES.LIST)"
        >
          <svg class="icon">
            <use xlink:href="#icon_service-list"></use>
          </svg>
        </span>
      </div>
    </div>
    <div class="overview-content">
      <div class="catalog-list">
        <ul class="catalog-sidebar">
          <li
            v-for="(clg, index) in categories"
            :key="index"
            :class="{ active: clg.name === category.name }"
            @click="switchCategory(clg, index)"
          >
            {{ clg.name }}
          </li>
        </ul>
      </div>
      <div class="service-list">
        <div :class="layoutType" v-if="serviceAvailable && availableServices.length">
          <div class="service-cell" v-for="service in availableServices" :key="service.id">
            <div class="box-wrap" @click="gotoInstanceList(service)">
              <div class="logo-box" v-if="service.logo_url" v-bg-image="service.logo_url"></div>
              <logo-placeholder class="logo-box" v-if="!service.logo_url"> </logo-placeholder>
              <div class="service-name">{{ service.name }}</div>
              <br />
            </div>
            <p v-if="service.short_description" class="service-content">
              {{ service.short_description }}
            </p>
            <div class="create-btn" v-if="$can('create')">
              <dao-tooltip content="可用区正在同步，服务无法创建" v-if="isZoneSyncing">
                <button
                  class="dao-btn blue"
                  @click="deployService(service)"
                  :disabled="isZoneSyncing || isDeleted(service)"
                >
                  创建服务
                </button>
              </dao-tooltip>
              <button
                v-else
                class="dao-btn blue"
                @click="deployService(service)"
                :disabled="isZoneSyncing || isDeleted(service)"
              >
                创建服务
              </button>
            </div>
          </div>
        </div>
        <p class="empty-service" v-else>
          {{ loadings.services ? '正在加载...' : '暂无可用服务' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script src="./services.js"></script>

<style lang="scss">
@import './services.scss';
</style>
