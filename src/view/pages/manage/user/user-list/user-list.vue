<template>
  <div>
    <div class="layout-content-header">
      用户管理
    </div>
    <div class="dao-view-main">
      <div class="dao-view-content">
        <!-- 用户列表 -->
        <dao-table-view
          :rows="rows"
          :config="tConfig"
          :loading="loadings.users"
          @refresh="loadUsers"
          @update-user-dialog="updateUserDialog"
          @confirm-disable="disableConfirm"
          @confirm-enable="enableConfirm">
          <div slot="tool" class="dao-table-view-left-bar">
            <button
              class="dao-btn has-icon blue"
              @click="openCreateUserDialog()">
              <svg class="icon">
                <use xlink:href="#icon_plus-circled"></use>
              </svg>
              <span class="text">创建用户</span>
            </button>
          </div>
        </dao-table-view>
      </div>
    </div>

    <!-- dialogs start -->
    <update-platform-user-dialog
      ref="updateUser"
      :user="selectedUser"
      @update="updateUser"
      :visible="dialogConfigs.updateUser.visible"
      @close="dialogConfigs.updateUser.visible = false">
    </update-platform-user-dialog>

    <create-user-dialog
      ref="createUser"
      :loading="loadings.create"
      @create="createUser"
      :visible="dialogConfigs.createUser.visible"
      @close="dialogConfigs.createUser.visible = false">
    </create-user-dialog>
    <!-- dialogs end -->
  </div>
</template>

<script src="./user-list.js">
</script>
