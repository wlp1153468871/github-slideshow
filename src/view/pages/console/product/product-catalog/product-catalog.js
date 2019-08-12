import CatalogService from '@/core/services/catalog.service';

export default {
  name: 'ProductCatalog',
  created() {
    this.loadCatalog();
  },
  data() {
    const { index } = this.$route.params;
    return {
      index,
      catelogInfo: {},
      // catalog: {
      //   name: '',
      //   services: [],
      // },
    };
  },
  watch: {
    $route(to, from) {
      if (to.params.index !== from.params.index) {
        this.index = to.params.index;
      }
    },
  },
  computed: {
    catalog() {
      return this.catelogInfo[this.index] || {};
    },
  },
  methods: {
    loadCatalog() {
      return CatalogService.getSchema().then(catelogInfo => {
        this.catelogInfo = catelogInfo;
      });
    },
    gotoService(productId) {
      this.$router.push({
        name: 'product.detail',
        params: {
          product: productId,
        },
      });
    },
  },
};
