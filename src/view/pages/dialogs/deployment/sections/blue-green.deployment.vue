<template>
  <div class="blue-green-deployment">
    <div class="sub-setting-layout">
      <div class="sub-setting-section level">
        <div class="sub-setting-item level-item">
          <p class="top-label">当前 Service</p>
          <div>
            <dao-select v-model="formModel.backend.name" class="select-full-width" :disabled="true">
              <dao-option
                :value="formModel.backend.name"
                :label="formModel.backend.name"
              ></dao-option>
            </dao-select>
            <dao-numeric-input
              icon-inside
              type="int"
              :min="0"
              :max="100"
              placeholder="0-100"
              unit="%"
              required
              v-model="formModel.backend.weight"
            >
            </dao-numeric-input>
          </div>
        </div>
        <div class="sub-setting-item level-item">
          <p class="top-label">新版本 Service</p>
          <div>
            <dao-select v-model="formModel.alternateBackends.name" class="select-full-width">
              <dao-option
                v-for="service in services"
                :key="service.metadata.name"
                :value="service.metadata.name"
                :label="service.metadata.name"
              >
              </dao-option>
            </dao-select>
            <dao-numeric-input
              icon-inside
              type="int"
              :min="0"
              :max="100"
              placeholder="0-100"
              unit="%"
              required
              v-model="formModel.alternateBackends.weight"
            >
            </dao-numeric-input>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { first } from 'lodash';

export default {
  name: 'BlueGreenDeployment',

  props: {
    services: { type: Array, default: () => [] },
    value: {
      type: Object,
      default: () => {
        return {
          backend: {
            name: null,
            weight: 100,
          },
          alternateBackends: {
            name: null,
            weight: 0,
          },
        };
      },
    },
    current: { type: String },
  },

  computed: {
    formModel: {
      set(val) {
        this.$emit('input', val);
      },
      get() {
        return this.value;
      },
    },
  },

  watch: {
    current(name) {
      this.formModel.backend.name = name;
    },

    'formModel.backend.weight': {
      handler(weight) {
        if (weight + this.formModel.alternateBackends.weight !== 100) {
          this.formModel.alternateBackends.weight = 100 - weight;
        }
      },
    },

    'formModel.alternateBackends.weight': {
      handler(weight) {
        if (weight + this.formModel.backend.weight !== 100) {
          this.formModel.backend.weight = 100 - weight;
        }
      },
    },

    services: {
      immediate: true,
      handler(services) {
        const service = first(services);
        if (service && !this.formModel.alternateBackends.name) {
          this.formModel.alternateBackends.name = service.metadata.name;
        }
      },
    },
  },
};
</script>

<style lang="scss">
.blue-green-deployment {
  .sub-setting-item {
    margin-right: 4px;
    width: 50%;
  }

  .dao-numeric-input {
    width: 100%;

    input {
      width: 100%;
    }
  }
}
</style>
