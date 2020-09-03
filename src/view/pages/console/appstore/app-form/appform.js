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
      config: {
        visible: false,
      },
      chartName: '',
      instanceName: '',
      table: [],
      loading: false,
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
      this.loading = true;
      AppStoreService
        .createForm(this.zone.id, this.space.id, this.$route.params.appid,
          this.chartName, this.$route.params.version, this.instanceName, this.table)
        .then(res => {
          console.log(res);
          if (res.status === 'deployed') {
            this.$router.go(-1);
            this.$noty.success('实例创建成功');
          } else if (res.status === 'timeOut') {
            this.$noty.warning('实例创建超时');
            this.$router.go(-1);
          } else {
            this.$noty.error('实例创建失败');
          }
        })
        .finally(() => {
          this.loading = false;
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
      this.loading = true;
      AppStoreService
        .updateForm(this.zone.id, this.space.id, this.$route.params.appid,
          this.$route.query.instanceId, this.table)
        .then(res => {
          if (res) {
            this.$noty.success('实例更新成功');
            if (this.$route.query.isInstance) {
              this.$router.push({
                name: 'appstore.instance',
                params: {
                  appid: this.$route.params.appid,
                  instanceid: this.$route.query.instanceId,
                },
              });
            } else {
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
          }
        })
        .finally(() => {
          this.loading = false;
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
