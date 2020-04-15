<template>
  <catalog-panel
    v-if="$can('platform.settings.assets', 'platform.settings')"
    v-show="content === TABS.CATALOG"
    :services="services"
  >
  </catalog-panel>
</template>

<script src="./home.js"></script>
