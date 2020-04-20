<template>
  <div class="sso" v-if="$can('platform.settings.third-party')">
    <dao-setting-layout>
      <div slot="layout-title">
        SSO 认证
      </div>
      <dao-setting-section>
        <template #content>
          <el-table v-loading="loading" :data="rows">
            <el-table-column prop="name" label="名称"> </el-table-column>
            <el-table-column show-overflow-tooltip prop="login_url" label="登录 URL">
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="logout_url" label="登出 URL">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              align="center"
              header-align="center"
              width="80"
            >
              <template #default="{ row: record}">
                <el-dropdown @command="handleOperate($event, record)">
                  <span>
                    <svg class="icon dropdown-trigger">
                      <use xlink:href="#icon_more"></use>
                    </svg>
                  </span>

                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="edit" icon="el-icon-edit">
                      编辑
                    </el-dropdown-item>
                    <el-dropdown-item
                      class="dropdown-item-error"
                      command="delete"
                      icon="el-icon-delete"
                    >
                      删除
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <template #content-helper>
          <button class="dao-btn blue" @click="openDialog">
            添加
          </button>
        </template>
      </dao-setting-section>
      <dao-setting-section>
        <div slot="label">只使用第三方登录</div>
        <div slot="content">
          <dao-switch
            :option="{ on: '是', off: '否' }"
            :with-notice="true"
            v-model="enable_local_login"
            @change="onChange"
          >
          </dao-switch>
        </div>
        <div slot="content-helper">您必须确保可以用第三方登录管理员账户, 否则任何人将无法登录</div>
      </dao-setting-section>
    </dao-setting-layout>

    <add-sso-dialog :visible.sync="visible" :base-model.sync="selectSSO" @refresh="loadSSOInfo">
    </add-sso-dialog>
  </div>
</template>

<script>
import SSOService from '@/core/services/sso.service';
import addSsoDialog from '@/view/pages/dialogs/preference/add-sso';

export default {
  name: 'SSOList',

  components: {
    addSsoDialog,
  },

  created() {
    if (this.$can('platform.settings.third-party')) {
      this.loadSSOInfo();
    } else {
      this.$noty.error('您暂无SSO设置权限');
    }
  },

  data() {
    return {
      rows: [],
      selectSSO: null,
      visible: false,
      enable_local_login: false,
      loading: true,
    };
  },

  methods: {
    loadSSOInfo() {
      this.loading = true;
      SSOService.getSSO().then(sso => {
        this.enable_local_login = !sso.enable_local_login;
      });
      SSOService.getIdentityProvider()
        .then(providers => {
          this.rows = providers;
        })
        .finally(() => {
          this.loading = false;
        });
    },

    openDialog() {
      this.visible = true;
    },

    handleOperate(command, sso) {
      if (command === 'edit') {
        this.selectSSO = sso;
        this.openDialog();
      }
      if (command === 'delete') {
        this.confirmDeleteSSO(sso);
      }
    },

    confirmDeleteSSO(sso) {
      this.$tada
        .confirm({
          title: '删除第三方登录',
          text: `您确定要删除第三方登录 ${sso.name} 吗？`,
        })
        .then(willDel => {
          if (willDel) {
            this.deleteSSO(sso.id);
          }
        });
    },

    deleteSSO(ssoId) {
      SSOService.deleteIdentityProvider(ssoId).then(() => {
        this.$noty.success('删除第三方登录成功!');
        this.loadSSOInfo();
      });
    },

    onChange() {
      if (!this.rows.length && !this.loadings.sso) {
        this.$tada.error('请先至少添加一条 SSO 登录信息!');
        this.enable_local_login = false;
      } else {
        const params = {
          enable_local_login: !this.enable_local_login,
        };
        SSOService.updateSSO(params);
      }
    },
  },
};
</script>

<style lang="scss">
.sso {
  .access-keys-table {
    overflow-x: auto;

    .dao-table {
      table-layout: fixed;
    }
  }

  a.icon {
    cursor: pointer;
  }
}
</style>
