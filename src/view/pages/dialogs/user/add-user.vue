<template>
  <dao-dialog
    :header="isUpdate? '更新用户权限' : '添加用户'"
    :visible.sync="isShow"
    @before-open="init"
    @closed="closed">
    <dao-setting-section>
      <dao-setting-item>
        <template #label>用户信息</template>
        <template #content>
          <template v-if="!isUpdate">
            <dao-select
              v-model="formModel.user_id"
              :with-search="true"
              name="user_id"
              v-validate.immediate="'required'"
              placeholder="请输入一位用户的邮箱"
              search-placeholder="请输入一位用户的邮箱"
              no-data-text="无用户"
              no-match-text="无匹配用户">
              <dao-option
                v-for="(option, index) in options"
                :key="index"
                :value="option.id"
                :label="option.value">
                {{ option.text }}
              </dao-option>
            </dao-select>
          </template>
          <template v-else>
            {{ model.username }}
          </template>
        </template>
      </dao-setting-item>
    </dao-setting-section>
    <dao-setting-section>
      <dao-setting-item>
        <template #label>项目组权限</template>
        <template #content>
          <dao-select
            name="space_role"
            v-validate.immediate="'required'"
            v-model="formModel.space_role">
            <dao-option
              v-for="(value, key) in roleOptions"
              :key="key"
              :value="key"
              :label="value">
            </dao-option>
          </dao-select>
        </template>
      </dao-setting-item>
    </dao-setting-section>
    <div slot="footer">
      <button
        class="dao-btn ghost"
        @click="onClose">
        取消
      </button>
      <button
        class="dao-btn blue"
        :disabled="!valid"
        @click="onConfirm">
        确定
      </button>
    </div>
  </dao-dialog>
</template>

<script>
import { get as getValue, first, isEmpty } from 'lodash';
import { SPACE_ROLE_LABEL as roleOptions } from '@/core/constants/role';
import UserService from '@/core/services/user.service';

export default {
  name: 'AddUserDialog',

  props: {
    spaceId: { type: String, default: '' },
    visible: { type: Boolean, default: false },
    users: { type: Array, default: () => [] },
    model: { type: Object, default: () => ({}) },
  },

  data() {
    return {
      roleOptions,
      formModel: {
        user_id: null,
        space_role: null,
      },
    };
  },

  computed: {
    isShow: {
      set() {
        this.$emit('close');
      },
      get() {
        return this.visible;
      },
    },

    isUpdate() {
      return !isEmpty(this.model);
    },

    options() {
      return this.users.map(user => ({
        text: `${user.email} ${user.username ? `(${user.username})` : ''}`,
        value: user.email,
        username: user.username,
        id: user.id,
      }));
    },

    valid() {
      return !this.veeErrors.any();
    },
  },

  methods: {
    init() {
      if (this.isUpdate) {
        this.formModel.space_role = this.model.space_role;
        this.formModel.user_id = this.model.id;
      } else {
        this.formModel.space_role = first(Object.keys(this.roleOptions));
        this.formModel.user_id = getValue(first(this.users), 'id');
      }
    },

    onConfirm() {
      this.$validator.validateAll().then(valid => {
        if (valid) {
          this.addUser();
        }
      });
    },

    addUser() {
      UserService.updateSpaceUser(this.spaceId, this.formModel).then(() => {
        this.onRefresh();
        this.$noty.success(this.isUpdate ? '成功更新用户权限' : '添加用户成功');
      });
    },

    onClose() {
      this.$emit('close');
    },

    onRefresh() {
      this.onClose();
      this.$emit('refresh');
    },

    closed() {
      this.$validator.reset();
      this.formModel = {
        user_id: null,
        space_role: null,
      };
    },
  },
};
</script>
