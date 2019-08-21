<template>
  <div class="traffic-table">
    <table class="dao-table row">
      <thead>
      <tr>
        <th>Route<span v-if="showNodePorts"> / Node Port</span></th>
        <th role="presentation"></th>
        <th>Service Port</th>
        <th role="presentation"></th>
        <th>Target Port</th>
        <th>Hostname</th>
        <th>TLS Termination</th>
      </tr>
      </thead>
      <tbody v-if="hashSizeFilter(portsByRoute) === 0">
      <tr>
        <td colspan="7"><em>No routes or ports to show</em></td>
      </tr>
      </tbody>

      <tbody v-if="hashSizeFilter(portsByRoute)">

      <template v-for="(ports, routeName) in portsByRoute">

        <tr
          v-for="(port, index) in ports"
          v-if="routeName !== ''"
          :key="routeName + index">

          <td>
            <router-link
              :to="{
                name: 'resource.routes.detail',
                params: { name: routes[routeName].metadata.name }
               }">
              {{ routes[routeName].metadata.name }}
            </router-link>
            <span v-if="showNodePorts">
              <span v-if="port.nodePort"> / {{port.nodePort}}</span>
            </span>
          </td>

          <td role="presentation" class="text-muted text-center">
            <svg class="icon text-muted">
              <use xlink:href="#icon_arrow-right"></use>
            </svg>
          </td>

          <td>
            {{port.port}}/{{port.protocol}}
            <span v-if="port.name">({{port.name}})</span>
          </td>

          <td role="presentation" class="text-muted text-center">
            <svg class="icon">
              <use xlink:href="#icon_arrow-right"></use>
            </svg>
          </td>

          <td>
            {{port.targetPort}}
          </td>

          <td>
            <span v-if="isWebRouteFilter(routes[routeName])" class="word-break">
              <a :href="routes[routeName] | route_web_url" target="_blank">
                {{routes[routeName] | route_label}}
                <svg class="icon">
                  <use xlink:href="#icon_link"></use>
                </svg>
              </a>
            </span>
            <span v-else class="word-break">
              {{routes[routeName] | route_label}}
            </span>

            <dao-popover
              v-if="!routes[routeName].status.ingress"
              :content="routeStatusInfo"
              trigger="hover">
              <span style="cursor: help; padding-left: 5px;">
                <status-icon :status="'Pending'"></status-icon>
                <span class="sr-only">Pending</span>
              </span>
            </dao-popover>
          </td>

          <td>
            <template v-if="routes[routeName].spec.tls">
              {{routes[routeName].spec.tls.termination | humanize_tls_termination}}
              <span v-if="!routes[routeName].spec.tls.termination">&nbsp;</span>
            </template>
            <template v-else>
              暂无
            </template>
          </td>
        </tr>

      </template>

      <tr
        v-for="(port, index) in portsByRoute['']"
        :key="index">
        <td>
          <span v-if="!port.nodePort" class="text-muted">暂无</span>
          <span v-if="port.nodePort">{{port.nodePort}}</span>
        </td>

        <td role="presentation" class="text-muted text-center">
          <svg class="icon text-muted">
            <use xlink:href="#icon_arrow-right"></use>
          </svg>
        </td>

        <td data-title="Service Port">
          {{port.port}}/{{port.protocol}}
          <span v-if="port.name">({{port.name}})</span>
        </td>

        <td role="presentation" class="text-muted text-center">
          <svg class="icon text-muted">
            <use xlink:href="#icon_arrow-right"></use>
          </svg>
        </td>

        <td data-title="Target Port">
          {{port.targetPort}}
        </td>

        <td data-title="Hostname"><span class="text-muted">暂无</span></td>

        <td data-title="Termination">
          <span class="text-muted">暂无</span>
        </td>
      </tr>

      </tbody>
    </table>
  </div>
</template>

<script>
import hashSizeFilter from '@/view/filters/hash-size.filter';
import isWebRouteFilter from '@/view/filters/resource/is-web-route.filter';
import { get as getValue } from 'lodash';

export default {
  name: 'traffic-table',

  props: {
    service: { type: Object, default: () => ({}) },
    routes: { type: Object, default: () => ({}) },
    portsByRoute: { type: Object, default: () => ({}) },
    showNodePorts: { type: Boolean, default: () => false },
  },

  data() {
    return {
      routeStatusInfo:
        'The route is not accepting traffic yet because it has not been admitted by a router.',
    };
  },

  methods: {
    hashSizeFilter,
    isWebRouteFilter,
    getValue,
  },
};
</script>

<style lang="scss">
</style>
