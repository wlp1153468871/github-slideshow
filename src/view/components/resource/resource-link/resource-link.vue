<template>
  <div class="resource-link">
    <span v-if="showKind" class="resource-icon" :class="[resource.icon]" title="Secret">
      {{ kind[0] }}
    </span>
    <router-link :to="resource.route">
      <slot>{{ name || kind }}</slot>
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
    showKind: { type: Boolean, default: true },
  },

  data() {
    return {
      resource: {},
    };
  },

  created() {
    this.resource = new Resource(this.kind, this.name);
  },

  watch: {
    name(name) {
      this.resource.name = name;
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
    background-color: #6dd9bf;
    flex-shrink: 0;
  }

  .resource-services {
    background-color: #50a18e;
  }

  .resource-secrets {
    background-color: #f2d680;
  }

  .resource-routes {
    background-color: #f2916d;
  }

  .resource-pods {
    background-color: #f26e50;
  }
}
</style>
