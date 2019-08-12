<template>
  <div class="deploy-config-map">
    <div class="top-bar">
      <div class="header-title">
        <a
          class="go-back"
          href="javascript:void(0)"
          @click="$router.go(-1)">
          <svg class="icon">
            <use xlink:href="#icon_caret-left"></use>
          </svg>
          <span class="text">返回</span>
        </a>
        <span class="service-name">Secret</span>
      </div>
    </div>

    <div class="container">
      <div v-show="STEPS.CONFIG === stepIndex">
        <space-zone
          ref="spaceZone">
        </space-zone>

        <dao-setting-layout>
          <template slot="layout-title">名称</template>
          <dao-setting-section>
            <dao-setting-item>
              <template slot="label">名称</template>
              <template slot="content">
                <dao-input
                  icon-inside
                  v-model="secretName"
                  name="secretName"
                  v-validate="'required|resource_name|exclude_spaces'"
                  :message="veeErrors.first('secretName')"
                  :status="veeErrors.has('secretName') ? 'error' : ''"
                  data-vv-as="名称">
                </dao-input>
              </template>
            </dao-setting-item>
          </dao-setting-section>
        </dao-setting-layout>

        <dao-setting-layout>
          <template slot="layout-title">类型</template>
          <dao-setting-section>
            <dao-setting-item>
              <template slot="label">类型</template>
              <template slot="content">
                <dao-select
                  v-model="secretType">
                  <dao-option
                    v-for="option in secretTypes"
                    :key="option.value"
                    :value="option.value"
                    :label="option.value">
                  </dao-option>
                </dao-select>
              </template>
            </dao-setting-item>
          </dao-setting-section>
        </dao-setting-layout>

        <labels-table
          :data="data"
          :dialog-title="CONFIG_TITLE_TYPE.DATA"
          :is-secret="true"
          @edit="editData">
        </labels-table>

        <labels-table
          :data="labels"
          :dialog-title="CONFIG_TITLE_TYPE.LABEL"
          @edit="editLabel">
        </labels-table>

        <labels-table
          :data="annotations"
          :dialog-title="CONFIG_TITLE_TYPE.ANNOTATIONS"
          @edit="editAnnotations">
        </labels-table>
      </div>

      <!--确认订购-->
      <overview-panel
        v-show="STEPS.OVERVIEW === stepIndex"
        :org="localOrg"
        :space="localSpace"
        :zone="localZone"
        :config-name="secretName"
        :purchasing="loadings.purchasing"
        @prev="prev(STEPS.OVERVIEW)"
        @next="purchase">
      </overview-panel>

      <!-- 成功 -->
      <finish-panel
        v-show="STEPS.FINISH === stepIndex"
        :resource-name="secretName"
        :instance="instance"
        :error="instanceError"
        :configType="type"
        @prev="prev(STEPS.FINISH)">
      </finish-panel>
    </div>

    <checkout-footer-panel
      :steps="STEPS"
      :step-index="stepIndex"
      :purchase-status="loadings.purchasing"
      :valid="valid"
      @prev="prev"
      @next="next"
      @purchase="purchase">
    </checkout-footer-panel>
  </div>
</template>

<script src="./deploy.js"></script>

<style lang="scss">
@import "./deploy.scss";
</style>
