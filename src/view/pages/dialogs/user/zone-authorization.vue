<template>
  <dao-dialog
    header="可用区授权"
    :visible.sync="isShow"
    @before-open="loadRoleOptions"
    @dao-dialog-close="onClose"
    @dao-dialog-cancel="onClose"
  >
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">用户名</div>
        <div slot="content">
          <p>{{ user.username }}</p>
        </div>
      </dao-setting-item>
    </dao-setting-section>
    <dao-setting-section>
      <dao-setting-item>
        <template #label>权限</template>
        <template #content>
          <div class="dao-setting-patch role">
            <div class="sub-setting-layout role" v-for="(zone, index) in zones" :key="index">
              <div class="sub-setting-section">
                <div class="sub-setting-item">
                  <p>可用区</p>
                  <div class="zone">{{ zone.name }}</div>
                </div>
                <div class="sub-setting-item">
                  <p>权限</p>
                  <dao-select style="width: 157px;" v-model="result[zone.name]">
                    <dao-option
                      v-for="(role, key) in zone.roles"
                      :key="key"
                      :value="role"
                      :label="role.name"
                    >
                    </dao-option>
                  </dao-select>
                </div>
              </div>
            </div>
          </div>
        </template>
      </dao-setting-item>
    </dao-setting-section>

    <div slot="footer">
      <button class="dao-btn ghost" @click="onClose">
        取消
      </button>
      <save-button class="blue" text="确定" :saving="isUpdating" @click="authorizeZone">
      </save-button>
    </div>
  </dao-dialog>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
// import { ZONE_ROLE_LABEL as roleOptions } from '@/core/constants/role';
import { cloneDeep } from 'lodash';
import SpaceService from '@/core/services/space.service';

export default {
  name: 'ZoneAuthorizationDialog',

  props: {
    spaceId: { type: String, default: '' },
    visible: { type: Boolean, default: false },
    model: { type: Object, default: () => ({}) },
  },

  data() {
    return {
      user: {},
      roleOptions: [],
      isUpdating: false,
      formModel: [],
      result: {
        k8s: '',
        'office-openshift': '',
      },
    };
  },

  watch: {
    model: {
      immediate: true,
      handler(model) {
        this.user = cloneDeep(model);
      },
    },
  },

  computed: {
    ...mapGetters(['zoneId']),
    ...mapState(['zones']),
    isShow: {
      set() {
        this.$emit('close');
      },
      get() {
        return this.visible;
      },
    },
  },

  methods: {
    getZoneRole(params) {
      console.log(params);
      return [
        {
          id: '01E2HX431T62G21RKT97TJG73K',
          name: 'space-super-admin',
        },
        {
          id: '01E2HX431T62G21RKT97TJG73K',
          name: 'space-super-admin',
        },
      ];
    },
    loadRoleOptions() {
      this.formModel = [];
      // this.zones.map(zone => {
      //   const params = {
      //     scope: 'zone.k8s',
      //     spaceId: this.spaceId,
      //     zoneId: zone.id,
      //   };
      //   return RoleService.getRoles(params)
      //     .then(role => {
      //       console.log('role', role);
      //       return role;
      //     });
      // });
    },

    authorizeZone() {
      this.isUpdating = true;
      const { zone_space_roles } = this.user;
      return SpaceService.authorizeZone(this.spaceId, this.model.id, {
        zone_space_roles,
      })
        .then(() => {
          this.successUpdate();
        })
        .finally(() => {
          this.isUpdating = false;
        });
    },

    onClose() {
      this.$emit('close');
    },

    successUpdate() {
      this.$emit('refresh');
      this.onClose();
      this.$noty.success('权限修改成功');
    },

    dialogWillClose() {
      this.user = {};
    },
  },
  created() {
    // this.();
  },
};
</script>

<style lang="scss" scoped>
.dao-setting-patch.role {
  .sub-setting-layout.role {
    &:not(:first-child) {
      margin-top: 10px;
    }

    .zone {
      width: 196px;
      height: 32px;
      line-height: 32px;
      margin-right: 10px;
      padding: 0 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      border-radius: 4px;
      background: #f5f7fa;
    }
  }
}
</style>
