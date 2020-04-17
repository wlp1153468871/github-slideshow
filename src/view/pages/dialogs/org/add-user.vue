<template>
  <dao-dialog
    :config="config"
    :visible.sync="isShow"
    @dao-dialog-close="onClose"
    @dao-dialog-cancel="onClose"
    @dao-dialog-confirm="onConfirm"
  >
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">用户信息</div>
        <div slot="content">
          <dao-autocomplete
            placeholder="请输入用户邮箱"
            v-model="keyword"
            @text-change="changeKeyword"
            :options="options"
          >
          </dao-autocomplete>
        </div>
      </dao-setting-item>
    </dao-setting-section>
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">权限</div>
        <div slot="content">
          <dao-select v-model="role" placeholder="请选择">
            <dao-option v-for="(r, index) in roles" :key="index" :value="r" :label="r.name">
            </dao-option>
          </dao-select>
        </div>
      </dao-setting-item>
    </dao-setting-section>
    <div slot="footer">
      <button class="dao-btn ghost" @click="onClose">
        取消
      </button>
      <button class="dao-btn blue" :disabled="!isValidForm" @click="onConfirm">
        确定
      </button>
    </div>
  </dao-dialog>
</template>

<script>
import { first } from 'lodash';
import dialog from '@/view/mixins/dialog';

export default {
  name: 'AddDialog',

  extends: dialog('添加用户'),

  props: {
    users: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
    roles: { type: Array, default: () => [] },
  },

  data() {
    return {
      userId: '',
      role: '',
      keyword: '',
    };
  },

  computed: {
    options() {
      return this.users.map(user => ({
        text: user.email,
        value: user.email,
        username: user.username,
        id: user.id,
      }));
    },
    isValidForm() {
      return this.userId !== '' && this.role !== '';
    },
  },

  watch: {
    users: {
      immediate: true,
      handler(users) {
        if (users.length) {
          const user = first(users);
          if (user) {
            this.userId = user.id;
          }
        }
      },
    },
    roles: {
      immediate: true,
      handler(roles) {
        this.initRole(roles);
      },
    },
  },

  methods: {
    changeKeyword(value) {
      this.keyword = value;
      if (value) {
        this.$emit('search', value);
      }
    },
    initRole(roles) {
      if (roles.length) {
        const role = first(roles);
        if (role) {
          this.role = role.value;
        }
      }
    },

    onConfirm() {
      const { keyword, role } = this;
      const user = this.users.find(x => x.email === keyword);
      if (!user || !user.email) {
        this.$noty.error('该用户无绑定邮箱');
        return;
      }
      this.$emit(
        'add',
        {
          user,
          role,
        },
        true,
      );
      this.onClose();
    },

    // @overload
    dialogWillClose() {
      this.keyword = '';
      this.userId = '';
      this.initRole(this.roles);
    },
  },
};
</script>
