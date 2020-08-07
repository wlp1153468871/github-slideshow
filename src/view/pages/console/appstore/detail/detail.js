export default {
  name: 'AppStoreDetail',
  data() {
    return {
      value: '',
      // 选中状态
      selectState: 0,
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
      },
      config1: {
        visible: false,
      },
      config2: {
        visible: false,
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
    close() {
      this.config.visible = false;
    },
    // 创建实例，跳转
    creatExample() {
      if (this.selectState === 1) {
        this.$router.push({ name: 'appstore.form' });
      } else if (this.selectState === 2) {
        this.$router.push({ name: 'appstore.yamlform' });
      }
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
    selectFirst() {
      this.selectState = 1;
    },
    selectSecond() {
      this.selectState = 2;
    },
    editInfo() {
      this.config1.visible = true;
    },
    editClose() {
      this.config1.visible = false;
    },
    addEdition() {
      this.config2.visible = true;
    },
    addClose() {
      this.config2.visible = false;
    },
  },
};
