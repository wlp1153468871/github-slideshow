<template>
  <div class="ingress-detail">
    <circle-loading v-if="loadings.detail"></circle-loading>
    <template v-else-if="ingress">
      <resource-header :resource="resource">

        <template #creationTime>
          创建于{{ ingress.metadata.creationTimestamp | date }}
        </template>

        <template #status v-if="status === 'approving'">
          <labels highLight :labels="{'状态': '审批中'}"></labels>
        </template>

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
                @click="dialogs.update = true">
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
                  <div class="col-xs-4">Host</div>
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
                        <div class="col-xs-4 break-word">
                          <a :href="ingress | ingress_web_url(rule, path)" target="_blank">
                            {{ rule.host }}
                            <svg class="icon">
                              <use xlink:href="#icon_link"></use>
                            </svg>
                          </a>
                        </div>
                        <div class="col-xs-3 break-word">
                          <div>{{ path.path }}</div>
                        </div>
                        <div class="col-xs-3">
                          <resource-link
                            kind="Service"
                            :name="path.backend.serviceName">
                          </resource-link>
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
              <pod-table
                :loading="loadings.pod"
                :pods="pods"
                @refresh="getPods">
              </pod-table>
            </div>
          </div>

          <div class="panel-resource">
            <h3>TLS Certificate</h3>
            <div class="panel-resource-content">
              <div class="ingress-table" v-if="ingress.spec.tls && ingress.spec.tls.length">
                <div class="row ingress-table-head">
                  <div class="col-xs-6">Host</div>
                  <div class="col-xs-6">Secret</div>
                </div>
                <div class="ingress-table-body">
                  <div
                    class="row"
                    v-for="(tls, index) in ingress.spec.tls"
                    :key="index">
                    <div class="col-xs-6 break-word">
                      <div>{{ tls.hosts.join() }}</div>
                    </div>
                    <div class="col-xs-6">
                      <resource-link
                        kind="Secret"
                        :name="tls.secretName">
                      </resource-link>
                    </div>
                  </div>
                </div>
              </div>
              <p v-else class="text-muted">暂未配置</p>
            </div>
          </div>

          <annotations
            style="margin-top: 15px;"
            :annotations="ingress.metadata.annotations">
          </annotations>
        </div>
      </div>
    </template>

    <edit-yaml-dialog
      :value="ingress"
      :visible.sync="dialogs.update"
      :header="'更新 ' + name"
      @update="updateIngress">
    </edit-yaml-dialog>
  </div>
</template>

<script>
import { RESOURCE_TYPE } from '@/core/constants/resource';
import IngressService from '@/core/services/ingress.service';
import PodTable from '@/view/components/resource/pod-table/pod-table';
import ResourceMixin from '@/view/mixins/resource';

export default {
  name: 'IngressDetail',

  mixins: [ResourceMixin],

  components: { PodTable },

  data() {
    const { tab } = this.$route.query;

    return {
      kind: RESOURCE_TYPE.INGRESS,
      activeTab: tab,
      loadings: {
        detail: true,
        pod: true,
      },
      ingress: null,
      dialogs: {
        update: false,
      },
      status: '',
      pods: [],
    };
  },

  created() {
    this.init();
  },

  methods: {
    init() {
      this.getIngress();
      this.getPods();
    },

    getIngress() {
      const { name } = this;
      this.loadings.detail = true;
      IngressService.get(name).then(({ originData, status }) => {
        this.ingress = originData;
        this.status = status;
        this.loadings.detail = false;
      });
    },

    getPods() {
      this.loadings.pod = true;
      const { name } = this;
      IngressService.getPods(name).then(({ originData }) => {
        this.pods = originData;
        this.loadings.pod = false;
      });
    },

    updateIngress(ingressModel) {
      const { name } = this;
      IngressService.update(ingressModel, name).then(res => {
        if (res.is_need_approval) {
          this.$noty.success('请在审批记录页面，查看审批进度');
        } else {
          this.$noty.success('更新成功');
        }
        this.getIngress();
      });
    },

    ensureRemove() {
      this.$tada
        .confirm({
          title: `删除 ${this.name}`,
          text: `您确定要删除 Ingress ${this.name} 吗？`,
        })
        .then(willDelete => {
          if (willDelete) {
            this.deleteIngress();
          }
        });
    },

    deleteIngress() {
      IngressService.delete(this.name).then(() => {
        this.$noty.success('删除成功');
        this.goBack();
      });
    },
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
}
</style>
