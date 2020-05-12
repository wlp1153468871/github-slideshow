<template>
  <dao-setting-layout>
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">同步可用区</div>
        <div slot="content">
          <p class="delete-notice">
            同步可用区需要谨慎操作，这是一个不可逆的操作。
          </p>
          <button
            v-if="$can('platform.zone.sync')"
            @click="$emit('syncService', 'catalog')"
            class="dao-btn blue"
          >
            同步
          </button>
        </div>
      </dao-setting-item>
    </dao-setting-section>
  </dao-setting-layout>
</template>

<script>
export default {
  name: 'SeniorPanel',
};
</script>
