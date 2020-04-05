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
        <div slot="label">可用区</div>
        <div slot="content">
          <el-select
            remote
            filterable
            multiple
            v-model="zoneIds"
            placeholder="请输入关键词"
            :remote-method="loadZones"
          >
            <el-option
              v-for="zone in zones"
              :key="zone.id"
              :label="zone.name"
              :value="zone.id"
            >
            </el-option>
          </el-select>
        </div>
      </dao-setting-item>
    </dao-setting-section>
    <div slot="footer">
      <button
        class="dao-btn ghost"
        @click="onClose"
      >
        取消
      </button>
      <button
        class="dao-btn blue"
        :disabled="!zoneIds.length"
        @click="onConfirm"
      >
        确定
      </button>
    </div>
  </dao-dialog>
</template>

<script>
import { differenceBy } from 'lodash';
import dialog from '@/view/mixins/dialog';
import ZoneService from '@/core/services/zone.service';

export default {
  name: 'AddZoneDialog',

  extends: dialog('添加可用区'),

  props: {
    zoneList: { type: Array, default: () => [] },
  },

  data() {
    return {
      zones: [],
      zoneIds: [],
      loading: false,
    };
  },

  methods: {
    loadZones(query) {
      if (query !== '') {
        this.loading = true;
        ZoneService.getAvailableZones().then(zones => {
          this.loading = false;
          const diffZones = differenceBy(zones, this.zoneList, 'id');
          const [currentZone] = diffZones.filter(zone => {
            return zone.area_name.toLowerCase().indexOf(query.toLowerCase()) > -1;
          });
          this.zones.push(currentZone);
        });
      }
    },

    onConfirm() {
      this.$emit('add', this.zoneIds);
      this.onClose();
    },

    onClose() {
      this.zoneIds = [];
      this.zones = [];
      this.$emit('close');
    },
  },
};
</script>
