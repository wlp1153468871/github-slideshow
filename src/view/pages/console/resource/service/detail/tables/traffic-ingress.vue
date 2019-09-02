<template>
  <div class="traffic-table">
    <table class="dao-table row">
      <thead>
      <tr>
        <th>Ingress<span v-if="showNodePorts"> / Node Port</span></th>
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
        <td colspan="7"><em>No ingresses or ports to show</em></td>
      </tr>
      </tbody>

      <tbody v-else>

      <template v-for="(ports, key) in portsByIngress">

        <tr
          v-for="(port, index) in ports"
          v-if="key !== ''"
          :key="key + index">

          <td>
            <resource-link
              kind="Ingress"
              :name="ingressMap[key].name"
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
            <a :href="ingressMap[key] | webURL" target="_blank">
              {{ ingressMap[key] | webURL }}
              <svg class="icon">
                <use xlink:href="#icon_link"></use>
              </svg>
            </a>
          </td>

          <td>
            <resource-link
              :kind="RESOURCE_TYPE.SECRET"
              :name="ingressMap[key].tls"
            >
            </resource-link>
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
import { RESOURCE_TYPE } from '@/core/constants/resource';
import hashSizeFilter from '@/view/filters/hash-size.filter';
import isWebRouteFilter from '@/view/filters/resource/is-web-route.filter';
import { each, get as getValue } from 'lodash';
import UnusedPort from './unused-port';

export default {
  name: 'traffic-ingress',

  components: {
    UnusedPort,
  },

  props: {
    service: { type: Object, default: () => ({}) },
    ingressList: { type: Array, default: () => [] },
  },

  computed: {
    noPorts() {
      return (
        hashSizeFilter(this.portsByIngress) === 0 &&
        this.unusedPorts.length === 0
      );
    },
  },

  data() {
    return {
      RESOURCE_TYPE,
      flattedIngressList: [],
      portsByIngress: {},
      ingressMap: {},
      showNodePorts: false,
      unusedPorts: [],
    };
  },

  methods: {
    isWebRouteFilter,
    getValue,

    matchTLS(tls, hostName) {
      let secret = '';
      if (!tls) {
        return secret;
      }
      tls.forEach(({ hosts, secretName }) => {
        hosts.forEach(host => {
          if (host === hostName) {
            secret = secretName;
          }
        });
      });
      return secret;
    },
  },

  filters: {
    webURL({ host, tls, path }) {
      const scheme = tls ? 'https' : 'http';
      return `${scheme}://${host}${path}`;
    },
  },

  created() {
    this.ingressList.forEach(ingress => {
      ingress.spec.rules.forEach(rule => {
        rule.http.paths.forEach(path => {
          if (path.backend.serviceName === this.service.metadata.name) {
            this.flattedIngressList.push({
              name: ingress.metadata.name,
              host: rule.host,
              path: path.path,
              servicePort: path.backend.servicePort,
              tls: this.matchTLS(ingress.spec.tls, rule.host),
            });
          }
        });
      });
    });

    this.flattedIngressList.forEach(ingress => {
      const key = ingress.name + ingress.host + ingress.path;
      this.ingressMap[key] = ingress;
    });

    each(this.service.spec.ports, port => {
      let reachedByRoute = false;
      if (port.nodePort) {
        this.showNodePorts = true;
      }

      each(this.ingressMap, (ingress, key) => {
        if (
          ingress.servicePort === port.name ||
          ingress.servicePort === port.targetPort
        ) {
          this.portsByIngress[key] = this.portsByIngress[key] || [];
          this.portsByIngress[key].push(port);
          reachedByRoute = true;
        }
      });

      if (!reachedByRoute) {
        this.unusedPorts.push(port);
      }
    });
  },
};
</script>
