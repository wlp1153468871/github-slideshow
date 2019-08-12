<template>
  <div class="container-fluid sticky-footer-container">
    <div class="container product-detail-module nearby-sticky-footer">
      <div class="row product-detail-header">
        <div class="col-md-9 col-sm-10">
          <div class="product-brief">
            <div class="product-logo">
              <logo-placeholder v-if="!service.logo_url"></logo-placeholder>
              <div
                class="logo-box"
                v-if="service.logo_url"
                v-bg-image="service.logo_url">
              </div>
            </div>
            <div class="product-info">
              <div class="product-name">
                {{ service.name }}
              </div>
              <div class="product-description" :title="service.short_description">
                {{ service.short_description }}
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-sm-2">
          <button
            class="dao-btn blue pull-right"
            :disabled="!service.available"
            @click="checkout()">
            {{ service.available ? '立即获取' : '已经下架' }}
          </button>
        </div>
      </div>
      <div class="row">
        <div class="col-md-9 product-overview">
          <div class="overview-pic" v-if="service.pictures">
            <div class="pic-big" v-bg-image="bigUrl">
            </div>
            <div class="small-pic" v-if="(service.pictures || []).length !== 1">
              <ul>
                <li
                  :class="{ 'active': bigUrl === pic }"
                  @click='show(pic)'
                  v-for="pic in service.pictures"
                  :key="pic"
                  v-bg-image="pic">
                </li>
              </ul>
            </div>
          </div>
          <div class="overview-main">
            <markdown class="main-text" :text="service.description">
            </markdown>
          </div>
        </div>
        <div class="col-md-3 hidden-xs hidden-sm">
          <dl class="product-meta">
            <dt class="meta-title">更新时间</dt>
            <dd class="meta-desc">{{ service.created_at | unix_date('YYYY-MM-DD') }}</dd>
          </dl>
        </div>
      </div>
    </div>

    <app-footer class="footer sticky-footer"></app-footer>
  </div>
</template>

<script src="./product-detail.js"></script>

<style lang="scss">
@import './product-detail';
</style>
