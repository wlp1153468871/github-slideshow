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
              name="description"
              type="text"
              v-validate="'min:0|max:80'"
              icon-inside
              :message="veeErrors.first('description')"
              :status="veeErrors.has('description') ? 'error' : ''"
              data-vv-as="角色描述"
            >
            </dao-input>
          </div>
        </dao-setting-item>
      </dao-setting-section>

      <div class="auth-content">
        <div class="menus">
          <!-- :data="permission.children" -->
          <el-tree
            ref="tree"
            check-strictly
            :show-checkbox="true"
            highlight-current
            default-expand-all
            node-key="featureCode"
            :expand-on-click-node="false"
            :data="treeData.children"
            :props="{
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
            :indeterminate="isIndeterminate"
            v-model="checkAll"
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
      <button class="dao-btn ghost" @click="onClose">关闭</button>
      <button class="dao-btn blue" @click="create">
        创建
      </button>
    </div>
  </dao-dialog>
</template>

<script>
import { cloneDeep } from 'lodash';
import api from '@/core/services/api';
import dialog from '@/view/mixins/dialog';

import { getCheckedKeys, permission2treeData, treeData2permission } from './utils';

export default {
  name: 'NewRolePermission',
  extends: dialog('新建角色'),
  data() {
    return {
      treeData: { children: [] },
      role: {
        name: '',
        description: '',
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
    visible: {
      handler(value) {
        if (value) {
          this.getPermissionTree();
          this.role = { name: '', description: '' };
        }
      },
    },
  },

  methods: {
    async getPermissionTree() {
      this.loading = true;
      try {
        const permission = await api.get('/authorizations/permissions', {
          struct: 'tree',
          scope: this.$route.params.scope,
        });
        const treeData = permission2treeData(permission);
        this.treeData = treeData;
        this.checkedKeys = getCheckedKeys(permission.children);
        const [first] = treeData.children;
        this.selectedNode = first;
        this.setActions(first && first.actions);
        // eslint-disable-next-line prefer-destructuring

        this.highlightSelectedNode();
      } catch (error) {
        // console.error(error);
        this.$noty.error('获取权限树失败');
        this.onClose();
      } finally {
        this.loading = false;
      }
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

    async create() {
      try {
        const valid = await this.$validator.validateAll();
        if (!valid) return;
        this.loading = true;
        const { id: roleId } = await api.post('/authorizations/roles', {
          name: this.role.name,
          description: this.role.description,
          scope: this.$route.params.scope,
        });
        this.$noty.success('创建成功');

        try {
          await api.put(
            `/authorizations/roles/${roleId}/permission`,
            treeData2permission(cloneDeep(this.treeData)),
          );
        } catch (error) {
          this.$noty.error(`但是权限树创建失败，${error}`);
        }
        this.$emit('created');
      } catch (error) {
        console.error(error);
        this.$noty.error('创建失败');
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
