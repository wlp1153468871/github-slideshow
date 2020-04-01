<template>
  <nav class="g-nav" :class="{ invisible: isFullscreened }">
    <div class="nav-left-container">
      <router-link :to="{ name: 'home' }" class="logo-box">
        <logo-container></logo-container>
      </router-link>
    </div>
    <div class="nav-right-container">
      <template v-if="!zoneUnauthorized">
        <div
          v-if="isConsoleView"
          class="horizontal-menu"
          @mouseenter="showDropdown"
          @mouseleave="hideDropdown">
          <div class="common-topbar-nav">
            <ul
              v-if="headerMenus.length"
              class="common-topbar-nav-list">
              <li
                :class="{ 'nav-active': index === selectedIndex }"
                @mouseenter="replaceTriangle($event, index)"
                v-for="(li, index) in headerMenus"
                :key="index">
                {{li.name}}
              </li>
            </ul>
          </div>
          <div
            class="common-topbar-dropdown"
            :class="{ expand }"
            :style="{ height: dropdownHeight + 'px' }">
            <div class="triangle" :style="{ left: triangleLeft + 'px' }"></div>
            <div
              class="common-topbar-dropdown-inner"
              v-if="headerMenus.length && selectedIndex !== -1">
              <div class="block-left">
                <ul class="block-left-ul">
                  <li
                    :class="{ 'li-active': selectedSubIndex === index }"
                    @mouseenter="onMouserEnterSubMenu(index)"
                    v-for="(subCategory, index) in headerMenus[selectedIndex].children"
                    :key="index">
                    <div class="block-left-li-content">{{ subCategory.name | translate }}</div>
                  </li>
                </ul>
              </div>
              <div class="block-right" ref="blockRight">
                <template
                  v-for="(item, index) in selectedServices">
                  <div
                    v-if="item.available === 'available'"
                    class="panel-operation"
                    :key="'service' + index">
                    <h3 class="service-title">{{ item.name | translate }}</h3>
                    <p class="service-description">
                      {{ item.description }}
                    </p>

                    <template v-if="item.isDefault">
                      <div class="operation-line">
                        <router-link
                          v-if="$can('create')"
                          class="operation-link"
                          :to="item.deployRoute"
                          @click.native="expand = false">
                          创建{{ item.name | translate  }}
                        </router-link>
                        <p class="operation-link disabled" v-else>创建{{ item.name | translate }}</p>
                        <p>{{ item.createMessage }}</p>
                      </div>

                      <div class="operation-line">
                        <router-link
                          class="operation-link"
                          :to="item.route"
                          @click.native="expand = false">查看{{ item.name | translate  }}列表
                        </router-link>
                        <p>查看已经创建的{{ item.name | translate }}的列表</p>
                      </div>
                    </template>

                    <template v-else>
                      <div class="operation-line">
                        <router-link
                          v-if="$can('create')"
                          class="operation-link"
                          @click.native="expand = false"
                          :to="item.deployRoute">
                          创建{{ item.name }}
                        </router-link>
                        <p class="operation-link disabled" v-else>创建{{ item.name }}</p>
                        <p>创建一个{{ item.name}}的实例</p>
                      </div>

                      <div class="operation-line">
                        <router-link
                          class="operation-link"
                          :to="item.route"
                          @click.native="expand = false">查看{{ item.name }}列表
                        </router-link>
                        <p>查看已经创建的{{item.name}}的实例列表</p>
                      </div>
                    </template>

                    <div class="operation-line" v-if="item.help_url">
                      <a
                        :href="item.help_url"
                        target="_blank">查看帮助信息</a>
                    </div>

                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
        <div class="global-search" v-if="isConsoleView">
          <el-select
            style="width: 100%;"
            ref="globalSearch"
            popper-class="select-global-search"
            filterable
            clearable
            v-model="searchKeyword"
            remote
            placeholder="请输入关键字"
            size="small"
            :remote-method="remoteMethod"
            :loading="loading"
            @change="onValueChanged">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
            <el-option-group
              v-for="group in options"
              :key="group.label"
              :label="group.label">
              <span class="group-length">{{group.options.length}}个结果</span>
              <el-option
                v-for="(item, index) in group.options"
                :key="index"
                :label="item.name"
                :value="item.id">
                <span
                  :class="{ 'instance-name': group.overflowHidden }"
                  class="text-overflow-ellipsis">
                  <template v-if="group.showType">
                    <el-tooltip
                      :open-delay="300"
                      :content="item.service.service_type | translate"
                      placement="top-start">
                      <span>{{ item.name }}</span>
                    </el-tooltip>
                  </template>
                  <template v-else>
                    {{ item.name }}
                  </template>
                </span>
                <span
                  class="instance-create-time"
                  v-if="group.label === '实例'">
                  {{item.created_at | unix_date('YYYY-MM-DD')}}
                </span>
              </el-option>
            </el-option-group>
          </el-select>
        </div>
      </template>
      <div
        class="goto-new-tab"
        v-if="$can('platform.manage', 'platform')">
        <router-link
          v-if="!isConsoleView"
          :to="{ name: 'console' }">
          <span>退出管理员视图</span>
        </router-link>
        <router-link
          v-else
          :to="{ name: 'manage' }">
          <span>进入管理员视图</span>
        </router-link>
      </div>
      <div class="user-operation">
        <dao-dropdown
          trigger="click"
          :append-to-body="false"
          placement="bottom-end">
          <div class="user-profile">
            <div class="info">
              <span class="name">{{ user.username }}</span>
            </div>
            <svg class="icon">
              <use xlink:href="#icon_caret-down"></use>
            </svg>
          </div>
          <dao-dropdown-menu slot="list">
            <dao-dropdown-item @click="gotoDashboard" v-if="isDisplayAppSelect">
              <svg>
                <use xlink:href="#icon_app-home"></use>
              </svg>
              <span class="text">应用管理</span>
            </dao-dropdown-item>
            <dao-dropdown-item @click="gotoOrg" v-if="$can('organization.manage', 'organization')">
              <svg class="icon">
                <use xlink:href="#icon_city"></use>
              </svg>
              <span class="text">组织管理</span>
            </dao-dropdown-item>
            <dao-dropdown-item @click="gotoProfile">
              <svg>
                <use xlink:href="#icon_user"></use>
              </svg>
              <span class="text">个人中心</span>
            </dao-dropdown-item>
            <dao-dropdown-item @click="onLogout">
              <svg>
                <use xlink:href="#icon_log-out"></use>
              </svg>
              <span class="text">登出</span>
            </dao-dropdown-item>
          </dao-dropdown-menu>
        </dao-dropdown>
      </div>
    </div>
  </nav>
</template>

<script src="./_global-nav-bar.js">
</script>

<style src="./_global-nav-bar.scss" lang="scss">
</style>
