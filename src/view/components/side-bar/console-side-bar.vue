<template>
  <div class="dao-nav-menu">
    <div class="menus">
      <div class="section-space">
        <template v-if="orgs.length">
          <el-tooltip
            :content="orgSpaceValue"
            placement="right">
            <el-cascader
              :options="orgs"
              :props="props"
              class="org-space-cascader"
              v-model="selectedOptions"
              @change="onSelectOrg">
            </el-cascader>
          </el-tooltip>
        </template>
        <template v-else>
          <el-tooltip placement="right" content="暂无项目组">
            <p class="empty-message">暂无项目组</p>
          </el-tooltip>
        </template>
      </div>

      <el-menu
        ref="topMenu"
        class="side-bar-menu"
        background-color="#373B41"
        text-color="#e4e7ed"
        :default-active="defaultActiveMenu"
        :router="true"
        :collapse="isCollapse"
        @select="onTopMenuSelect">
        <el-menu-item
          style="border-bottom: 1px solid #3c434b;"
          index="console.dashboard"
          :route="{ name: 'console.dashboard' }">
          <i class="el-icon-menu"></i>
          <span slot="title">总览</span>
        </el-menu-item>
      </el-menu>

      <div class="section-zone">
        <el-tooltip
          :content="zone.name ? zone.name : '暂无可用区'"
          placement="right">
          <zone-select v-if="zones.length"></zone-select>
          <template v-else>
            <p class="empty-message">暂无可用区</p>
          </template>
        </el-tooltip>
      </div>

      <el-menu
        ref="bottomMenu"
        class="side-bar-menu"
        background-color="#373B41"
        text-color="#e4e7ed"
        :default-active="defaultActiveMenu"
        :default-openeds="defaultOpeneds"
        :router="true"
        :collapse="isCollapse"
        @select="onBottomMenuSelect">

        <el-submenu index="operators">
          <template slot="title">
            <svg class="icon">
              <use xlink:href="#icon_opreators"></use>
            </svg>
            <span slot="title">Operators</span>
          </template>
          <el-menu-item
            index="console.operator-hub"
            :route="{ name: 'console.operator-hub' }">
            <svg class="icon">
              <use xlink:href="#icon_operator-hub"></use>
            </svg>
            <span>Operator Hub</span>
          </el-menu-item>
        </el-submenu>

        <template v-if="isPlatformAdmin || !zoneUnauthorized">

          <el-menu-item
            index="console.applications.list"
            :route="{ name: 'console.applications.list' }">
            <svg class="icon">
              <use xlink:href="#icon_application"></use>
            </svg>
            <span slot="title">应用</span>
          </el-menu-item>

          <el-submenu
            index="resource">
            <template slot="title">
              <svg class="icon">
                <use xlink:href="#icon_resource"></use>
              </svg>
              <span slot="title">资源对象</span>
            </template>
            <template v-for="resource in apiResource">
              <el-menu-item
                v-if="$can('read', resource.name)"
                :key="resource.name"
                :index="resource.route.name"
                :route="resource.route">
                <svg class="icon">
                  <use :xlink:href="resource.icon"></use>
                </svg>
                <overflow-tooltip
                  slot="title"
                  :text="resource.kind"
                >
                </overflow-tooltip>
              </el-menu-item>
            </template>

          </el-submenu>

          <el-menu-item
            index="console.registry"
            :route="{ name: 'console.registry' }">
            <svg class="icon">
              <use xlink:href="#icon_docker-image"></use>
            </svg>
            <span slot="title">镜像中心</span>
          </el-menu-item>

          <el-submenu index="service">
            <template slot="title">
              <svg class="icon">
                <use xlink:href="#icon_service-category"></use>
              </svg>
              <span slot="title">服务目录</span>
            </template>
            <el-menu-item
              v-for="menu in services"
              :key="menu.id"
              :index="compileIndex(menu)"
              :route="menu.route">
              <service-logo :src="menu.logo_url" size="small"></service-logo>
              <el-tooltip
                popper-class="service-name-tooltip"
                slot="title"
                :content="menu.name"
                placement="right">
                <span class="service-menu-name text-overflow-ellipsis">{{menu.name}}</span>
              </el-tooltip>
            </el-menu-item>
          </el-submenu>

          <el-menu-item
            index="console.monitor"
            :route="{ name: 'console.monitor' }">
            <svg class="icon">
              <use xlink:href="#icon_monitor"></use>
            </svg>
            <span slot="title">监控中心</span>
          </el-menu-item>

        </template>

        <el-submenu index="management">
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span slot="title">管理</span>
          </template>
          <el-menu-item
            v-if="isOrganizationAdmin || isSpaceAdmin"
            index="console.user.list"
            :route="{ name: 'console.user.list' }">
            <svg class="icon">
              <use xlink:href="#icon_user"></use>
            </svg>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item
            index="console.quota.used"
            :route="{ name: 'console.quota.used' }">
            <svg class="icon">
              <use xlink:href="#icon_quota"></use>
            </svg>
            <span>配额管理</span>
          </el-menu-item>
          <el-submenu index="approve-log" popper-append-to-body>
          <span slot="title">
            <svg class="icon">
              <use xlink:href="#icon_audit"></use>
            </svg>
            <span>
              审批日志
            </span>
          </span>
            <el-menu-item
              index="console.approval.list"
              :route="{ name: 'console.approval.list' }">
              <span slot="title">审批请求</span>
            </el-menu-item>
            <el-menu-item
              index="console.approval.history"
              :route="{ name: 'console.approval.history' }">
              <span slot="title">审批记录</span>
            </el-menu-item>
            <el-menu-item
              v-if="isSpaceAdmin"
              index="console.approval.setting"
              :route="{ name: 'console.approval.setting' }">
              <span slot="title">审批设置</span>
            </el-menu-item>
          </el-submenu>
        </el-submenu>

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
import { mapState, mapGetters } from 'vuex';
import { find } from 'lodash';
import * as types from '@/core/store/mutation-types';
import SideBarSection from './side-bar-section';
import SideBarLogo from './side-bar-logo';
import ZoneSelect from './zone-select';
import OverflowTooltip from './overflow-tooltip';

