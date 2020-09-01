<template>
  <dao-dialog
    :config="config"
    :visible.sync="isShow"
    @opened="onOpened"
    @dao-dialog-close="onClose"
    @dao-dialog-cancel="onClose"
  >
    <div v-loading="loading">
      <dao-setting-section>
        <dao-setting-item>
          <div slot="label">角色名</div>
          <div slot="content">
            <dao-input
              v-model="role.name"
              placeholder="角色名"
              name="name"
              :readonly="isPreset"
              type="text"
              v-validate="'required|min:2|max:20'"
              icon-inside
              :message="veeErrors.first('name')"
              :status="veeErrors.has('name') ? 'error' : ''"
              data-vv-as="角色名"
            >
            </dao-input>
          </div>
        </dao-setting-item>
        <dao-setting-item>
          <div slot="label">角色描述</div>
          <div slot="content">
            <dao-input
              v-model="role.description"
              placeholder="角色描述"
              :readonly="isPreset"
              name="description"
              type="text"
              v-validate="'min:0|max:20'"
              icon-inside
              :message="veeErrors.first('description')"
              :status="veeErrors.has('description') ? 'error' : ''"
              data-vv-as="角色描述"
            >
            </dao-input>
          </div>
        </dao-setting-item>
        <dao-setting-item v-if="isShowNote && !isPreset">
          <div slot="content">
            <el-alert title="项目组部分权限需要相应可用区权限支持" type="warning" show-icon>
            </el-alert>
          </div>
        </dao-setting-item>
        <dao-setting-item v-if="isShowZoneNote && !isPreset">
          <div slot="content">
            <el-alert title="该角色必须有项目组权限" type="warning" show-icon> </el-alert>
          </div>
        </dao-setting-item>
      </dao-setting-section>

      <div class="auth-content">
        <div class="menus">
          <!-- :data="permission.children" -->
          <el-tree
            ref="tree"
            check-strictly
            highlight-current
            default-expand-all
            :show-checkbox="true"
            node-key="featureCode"
            :expand-on-click-node="false"
            :data="treeData.children"
            :props="{
              disabled: () => {
                return isDisabled ? true : false;
              },
              children: 'children',
              label: 'name',
            }"
            :default-checked-keys="checkedKeys"
            @node-click="handleNodeClick"
            @check-change="handleCheckChange"
          ></el-tree>
        </div>
        <div class="actions">
          <el-checkbox
            :disabled="isDisabled"
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            v-if="!isPreset && actions.length"
            @change="handleCheckAllChange"
            >全选
          </el-checkbox>
          <el-divider>
            <div style="white-space: nowrap; max-width: 200px; overflow: hidden;">
              <i class="el-icon-set-up"></i>
              {{ selectedNode && selectedNode.name }}
            </div>
          </el-divider>

          <!-- todo: 根据DSP现有空状态组件显示 -->
          <p v-if="!actions.length">
            无权限动作
          </p>
          <div class="checkbox-container" v-else>
            <div class="m-xs" v-for="action in actions" :key="action.featureCode">
              <el-checkbox
                border
                :disabled="isDisabled"
                v-model="action.access"
                :label="action.name"
                @change="handleCheckedActionsChange"
                >{{ action.name }}
              </el-checkbox>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div slot="footer">
      <p v-if="isPreset" style="float: left;">
        <svg class="icon">
          <use xlink:href="#icon_info"></use>
        </svg>
        <span>
          默认角色，无法修改
        </span>
      </p>
      <button class="dao-btn ghost" @click="onClose">关闭</button>
      <button
        class="dao-btn blue"
        @click="save"
        v-throttleClick="1500"
        :disabled="loading"
        v-if="!isPreset && $can('platform.rolePermission.update')"
      >
        更新
      </button>
    </div>
  </dao-dialog>
</template>

<script>
import { pick, cloneDeep } from 'lodash';
import api from '@/core/services/api';
import dialog from '@/view/mixins/dialog';

import { getCheckedKeys, permission2treeData, treeData2permission } from './utils';

