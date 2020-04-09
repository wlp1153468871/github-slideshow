<template>
  <div class="dao-nav-menu" :class="{ collapsed: isCollapse }">
    <div class="menus">
      <div class="sidebar-header">
        <a class="sidebar-header-return" @click="$router.go(-1)">
          <svg class="icon">
            <use xlink:href="#icon_caret-left"></use>
          </svg>
          <span>返回</span>
        </a>
      </div>

      <el-menu
        ref="topMenu"
        class="side-bar-menu"
        background-color="#373B41"
        text-color="#e4e7ed"
        :default-active="defaultActiveMenu"
        :default-openeds="defaultOpens"
        :router="true"
        :collapse="isCollapse"
      >
        <el-submenu index="account">
          <template slot="title">
            <svg class="icon">
              <use xlink:href="#icon_user"></use>
            </svg>
            <span slot="title">账号管理</span>
          </template>
          <el-menu-item index="profile.self" :route="{ name: 'profile.self' }">
            <template slot="title">个人中心</template>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </div>

    <div class="collapse-btn" @click="toggleSideBar">
      <i class="el-icon-d-arrow-left"></i>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import SideBarSection from './side-bar-section';
import SideBarLogo from './side-bar-logo';
import * as types from '../../../core/store/mutation-types';

export default {
  name: 'ProfileSideBar',

  props: {
    sections: { type: Array, default: () => [] },
    section: { type: Object, default: () => ({}) },
  },

  computed: {
    ...mapState(['isCollapse', 'defaultActiveMenu']),
  },

  components: {
    SideBarSection,
    SideBarLogo,
  },

  data() {
    return {
      sectionId: this.section.id,
      defaultOpens: ['account'],
    };
  },

  watch: {
    section: {
      immediate: true,
      handler(section) {
        this.sectionId = section.id;
      },
    },
  },

  methods: {
    toggleSideBar() {
      this.$store.commit(types.IS_COLLAPSE, !this.isCollapse);
    },
  },
};
</script>

<style lang="scss">
.sidebar-header {
  .sidebar-header-return {
    display: inline-block;
    width: 100%;
    height: 32px;
    padding-left: 10px;
    color: #e4e7ed;
    line-height: 32px;
    box-shadow: inset 0 -1px 0 0 #3d444f;
    border-radius: 0;
  }
}
</style>
