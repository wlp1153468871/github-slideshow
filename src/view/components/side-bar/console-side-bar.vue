<template>
  <div class="dao-nav-menu">
    <div class="menus">
      <div class="section-space">
        <template v-if="orgs.length">
          <el-tooltip :content="orgSpaceValue" placement="right">
            <el-cascader
              :options="orgWithSpaceSepereatedBySlash"
              :props="props"
              :empty="'暂无项目组'"
              filterable
              class="org-space-cascader"
              v-model="selectedOptions"
              popper-class="space-menu-popper"
              @change="onSelectOrg"
            >
            </el-cascader>
          </el-tooltip>
        </template>
        <template v-else>
          <el-tooltip placement="right" content="暂无项目组">
            <p class="empty-message">暂无项目组</p>
          </el-tooltip>
        </template>
      </div>

      <div class="section-zone" v-if="isShowZoneSelect">
        <el-tooltip :content="zone.name ? zone.name : '暂无可用区'" placement="right">
          <zone-select v-if="zones.length"></zone-select>
          <template v-else>
            <p class="empty-message">暂无可用区</p>
          </template>
        </el-tooltip>
      </div>

      <!-- 新菜单 -->
      <el-menu
        ref="bottomMenu"
        class="side-bar-menu"
        background-color="#373B41"
        text-color="#e4e7ed"
        :default-active="defaultActiveMenu"
        :router="true"
        :collapse="isCollapse"
      >
        <template v-for="(item, index) in allMenus">
          <template v-if="item.children">
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
              <!-- 资源 子菜单 -->
              <template v-for="resource in apiResource">
                <el-menu-item
                  v-if="item.meta.code === 'resource' && !hiddenMenu({ meta: resource.kind })"
                  :key="resource.name"
                  :index="resource.route.name"
                  :route="resource.route"
                >
                  <svg class="icon">
                    <use :xlink:href="resource.icon"></use>
                  </svg>
                  <overflow-tooltip slot="title" :text="resource.kind"> </overflow-tooltip>
                </el-menu-item>
              </template>
              <!-- <template v-for="menu in apiResource">
                <el-menu-item
                  v-if="item.meta.code === 'resource'"
                  :key="menu.id"
                  :index="compileIndex(menu)"
                  :route="menu.route"
                >
                  <service-logo :src="menu.logo_url" size="small"></service-logo>
                  <el-tooltip
                    popper-class="service-name-tooltip"
                    slot="title"
                    :content="menu.name"
                    placement="right"
                  >
                    <span class="service-menu-name text-overflow-ellipsis">{{ menu.name }}</span>
                  </el-tooltip>
                </el-menu-item>
              </template> -->
              <!-- 这里是服务子菜单 -->
              <template v-for="menu in services">
                <el-menu-item
                  v-if="item.meta.code === 'serviceBroker'"
                  :key="menu.id"
                  :index="compileIndex(menu)"
                  :route="menu.route"
                >
                  <service-logo :src="menu.logo_url" size="small"></service-logo>
                  <el-tooltip
                    popper-class="service-name-tooltip"
                    slot="title"
                    :content="menu.name"
                    placement="right"
                  >
                    <span class="service-menu-name text-overflow-ellipsis">{{ menu.name }}</span>
                  </el-tooltip>
                </el-menu-item>
              </template>

              <el-menu-item v-if="item.meta.code === 'serviceBroker' && services.length === 0">
                <span class="service-menu-name text-overflow-ellipsis">无服务</span>
              </el-menu-item>
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
import { mapState, mapGetters } from 'vuex';
import { find } from 'lodash';
import * as types from '@/core/store/mutation-types';
import allMenus from '@/view/router/console.js';
import hasPermission from '@/core/utils/hasPermission';
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

  data() {
    return {
      allMenus,
      props: {
        value: 'id',
        label: 'name',
      },
      defaultOpeneds: ['service'],
      selectedOptions: [],
      cascaderIdMap: {},
      // menu: {
      //   type: Array,
      //   default: () => [],
      // },
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
    ...mapGetters(['pages']),

    isShowZoneSelect() {
      // 只要加入项目就可以切换可用区
      return this.pages.some(m => m === 'space-root');
    },

    orgSpaceValue() {
      return `${this.org.name} / ${this.space.name}`;
    },
    /**
     * 会把带有 / 的 space name 分割成多个space
     * 比如 dsp/dev, dsp/test,
     * 会成为
     *
     * dsp: {
     *    id: 'dsp',
     *    name: 'dsp',
     *    children: [
     *      {
     *        name: 'dev',
     *        id: '1232131vdssafsfd',
     *      },
     *      {
     *        name: 'test',
     *        id: 'opuoijka2123',
     *      }
     *    ],
     * }
     *
     * 类似的结构。
     * 同时在比较 space id 时，如果和当前 store.space 的id一致，会更新
     * selectedOptions 为对应的 cascader 的 model id。
     */
    orgWithSpaceSepereatedBySlash() {
      const res = [];
      for (let i = 0; i < this.orgs.length; i += 1) {
        const org = this.orgs[i];
        const newOrg = {
          name: org.name,
          id: org.id,
          children: [],
        };
        for (let j = 0; j < org.children.length; j += 1) {
          const space = org.children[j];
          if (space.name.indexOf('/') === -1) {
            if (space.id === this.space.id) {
              // eslint-disable-next-line vue/no-side-effects-in-computed-properties
              this.selectedOptions = [org.id, space.id];
            }
            newOrg.children.push({
              id: space.id,
              name: space.name,
            });
          } else {
            // 分割 /，组成 cascader 的options
            let curChildren = newOrg.children;
            const ids = [org.id];
            const spaceNames = space.name.split('/');
            for (let k = 0; k < spaceNames.length; k += 1) {
              const name = spaceNames[k];
              let nameObj = find(curChildren, { name });
              if (nameObj) {
                curChildren = nameObj.children;
                ids.push(nameObj.id);
              } else {
                if (k === spaceNames.length - 1) {
                  nameObj = {
                    id: space.id,
                    name,
                  };
                  ids.push(nameObj.id);
                } else {
                  nameObj = { id: name, name, children: [] };
                  ids.push(nameObj.id);
                }
                curChildren.push(nameObj);
                curChildren = nameObj.children;
              }
            }
            if (space.id === this.space.id) {
              // eslint-disable-next-line vue/no-side-effects-in-computed-properties
              this.selectedOptions = ids;
            }
          }
        }
        res.push(newOrg);
      }
      return res;
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

    onSelectOrg(ids) {
      const orgId = ids[0];
      const spaceId = ids[ids.length - 1];
      const org = find(this.orgs, { id: orgId });
      const space = find(org.children, { id: spaceId });
      if (!org || !space) {
        return;
      }
      this.selectedOptions = ids;
      this.$store.dispatch('switchOrg', { org, space });
      this.$tada(`切换到 ${org.name} 租户下的 ${space.name} 项目组`, {
        buttons: false,
        timer: 2000,
      });
    },

    hiddenMenu(menu) {
      return (menu.meta && menu.meta.hidden) || !hasPermission(menu);
    },
  },
};
</script>

<style lang="scss">
// compatiable with chrome version: 49.0.**
.space-menu-popper {
  .el-icon-check,
  .el-icon-arrow-right {
    top: 50%;
    transform: translate(0, -7px);
  }
}
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
