<template>
  <dao-dialog
    header="可用区授权"
    :visible.sync="isShow"
    @dao-dialog-close="onClose"
    @dao-dialog-cancel="onClose">
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
            <div
              class="sub-setting-layout role"
              v-for="(zone, index) in user.zone_space_roles"
              :key="index">
              <div class="sub-setting-section">
                <div class="sub-setting-item">
                  <p>可用区</p>
                  <div class="zone">{{ zone.zone_name }}</div>
                </div>
                <div class="sub-setting-item">
                  <p>权限</p>
                  <dao-select
                    style="width: 157px;"
                    v-model="zone.zone_role">
                    <dao-option
                      v-for="(value, key) in roleOptions"
                      :key="key"
                      :value="key"
                      :label="value">
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
      <button
        class="dao-btn ghost"
        @click="onClose">
        取消
      </button>
      <save-button
        class="blue"
        text="确定"
        :saving="isUpdating"
        @click="authorizeZone">
      </save-button>
    </div>
  </dao-dialog>
</template>

<script>
import { ZONE_ROLE_LABEL as roleOptions } from '@/core/constants/role';
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
      roleOptions,
      isUpdating: false,
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
