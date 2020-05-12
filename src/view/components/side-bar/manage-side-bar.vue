<template>
  <div class="dao-nav-menu" :class="{ collapsed: isCollapse }">
    <div class="menus">
      <el-menu
        v-if="false"
        class="side-bar-menu"
        background-color="#373B41"
        router
        text-color="#e4e7ed"
        :default-active="defaultActiveMenu"
        :collapse="isCollapse"
        :default-openeds="defaultOpeneds"
      >
        <el-submenu index="account-permissions">
          <template slot="title">
            <i class="el-icon-document"></i>
            <span slot="title">账号与管理</span>
          </template>
          <el-menu-item index="manage.org.list" :route="{ name: 'manage.org.list' }">
            <svg class="icon">
              <use xlink:href="#icon_users"></use>
            </svg>
            <span>租户管理</span>
          </el-menu-item>
          <el-menu-item index="manage.user.list" :route="{ name: 'manage.user.list' }">
            <svg class="icon">
              <use xlink:href="#icon_user"></use>
            </svg>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item
            index="manage.auth.roles"
            :route="{ name: 'manage.auth.roles', params: { scope: 'platform' } }"
          >
            <svg class="icon">
              <use xlink:href="#icon_users"></use>
            </svg>
            <span>权限角色</span>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="global-setting">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span slot="title">全局设置</span>
          </template>
          <el-menu-item index="manage.service.list" :route="{ name: 'manage.service.list' }">
            <svg class="icon">
              <use xlink:href="#icon_stack-alt"></use>
            </svg>
            <span>服务管理</span>
          </el-menu-item>
          <el-menu-item index="manage.zone.list" :route="{ name: 'manage.zone.list' }">
            <svg class="icon">
              <use xlink:href="#icon_globe-alt"></use>
            </svg>
            <span>可用区设置</span>
          </el-menu-item>
          <el-menu-item
            index="manage.alarm-metrics.list"
            :route="{ name: 'manage.alarm-metrics.list' }"
          >
            <svg class="icon">
              <use xlink:href="#icon_bell"></use>
            </svg>
            <span>告警指标</span>
          </el-menu-item>
        </el-submenu>
        <el-menu-item index="manage.preference" :route="{ path: 'manage.preference' }">
          <i class="el-icon-setting"></i>
          <span slot="title">设置</span>
        </el-menu-item>
      </el-menu>

      <el-menu
        class="side-bar-menu"
        background-color="#373B41"
        router
        text-color="#e4e7ed"
        :default-active="defaultActiveMenu"
        :collapse="isCollapse"
        :default-openeds="defaultOpeneds"
      >
        <template v-for="(item, index) in menus">
          <template v-if="item.meta.type === 'submenu'">
            <el-submenu :index="item.name" v-if="!hiddenMenu(item)" :key="index">
              <template slot="title">
                <svg class="icon">
                  <use :xlink:href="item.meta.icon"></use>
                </svg>
                <span>{{ item.meta.title }}</span>
              </template>
              <template v-for="(menuItem, index) in item.children">
                <el-menu-item
                  :key="index"
                  :route="{ name: menuItem.name }"
                  :index="menuItem.name"
                  v-if="!hiddenMenu(menuItem)"
                >
                  <svg class="icon">
                    <use :xlink:href="menuItem.meta.icon"></use>
                  </svg>
                  <span>
                    <overflow-tooltip slot="title" :text="menuItem.meta.title"> </overflow-tooltip>
                  </span>
                </el-menu-item>
              </template>
            </el-submenu>
          </template>
          <template v-else>
            <el-menu-item
              :key="index"
              v-if="!hiddenMenu(item)"
              :route="{ name: item.name }"
              :index="item.name"
            >
              <svg class="icon">
                <use :xlink:href="item.meta.icon"></use>
              </svg>
              <span slot="title">{{ item.meta.title }}</span>
            </el-menu-item>
          </template>
        </template>
      </el-menu>
    </div>

    <div class="collapse-btn" @click="toggleSideBar">
      <i class="el-icon-d-arrow-left"></i>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import menus from '@/view/router/manage.js';
import hasPermission from '@/core/utils/hasPermission';

import * as types from '../../../core/store/mutation-types';

export default {
  name: 'ManageSideBar',

  data() {
    return {
      menus,
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

    hiddenMenu(menu) {
      return (menu.meta && menu.meta.hidden) || !hasPermission(menu);
    },
  },
};
</script>
