import { mapState } from 'vuex';
import { groupBy } from 'lodash';

import AppStoreService from '@/core/services/appstore.service';

import PodTable from '@/view/components/resource/pod-table/pod-table';
import PvcTable from '@/view/components/resource/pvc-table/pvc-table';
import Marked from '@/view/components/marked/marked.vue';

import DeploymentPanel from '@/view/pages/console/app/detail/panels/deployment';
import ServicePanel from '@/view/pages/console/app/detail/sections/service.vue';
import IngressPanel from '@/view/pages/console/app/detail/panels/ingress';
import ConfigPanel from '@/view/pages/console/app/detail/panels/config';
import JobPanel from '@/view/pages/console/app/detail/panels/job';

export default {
  name: 'AppStoreInstance',
  data() {
    return {
      activeName: 'first',
      // 实例
      instanceInfo: '',
      appInfo: '',
      appType: '',
      operator: [],
      //  资源列表
      resources: {
        Depolyment: [],
        DeploymentConfig: [],
        Service: [],
        Ingress: [],
        Pod: [],
        ConfigMap: [],
        PersistentVolumeClaim: [],
      },
      //  懒加载
      loading: {
        resources: false,
      },
      //  状态
      stateMap: {
        deployed: 'success',
        failed: 'error',
        timeOut: 'warning',
      },
    };
  },

  components: {
    DeploymentPanel,
    ServicePanel,
    IngressPanel,
    PodTable,
    ConfigPanel,
    PvcTable,
    JobPanel,
    Marked,
  },

  computed: {
    ...mapState(['space', 'zone', 'user']),
    stateClass() {
      return this.stateMap[this.instanceInfo.status] || '';
    },
  },

  created() {
    this.activeName = this.$route.query.activeName || 'first';

    this.getInstanceOne();
    this.getApp();
    this.getOperator();
  },

  methods: {
    toDetail() {
      this.activeName = 'second';
    },
    // 表单更新
    linktoForm() {
      this.$router.push({
        name: 'appstore.form',
        params: {
          appid: this.$route.params.appid,
          version: this.instanceInfo.chartVersion,
        },
        query: {
          instanceId: this.$route.params.instanceid,
          isInstance: true,
          activeName: this.activeName,
        },
      });
    },
    // Yaml更新
    linktoYamlForm() {
      this.$router.push({
        name: 'appstore.yamlform',
        params: {
          appid: this.$route.params.appid,
          version: this.instanceInfo.chartVersion,
        },
        query: {
          instanceId: this.$route.params.instanceid,
        },
      });
    },
    // 删除实例
    deleteInstance() {
      AppStoreService
        .deleteInstance(this.zone.id, this.space.id,
          this.$route.params.appid, this.$route.params.instanceid)
        .then(() => {
          this.$noty.success('实例删除成功');
          this.$router.push({
            name: 'appstore.detail',
            params: {
              Id: this.$route.params.appid,
            },
          });
        })
        .catch(() => {
          this.getOperator();
          this.getInstanceOne();
        });
    },
    // 获取实例详情
    getInstanceOne() {
      AppStoreService
        .getInstanceOne(this.zone.id, this.space.id, this.$route.params.appid,
          this.$route.params.instanceid)
        .then(res => {
          if (res) {
            this.instanceInfo = res;
          }
        })
        .then(() => {
          if (this.instanceInfo.status !== 'failed') {
            this.getResource();
          }
        });
    },
    // 获取应用
    getApp() {
      AppStoreService
        .getApp(this.zone.id, this.space.id, this.$route.params.appid)
        .then(res => {
          if (res) {
            this.appInfo = res;
          }
        });
    },
    // 获取操作
    getOperator() {
      AppStoreService
        .getOperator(this.zone.id, this.space.id, this.$route.params.instanceid)
        .then(res => {
          this.operator = [];
          if (res) {
            res.forEach(item => {
              const obj = {};
              const owner = {};
              obj.name = item.actionDescription;
              obj.started_at = item.startedAt;
              obj.ended_at = item.endedAt;
              obj.description = item.resultDetail.response;
              if (item.resultDescription === 'deployed') {
                obj.status = 'succeed';
              } else {
                obj.status = item.resultDescription;
              }
              owner.name = item.userName;
              obj.owner = owner;
              this.operator.push(obj);
            });
          }
        });
    },
    // 获取资源
    getResource() {
      this.loading.resources = true;
      AppStoreService
        .getResource(this.zone.id, this.space.id, this.$route.params.appid,
          this.$route.params.instanceid)
        .then(res => {
          if (res) {
            this.resources = groupBy(res, 'kind');
          }
        })
        .finally(() => {
          this.loading.resources = false;
        });
    },
    getUrl(url) {
      const local = window.location;
      if (process.env.NODE_ENV === 'development') {
        return `${process.env.VUE_APP_API_URL}${url}`;
      }
      return `${local.origin}${url}`;
    },
  },
};
