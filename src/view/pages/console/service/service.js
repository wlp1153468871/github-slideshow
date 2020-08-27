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
      appType: [ // 资源类型
        {
          id: '',
          name: '全部',
        }, {
          id: 'Helm Chart',
          name: 'Helm Chart',
        },
      ],
      appTypeCat: '',
    };
  },

  computed: {
    ...mapState(['space', 'zone']),
  },

  created() {
    this.getAllApp();
    this.getAllZone();
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
    /**
     * 可用区修改, 或者状态，或者资源
     */
    changeSearch() {
      ServiceAdmin.getAllApp(this.zoneCat, this.statuCat, this.appTypeCat).then(res => {
        console.log(res);
        this.appInfo = res;
      });
    },
    linkToDetail() {
      this.$router.push({ name: 'service.detail' });
    },
    // app
    getAllApp() {
      ServiceAdmin.getAllApp(this.zoneCat, this.statuCat, this.appTypeCat).then(res => {
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
