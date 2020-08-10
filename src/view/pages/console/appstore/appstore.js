import { mapState } from 'vuex';

import AppStoreService from '@/core/services/appstore.service';

import AppItem from './app-item/appitem.vue';

export default {
  name: 'AppStore',
  components: {
    AppItem,
  },
  data() {
    return {
      //
      applications: '',
      //
      categories: '',
      select: 1,
      // 分类
      options1: [],
      // 首页数据
      homeApp: {
        // 分类
        category: [],
        // 服务类型
        appType: [],
        // 供应商
        provider: [],
        // tab页
        tabs: [],
        appItem: [],
      },
    };
  },

  computed: {
    ...mapState(['space', 'zone', 'user']),
  },
  created() {
    // 初始化
    this.init();
  },
  methods: {
    linkToApp() {
      this.$router.push({ name: 'appstore.app' });
    },
    linkToMy() {
      this.$router.push({ name: 'appstore.mycreate' });
    },
    filter(tab) {
      return this.homeApp.appItem.filter(item => {
        return item.tab === tab;
      });
    },
    init() {
      this.getApplications();
    },

    // list
    getApplications() {
      AppStoreService.zoneList(this.zone.id, this.space.id).then(res => {
        if (res) {
          this.applications = res;
          this.getCategory();
        }
        // console.log(res);
        // const arr = [];
        // res.forEach(item => {
        //   if (this.homeApp.appType.indexOf(item.appType) === -1 && item.appType) {
        //     this.homeApp.appType.push(item.appType);
        //   }
        //   if (this.homeApp.provider.indexOf(item.provider) === -1) {
        //     this.homeApp.provider.push(item.provider);
        //   }
        //   item.category.forEach(value => {
        //     if (this.homeApp.tabs.indexOf(value) === -1 && value) {
        //       this.homeApp.tabs.push(value);
        //     }
        //     const obj = {};
        //     obj.tab = value;
        //     obj.name = item.name;
        //     obj.appType = item.appType;
        //     obj.description = item.description;
        //     obj.provider = item.provider;
        //     arr.push(obj);
        //     this.homeApp.appItem = arr;
        //   });
        // });
        // console.log(this.homeApp.appItem.filter(item => {
        //   return item.tab === '数据库';
        // }));
      });
    },
    // type
    getCategory() {
      AppStoreService.getCategory(this.zone.id, this.space.id).then((res) => {
        if (res) {
          res.forEach(cate => {
            const length = (this.applications.filter(item => item.category.includes(cate.name))).length;
            if (length > 0) {
              cate.isShow = true;
            } else {
              cate.isShow = false;
            }
          });
          this.categories = res;
          console.log(res);
        }
      });
    },
  },
};
