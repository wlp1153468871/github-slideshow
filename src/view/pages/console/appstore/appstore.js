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
      // 供应商
      provider: [],
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
