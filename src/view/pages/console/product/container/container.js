export default {
  computed: {
    isCheckoutPage() {
      return this.$route.name === 'product.checkout';
    },
  },
};
