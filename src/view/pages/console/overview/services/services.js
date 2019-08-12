import { mapState, mapGetters } from 'vuex';
import { isEmpty, first, debounce, find, cloneDeep } from 'lodash';
import { SERVICE_STATUS } from '@/core/constants/constants';

export default {
  name: 'OverviewServices',

  data() {
    const LAYOUT_TYPES = {
      CARD: 'catalog-card-content',
      LIST: 'catalog-list-content',
    };

    return {
      LAYOUT_TYPES,
      keyword: '',
      searchKeyword: '',
      categories: [],
      category: {},
      service: {},
      searchedServices: [],
      layoutType: LAYOUT_TYPES.CARD,
      loadings: {
        services: true,
      },
      selectedCategory: 0,
    };
  },

  methods: {
    ensureServices() {
      return new Promise((resolve, reject) => {
        const { services } = this.$store.state;
        if (!isEmpty(services)) {
          resolve(services);
        } else {
          this.$store.watch(
            () => this.$store.state.services,
            res => {
              if (isEmpty(res)) reject();
              resolve(res);
            },
          );
        }
      });
    },

    ensureCategory() {
      return new Promise((resolve, reject) => {
        const { category } = this.$store.state;
        if (category) {
          resolve(category);
        } else {
          this.$store.watch(
            () => this.$store.state.category,
            res => {
              if (res) resolve(res);
              reject();
            },
          );
        }
      });
    },

    isDeleted(service) {
      return service.available === SERVICE_STATUS.BROKERDELETED;
    },

    deployService(service) {
      this.$router.push({
        name: 'product.checkout',
        params: {
          serviceId: service.id,
        },
        query: {
          brokerServiceId: service.id,
        },
      });
    },

    gotoInstanceList(service) {
      this.$router.push({
        name: 'console.instances',
        params: {
          serviceId: service.id,
        },
        query: {
          brokerServiceId: service.brokerService.id,
        },
      });
    },

    handleKeyword: debounce(function handleKeyword() {
      this.searchKeyword = this.keyword.trim().toLowerCase();
    }, 0.3 * 1e3),

    switchCategory(category, index) {
      this.keyword = '';
      this.searchKeyword = '';
      this.category = category;
      this.selectedCategory = index;
    },

    toggleLayout(type) {
      this.layoutType = type;
    },

    getServices(categoryList) {
      if (!categoryList) return [];
      let list = [];
      if (categoryList) {
        categoryList.forEach(category => {
          list = list.concat(...category.services);
        });
      }
      return list;
    },

    flatCategory(categoryList) {
      categoryList.forEach(category => {
        category.services = this.getServices(category.children);
      });
      return categoryList;
    },
  },

  computed: {
    ...mapState(['org', 'space', 'zones', 'zone', 'services', 'user']),
    ...mapGetters(['isZoneSyncing']),

    serviceAvailable() {
      // 用户不属于任何租户的时候无法提供服务
      return !isEmpty(this.space);
    },

    availableServices() {
      const keyword = this.searchKeyword.trim().toLowerCase();
      if (!this.categories.length) return [];
      return (
        this.categories[this.selectedCategory].services
          // .filter(service => {
          //   return service.id === this.zone.id;
          // })
          // .filter(service => service.available !== 'unavailable')
          .filter(service => service.name.toLowerCase().includes(keyword))
      );
    },
  },

  created() {
    Promise.all([this.ensureServices(), this.ensureCategory()]).then(([services, categories]) => {
      const categoriesCopy = this.flatCategory(cloneDeep(categories));
      categoriesCopy.forEach(item => {
        item.services = item.services
          .map(service => find(services, { id: service.id }))
          .filter(v => v);
        this.categories.push(item);
      });
      this.category = first(categories);
      this.loadings.services = false;
    });
  },
};
