<template>
  <el-popover
    v-if="content"
    placement="top-start"
    width="300"
    trigger="hover">
    <span v-html="content">
    </span>
    <svg
      class="icon"
      slot="reference"
      style="color: #f7b32b; margin-left: 5px;">
      <use xlink:href="#icon_warning-line"></use>
    </svg>
  </el-popover>
</template>

<script>
import RoutesService from '@/view/pages/console/resource/route/services/route.service';
import Vue from 'vue';
import { map, escape } from 'lodash';

export default {
  name: 'route-warnings',

  props: {
    route: { type: Object, required: true },
    services: { type: Object, required: true },
  },

  data() {
    return {
      content: '',
      annotation: Vue.filter('annotation'),
      routesService: new RoutesService(this.route, this.services),
    };
  },

  created() {
    this.updateWarnings();
  },

  methods: {
    updateWarnings() {
      const warnings = this.routesService.getRouteWarnings(
        this.route,
        this.services,
      );
      this.content = map(warnings, escape).join('<br>');
    },
  },
};
</script>
