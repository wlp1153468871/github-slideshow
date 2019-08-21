<template>
  <div class="resource-link">
    <span
      class="resource-icon"
      :class="[resourceIcon]"
      title="Secret">
      {{ kind[0] }}
    </span>
    <router-link :to="resourceRoute">
      {{ name || kind }}
    </router-link>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { get as getValue } from 'lodash';

export default {
  name: 'resource-link',

  props: {
    kind: { type: String, required: true },
    name: { type: String },
  },

  computed: {
    ...mapState(['apiResource']),

    resourceName() {
      return getValue(this.apiResource, `${this.kind}.name`);
    },

    resourceRoute() {
      const { name, resourceName } = this;
      if (!resourceName) return { name: 'dashboard' };
      if (name) {
        return {
          name: `resource.${resourceName}.detail`,
          params: { name },
        };
      } else {
        return {
          name: `resource.${resourceName}.list`,
        };
      }
    },

    resourceIcon() {
      return `resource-${this.resourceName}`;
    },
  },
};
</script>

<style lang="scss">
.resource-link {
  align-items: baseline;
  display: flex;
  min-width: 0;
  overflow-wrap: break-word;
  word-wrap: break-word;

  .resource-icon {
    display: inline-block;
    font-weight: normal;
    text-align: center;
    border-radius: 10px;
    height: 18px;
    min-width: 18px;
    padding: 0 4px;
    line-height: 18px;
    color: #fff;
    margin: 0 4px;
    background-color: #00b9e4;
    flex-shrink: 0;
  }

  .resource-services {
    background-color: #43A047;
  }

  .resource-secrets {
    background-color: #FFB300;
  }
}
</style>
