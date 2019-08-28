<template>
  <div class="resource-link">
    <span
      class="resource-icon"
      :class="[resource.icon]"
      title="Secret">
      {{ kind[0] }}
    </span>
    <router-link :to="resource.route">
      {{ name || kind }}
    </router-link>
  </div>
</template>

<script>
import Resource from '@/view/components/resource/resource-link/resource';

export default {
  name: 'resource-link',

  props: {
    kind: { type: String, required: true },
    name: { type: String },
  },

  data() {
    return {
      resource: {},
      unwatch: () => {},
    };
  },

  created() {
    this.resource = new Resource(this.kind, this.name);
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
    background-color: #43a047;
  }

  .resource-secrets {
    background-color: #ffb300;
  }
}
</style>
