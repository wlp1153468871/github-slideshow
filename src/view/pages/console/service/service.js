import { mapState } from 'vuex';

import ServiceAdmin from '@/core/services/service-admin.service';

export default {
  name: 'Service',
  data() {
    return {
      select: 1,
      items: [
        {
          text: '全部',
          value: 1,
        },
        {
          text: '选项1',
          value: 2,
        },
      ],
      // 应用
      appInfo: [],

      appInfoCopy: [],
      appNum: '',
      zones: [
        {
          id: '',
          name: '全部',
        },
      ],
      zoneCat: '全部',

      status: [
        {
          id: '',
          name: '全部',
        },
      ],
      statuCat: '全部',

      appType: [
        {
          name: '全部',
        },
      ],
      appTypeCat: '全部',
    };
  },

  computed: {
    ...mapState(['space', 'zone']),
  },

  created() {
    this.getAllApp();
  },

  watch: {
    // zoneCat: function () {
    //   this.appInfo.filter(item => {
    //     return this.zoneCat === item.zoneName;
    //   });
    // },
    statuCat: () => {
      this.appInfo.filter(item => {
        return this.statuCat === item;
      });
      console.log('触发了');
    },
  },

  methods: {
    linkToDetail() {
      this.$router.push({ name: 'service.detail' });
    },
    // app
    getAllApp() {
      ServiceAdmin.getAllApp().then(res => {
        if (res) {
          this.appInfo = res;
          this.appInfoCopy = res;
        }
        console.log(this.appInfo);
      }).then(() => {
        this.getZone();
        this.getStatus();
        this.getType();
      });
    },

    appNumber() {
      return this.appInfo.length;
    },
    // 所有的可用区
    getZone() {
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
  },
};
