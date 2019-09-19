<template>
  <dao-dialog
    header="添加项目组"
    :visible.sync="isShow"
    @closed="closed">
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">项目组名</div>
        <div slot="content">
          <dao-input
            icon-inside
            name="name"
            data-vv-as="项目组名"
            :message="veeErrors.first('name')"
            :status="veeErrors.has('name') ? 'error' : ''"
            v-validate="'required|org_name'"
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
            name="short_name"
            data-vv-as="唯一标识"
            :message="veeErrors.first('short_name')"
            :status="veeErrors.has('short_name') ? 'error' : ''"
            v-validate="{
              required: true,
              dns_1123_label: true,
              max: 63
            }"
            v-model="short_name">
          </dao-input>
        </div>
        <div slot="content-helper">
          <b>唯一标识, 之后不能修改</b>
        </div>
      </dao-setting-item>
    </dao-setting-section>
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">可用区</div>
        <div slot="content">
          <el-select
            remote
            filterable
            multiple
            v-model="zoneIds"
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
    <div slot="footer">
      <button
        class="dao-btn ghost"
        @click="onClose">
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
import { differenceBy } from 'lodash';
import ZoneService from '@/core/services/zone.service';

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
      zones: [],
      zoneIds: [],
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
        this.name !== '' && this.zoneIds.length !== 0 && this.short_name !== '' && !this.veeErrors.any()
      );
    },
  },

  methods: {
    onConfirm() {
      const {
        name, short_name, description, zoneIds,
      } = this;

      this.$emit('create', {
        name,
        short_name,
        description,
        zoneIds,
      });
      this.onClose();
    },

    onClose() {
      this.$emit('close');
    },

    closed() {
      this.name = '';
      this.short_name = '';
      this.description = '';
      this.zoneIds = [];
    },

    loadZones(query) {
      if (query !== '') {
        this.loading = true;
        ZoneService.getAvailableZones().then(zones => {
          this.loading = false;
          const diffZones = differenceBy(zones, this.zoneList, 'id');
          this.zones = diffZones.filter(zone => {
            return zone.area_name.toLowerCase()
              .indexOf(query.toLowerCase()) > -1;
          });
        });
      }
    },
  },
};
</script>
