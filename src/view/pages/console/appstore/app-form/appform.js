import { mapState } from 'vuex';
import AppStoreService from '@/core/services/appstore.service';

export default {
  name: 'AppStoreForm',

  data() {
    return {
      config: {
        visible: false,
      },
      chartName: '',
      instanceName: '',
      max: 32,
      table: [],
      loading: false,
      giveup: false,
      status: '',
      errormMsg: '',
    };
  },

  computed: {
    ...mapState(['space', 'zone']),
  },

  watch: {
    instanceName: {
      handler(str) {
        if (!this.check(str) && str.length) {
          this.status = 'error';
          this.errormMsg = '请输入以字母开头和结尾，由数字，字母，‘-’ 组成的合法字符串。';
        } else {
          this.errormMsg = '';
          this.status = 'success';
        }
      },
    },
  },

  created() {
    this.getApp();
  },

  methods: {
    // 检测
    check(name) {
      const reg = /^[a-z]([-a-z0-9]*[a-z0-9])?$/;
      return reg.test(name);
    },
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
      if (this.instanceName.length && this.status === 'success') {
        this.loading = true;
        AppStoreService
          .createForm(this.zone.id, this.space.id, this.$route.params.appid,
            this.chartName, this.$route.params.version, this.instanceName, this.table)
          .then(res => {
            if (res.status === 'deployed') {
              this.$router.push({
                name: 'appstore.detail',
                params: {
                  Id: this.$route.params.appid,
                },
                query: {
                  activeName: this.$route.query.activeName,
                },
              });
              this.$noty.success('实例创建成功');
            } else {
              this.$noty.error('实例创建失败');
            }
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        this.$noty.error('实例名称有误');
      }
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
          if (res.status === 'deployed') {
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
                  activeName: this.$route.query.activeName,
                },
              });
            }
          } else if (res.status === 'timeOut') {
            this.$router.push({
              name: 'appstore.detail',
              params: {
                Id: this.$route.params.appid,
              },
              query: {
                activeName: this.$route.query.activeName,
              },
            });
            this.$noty.warning('实例更新超时');
          } else {
            this.$noty.error('实例更新失败');
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
    destoryDialog() {
      if (this.giveup) {
        this.$router.push({
          name: 'appstore.detail',
          params: {
            Id: this.$route.params.appid,
          },
          query: {
            activeName: this.$route.query.activeName,
          },
        });
      }
    },
    giveUp() {
      this.config.visible = false;
      this.giveup = true;
    },
  },
};