export default {
  name: 'ConsoleSideBar',

  components: {
    SideBarSection,
    SideBarLogo,
    ZoneSelect,
    OverflowTooltip,
  },

  updated() {
    if (this.$route.name === 'console.dashboard') {
      this.$refs.bottomMenu.activeIndex = '';
    } else {
      this.$refs.topMenu.activeIndex = '';
    }
  },

  data() {
    return {
      props: {
        value: 'id',
        label: 'name',
      },
      defaultOpeneds: ['service'],
      selectedOptions: [],
    };
  },

  computed: {
    ...mapState([
      'orgs',
      'space',
      'org',
      'zone',
      'zones',
      'services',
      'isCollapse',
      'defaultActiveMenu',
      'apiResource',
    ]),

    ...mapGetters([
      'zoneUnauthorized',
      'isPlatformAdmin',
      'isOrganizationAdmin',
      'isSpaceAdmin',
    ]),

    orgSpaceValue() {
      return `${this.org.name} / ${this.space.name}`;
    },
  },

  watch: {
    org: {
      immediate: true,
      handler(val) {
        this.selectedOptions = [val.id, this.selectedOptions[1]];
      },
    },

    space: {
      immediate: true,
      handler(val) {
        this.selectedOptions = [this.selectedOptions[0], val.id];
      },
    },
  },

  methods: {
    compileIndex(menu) {
      const { services } = menu;
      if (services) {
        const {
          services: [{ service_type }],
        } = menu;
        if (service_type === '') {
          return `${menu.route.name}/${menu.route.params.serviceId}`;
        }
        return menu.route.name;
      }
      return menu;
    },

    toggleSideBar() {
      this.$store.commit(types.IS_COLLAPSE, !this.isCollapse);
    },

    onSelectOrg([orgId, spaceId]) {
      const org = find(this.orgs, { id: orgId });
      const space = find(org.children, { id: spaceId });
      this.onTopMenuSelect();
      this.$store.dispatch('switchOrg', { org, space });
      this.$tada(`切换到 ${org.name} 租户下的 ${space.name} 项目组`, {
        buttons: false,
        timer: 2000,
      });
    },

    onTopMenuSelect() {
      this.$refs.bottomMenu.activeIndex = '';
    },

    onBottomMenuSelect() {
      this.$refs.topMenu.activeIndex = '';
    },
  },

  mounted() {
    this.$watch(
      () => {
        return this.$refs.bottomMenu.openedMenus;
      },
      val => {
        this.$store.commit(types.UPDATE_OPENED_MENUS, [...val]);
      },
    );
  },
};
</script>

<style lang="scss">
.dao-nav-menu {
  .section-space,
  .section-zone {
    border-bottom: 1px solid #3c434b;
    background: #373b41;

    .el-input__inner {
      background: transparent;
      border: none;
    }

    .el-cascader__label {
      color: #e4e7ed;

      span {
        color: #e4e7ed;
      }
    }
  }

  .service-menu-name {
    display: inline-block;
    width: 100%;
  }

  .empty-message {
    white-space: nowrap;
    color: #e4e7ed;
    padding: 0 25px 0 15px;
    line-height: 40px;
    text-align: center;
  }
}
</style>
