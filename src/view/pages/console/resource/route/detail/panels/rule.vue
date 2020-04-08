<template>
  <div>
    <dao-setting-layout>
      <template slot="layout-title">
        {{ isBlueGreen? '按百分比' : '默认' }}发布
      </template>
      <template slot="layout-setting">
        <button
          v-if="$can('route.update', 'route')"
          class="dao-btn btn-sm mini blue"
          @click="openUpdateDialog">
          更改
        </button>
      </template>
      <dao-setting-section>
        <dao-setting-item>
          <div slot="content">
            <!-- 蓝绿发布 -->
            <div
              class="csp-table-container"
              v-if="isBlueGreen">
              <table class="csp-table-layout">
                <thead>
                <tr>
                  <th>服务</th>
                  <th>权重</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>新版本: {{ next.name }}</td>
                  <td>{{ next.weight }} %</td>
                </tr>
                <tr>
                  <td>旧版本: {{ current.name }}</td>
                  <td>{{ current.weight }} %</td>
                </tr>
                </tbody>
              </table>
            </div>

            <!-- 默认发布 -->
            <div
              class="dao-setting-patch"
              v-else>
              <p>所有请求将被路由到当前 Service <b>{{ current.name }}</b></p>
            </div>
          </div>
        </dao-setting-item>
      </dao-setting-section>
    </dao-setting-layout>

    <route-update-dialog
      :visible="dialog.update"
      :route="route"
      @update="updateRoute"
      @close="closeUpdateDialog">
    </route-update-dialog>
  </div>
</template>

<script>
import { DEPLOYMENT_TYPE } from '@/core/constants/app';
import { first } from 'lodash';
import RouteUpdateDialog from '../dialogs/update';

export default {
  name: 'RulePanel',

  components: { RouteUpdateDialog },

  props: {
    route: { type: Object, default: () => ({}) },
  },

  data() {
    return {
      DEPLOYMENT_TYPE,
      dialog: {
        update: false,
      },
    };
  },

  computed: {
    isBlueGreen() {
      return (
        this.route.spec.alternateBackends &&
        this.route.spec.alternateBackends.length > 0
      );
    },

    current() {
      return this.route.spec.to;
    },

    next() {
      return first(this.route.spec.alternateBackends);
    },
  },

  methods: {
    openUpdateDialog() {
      this.dialog.update = true;
    },

    closeUpdateDialog() {
      this.dialog.update = false;
    },

    updateRoute() {
      this.$emit('update');
    },
  },
};
</script>
