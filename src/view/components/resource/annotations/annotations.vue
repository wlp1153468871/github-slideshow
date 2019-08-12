<template>
  <div class="annotations">
    <p
      v-if="annotations"
      class="mar-bottom-sm"
      :class="{'mar-bottom-xl': !expandAnnotations}">
      <button
        class="dao-btn mini blue"
        @click="toggleAnnotations">
        {{expandAnnotations ? 'Hide Annotations' : 'Show Annotations'}}
      </button>
    </p>
    <div v-if="expandAnnotations && annotations" class="table-responsive scroll-shadows-horizontal">
      <table class="table table-bordered key-value-table">
        <tbody>
        <tr
          :key="annotationKey"
          v-for="(annotationKey, annotationValue) in annotations">
          <td>{{annotationKey}}</td>
          <td>
            <truncate-long-text
              :content="annotationValue | prettify_json"
              :limit="500"
              :newline-limit="20"
              :expandable="true">
            </truncate-long-text>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <p v-if="!annotations" class="mar-bottom-xl">
      There are no annotations on this resource.
    </p>
  </div>
</template>

<script>
export default {
  name: 'Annotations',

  props: {
    annotations: { type: Object, default: () => ({}) },
  },

  data() {
    return {
      expandAnnotations: false,
    };
  },

  methods: {
    toggleAnnotations() {
      this.expandAnnotations = !this.expandAnnotations;
    },
  },
};
</script>

<style lang="scss">
.annotations {
  .table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 2px;
    background: #fff;

    tr,
    td {
      padding: 8px 10px;
    }

    td {
      border: 1px solid #dee2e6;
      color: #595f69;
    }
  }

  .table-bordered {
    border: 1px solid #e4e7ed;
  }

  .mar-bottom-sm {
    margin-bottom: 10px;
  }

  .mar-bottom-xl {
    margin-bottom: 100px;
  }
}
</style>
