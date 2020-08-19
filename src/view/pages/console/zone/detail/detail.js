export default {
  name: 'ZoneDetail',
  data() {
    return {
      activeName: 'first',
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
      tableData: [
        {
          serviceName: 'ectd',
          zone: '上海-dev',
          supplier: 'RedHat',
          state: '已上架',
          type: 'Operator',
          serviceNum: 1,
          classify: '数据库',
          date: '2020-05-23 12:24',
        },
        {
          serviceName: 'ectd',
          zone: '上海-dev',
          supplier: 'RedHat',
          state: '已上架',
          type: 'Operator',
          serviceNum: 1,
          classify: '数据库',
          date: '2020-05-23 12:24',
        },
      ],
      chartData: [
        {
          type: '2.6.0',
          state: 'Active',
          defender: 'codefresh-io (2 other)',
          date: '2020-5-23 13:23:54',
        },
      ],
      config: {
        visible: false,
        footer: {
          cancelText: '取消',
          confirmText: '上传',
          confirmDisabled: true,
        },
      },
    };
  },
  methods: {
    showDialog() {
      this.config.visible = true;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    linkToChart() {
      this.$router.push({ name: 'zone.chart' });
    },
  },
};
