<template>
  <div class="dao-nav-menu" :class="{ collapsed: isCollapse }">
    <div class="menus">
      <el-menu
        class="side-bar-menu"
        background-color="#373B41"
        text-color="#e4e7ed"
        :default-active="defaultActiveMenu"
        :router="true"
        :collapse="isCollapse"
        :default-openeds="defaultOpeneds">
        <el-submenu index="account-permissions">
          <template slot="title">
            <i class="el-icon-document"></i>
            <span slot="title">账号与管理</span>
          </template>
          <el-menu-item
            background-color="#545c64"
            index="manage.org.list"
            :route="{ name: 'manage.org.list' }">
            <svg class="icon">
              <use xlink:href="#icon_users"></use>
            </svg>
            <span>租户管理</span>
          </el-menu-item>
          <el-menu-item
            index="manage.user.list"
            :route="{ name: 'manage.user.list' }">
            <svg class="icon">
              <use xlink:href="#icon_user"></use>
            </svg>
            <span>用户管理</span>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="global-setting">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span slot="title">全局设置</span>
          </template>
          <el-menu-item
            index="manage.service.list"
            :route="{ name: 'manage.service.list' }">
            <svg class="icon">
              <use xlink:href="#icon_stack-alt"></use>
            </svg>
            <span>服务管理</span>
          </el-menu-item>
          <el-menu-item
            index="manage.zone.list"
            :route="{ name: 'manage.zone.list' }">
            <svg class="icon">
              <use xlink:href="#icon_globe-alt"></use>
            </svg>
            <span>可用区设置</span>
          </el-menu-item>
          <el-menu-item
            background-color="#545c64"
            index="manage.quota.list"
            :route="{ name: 'manage.quota.list' }">
            <svg class="icon">
              <use xlink:href="#icon_quota-field"></use>
            </svg>
            <span>配额字段</span>
          </el-menu-item>
          <el-submenu index="quota-setting">
            <template slot="title">
              <svg class="icon">
                <use xlink:href="#icon_quota"></use>
              </svg>
              <span slot="title">配额组设置</span>
            </template>
            <el-menu-item
              index="manage.quota.group"
              :route="{ name: 'manage.quota.group' }">
              <span>租户配额组</span>
            </el-menu-item>
            <el-menu-item
              index="manage.quota.org-group"
              :route="{ name: 'manage.quota.org-group' }">
              <span>项目配额组</span>
            </el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-menu-item
          index="manage.preference.home"
          :route="{ name: 'manage.preference.home' }">
          <i class="el-icon-setting"></i>
          <span slot="title">设置</span>
        </el-menu-item>
      </el-menu>
    </div>

    <div
      class="collapse-btn"
      @click="toggleSideBar">
      <i class="el-icon-d-arrow-left"></i>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import * as types from '../../../core/store/mutation-types';

export default {
  name: 'ManageSideBar',

  data() {
    return {
      defaultOpeneds: ['account-permissions', 'global-setting'],
      selectedOptions: [],
    };
  },

  created() {
    this.updateMenu();
  },

  computed: {
    ...mapState(['isCollapse', 'defaultActiveMenu']),
  },

  watch: {
    $route() {
      this.updateMenu();
    },
  },

  methods: {
    updateMenu() {
      const routes = this.$route.matched.concat();
      this.defaultActive = routes.pop().name;
    },

    toggleSideBar() {
      this.$store.commit(types.IS_COLLAPSE, !this.isCollapse);
    },
  },
};
</script>
