import { mapState } from 'vuex';
import { debounce } from 'lodash';

import AppStoreService from '@/core/services/appstore.service';

export default {
  name: 'AllInstances',
  data() {
    return {
      key: '',
      // 所有实例
      instances: [],
    };
  },

  computed: {
    ...mapState(['space', 'zone']),
  },

  created() {
    this.getAllInstances();
  },

  watch: {
    key: {
      handler() {
        if (this.key === '') {
          this.getAllInstances();
        } else {
          this.updateKey();
        }
      },
    },
  },

  methods: {
    // 获取所有实例
    getAllInstances() {
      AppStoreService.getAllInstances(this.zone.id, this.space.id).then(res => {
        if (res) {
          this.instances = res;
          this.instanceNum();
        }
      });
    },
    // 实例数
    instanceNum() {
      return this.instances.length;
    },

    // 暂时缺少appid
    // 实例跳转
    rowClick(id) {
      let appId = '';
      this.instances.forEach(item => {
        if (item.id === id) {
          appId = item.appId;
        }
      });
      console.log(appId);
      this.$router.push({
        name: 'appstore.instance',
        params: {
          appid: appId,
          instanceid: id,
        },
      });
    },

    // 搜索实例
    updateKey: debounce(function updateKey() {
      this.searchInstance();
    }, 300),
    searchInstance() {
      this.instances = this.instances.filter(item => item.name.includes(this.key));
    },

    // 刷新
    fresh() {
      this.key = '';
      this.getAllInstances();
    },
  },
};