export default {
  name: 'RolePermission',
  extends: dialog('角色权限'),
  props: {
    roleId: { type: String, default: '' },
  },
  data() {
    return {
      treeData: { children: [] },
      role: {
        preset: false,
      },
      checkedKeys: [],
      actions: [],
      checkAll: false,
      isIndeterminate: true,
      loading: false,
      selectedNode: null,
      currentNodeKey: '',
    };
  },

  watch: {
    roleId: {
      handler(value) {
        if (value) {
          this.role = {
            preset: false,
          };
          this.getPermission();
        }
      },
    },
  },
  computed: {
    isPreset() {
      return this.role.preset;
    },
    isDisabled() {
      return this.isPreset || !this.$can('platform.rolePermission.update');
    },
    isShowNote() {
      return this.$route.params.scope === 'space';
    },
    isShowZoneNote() {
      return this.$route.params.scope === 'zone.ocp' || this.$route.params.scope === 'zone.k8s';
    },
  },

  methods: {
    async getPermission() {
      this.loading = true;
      try {
        const [dateail, permission] = await Promise.all([
          api.get(`/authorizations/roles/${this.roleId}`),
          api.get(`/authorizations/roles/${this.roleId}/permission`),
        ]);
        this.role = dateail;
        const treeData = permission2treeData(permission);
        this.treeData = treeData;
        this.checkedKeys = getCheckedKeys(permission.children);
        const [first] = treeData.children;
        this.selectedNode = first;
        this.setActions(first && first.actions);
        this.highlightSelectedNode();
      } catch (error) {
        this.$noty.error('获取权限详情失败');
        this.onClose();
      } finally {
        this.loading = false;
      }
      // eslint-disable-next-line prefer-destructuring
    },

    setActions(actions) {
      this.actions = actions || [];
      this.$nextTick(() => {
        this.handleCheckedActionsChange();
      });
    },

    handleNodeClick(node) {
      this.selectedNode = node;
      const { actions } = node;
      this.setActions(actions);
    },

    handleCheckedActionsChange() {
      const checkedCount = this.actions.filter(item => item.access).length;
      this.checkAll = checkedCount === this.actions.length;

      this.isIndeterminate = checkedCount > 0 && checkedCount < this.actions.length;

      if (checkedCount > 0) {
        this.setChecked();
      }
    },

    handleCheckChange(node, checked) {
      node.access = checked;

      if (!checked && node.actions) {
        node.actions.forEach(action => {
          action.access = false;
        });
        this.checkAll = false;
      }
    },

    setChecked() {
      if (!this.$refs.tree) return;
      this.$refs.tree.setChecked(this.selectedNode, true, false);
    },

    highlightSelectedNode() {
      this.$nextTick(() => {
        if (this.selectedNode) this.$refs.tree.setCurrentKey(this.selectedNode.featureCode);
      });
    },

    handleCheckAllChange(val) {
      this.actions.forEach(item => {
        item.access = val;
        if (item.children) {
          item.children.forEach(i => {
            i.access = val;
          });
        }
        return 0;
      });
      this.isIndeterminate = false;
      if (val) {
        this.setChecked();
      }
    },

    async save() {
      try {
        this.loading = true;
        const permission = treeData2permission(cloneDeep(this.treeData));
        await Promise.all([
          api.put(
            `/authorizations/roles/${this.roleId}`,
            pick(this.role, ['scope', 'name', 'description']),
          ),
          api.put(`/authorizations/roles/${this.roleId}/permission`, permission),
        ]);
        this.$noty.success('更新成功');
        this.$emit('updated');
      } catch (error) {
        console.error(error);
        this.$noty.error('更新失败');
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss">
.auth-content {
  display: flex;
  height: 400px;
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.1);

  .menus {
    flex-basis: 40%;
    border-right: 1px solid #ebeef5;
    padding: 15px;
    overflow: auto;
  }

  .actions {
    flex: 1;
    padding: 15px 20px;
  }

  .save-btn {
    padding: 0 10px;
  }

  .checkbox-container {
    display: flex;
    align-content: center;
    flex-wrap: wrap;
  }
}
</style>
