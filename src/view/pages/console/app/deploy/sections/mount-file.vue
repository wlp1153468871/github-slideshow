<template>
  <div class="mount-file-section">
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">
          Config Map
        </div>
        <template slot="content">
          <table class="dao-table flexrow" v-if="rows.length">
            <thead>
              <tr>
                <th width="20%">
                  <span>Config Map</span>
                </th>
                <th width="20%">
                  <span>文件类型</span>
                </th>
                <th>
                  <span>容器路径</span>
                </th>
                <th width="10%">
                  <span>模式</span>
                </th>
                <th width="10%" style="text-align: center;">
                  <span>操作</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in rows" :key="row.name">
                <td>
                  {{ row.source }}
                </td>
                <td>
                  {{ row.type | config_file }}
                </td>
                <td>
                  {{ row.mountpath }}
                </td>
                <td>
                  {{ row.readonly | file_mode }}
                </td>
                <td class="cell-operations">
                  <svg class="icon icon-remove" @click="removeRow(index)">
                    <use xlink:href="#icon_cross"></use>
                  </svg>
                  <svg class="icon icon-edit" @click="editRow(index)">
                    <use xlink:href="#icon_pencil-edit"></use>
                  </svg>
                </td>
              </tr>
            </tbody>
          </table>
          <button class="dao-btn mini blue has-icon" @click="addRow()">
            <svg class="icon">
              <use xlink:href="#icon_plus-circled"></use>
            </svg>
            <span class="text">添加</span>
          </button>
        </template>
      </dao-setting-item>
    </dao-setting-section>

    <mount-file-dialog
      :configMaps="configMaps"
      :secrets="secrets"
      :keys="keys"
      :model="model"
      :visible="dialogs.file"
      @finish="finish($event)"
      @close="closeModal"
    >
    </mount-file-dialog>
  </div>
</template>

<script>
import { ENV_SOURCE } from '@/core/constants/constants';
import MountFileDialog from '@/view/pages/dialogs/app/mount-file';

export default {
  props: {
    value: { type: Array, default: () => [] },
    configMaps: {
      type: Array,
      default: () => [],
    },
    secrets: {
      type: Array,
      default: () => [],
    },
  },

  components: {
    MountFileDialog,
  },

  data() {
    return {
      ENV_SOURCE,
      dialogs: {
        file: false,
      },
      model: null,
      index: 0,
      keys: [],
    };
  },

  methods: {
    openModal() {
      this.dialogs.file = true;
    },
    closeModal() {
      this.dialogs.file = false;
    },
    addRow() {
      this.index = this.rows.length;
      this.model = null;
      this.openModal();
    },
    removeRow(index) {
      this.rows.splice(index, 1);
    },
    editRow(index) {
      this.index = index;
      this.model = this.rows[index];
      this.openModal();
    },
    finish(model) {
      this.closeModal();
      this.rows.splice(this.index, 1, model);
    },
  },

  computed: {
    rows: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
};
</script>

<style lang="scss">
.mount-file-section {
  & > .dao-setting-section {
    padding: 25px 20px 25px 0;
  }
}
</style>
