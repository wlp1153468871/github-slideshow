<template>
  <div class="appstore" v-if="$can('platform.settings.assets')">
    <dao-setting-layout>
      <div slot="layout-title">
        应用商店介绍
      </div>
      <div slot="layout-title-helper">您可以在这里修改产品的名称以及页脚等文案的内容</div>
      <dao-setting-section>
        <div slot="label">服务市场介绍</div>
        <!-- <div slot="content">
          <dao-input
            icon-inside
            v-model="productInfo"
            type="text"
            placeholder="例: 我的容器平台"
            name="name"
            :message="veeErrors.first('name')"
            :status="veeErrors.has('name') ? 'error' : ''"
            v-validate="'max:25'"
            data-vv-as="产品名称"
          >
          </dao-input>
          <button class="dao-btn blue" :disabled="!isValidForm" @click="updateProduceName">
            <span class="text">保存</span>
          </button>
        </div> -->
        <div slot="content-helper">将 "DSP" 替换成 "我的DSP"</div>
      </dao-setting-section>
    </dao-setting-layout>
  </div>
</template>

<script>
export default {
  name: 'AppStoreSetting',
};
</script>

<style lang="scss">

</style>
