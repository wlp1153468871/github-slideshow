// panels
import OrderListPanel from '../order-list/order-list.vue';

export default {
  name: 'Charging',
  components: {
    OrderListPanel,
  },
  data() {
    const TABS = {
      ORDER_LIST: '我的订单',
    };
    return {
      TABS,
    };
  },
};
