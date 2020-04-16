<template>
  <div>
    <div class="layout-content-header">
      用户管理
    </div>
    <div class="dao-view-main">
      <div class="dao-view-content">
        <!-- 用户列表 -->
        <x-table
          :showRefresh="$can('platform.user.get', 'platform.user')"
          :loading="loadings.users"
          :data="rows"
          @refresh="loadUsers"
          :filter-method="filterMethod"
          style="width: 100%;"
        >
          <template #operation>
            <button
              class="dao-btn has-icon blue"
              v-if="$can('platform.user.create', 'platform.user')"
              @click="openCreateUserDialog()"
            >
              <svg class="icon">
                <use xlink:href="#icon_plus-circled"></use>
              </svg>
              <span class="text">创建用户</span>
            </button>
          </template>
          <el-table-column prop="name" sortable label="用户名">
            <template slot-scope="{ row: user }">
              {{ user.username }}
            </template>
          </el-table-column>
          <el-table-column prop="email" label="邮箱" sortable>
            <template slot-scope="{ row: user }">
              {{ user.email }}
            </template>
          </el-table-column>
          <el-table-column prop="phone_number" label="手机号码">
            <template slot-scope="{ row: user }">
              {{ user.phone_number | otherwise }}
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="platform_role"
            sortable
            label="权限"
          >
            <template slot-scope="{ row: user }" prop="platform_role">
              {{ user.platform_role | platform_role}}
            </template>
          </el-table-column> -->
          <el-table-column prop="platform_role" sortable label="权限">
            <template slot-scope="{ row: user }">
              {{ user.roles | roleFormat }}
            </template>
          </el-table-column>
          <el-table-column prop="user.registry_location" sortable label="用户类型">
            <template slot-scope="{ row: user }">
              {{ user.registry_location === 'local' ? '本地用户' : 'SSO' }}
            </template>
          </el-table-column>
          <el-table-column sortable label="状态">
            <template slot-scope="{ row: user }">
              <x-table-status :row="user" :other="other" :text="isFrozen(user.is_frozen)">
              </x-table-status>
            </template>
          </el-table-column>
          <el-table-column
            v-if="
              $can('platform.user.update', 'platform.user') ||
                $can('platform.user.freeze', 'platform.user')
            "
            fixed="right"
            label=""
            align="center"
            header-align="center"
            width="80"
          >
            <template slot-scope="{ row: user }">
              <el-dropdown trigger="click">
                <span>
                  <svg class="icon dropdown-trigger">
                    <use xlink:href="#icon_more"></use>
                  </svg>
                </span>

                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="$can('platform.user.update', 'platform.user')">
                    <el-tooltip
                      :disabled="!(user.username === userName && isPlatformAdmin)"
                      class="item"
                      effect="dark"
                      content="无法对自己操作"
                      placement="top"
                    >
                      <div>
                        <el-button
                          @click="updateUserDialog(user)"
                          :disabled="user.username === userName && isPlatformAdmin"
                          type="text"
                          >修改权限</el-button
                        >
                      </div>
                    </el-tooltip>
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="user.is_frozen && $can('platform.user.freeze', 'platform.user')"
                  >
                    <el-tooltip
                      :disabled="!(user.username === userName && isPlatformAdmin)"
                      class="item"
                      effect="dark"
                      content="无法对自己操作"
                      placement="bottom"
                    >
                      <div>
                        <el-button
                          @click="enableUser(user)"
                          type="text"
                          :disabled="user.username === userName && isPlatformAdmin"
                          >激活</el-button
                        >
                      </div>
                    </el-tooltip>
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="!user.is_frozen && $can('platform.user.freeze', 'platform.user')"
                  >
                    <el-tooltip
                      :disabled="!(user.username === userName && isPlatformAdmin)"
                      class="item"
                      effect="dark"
                      content="无法对自己操作"
                      placement="bottom"
                    >
                      <div>
                        <el-button
                          @click="disableUser(user)"
                          type="text"
                          :disabled="user.username === userName && isPlatformAdmin"
                          >冻结</el-button
                        >
                      </div>
                    </el-tooltip>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </x-table>
      </div>
    </div>

    <!-- dialogs start -->
    <update-platform-user-dialog
      ref="updateUser"
      :platformroles="ROLES"
      :user="selectedUser"
      @update="updateUser"
      :visible="dialogConfigs.updateUser.visible"
      @close="dialogConfigs.updateUser.visible = false"
    >
    </update-platform-user-dialog>

    <create-user-dialog
      ref="createUser"
      :loading="loadings.create"
      :platformroles="ROLES"
      @create="createUser"
      :visible="dialogConfigs.createUser.visible"
      @close="dialogConfigs.createUser.visible = false"
    >
    </create-user-dialog>
    <!-- dialogs end -->
  </div>
</template>

<script src="./user-list.js"></script>
