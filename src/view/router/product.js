import ProductContainer from '@/view/pages/console/product/container/container.vue';
import ProductDetail from '@/view/pages/console/product/product-detail/product-detail.vue';

export default {
  path: '/product',
  name: 'product',
  component: ProductContainer,
  children: [
    {
      path: 'detail/:product',
      name: 'product.detail',
      component: ProductDetail,
      meta: {
        public: true,
      },
    },
  ],
};
