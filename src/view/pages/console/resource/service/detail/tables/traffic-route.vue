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
      <tbody v-if="noPorts">
      <tr>
        <td colspan="7"><em>No routes or ports to show</em></td>
      </tr>
      </tbody>

      <tbody v-else>

      <template v-for="(ports, routeName) in portsByRoute">

        <tr
          v-for="(port, index) in ports"
          v-if="routeName !== ''"
          :key="routeName + index">

          <td>
            <resource-link
              kind="Route"
              :name="routeName"
            >
            </resource-link>
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
            <span v-if="isWebRouteFilter(routesForService[routeName])" class="word-break">
              <a :href="routesForService[routeName] | route_web_url" target="_blank">
                {{routesForService[routeName] | route_label}}
                <svg class="icon">
                  <use xlink:href="#icon_link"></use>
                </svg>
              </a>
            </span>
            <span v-else class="word-break">
              {{routesForService[routeName] | route_label}}
            </span>

            <dao-popover
              v-if="!routesForService[routeName].status.ingress"
              :content="routeStatusInfo"
              trigger="hover">
              <span style="cursor: help; padding-left: 5px;">
                <status-icon :status="'Pending'"></status-icon>
                <span class="sr-only">Pending</span>
              </span>
            </dao-popover>
          </td>

          <td>
            <template v-if="routesForService[routeName].spec.tls">
              {{routesForService[routeName].spec.tls.termination | humanize_tls_termination}}
              <span v-if="!routesForService[routeName].spec.tls.termination">&nbsp;</span>
            </template>
            <template v-else>
              暂无
            </template>
          </td>
        </tr>

      </template>

      <unused-port
        v-for="(port, index) in unusedPorts"
        :key="index"
        :port="port"
      >
      </unused-port>

      </tbody>
    </table>
  </div>
</template>

<script>
import hashSizeFilter from '@/view/filters/hash-size.filter';
import isWebRouteFilter from '@/view/filters/resource/is-web-route.filter';
import { each, get as getValue } from 'lodash';
import UnusedPort from './unused-port';

export default {
  name: 'traffic-route',

  components: {
    UnusedPort,
  },

  props: {
    service: { type: Object, default: () => ({}) },
    routes: { type: Array, default: () => [] },
  },

  data() {
    return {
      routeStatusInfo:
        'The route is not accepting traffic yet because it has not been admitted by a router.',
      routesForService: {},
      portsByRoute: {},
      showNodePorts: false,
      unusedPorts: [],
    };
  },

  computed: {
    noPorts() {
      return (
        hashSizeFilter(this.portsByRoute) === 0 && this.unusedPorts.length === 0
      );
    },
  },

  created() {
    this.routes.forEach(route => {
      this.routesForService[route.metadata.name] = route;
    });
    this.getPortsByRoute();
  },

  methods: {
    isWebRouteFilter,
    getValue,
    // receives routes for the current service and maps service ports to each route name
    getPortsByRoute() {
      this.portsByRoute = {};
      each(this.service.spec.ports, port => {
        let reachedByRoute = false;
        if (port.nodePort) {
          this.showNodePorts = true;
        }

        each(this.routesForService, route => {
          if (
            !route.spec.port ||
            route.spec.port.targetPort === port.name ||
            route.spec.port.targetPort === port.targetPort
          ) {
            this.portsByRoute[route.metadata.name] =
              this.portsByRoute[route.metadata.name] || [];
            this.portsByRoute[route.metadata.name].push(port);
            reachedByRoute = true;
          }
        });

        if (!reachedByRoute) {
          this.unusedPorts.push(port);
        }
      });
    },
  },
};
</script>
