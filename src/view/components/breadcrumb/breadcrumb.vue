<template>
  <ol class="breadcrumb">
    <li v-for="(item, index) in links" :key="index">
      <router-link v-if="item.route" :to="item.route">
        {{ item.text }}
      </router-link>
      <span v-else>{{ item.text }}</span>
    </li>
  </ol>
</template>

<script>
export default {
  name: 'Breadcrumb',
  props: {
    links: { type: Array, default: () => [] },
  },
};
</script>

<style lang="scss">
@import "~daoColor";

.breadcrumb {
  display: inline-block;
  padding-left: 0;
  list-style: none;
  a {
    color: $black-dark;
    &:hover {
      text-decoration: underline;

      text-underline-position: 3px;
    }
  }
  & > li {
    display: inline-block;
  }
  & > li + li:before {
    content: "/";
    padding: 0 5px;
    color: $black-dark;
    font-weight: 500;
  }
  li:last-child {
    a,
    span {
      color: $black-dark;
      font-weight: 500;
    }
  }
}
</style>
