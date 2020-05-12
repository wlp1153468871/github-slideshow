<template>
  <dao-setting-layout>
    <dao-setting-section>
      <dao-setting-item>
        <template slot="label">卷存储</template>
        <template slot="content">
          <dao-editable-table :config="config" v-model="editVolumes" @valid="validChange">
          </dao-editable-table>
        </template>
      </dao-setting-item>
    </dao-setting-section>
  </dao-setting-layout>
</template>

<script>
import { cloneDeep } from 'lodash';
import arr2map from '@/core/utils/arr2map';
import isAbsolutePath from '@/core/utils/is-absolute-path';

export default {
  name: 'Volume',
  props: {
    volumes: { type: Array, default: () => [] },
    allVolumes: { type: Array, default: () => [] },
  },
  data() {
    return {
      editEnvs: [],
      config: {
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
            name: 'path',
            default: '',
            validate(row) {
              if (!isAbsolutePath(row.path)) {
                return '只能是绝对路径';
              }
              return true;
            },
          },
        ],
      },
      cmd: '',
      args: '',
    };
  },

  watch: {
    volumes: {
      immediate: true,
      handler() {
        this.editVolumes = cloneDeep(this.volumes);
      },
    },

    allVolumes: {
      immediate: true,
      handler(allVolumes) {
        this.$_volumeMap = arr2map(allVolumes, 'name');
        const options = Array.from(this.$_volumeMap.keys());
        this.config.body[0].options = options;
      },
    },
  },

  methods: {
    validChange(valid) {
      this.isValid = valid;
    },

    validate() {
      return this.isValid;
    },

    providePartialModel() {
      const bindings = this.editVolumes.map(editVol => {
        const volume = this.$_volumeMap.get(editVol.name);
        return {
          instance_id: volume.id,
          params: [editVol],
        };
      });

      return {
        binding_instances: bindings,
      };
    },
  },
};
</script>
