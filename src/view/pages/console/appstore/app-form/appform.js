import { mapState } from 'vuex';

import AppStoreService from '@/core/services/appstore.service';

export default {
  name: 'AppStoreForm',

  data() {
    return {
      select1: 1,
      select2: 2,
      zones: [
        {
          value: '默认租户',
          index: 1,
        },
      ],
      project: [
        {
          value: '默认项目组',
          index: 2,
        },
      ],
      tableData: [
        {
          key: 'chartmuseum.absoluteUrl',
          value: 'true',
        },
        {
          key: 'chartmuseum.absoluteUrl',
          value: 'false',
        },
        {
          key: 'chartmuseum.absoluteUrl',
          value: 'true',
        },
      ],
      config: {
        visible: false,
      },
      chartName: '',
      instanceName: '',
      table: [],
    };
  },

  computed: {
    ...mapState(['space', 'zone']),
  },

  created() {
    this.getApp();
  },
  methods: {
    // 获取App
    getApp() {
      AppStoreService.getApp(this.zone.id, this.space.id, this.$route.params.appid).then(res => {
        if (res) {
          res.applicationInfos.forEach(data => {
            if (data.version === this.$route.params.version) {
              this.chartName = data.chartName;
            }
          });
          // 创建还是更新
          if (this.$route.query.instanceId) {
            this.getNewForm();
            this.getInstanceOne();
          } else {
            this.getForm();
          }
        }
      });
    },
    // 获取form
    getForm() {
      AppStoreService
        .getForm(this.zone.id, this.space.id, this.$route.params.appid,
          this.chartName, this.$route.params.version)
        .then(res => {
          const arr = [];
          Object.keys(res).forEach(key => {
            const obj = {};
            if (Array.isArray(res[key])) {
              delete res[key];
            } else {
              obj.name = key;
              if (key === 'serviceAccount.name') {
                obj.value = 'default';
              } else {
                obj.value = `${res[key]}`;
              }
              arr.push(obj);
            }
          });
          this.table = [...arr];
        });
    },
    // 获取最新form
    getNewForm() {
      AppStoreService
        .getNewForm(this.zone.id, this.space.id, this.$route.params.appid,
          this.$route.query.instanceId)
        .then(res => {
          const arr = [];
          Object.keys(res).forEach(key => {
            const obj = {};
            if (Array.isArray(res[key])) {
              delete res[key];
            } else {
              obj.name = key;
              if (key === 'serviceAccount.name') {
                obj.value = 'default';
              } else {
                obj.value = `${res[key]}`;
              }
              arr.push(obj);
            }
          });
          this.table = [...arr];
        });
    },
    // 以form创建
    createForm() {
      AppStoreService
        .createForm(this.zone.id, this.space.id, this.$route.params.appid,
          this.chartName, this.$route.params.version, this.instanceName, this.table)
        .then(res => {
          if (res) {
            this.$noty.success('实例创建成功');
            this.$router.go(-1);
          }
        });
    },
    // 获取一个实例
    getInstanceOne() {
      AppStoreService
        .getInstanceOne(this.zone.id, this.space.id, this.$route.params.appid,
          this.$route.query.instanceId)
        .then(res => {
          if (res) {
            this.instanceName = res.name;
          }
        });
    },
    // 更新实例的form
    updateForm() {
      AppStoreService
        .updateForm(this.zone.id, this.space.id, this.$route.params.appid,
          this.$route.query.instanceId, this.table)
        .then(res => {
          console.log('更新1');
          if (res) {
            this.$noty.success('实例更新成功');
            this.$router.push({
              name: 'appstore.detail',
              params: {
                Id: this.$route.params.appid,
              },
              query: {
                activeName: 'second',
              },
            });
          }
        });
    },
    cancerForm() {
      this.config.visible = true;
    },
    close() {
      this.config.visible = false;
    },
    giveUp() {
      this.$router.go(-1);
    },
  },
};
