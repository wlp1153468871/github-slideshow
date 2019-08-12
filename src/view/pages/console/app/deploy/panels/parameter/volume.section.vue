<template>
  <dao-setting-layout>
    <template slot="layout-title">存储卷</template>
    <dao-setting-section>
      <div slot="label">
        <span>存储卷</span>
      </div>
      <div slot="content">
        <dao-editable-table
          :config="volumeConfig"
          v-model="volumeModel"
          @valid="onValidChange">
        </dao-editable-table>
      </div>
    </dao-setting-section>
  </dao-setting-layout>
</template>

<script>
import VolumeService from '@/core/services/volume.service';

export default {
  name: 'VolumeSection',

  inject: ['$validator'],

  props: {
    space: { type: Object, default: () => ({}) },
    zone: { type: Object, default: () => ({}) },
    value: { type: Array, default: () => [] },
  },

  created() {
    this.loadVolume();
  },

  data() {
    return {
      volumeModel: [],
      volumeList: [],
      volumeConfig: {
        header: ['存储卷名', '存储路径'],
        body: [
          {
            type: 'select',
            name: 'name',
            default: '',
            options: [],
          },
          {
            type: 'input',
            name: 'containerPath',
            default: '',
            validate(row) {
              const { name } = row;
              if (name.trim() === '') {
                return '存储卷名是必填字段';
              }
              const path = row.containerPath;
              if (path.trim() === '') {
                return '必填字段';
              }
              if (!/^\/.*$/.test(path)) {
                return '只能是绝对路径';
              }
              return true;
            },
          },
        ],
      },
    };
  },

  watch: {
    volumeModel: {
      deep: true,
      handler(volumes) {
        this.$emit('update:volumes', volumes);
      },
    },
  },

  methods: {
    onValidChange(valid) {
      const fieldName = 'volume';

      if (valid) {
        // is valid
        if (this.veeErrors.has(fieldName)) {
          this.veeErrors.remove(fieldName);
        }
      } else {
        // is invalid
        const bag = this.veeErrors.first(fieldName);
        if (bag) {
          this.veeErrors.update(bag.id, 'Wrong Credentials');
        } else {
          this.veeErrors.add({
            field: fieldName,
            msg: 'Wrong Credentials',
          });
        }
      }
    },

    loadVolume() {
      VolumeService.list(this.space.id, this.zone.id).then(res => {
        const { items } = res;
        this.updateVolumeConfigOptions(items.map(x => x.metadata.name));
      });
    },

    updateVolumeConfigOptions(options) {
      this.volumeConfig.body[0].options = options;
    },
  },
};
</script>
