<template>
  <div>
    <x-table
      :data="parsedData"
      :filter-method="filterMethod"
      small
      :search-placeholder="`搜索 ${spaceDescription}`"
      @refresh="onRefresh"
    >

      <el-table-column
        prop="space_name"
        :label="spaceDescription"
      >
      </el-table-column>

      <el-table-column
        prop="hard.cpu"
        label="CPU（核）"
      >
        <template #default="{ row: approval }">
          {{ approval.hard && approval.hard.cpu | byte2gib('CPU') }}
        </template>
      </el-table-column>

      <el-table-column
        prop="hard.memory"
        label="内存（GiB）"
      >
        <template #default="{ row: approval }">
          {{ approval.hard && approval.hard.memory | byte2gib }}
        </template>
      </el-table-column>

      <el-table-column
        prop="hard.storage"
        label="存储（GiB）"
      >
        <template #default="{ row: approval }">
          {{ approval.hard && approval.hard.storage | byte2gib }}
        </template>
      </el-table-column>

      <el-table-column
        fixed="right"
        :align="'center'"
        label="操作"
      >
        <template #default="{ row: quota }">
          <button
            class="dao-btn btn-sm mini blue"
            @click="openDialog(quota)"
          >
            更新
          </button>
        </template>
      </el-table-column>
    </x-table>

    <update-space-quota-dialog
      :visible.sync="dialogConfigs.visible"
      :space="dialogConfigs.space"
      @close="dialogConfigs.visible = false"
      @refresh="$emit('refresh')"
    >
    </update-space-quota-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { has, cloneDeep } from 'lodash';
import { byte2gib } from '@/core/utils/gib2byte';

import UpdateSpaceQuotaDialog from './update-space-quota-dialog.vue';

export default {
  name: 'SpaceQuotaTable',

  props: ['loading', 'spaceQuotas'],

  components: {
    UpdateSpaceQuotaDialog,
  },

  data() {
    return {
      dialogConfigs: {
        visible: false,
        type: 'detail',
        space: {},
      },
    };
  },

  computed: {
    ...mapGetters(['spaceDescription']),
    parsedData() {
      return this.spaceQuotas.map(i => i).sort((a, b) => b.created_at - a.created_at);
    },
  },

  filters: {
    byte2gib(byte, type) {
      return byte2gib(byte, type);
    },
  },

  methods: {
    filterMethod(item, filterKey) {
      return has(item, 'space_name') && item.space_name.toLowerCase().includes(filterKey);
    },
    onRefresh() {
      this.$emit('refresh');
    },
    openDialog(space) {
      this.dialogConfigs.space = cloneDeep(space);
      this.dialogConfigs.visible = true;
    },
  },
};
</script>
