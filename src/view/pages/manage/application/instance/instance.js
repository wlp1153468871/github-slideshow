import { groupBy } from 'lodash';

import ServiceAdmin from '@/core/services/service-admin.service';

import PodTable from '@/view/components/resource/pod-table/pod-table';
import PvcTable from '@/view/components/resource/pvc-table/pvc-table';
import Marked from '@/view/components/marked/marked.vue';

import DeploymentPanel from '@/view/pages/console/app/detail/panels/deployment';
import ServicePanel from '@/view/pages/console/app/detail/sections/service.vue';
import IngressPanel from '@/view/pages/console/app/detail/panels/ingress';
import ConfigPanel from '@/view/pages/console/app/detail/panels/config';
import JobPanel from '@/view/pages/console/app/detail/panels/job';

export default {
  name: 'AdminInstance',
  data() {
    return {
      activeName: 'first',
      // 实例
      instanceInfo: '',
      appInfo: '',
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
    stateClass() {
      return this.stateMap[this.instanceInfo.status] || '';
    },
  },

  created() {
    this.getInstance();
    this.getApp();
    this.getOperator();
  },

  methods: {
    toDetail() {
      this.activeName = 'second';
    },
    // 获取实例详情
    getInstance() {
      ServiceAdmin
        .getInstance(this.$route.params.appid, this.$route.params.instanceid)
        .then(res => {
          if (res) {
            this.instanceInfo = res;
          }
        })
        .then(() => {
          if (this.instanceInfo.status !== 'failed') {
            this.getResources();
          }
        });
    },
    // 获取应用
    getApp() {
      ServiceAdmin
        .getApp(this.$route.params.appid).then(res => {
          if (res) {
            this.appInfo = res;
          }
        });
    },
    // 获取操作
    getOperator() {
      ServiceAdmin
        .getOperator(this.$route.params.appid, this.$route.params.instanceid)
        .then(res => {
          if (res) {
            res.forEach(item => {
              const obj = {};
              const owner = {};
              obj.name = item.statusRecord;
              obj.started_at = item.startedAt;
              obj.ended_at = item.endedAt;
              obj.description = item.description;
              if (item.status === 'deployed') {
                obj.status = 'succeed';
              } else {
                obj.status = item.status;
              }
              owner.name = item.operator;
              obj.owner = owner;
              this.operator.push(obj);
            });
          }
        });
    },
    //  拉取资源
    getResources() {
      this.loading.resources = true;
      ServiceAdmin.getResources(this.$route.params.appid, this.$route.params.instanceid)
        .then(res => {
          if (res) {
            this.resources = groupBy(res, 'kind');
          }
        })
        .finally(() => {
          this.loading.resources = false;
        });
    },
  },
};
