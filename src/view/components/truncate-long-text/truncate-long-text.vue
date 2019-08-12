<template>
  <div class="truncate-long-text">
    <span v-if="!truncated">
      <span
        v-html="fullContent"
        class="truncated-content">
      </span>
    </span>

    <span v-if="truncated">
      <span v-if="!expanded">
        <span class="truncation-block">
          <span
            v-html="truncatedContent"
            class="truncated-content">
          </span>&hellip;
        </span>
        <span
          v-if="expandable"
          @click="expanded = true"
          class="truncation-expand-link">
          See All
        </span>
      </span>
      <span v-if="expanded">
      <span
        v-html="fullContent"
        class="truncated-content">
      </span>
      <span
        v-if="!hideCollapse"
        @click="expanded = false"
        class="truncation-collapse-link">Collapse</span>
      </span>
    </span>
  </div>
</template>

<script>
import { size } from 'lodash';
import Vue from 'vue';

export default {
  name: 'TruncateLongText',

  props: {
    content: String,
    limit: Number,
    newlineLimit: Number,
    useWordBoundary: Boolean,
    expandable: Boolean,
    // When expandable is on,
    // optionally hide the collapse link so text can only be expanded.
    // (Used for toast notifications.)
    hideCollapse: Boolean,
    // optional keywords to highlight using the `highlightKeywords` filter
    keywords: String,
  },

  data() {
    return {
      expanded: false,
    };
  },

  computed: {
    truncated() {
      if (!this.truncatedContent) return false;
      return this.truncatedContent.length !== this.fullContent.length;
    },

    truncatedContent() {
      if (!this.content) return null;
      const truncatedContent = Vue.filter('truncate')(
        this.content,
        this.limit,
        this.useWordBoundary,
        this.newlineLimit,
      );

      if (size(this.keywords)) {
        return Vue.filter('highlight_keywords')(
          truncatedContent,
          this.keywords,
        );
      }

      return truncatedContent;
    },

    fullContent() {
      if (size(this.keywords)) {
        return Vue.filter('highlight_keywords')(this.content, this.keywords);
      }
      return this.content;
    },
  },
};
</script>

<style lang="scss">
.truncated-content {
  white-space: pre-line;
}

.truncation-block {
  margin-right: 10px;
}

.truncation-expand-link {
  white-space: nowrap;

  .table-responsive & {
    display: block;
  }
}
</style>
