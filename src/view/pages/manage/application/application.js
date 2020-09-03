import { mapState } from 'vuex';

import ServiceAdmin from '@/core/services/service-admin.service';

export default {
  name: 'Service',
  data() {
    return {
      select: 1,
      // 应用
      appInfo: [],

      appInfoCopy: [],
      appNum: '',
      // 选择的状态
      selectStatus: [],
      selectedArr: [], // 选中时的数组
      zones: [
        {
          id: '',
          name: '全部',
        },
      ],
      zoneCat: '',

      status: [
        {
          id: '',
          name: '全部',
        }, {
          id: 1,
          name: '已上架',
        }, {
          id: 0,
          name: '已下架',
        },
      ],
      statuCat: '',

      appType: [
        {
          id: '',
          name: '全部',
        }, {
          id: 'Helm Chart',
          name: 'Helm Chart',
        },
      ],
      appTypeCat: '',
      key: '',
      lineCode: 0,
      loading: {
        appInfo: false,
      },
    };
  },

  computed: {
    ...mapState(['space', 'zone']),
  },

  created() {
    this.getAllApp();
  },

  methods: {
    createApp() {
      this.$router.push({ name: 'application.app' });
    },
    /**
     * 删除/批量删除
     * @param val
     */
    deleteApplication() {
      this.selectedArr.forEach(item => {
        ServiceAdmin.deleteApplication(item.id, item.zoneId).then(() => {
          this.getAllApp();
        }).catch(() => {
          this.getAllApp();
        });
      });
      this.$noty.success('删除成功');
    },
    /**
     * 批量上架
     * @param val
     */
    handleOnline() {
      this.selectedArr.forEach((item, index) => {
        ServiceAdmin.availableOn(item.id).then(() => {
          this.getAllApp();
          if (index === this.selectedArr.length - 1) {
            this.lineCode = 200;
          }
        });
      });
      if (this.lineCode === 200) {
        this.$noty.success('上架成功');
        this.lineCode = 0;
      }
    },
    /**
     * 批量下架
     * @param val
     */
    handleOff() {
      this.selectedArr.forEach(item => {
        ServiceAdmin.availableOff(item.id).then(() => {
          this.getAllApp();
        });
        this.$noty.success('下架成功');
      });
    },
    selectChange(val) {
      const arr = [];
      val.forEach(item => {
        if (!arr.includes(item.available)) {
          arr.push(item.available);
        }
      });
      this.selectStatus = arr;
    },
    // 全选
    selectAll(val) {
      this.selectedArr = val;
      const arr = [];
      val.forEach(item => {
        if (!arr.includes(item.available)) {
          arr.push(item.available);
        }
      });
      this.selectStatus = arr;
    },
    // 实例跳转
    rowClick(id) {
      this.$router.push({
        name: 'application.detail',
        params: {
          id,
        },
      });
    },
    // app
    getAllApp() {
      this.loading.appInfo = true;
      ServiceAdmin.getAllApp(this.zoneCat, this.statuCat, this.appTypeCat)
        .then(res => {
          if (res) {
            this.appInfo = res;
            this.appInfoCopy = res;
          }
        })
        .then(() => {
          this.getZone();
          this.getStatus();
        })
        .finally(() => {
          this.loading.appInfo = false;
        });
    },

    /**
     * 修改筛选条件
     * @returns {*}
     */
    handleChange() {
      ServiceAdmin.getAllApp(this.zoneCat, this.statuCat, this.appTypeCat).then(res => {
        if (res) {
          this.appInfo = res;
          this.appInfoCopy = res;
        }
      }).then(() => {
        this.getZone();
        this.getStatus();
        // this.getType();
      });
    },
    appNumber() {
      return this.appInfo.length;
    },
    // 所有的可用区
    getZone() {
      this.zones = [];
      const obj = {
        id: '',
        name: '全部',
      };
      this.zones.push(obj);
      ServiceAdmin.getZone().then(res => {
        if (res) {
          res.forEach(item => this.zones.push(item));
        }
      });
    },
    // 清洗状态
    getStatus() {
      this.appInfo.forEach(item => {
        const obj = {};
        if (item.available === 1) {
          obj.id = item.available;
          obj.name = '已上架';
        } else {
          obj.id = item.available;
          obj.name = '已下架';
        }
        if (this.status.filter(data => data.name === obj.name).length < 1) {
          this.status.push(obj);
        }
      });
    },
    getType() {
      this.appInfo.forEach(item => {
        const obj = {};
        obj.name = item.appType;
        if (this.appType.filter(data => data.name === obj.name).length < 1) {
          this.appType.push(obj);
        }
      });
    },
    // 搜索
    search(val) {
      this.appInfo = this.appInfoCopy.filter(item => item.name.includes(val));
    },
    // 刷新
    fresh() {
      this.key = '';
      this.appInfo = this.appInfoCopy;
    },
  },
};
