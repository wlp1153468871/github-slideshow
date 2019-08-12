import SelfPanel from './panels/self';

export default {
  name: 'Profile',
  components: {
    SelfPanel,
  },
  data() {
    const TABS = {
      SELF: '我的信息',
    };
    return {
      TABS,
      content: TABS.SELF,
    };
  },
};
