<template>
  <span>
    <template v-if="!longEnough">
      <code>{{trimedCode}}</code><br/>
    </template>
    <template v-else-if="!collapsed">
      <code>{{trimedCode}}</code><br/>
      <a @click="toggleCollapse">收起</a>
    </template>
    <template v-else>
      <code>{{trimedCode | codeValueCollapsed}}</code><br/>
      <a @click="toggleCollapse">展开</a>
    </template>
  </span>
</template>

<script>
export default {
  name: 'collapibleCode',
  props: ['code'],
  data() {
    return {
      collapsed: true,
    };
  },
  computed: {
    trimedCode() {
      return this.code.trim();
    },
    longEnough() {
      return this.trimedCode.length > 50;
    },
  },
  methods: {
    toggleCollapse() {
      this.collapsed = !this.collapsed;
    },
  },
  filters: {
    codeValueCollapsed(v) {
      return `${v.slice(0, 50)}...`;
    },
  },
};
</script>
