<template>
  <div class="page-registry">
    <resource-header :resource="resource"></resource-header>

    <el-tabs v-model="tab">
      <el-tab-pane
        label="镜像列表"
        name="镜像列表"
        :lazy="true">
        <tab-list></tab-list>
      </el-tab-pane>
      <el-tab-pane
        v-if="isSpaceAdmin || isOrganizationAdmin"
        label="镜像仓库信息"
        name="镜像仓库信息"
        :lazy="true">
      <passwd></passwd>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import tabList from './tabs/list.vue';
import passwd from './tabs/passwd.vue';

export default {
  name: 'Registry',

  components: {
    tabList,
    passwd,
  },

  data() {
    return {
      resource: {
        logo: '#icon_image-logo',
        links: [
          {
            text: '镜像中心',
          },
        ],
      },
      tab: '镜像列表',
    };
  },

  computed: {
    ...mapGetters(['isSpaceAdmin', 'isOrganizationAdmin']),
  },
};
</script>

<style src="./_registry.scss" lang="scss">
</style>
