<template>
  <div class="ingress-detail">
    <circle-loading v-if="loading"></circle-loading>
    <template v-else-if="ingress">
      <resource-header :resource="resource">

        <template #creationTime>
          创建于{{ ingress.metadata.creationTimestamp | date }}
        </template>

        <!--<template #status v-if="status === 'approving'">
          <labels highLight :labels="{'状态': '审批中'}"></labels>
        </template>-->

        <template #labels>
          <labels :labels="ingress.metadata.labels || {}"></labels>
        </template>

        <template #action-buttons>
          <dao-dropdown
            v-if="$can('update') || $can('delete')"
            trigger="click"
            :append-to-body="true"
            placement="bottom-end">
            <button class="dao-btn ghosthas-icon">
              操作
              <svg class="icon">
                <use xlink:href="#icon_caret-down"></use>
              </svg>
            </button>

            <dao-dropdown-menu slot="list">
              <dao-dropdown-item
                v-if="$can('update')"
                @click="openUpdateDialog">
                <span>更新</span>
              </dao-dropdown-item>
              <dao-dropdown-item
                v-if="$can('delete')"
                @click="ensureRemove"
                class="dao-dropdown-item-red dao-dropdown-item-hover-red">
                <span>删除</span>
              </dao-dropdown-item>
            </dao-dropdown-menu>
          </dao-dropdown>
          <button
            class="dao-btn csp-table-update-btn"
            @click="init"
            style="margin-left: 10px">
            <svg class="icon">
              <use xlink:href="#icon_update"></use>
            </svg>
          </button>

        </template>
      </resource-header>

      <div class="dao-view-main">
        <div class="dao-view-content">
          <div class="panel-resource">
            <h3>Rules</h3>
            <div class="panel-resource-content">
              <p class="sub-title">
                These rules are handled by a routing layer (Ingress Controller)
                which is updated as the rules are modified.
                The Ingress controller implementation defines how headers
                and other metadata are forwarded or
                manipulated.
              </p>
              <div class="ingress-table">
                <div class="row ingress-table-head">
                  <div class="col-xs-3">Host</div>
                  <div class="col-xs-3">Path</div>
                  <div class="col-xs-3">Service</div>
                  <div class="col-xs-2">Service Port</div>
                </div>
                <div class="ingress-table-body">
                  <template v-for="(rule, ruleIndex) in ingress.spec.rules">
                    <template v-for="(path, pathIndex) in rule.http.paths">
                      <div
                        :key="ruleIndex + '-' + pathIndex"
                        class="row">
                        <div class="col-xs-3 break-word">
                          <div>{{ rule.host }}</div>
                        </div>
                        <div class="col-xs-3 break-word">
                          <div>{{ path.path }}</div>
                        </div>
                        <div class="col-xs-3">
                          <span class="resource-link">
                            <span class="sr-only">Service</span>
                            <span
                              class="resource-icon resource-service"
                              title="Service">
                              S
                            </span>
                            <router-link
                              :to="{
                                name: 'resource.services.detail',
                                params: { name: path.backend.serviceName }
                              }">
                              {{ path.backend.serviceName }}
                            </router-link>
                          </span>
                        </div>
                        <div class="col-xs-2">
                          <div>{{ path.backend.servicePort }}</div>
                        </div>
                      </div>
                    </template>
                  </template>
                </div>
              </div>
            </div>
          </div>

          <div class="panel-resource">
            <h3>Pod</h3>
            <div class="panel-resource-content">
              Pods
            </div>
          </div>

          <div class="panel-resource">
            <h3>TLS Certificate</h3>
            <div class="panel-resource-content">
              <div class="ingress-table">
                <div class="row ingress-table-head">
                  <div class="col-xs-3">Host</div>
                  <div class="col-xs-3">Secret</div>
                </div>
                <div class="ingress-table-body">
                  <div
                    class="row"
                    v-for="(tls, index) in ingress.spec.tls"
                    :key="index">
                    <div class="col-xs-3 break-word">
                      <div>{{ tls.hosts.join() }}</div>
                    </div>
                    <div class="col-xs-3">
                      <span class="resource-link">
                        <span class="sr-only">Secret</span>
                        <span
                          class="resource-icon resource-secret"
                          title="Secret">
                          S
                        </span>
                        <router-link
                          :to="{
                            name: 'resource.secrets.detail',
                            params: { name: tls.secretName }
                          }">
                          {{ tls.secretName }}
                        </router-link>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <annotations
            style="margin-top: 15px;"
            :annotations="ingress.metadata.annotations">
          </annotations>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { RESOURCE } from '@/core/constants/resource';
import IngressService from '@/core/services/ingress.service';

export default {
  name: 'IngressDetail',

  props: {},

  data() {
    const { name: ingressName } = this.$route.params;
    const { tab } = this.$route.query;

    return {
      activeTab: tab,
      loading: false,
      resource: {
        ...RESOURCE.INGRESS,
        links: [
          { text: RESOURCE.INGRESS.name, route: RESOURCE.INGRESS.route },
          { text: ingressName },
        ],
      },
      ingress: null,
    };
  },

  created() {
    this.init();
  },

  methods: {
    init() {
      this.getIngress();
    },

    getIngress() {
      IngressService.get().then(ingress => {
        this.ingress = ingress;
      });
    },

    openUpdateDialog() {},

    ensureRemove() {},
  },
};
</script>

<style lang="scss">
.ingress-detail {
  .ingress-table {
    .ingress-table-head,
    .ingress-table-body .row {
      border-bottom: solid 1px #eee;
    }

    .row,
    [class*='col-'] {
      vertical-align: middle;
    }

    .row {
      line-height: normal;
      margin: 0;
    }
  }

  .ingress-table-head {
    padding: 0 0 10px 0;
    color: #666;
    text-transform: uppercase;
    padding: 10px 0;
  }

  .ingress-table-body {
    min-height: 50px;
    position: relative;
    width: 100%;

    .row {
      padding: 10px 0;
    }
  }

  .break-word {
    overflow-wrap: break-word;
    word-wrap: break-word;
  }

  .resource-link {
    align-items: baseline;
    display: flex;
    min-width: 0;
    overflow-wrap: break-word;
    word-wrap: break-word;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }

  .co-resource-link .resource-icon {
    flex-shrink: 0;
  }

  .resource-icon {
    display: inline-block;
    font-weight: normal;
    text-align: center;
    border-radius: 10px;
    height: 18px;
    min-width: 18px;
    padding: 0 4px;
    line-height: 18px;
    color: #fff;
    margin: 0 4px;
    background-color: #00b9e4;
  }

  .resource-service {
    background-color: #6ca100;
  }

  .resource-secret {
    background-color: #ec7a08;
  }
}
</style>
