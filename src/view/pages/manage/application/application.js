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
      indexArr: [],
      isForbidden: false,
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
          name: '已启用',
        }, {
          id: 0,
          name: '已禁用',
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
      size: 10,
      currentPage: 1,
      total: 0,
    };
  },

  computed: {
    ...mapState(['space', 'zone']),
  },

  created() {
    this.getAllApp();
  },

  watch: {
    size: {
      handler(size) {
        this.appInfo = this.appInfoCopy.slice(0, size);
      },
    },
    currentPage: {
      handler(currentPage) {
        this.appInfo = this.appInfoCopy.slice((currentPage - 1) * this.size,
          (currentPage) * this.size);
      },
    },
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
        this.$noty.success('启用成功');
        this.lineCode = 0;
      }
    },
    /**
     * 批量下架
     * @param val
     */
    handleOff() {
      this.isForbidden = true;
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
      const indexArr = [];
      val.forEach(item => {
        if (!arr.includes(item.available)) {
          arr.push(item.available);
        }
        // 判断选择哪一行
        this.appInfo.forEach((data, index) => {
          if (item.id === data.id) indexArr.push(index);
        });
      });
      this.selectStatus = arr;
      this.indexArr = indexArr;
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
            this.appInfo = res.slice((this.currentPage - 1) * this.size,
              (this.currentPage) * this.size);
            this.appInfoCopy = res;
            this.total = res.length;
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
      this.getAllApp();
    },
    appNumber() {
      return this.appInfoCopy.length;
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
        if (Array.isArray(res)) {
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
          obj.name = '已启用';
        } else {
          obj.id = item.available;
          obj.name = '已禁用';
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
      this.appInfo = this.appInfoCopy.filter(item => item.name.includes(val))
        .slice((this.currentPage - 1) * this.size, (this.currentPage) * this.size);
    },
    // 刷新
    fresh() {
      this.key = '';
      this.getAllApp();
    },
    changeSize(size) {
      this.size = size;
    },
    handleCurrentChange(page) {
      this.currentPage = page;
    },
    rowStyle({ rowIndex }) {
      return this.indexArr.includes(rowIndex) ? 'rowStyle' : '';
    },
    forbidden() {
      this.isForbidden = false;
      this.selectedArr.forEach(item => {
        ServiceAdmin.availableOff(item.id).then(() => {
          this.getAllApp();
        });
      });
      this.$noty.success('禁用成功');
    },
    cancel() {
      this.isForbidden = false;
    },
  },
};
