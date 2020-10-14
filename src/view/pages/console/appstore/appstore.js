import { mapState } from 'vuex';
import { debounce } from 'lodash';

import AppStoreService from '@/core/services/appstore.service';

import AppItem from './app-item/appitem.vue';

export default {
  name: 'AppStore',
  components: {
    AppItem,
  },
  data() {
    return {
      key: '',
      //  应用数据
      applications: '',
      //  分类
      categories: [
        {
          name: '全部',
          id: '',
        },
      ],
      // 分类
      category: '全部',
      // 服务类型
      appType: [],
      checkedApp: [],
      // 供应商
      provider: [],
      checkedPro: [],
      appCopy: '',
      max: 1,
      loading: false,
    };
  },

  computed: {
    ...mapState(['space', 'zone', 'user', 'simpleInfo']),
  },

  created() {
    // 初始化
    this.init();
  },
  watch: {
    key: {
      handler() {
        if (this.key === '') {
          this.applications = this.appCopy;
          this.filterData(this.applications);
        } else {
          this.updateKey();
        }
      },
    },
    category: {
      handler() {
        if (this.category !== '全部') {
          this.applications = this.appCopy.filter(item => item.category.includes(this.category));
        } else {
          this.applications = this.appCopy;
        }
      },
    },
    checkedApp: {
      handler() {
        this.checked();
      },
    },
    checkedPro: {
      handler() {
        this.checked();
      },
    },
  },

  methods: {
    init() {
      this.getApplications();
    },

    // 清除tag
    handleClose1() {
      this.checkedApp = [];
    },
    handleClose2() {
      this.checkedPro = [];
    },
    clearAll() {
      this.checkedApp = [];
      this.checkedPro = [];
    },
    // 搜索
    updateKey: debounce(function updateKey() {
      this.searchApp();
    }, 300),
    searchApp() {
      this.applications = this.appCopy.filter(item => item.name.includes(this.key));
      this.filterData(this.applications);
    },
    // 刷新
    fresh() {
      this.loading = true;
      this.key = '';
      this.filterData(this.applications);
      this.clearAll();
      AppStoreService.zoneList(this.zone.id, this.space.id)
        .then(res => {
          if (res) {
            this.applications = res;
            this.appCopy = res;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },

    // list
    getApplications() {
      this.applications = [];
      AppStoreService.zoneList(this.zone.id, this.space.id)
        .then(res => {
          if (res) {
            this.applications = res;
            this.appCopy = res;
            this.getCategory();
          }
        })
        .then(() => {
          this.applications.forEach(res => {
            if (this.appType.indexOf(res.appType) === -1 && res.appType) {
              this.appType.push(res.appType);
            }
            if (this.provider.indexOf(res.provider) === -1 && res.provider) {
              this.provider.push(res.provider);
            }
          });
        });
    },
    // 数据清洗
    getCategory() {
      AppStoreService.getCategory(this.zone.id, this.space.id).then(res => {
        if (res) {
          res.forEach(cate => {
            const arr = this.applications.filter(item =>
              item.category.includes(cate.name));
            if (arr.length > 0) {
              cate.isShow = true;
            } else {
              cate.isShow = false;
            }
          });
          res.forEach(item => this.categories.push(item));
        }
      });
    },
    // 数据过滤
    filterData(data) {
      this.categories.forEach(cate => {
        const arr = data.filter(item =>
          item.category.includes(cate.name));
        if (arr.length > 0) {
          cate.isShow = true;
        } else {
          cate.isShow = false;
        }
      });
    },
    // 筛选
    checked() {
      if (!this.checkedPro.length && !this.checkedApp.length) {
        this.applications = this.appCopy;
        this.filterData(this.applications);
        return;
      }
      if (this.checkedPro.length && this.checkedApp.length) {
        this.applications = this.applications.filter(item =>
          item.appType.includes(this.checkedApp[0]));
        this.applications = this.applications.filter(item =>
          item.provider.includes(this.checkedPro[0]));
        this.filterData(this.applications);
        return;
      }
      if (this.checkedApp.length && !this.checkedPro.length) {
        this.applications = this.appCopy.filter(item =>
          item.appType.includes(this.checkedApp[0]));
        this.filterData(this.applications);
        return;
      }
      if (this.checkedPro.length && !this.checkedApp.length) {
        this.applications = this.appCopy.filter(item =>
          item.provider.includes(this.checkedPro[0]));
        this.filterData(this.applications);
      }
    },
  },
};
