<template>
  <div class="dao-left-nav-section" v-show="uls.length">
    <h2 class="dao-left-nav-title">{{ section.name }}</h2>

    <div
      class="dao-left-nav-group"
      v-for="(ul, index) in uls"
      v-show="ul.isShow()"
      :key="index"
      :style="{ 'pointer-events': ul.isDisabled ? 'none' : 'all' }">

      <div
        class="dao-left-nav-ul-title"
        :class="{ active: ulActive(ul) && !ul.isOpen }"
        @click="routeTo(ul)">

        <!-- 如果有子目录就显示一个折叠标记 -->
        <svg
          class="down-arrow"
          :class="{ 'right-arrow': !ul.isOpen }"
          @click.stop="toggle(ul)"
          v-if="ul.children && ul.children.length">
          <use xlink:href="#icon_down-arrow"></use>
        </svg>
        <svg class="text-icon">
          <use :xlink:href="ul.icon"></use>
        </svg>
        <span class="dao-left-nav-ul-title-name">
          {{ ul.name }}
        </span>
      </div>
      <ul
        class="dao-left-nav-ul"
        v-if="ul.children && ul.children.length && ul.isOpen">
        <li
          class="dao-left-nav-item"
          :class="{ active: li.isActive() }"
          v-for="li in ul.children"
          v-show="li.isShow()"
          @click="routeTo(li)"
          :key="li.name">
          <span class="item-span">{{ li.name }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SideBarSection',
  props: {
    section: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      uls: [],
    };
  },
  watch: {
    section: {
      immediate: true,
      handler() {
        const { children } = this.section;
        this.uls = children.map(ul => {
          return ul.children ? Object.assign({ isOpen: false }, ul) : ul;
        });
      },
    },
  },
  methods: {
    ulActive(ul) {
      return ul.children
        ? ul.children.some(li => li.isActive())
        : ul.isActive();
    },

    routeTo(ul) {
      if (ul.state) {
        const { state = 'home', stateParams = {} } = ul;
        this.$router.push({
          name: state,
          ...stateParams,
        });
      }
      if (ul.children) {
        this.toggle(ul);
      }
    },

    toggle(ul) {
      ul.isOpen = !ul.isOpen;
    },
  },
};
</script>
