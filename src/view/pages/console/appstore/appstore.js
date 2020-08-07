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
      select: 1,
      items: [
        {
          text: '全部',
          value: 1,
        },
        {
          text: '数据库',
          value: 2,
        },
        {
          text: '大数据',
          value: 3,
        },
        {
          text: '网络',
          value: 4,
        },
        {
          text: '监控',
          value: 5,
        },
        {
          text: '其他',
          value: 6,
        },
      ],
      appType: '',
    };
  },

  computed: {
    ...mapState(['space', 'zone', 'user']),
  },
  created() {
    this.init();
  },
  methods: {
    linkToApp() {
      this.$router.push({ name: 'appstore.app' });
    },
    linkToMy() {
      this.$router.push({ name: 'appstore.mycreate' });
    },
    createApp() {
      // this.space.id, this.zone.id
      AppStoreService.create(this.zone.id, this.space.id).then(res => {
        console.log(res);
      });
    },
    // get apps list
    init() {
      AppStoreService.zoneList(this.zone.id, this.space.id).then(res => {
        console.log(res);
      });
    },
  },
};
