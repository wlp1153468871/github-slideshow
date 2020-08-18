import { mapState } from 'vuex';
// import { debounce } from 'lodash';

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
      baseUrl: '',
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

      tags: [],
    };
  },

  computed: {
    ...mapState(['space', 'zone', 'user']),
  },

  created() {
    // 初始化
    this.init();
  },

  // watch: {
  //   key: {
  //     handler() {
  //       if (this.key === '') {
  //         // this.getApplications();
  //       } else {
  //         this.updateKey();
  //       }
  //     },
  //   },
  // },

  methods: {
    linkToApp() {
      this.$router.push({ name: 'appstore.app' });
    },
    linkToMy() {
      this.$router.push({ name: 'appstore.mycreate' });
    },
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
    // 搜索
    // updateKey: debounce(function updateKey() {
    //   this.searchApp();
    // }, 300),
    // searchApp() {
    //   this.applications = this.applications.filter(item => item.name.includes(this.key));
    // },
    // // 刷新
    // fresh() {
    //   this.key = '';
    //   this.getApplications();
    // },
    // list
    getApplications() {
      AppStoreService.zoneList(this.zone.id, this.space.id).then(res => {
        if (res) {
          this.applications = res;
          this.getCategory();
        }
      }).then(() => {
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
  },
};
