<template>
  <div class="approval-setting-module">
    <!-- <div class="layout-content-header">
      审批设置
    </div> -->
    <div class="dao-view-main">
      <div class="dao-view-content">
        <div class="dao-setting-layout">
          <div class="dao-setting-section">
            <div class="dao-setting-item">
              <span class="dao-setting-label">审批开关</span>
              <div class="dao-setting-content">
                <dao-switch
                  name="enabled"
                  v-model="config.is_need_approval"
                  :with-notice="true">
                </dao-switch>
              </div>
            </div>
          </div>

          <div class="dao-setting-section dao-setting-mark-container">
            <div class="dao-setting-item">
              <span class="dao-setting-label">审批授权</span>
              <div class="dao-setting-content">

                <dao-radio-group type="block">
                  <dao-radio
                    v-for="(radio, index) in approvalTypes"
                    v-model="approvalType"
                    :key="index"
                    :label="radio.name"
                    :headline="radio.headline"
                    :description="radio.description">
                  </dao-radio>
                </dao-radio-group>

                <div
                  class="dao-table-container"
                  v-show="approvalType === APPROVAL_TYPES.PASS_TYPE_CUSTOM">
                  <div class="dao-table-toolbar">
                    <div
                      class="dao-btn has-icon blue"
                      @click="showAddUserDialog()">
                      <span class="text">添加审批成员</span>
                    </div>
                    <div
                      class="table-count pull-right"
                      v-if="approvalType === APPROVAL_TYPES.PASS_TYPE_SEQ">
                      <span>
                        <svg class="icon"><use xlink:href="#icon_arrow-down"></use></svg>
                        按顺序排序
                      </span>
                    </div>
                  </div>
                  <div class="dao-table-main">
                    <table class="dao-table row">
                      <thead>
                        <tr>
                          <td>用户名</td>
                          <td>手机号</td>
                          <td>邮箱</td>
                          <td>项目权限</td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="user in approverList"
                          :key="user.phone_number">
                          <td>{{ user.username }}</td>
                          <td>{{ user.phone_number }}</td>
                          <td>{{ user.email }}</td>
                          <td>{{ user.space_role | space_role }}</td>
                        </tr>
                      </tbody>
                    </table>
                    <empty-state
                      v-show="!approverList.length"
                      title="审批成员为空">
                    </empty-state>
                  </div>
                </div>

              </div>
            </div>
            <div class="dao-setting-mark" :class="{'open': !config.is_need_approval }">
            </div>
          </div>

          <div class="dao-setting-layout-footer">
            <button
              class="dao-btn blue"
              @click="save()">
              保存
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- dialogs start -->
    <add-approvers-dialog
      :tenant-users="users"
      :approvers="approverList"
      :enable-order="isEnableOrder"
      @on-change="onApproversChange"
      :visible="dialogConfigs.addApprovers.visible"
      @close="dialogConfigs.addApprovers.visible = false">
    </add-approvers-dialog>
    <!-- dialogs end -->
  </div>
</template>

<script src="./approval-setting.js"></script>

<style lang="scss">
.approval-setting-module {
  .dao-setting-mark-container {
    position: relative;
  }
  .dao-setting-mark {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: none;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, .65);
    cursor: not-allowed;

    &.open {
      display: block;
    }
  }
}
</style>
