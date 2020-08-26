import { mapState } from 'vuex';

import AppStoreService from '@/core/services/appstore.service';

import PodTable from '@/view/components/resource/pod-table/pod-table';
import PvcTable from '@/view/components/resource/pvc-table/pvc-table';
import MarkDown from '@/view/components/markdown/markdown.vue';

import DeploymentPanel from '@/view/pages/console/app/detail/panels/deployment';
import ServicePanel from '@/view/pages/console/app/detail/sections/service.vue';
import IngressPanel from '@/view/pages/console/app/detail/panels/ingress';
import ConfigPanel from '@/view/pages/console/app/detail/panels/config';

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

  computed: {
    ...mapState(['space', 'zone', 'user']),
  },

  created() {
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
        .getOperator(this.zone.id, this.space.id, this.$route.params.appid,
          this.$route.params.instanceid)
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
  },
};
