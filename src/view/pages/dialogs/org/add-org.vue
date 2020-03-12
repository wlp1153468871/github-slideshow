<template>
  <dao-dialog
    header="添加租户"
    :visible.sync="isShow"
    @before-open="bopen"
    @closed="closed">
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">租户名</div>
        <div slot="content">
          <dao-input
            icon-inside
            type="text"
            name="name"
            data-vv-as="租户名"
            :message="veeErrors.first('name')"
            :status="veeErrors.has('name') ? 'error' : ''"
            v-validate="'required|min:4|max:20'"
            v-model="name">
          </dao-input>
        </div>
      </dao-setting-item>
    </dao-setting-section>
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">唯一标识</div>
        <div slot="content">
          <dao-input
            icon-inside
            type="text"
            name="short_name"
            data-vv-as="唯一标识"
            placeholder="唯一标识, 之后不能修改"
            :message="veeErrors.first('short_name')"
            :status="veeErrors.has('short_name') ? 'error' : ''"
            v-validate="{
              required: true,
              dns_1123_label: true,
              max: 63,
              min: 4
            }"
            v-model="short_name">
          </dao-input>
        </div>
      </dao-setting-item>
    </dao-setting-section>
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">管理员</div>
        <div slot="content">
          <el-select
            multiple
            filterable
            remote
            ref="select1"
            v-model="user_ids"
            placeholder="请输入关键词"
            :remote-method="loadAdministors">
            <el-option
              v-for="user in users"
              :key="user.id"
              :label="user.username"
              :value="user.id">
            </el-option>
          </el-select>
        </div>
      </dao-setting-item>
    </dao-setting-section>
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">可用区</div>
        <div slot="content">
          <el-select
            multiple
            filterable
            remote
            ref="select2"
            v-model="zone_ids"
            placeholder="请输入关键词"
            :remote-method="loadZones">
            <el-option
              v-for="zone in zones"
              :key="zone.id"
              :label="zone.name"
              :value="zone.id">
            </el-option>
          </el-select>
        </div>
      </dao-setting-item>
    </dao-setting-section>
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">租户备注</div>
        <div slot="content">
          <textarea
            class="dao-control"
            :class="{ 'error': veeErrors.has('description') }"
            v-model="description"
            name="description"
            rows="3"
            v-validate="'max:80'">
          </textarea>
          <p class="text-danger" v-show="veeErrors.has('description')">
            租户备注不能超过80字
          </p>
        </div>
      </dao-setting-item>
    </dao-setting-section>
    <div slot="footer">
      <button
        class="dao-btn ghost"
        @click="$emit('close')">
        取消
      </button>
      <button
        class="dao-btn blue"
        :disabled="!isValidForm"
        @click="onConfirm">
        确定
      </button>
    </div>
  </dao-dialog>
</template>

<script>
import ZoneService from '@/core/services/zone.service';
import UserService from '@/core/services/user.service';

export default {
  name: 'AddOrgDialog',

  props: {
    visible: { type: Boolean, default: false },
  },

  data() {
    return {
      name: '',
      short_name: '',
      description: '',
      users: [],
      zones: [],
      user_ids: [],
      zone_ids: [],
      loading: false,
    };
  },

  computed: {
    isShow: {
      set(val) {
        this.$emit('close', val);
      },
      get() {
        return this.visible;
      },
    },

    isValidForm() {
      return (
        this.name !== '' &&
        this.short_name !== '' &&
        this.user_ids.length !== 0 &&
        this.zone_ids.length !== 0 &&
        !this.veeErrors.any()
      );
    },
  },

  methods: {
    loadAdministors(query) {
      if (query !== '') {
        UserService.getUsers().then(users => {
          this.users = users.filter(user => {
            return (
              user.username.toLowerCase().indexOf(query.toLowerCase()) > -1
            );
          });
        });
      }
    },

    loadZones(query) {
      if (query !== '') {
        this.loading = true;
        ZoneService.getAvailableZones().then(zones => {
          this.loading = false;
          this.zones = zones.filter(zone => {
            return (
              zone.name.toLowerCase().indexOf(query.toLowerCase()) > -1
            );
          });
        });
      }
    },

    onConfirm() {
      const {
        name, short_name, description, user_ids, zone_ids,
      } = this;

      this.$emit('create', {
        name,
        short_name,
        description,
        user_ids,
        zone_ids,
      });
      this.$emit('close');
    },

    closed() {
      this.name = '';
      this.short_name = '';
      this.user_ids = [];
      this.zone_ids = [];
      this.description = '';
    },

    bopen() {
      setTimeout(() => {
        this.$refs.select1.initialInputHeight = 32;
        this.$refs.select1.resetInputHeight();
        this.$refs.select2.initialInputHeight = 32;
        this.$refs.select2.resetInputHeight();
      }, 10);
    },
  },
};
</script>
