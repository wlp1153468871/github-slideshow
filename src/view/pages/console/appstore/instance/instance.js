import { mapState } from 'vuex';

import AppStoreService from '@/core/services/appstore.service';

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
          })
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
