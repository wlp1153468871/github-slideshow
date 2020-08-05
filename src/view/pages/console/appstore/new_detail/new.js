export default {
  name: 'AppNewDetail',
  data() {
    return {
      activeName: 'first',
      select: 1,
      items: [
        {
          text: '1.9.1',
          value: 1,
        },
        {
          text: '1.10.2',
          value: 2,
        },
        {
          text: '2.1.1',
          value: 3,
        },
      ],
      tableData: [
        {
          exampleName: 'nginx-example-1',
          state: '成功',
          type: '1.9.1',
          creator: 'admin',
          date: '2020-5-6 12:23',
        },
        {
          exampleName: 'nginx-example-1',
          state: '成功',
          type: '1.9.1',
          creator: 'admin',
          date: '2020-5-6 12:23',
        },
        {
          exampleName: 'nginx-example-1',
          state: '成功',
          type: '1.9.1',
          creator: 'admin',
          date: '2020-5-6 12:23',
        },
        {
          exampleName: 'nginx-example-1',
          state: '成功',
          type: '1.9.1',
          creator: 'admin',
          date: '2020-5-6 12:23',
        },
      ],
      config: {
        visible: false,
        footer: {
          cancelText: '取消',
          confirmText: '继续',
          confirmDisabled: true,
        },
      },
    };
  },
  methods: {
    linktoForm() {
      this.$router.push({ name: 'appstore.form' });
    },
    linktoYamlForm() {
      this.$router.push({ name: 'appstore.yamlform' });
    },
    showDialog() {
      this.config.visible = true;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
  },
};
