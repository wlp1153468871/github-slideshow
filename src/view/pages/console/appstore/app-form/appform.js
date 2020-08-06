export default {
  name: 'AppStoreForm',

  data() {
    return {
      select: 1,
      items: [
        {
          text: '默认租户',
          value: 1,
        },
        {
          text: '租户1',
          value: 2,
        },
      ],
      tableData: [
        {
          key: 'chartmuseum.absoluteUrl',
          value: 'true',
        },
        {
          key: 'chartmuseum.absoluteUrl',
          value: 'false',
        },
        {
          key: 'chartmuseum.absoluteUrl',
          value: 'true',
        },
      ],
      config: {
        visible: false,
        footer: {
          cancelText: '取消',
          confirmText: '放弃',
          confirmDisabled: true,
        },
      },
    };
  },
  methods: {
    cancerForm() {
      this.config.visible = true;
    },
    close() {
      this.config.visible = false;
    },
    giveUp() {
      this.$router.go(-1);
    },
  },
};
