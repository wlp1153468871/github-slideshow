import { mapState } from 'vuex';

import AppStoreService from '@/core/services/appstore.service';

export default {
  name: 'AppStoreInstance',
  data() {
    return {
      activeName: 'first',
      tableData: [
        {
          resourceName: 'ngnix-example-1',
          type: 'Deployment',
          state: 'Created',
          date: '2020-5-23 15:12:45',
        },
        {
          resourceName: 'ngnix-example-1',
          type: 'Deployment',
          state: 'Created',
          date: '2020-5-23 15:12:45',
        },
      ],
      // 实例
      instanceInfo: '',
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
            this.appType = res.appType;
          }
        });
    },
    // 获取操作
    getOperator() {
      AppStoreService
        .getOperator(this.zone.id, this.space.id, this.$route.params.appid,
          this.$route.params.instanceid)
        .then(res => {
          if (res) {
            const obj = {};
            const owner = {};
            res.forEach((item, index) => {
              obj.started_at = item.created_at;
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
