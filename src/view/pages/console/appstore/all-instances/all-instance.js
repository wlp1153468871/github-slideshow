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
      instancesCopy: [],
      loading: {
        instance: false,
      },
      //  状态
      stateMap: {
        deployed: 'success',
        failed: 'error',
        timeOut: 'warning',
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
    size: {
      handler(size) {
        this.instances = this.instancesCopy.slice(0, size);
      },
    },
    currentPage: {
      handler(currentPage) {
        this.instances = this.instancesCopy.slice((currentPage - 1) * this.size,
          (currentPage) * this.size);
      },
    },
  },

  methods: {
    stateClass(status) {
      return this.stateMap[status] || '';
    },
    // 获取所有实例
    getAllInstances() {
      this.loading.instance = true;
      AppStoreService.getAllInstances(this.zone.id, this.space.id)
        .then(res => {
          if (res) {
            this.instances = res.slice(0, 10);
            this.instancesCopy = res;
            this.total = res.length;
            this.instanceNum();
          }
        })
        .finally(() => {
          this.loading.instance = false;
        });
    },
    // 实例数
    instanceNum() {
      return this.instances.length;
    },

    // 实例跳转
    rowClick(id) {
      const { appId } = this.instances.find(item => item.id === id);
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
      this.instances = this.instancesCopy.filter(item => item.name.includes(this.key))
        .slice((this.currentPage - 1) * this.size, (this.currentPage) * this.size);
    },

    // 刷新
    fresh() {
      this.key = '';
      this.getAllInstances();
    },
    changeSize(size) {
      this.size = size;
    },
    handleCurrentChange(page) {
      this.currentPage = page;
    },
  },
};
