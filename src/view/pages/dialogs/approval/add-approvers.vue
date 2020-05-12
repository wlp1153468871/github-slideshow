<template>
  <dao-dialog
    class="add-approvers-dialog"
    :config="config"
    :visible.sync="isShow"
    @dao-dialog-confirm="onConfirm"
    @dao-dialog-close="onClose"
    @dao-dialog-cancel="onClose"
  >
    <div class="dao-table-container" style="padding: 20px;">
      <div class="dao-table-toolbar">
        <el-select
          filterable
          size="small"
          v-model="keyword"
          placeholder="请输入文本"
          :popper-append-to-body="false"
          class="select-approve-member"
        >
          <el-option
            v-for="item in availableUsers"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          >
            <p class="item-username">{{ item.username }}</p>
            <div class="user-info">
              <span>{{ item.email }}</span>
            </div>
          </el-option>
        </el-select>
        <button class="dao-btn add-approver-btn has-icon blue pull-left" @click="addApprover()">
          <svg class="icon">
            <use xlink:href="#icon_plus"></use>
          </svg>
          <span class="text">添加</span>
        </button>
        <div class="table-filters">
          <dao-switch
            v-model="isEnableOrder"
            :with-notice="true"
            :option="{ on: '有序', off: '无序' }"
          >
          </dao-switch>
        </div>
      </div>
      <div class="dao-table-main">
        <table class="dao-table row">
          <thead>
            <tr>
              <th class="td-name" style="width: 20px;" v-show="isEnableOrder"></th>
              <th class="td-name">用户名</th>
              <th>手机号</th>
              <th>邮箱</th>
              <th>操作</th>
            </tr>
          </thead>
          <draggable tag="tbody" class="dao-table-main" v-model="users" :options="option">
            <tr v-for="(user, index) in users" :key="index">
              <td class="td-name" v-show="isEnableOrder">
                <span class="drag-handle">☰</span>
              </td>
              <td class="td-name">{{ user.username }}</td>
              <td>{{ user.phone_number }}</td>
              <td>{{ user.email }}</td>
              <td>
                <a href="javascript:void(0);" @click="remove(index)">
                  <svg class="icon">
                    <use xlink:href="#icon_trash"></use>
                  </svg>
                </a>
              </td>
            </tr>
          </draggable>
        </table>
        <empty-state v-show="!users.length" title="审批成员为空"> </empty-state>
      </div>
    </div>
  </dao-dialog>
</template>

<script>
import draggable from 'vuedraggable';
import dialog from '@/view/mixins/dialog';

export default {
  name: 'AddApproversDialog',
  components: {
    draggable,
  },
  extends: dialog('添加审批成员', {
    size: 'lg',
  }),
  props: {
    tenantUsers: { type: Array, default: () => [] },
    approvers: { type: Array, default: () => [] },
    enableOrder: { type: Boolean, default: false },
  },
  data() {
    return {
      users: [], // selected users
      isEnableOrder: false,
      keyword: '',
      option: {
        handle: '.drag-handle',
        animation: 150,
      },
    };
  },
  watch: {
    approvers: {
      immediate: true,
      handler(approvers) {
        this.users = [...approvers];
      },
    },
    enableOrder: {
      immediate: true,
      handler(enableOrder) {
        this.isEnableOrder = enableOrder;
      },
    },
  },
  computed: {
    availableUsers() {
      const selectedSet = new Set(this.users.map(x => x.id));
      const users = [];
      this.tenantUsers.forEach(x => {
        if (!selectedSet.has(x.id)) {
          x.text = x.username;
          users.push(x);
        }
      });
      return users;
    },
  },
  methods: {
    filterRule() {
      return true;
    },

    addApprover() {
      if (!this.keyword) return;
      const user = this.tenantUsers.find(x => x.text === this.keyword);
      if (user) {
        this.users.push(user);
      }
      this.keyword = this.availableUsers.length ? this.availableUsers[0].text : '';
    },

    remove(index) {
      this.users.splice(index, 1);
    },

    onConfirm() {
      this.$emit('on-change', {
        approvers: this.users,
        isEnableOrder: this.isEnableOrder,
      });
    },

    dialogWillClose() {
      this.keyword = '';
      this.users = [...this.approvers];
    },
  },
};
</script>

<style lang="scss">
@import '~daoColor';

.add-approvers-dialog {
  .select-approve-member {
    float: left;

    .el-select-dropdown__item {
      height: auto;
    }
  }

  .add-approver-btn {
    margin-left: 10px;
  }
}

.item-username {
  line-height: 14px;
  padding-top: 10px;
  margin-bottom: 5px;
}

.user-info {
  display: flex;
  justify-content: space-between;
  line-height: 14px;
  font-size: 12px;
  padding-bottom: 10px;
}
</style>
