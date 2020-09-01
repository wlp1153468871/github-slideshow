import { groupBy } from 'lodash';

import ServiceAdmin from '@/core/services/service-admin.service';

import PodTable from '@/view/components/resource/pod-table/pod-table';
import PvcTable from '@/view/components/resource/pvc-table/pvc-table';
import MarkDown from '@/view/components/markdown/markdown.vue';

import DeploymentPanel from '@/view/pages/console/app/detail/panels/deployment';
import ServicePanel from '@/view/pages/console/app/detail/sections/service.vue';
import IngressPanel from '@/view/pages/console/app/detail/panels/ingress';
import ConfigPanel from '@/view/pages/console/app/detail/panels/config';

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
        PVC: [],
      },
      //  懒加载
      loading: {
        resources: false,
      },
    };
  },

  components: {
    MarkDown,
    DeploymentPanel,
    ServicePanel,
    IngressPanel,
    PodTable,
    ConfigPanel,
    PvcTable,
  },

  created() {
    this.getInstance();
    this.getApp();
    this.getOperator();
    this.getResources();
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
          res.sort((a, b) => {
            return a.revision - b.revision;
          });
          if (res) {
            res.forEach((item, index) => {
              const obj = {};
              const owner = {};
              obj.started_at = item.createdAt;
              if (index === 0) {
                owner.name = '创建实例';
              } else {
                owner.name = '更新实例';
              }
              obj.owner = owner;
              this.operator.push(obj);
            });
          }
        });
    },
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
