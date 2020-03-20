<template>
  <div>
    <x-table
      :loading="loading"
      :data="tableData"
      :showRefresh="true"
      :paginate="false"
      @refresh="listRoles"
    >
      <template #operation>
        <button
          class="dao-btn blue has-icon"
          :disabled="loading"
          @click="addRole"
        >
          <svg class="icon">
            <use xlink:href="#icon_plus-circled"></use>
          </svg>
          <span class="text">创建角色</span>
        </button>
      </template>
      <el-table-column
        prop="name"
        label="名称"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="id"
        label="唯一标识"
      ></el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">{{scope.row.createdAt| date}}</template>
      </el-table-column>
      <el-table-column label="更新时间">
        <template slot-scope="scope">{{scope.row.updatedAt| date}}</template>
      </el-table-column>
      <el-table-column
        :align="'center'"
        label="操作"
        width="150"
      >
        <template #default="{ row: role }">
          <button
            class="dao-btn btn-sm mini blue"
            @click="checkOrUpdateRole(role)"
          >
            详情
          </button>
          <button
            v-if="!role.preset"
            class="dao-btn btn-sm mini red"
            @click="confirmDelete(role)"
          >
            删除
          </button>
        </template>
      </el-table-column>
    </x-table>
    <role-permission
      :visible="roleDetailDialog.visible"
      @close="onUpdateClose"
      @updated="onUpdateSuccess"
      :role-id="roleDetailDialog.id"
    ></role-permission>
    <new-role-permission
      :visible="newRoleDetailDialog.visible"
      @close="onCreateClose"
      @created="onCreateSuccess"
    ></new-role-permission>
  </div>
</template>

<script>
import api from '@/core/services/api';

import RolePermission from './rolePermission.vue';
import NewRolePermission from './newRolePermission.vue';
// import RoleService from '@/core/services/role.service';
// import CreateForm from '../forms/create';

export default {
  name: 'role-list',

  components: { RolePermission, NewRolePermission },

  data() {
    return {
      tableData: [],
      roleDetailDialog: {
        visible: false,
        id: null,
      },
      newRoleDetailDialog: {
        visible: false,
      },
      visible: false,
      loading: false,
      creating: false,
    };
  },

  created() {
    this.listRoles();
  },

  watch: {
    '$route.params.scope': {
      handler() {
        this.listRoles();
      },
    },
  },

  methods: {
    async listRoles() {
      this.loading = true;
      this.tableData = await api.get('/authorizations/roles', { scope: this.$route.params.scope });
      this.loading = false;
    },

    addRole() {
      this.newRoleDetailDialog = {
        visible: true,
      };
    },

    checkOrUpdateRole(role) {
      this.roleDetailDialog = {
        visible: true,
        id: role.id,
      };
    },

    confirmDelete(role) {
      this.$tada
        .confirm({
          title: `删除角色 ${role.name}`,
          text: '此操作将永久删除该角色, 是否继续?',
          primaryText: '删除',
        })
        .then(willEnable => {
          if (!willEnable) return;
          this.deleteRole(role);
        });
    },

    onUpdateClose() {
      this.roleDetailDialog = { visible: false, roldID: null };
    },

    onUpdateSuccess() {
      this.onUpdateClose();
      this.listRoles();
    },

    onCreateClose() {
      this.newRoleDetailDialog = { visible: false };
    },

    onCreateSuccess() {
      this.onCreateClose();
      this.listRoles();
    },

    async deleteRole(role) {
      this.loading = true;
      try {
        await api.delete(`/authorizations/roles/${role.id}`);
        this.$noty.success('删除成功!');
        this.listRoles();
      } catch (error) {
        this.$noty.error('删除失败!');
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
