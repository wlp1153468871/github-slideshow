<template>
  <div class="dao-list-group-container">
    <ul
      class="dao-list-group"
      v-for="(group, index) in groups"
      :key="index">
      <li
        class="dao-list-item"
        v-for="item in group"
        :key="item"
        @click="onSelectItem(item)"
        :class="{'active': content === item }">
        {{ item }}
        <span class="icon">
          <svg>
            <use xlink:href="#icon_caret-right"></use>
          </svg>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
import { first } from 'lodash';

export default {
  name: 'ListGroup',
  props: {
    groups: { type: Array, default: () => [] },
    content: { type: String, default: '' },
  },
  watch: {
    groups() {
      this.content = first(first(this.groups));
    },
  },
  methods: {
    onSelectItem(item) {
      this.$emit('update:content', item);
    },
  },
};
</script>
