import newApp from './new-app'
import ZoneAdminService from '@/core/services/zone-admin.service';
import fa from 'element-ui/src/locale/lang/fa';
export default {
  name: 'ZoneDetail',
  components: {
    'newApp': newApp
  },
  // props: ['id', 'zoneName'],
  data() {
    return {
      activeName: 'first',
      select: 1,
      status: null, // 状态
      statusOptions: [
        {
          text: '全部',
          value: null,
        },
        {
          text: '已上架',
          value: 1,
        },
        {
          text: '已下架',
          value: 0,
        },
      ],
      type: 1, // 资源状态
      typeOptions: [{
        text: '全部',
        value: 1,
      }, {
        text: 'Helm Chart',
        value: 2,
      }],
      tableData: [],
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
      chartBaseList: {},
      showPass: false, // 是否显示密码
      chartTableData: [], // chart管理渲染列表
      itemChart: [], // 展开行渲染列表
    };
  },
  created() {
    // this.getSelectZone();
    // console.log(this.zoneName)
  },
  methods: {
    /**
     * 请求可用区选中应用list
     */
    getSelectZone() {
      ZoneAdminService.getSelectedZone(this.id, this.status).then(res => {
        this.tableData = res;
        this.tableData.forEach(item => {
          let category = item.category.join(',');
          item.category = category;
        })
      })
    },
    /**
     * 下架应用
     */
    handleOff(id) {
      console.log('点击下架应用')
      ZoneAdminService.availableOff(id).then(res => {
        console.log(res);
        this.getSelectZone();
      })
    },
    /**
     * 上架应用
     */
    handleOn(id) {
      console.log('点击上架架应用')
      ZoneAdminService.availableOn(id).then(res => {
        console.log(res);
        this.getSelectZone();
      })
    },
    /**
     * 删除应用
     */
    handleClick(id) {
      console.log('删除应用')
      ZoneAdminService.deleteApplication(id).then(res => {
        this.getSelectZone();
      })
    },
    /**
     * 状态搜索
     */
    changeStatus(val) {
      console.log(val)
      this.getSelectZone();
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
    linkToChart() {
      this.$router.push({ name: 'zone.chart' });
    },
    /**
     * 新建一个应用按钮点击事件
     */
    handleNewApplication() {
      this.$router.push(`zone/newapp/${this.id}/${this.zoneName}`);
    },

    /**
     * tabsClick：选中chart管理
     */
    tabsClick(event) {
      console.log(event);
      if (event.name === 'second') {
        this.getChartData();
      }
    },
    /**
     * 获取chart列表数据
     */
    getChartData() {
      ZoneAdminService.getChartInformation().then(res => {
        console.log(res);
        this.chartBaseList = res;
      })
      this.getChartTableData();
    },
    /**
     * 显示密码
     */
    showPassword() {
      this.showPass = !this.showPass;
    },
    /**
     * 获取chart管理的table数据
     */
    getChartTableData() {
      ZoneAdminService.getChartList().then(res => {
        console.log(res);
        this.chartTableData = res;
        this.changeExpand();
      })
    },
    /**
     * 展开行改变
     */
    changeExpand() {
      if (this.chartTableData.length !== 0) {
        this.chartTableData.forEach(item => {
          ZoneAdminService.getChartVersionList(item.name).then(res => {
            console.log(res);
            item[item.name] = res;
            console.log(this.chartTableData, '改变后的数组');
          })
        })
      }
    },
    /**
     * 删除chart版本
     */
    deleteChartVersion(name, version) {
      console.log('删除chart版本');
      ZoneAdminService.deleteChartVersion(name, version).then(res => {
        this.getChartTableData();
        this.changeExpand();
      }).catch(err => {
        this.$message({
          message: '删除失败',
          type: 'warning'
        });
      });
    },
    /**
     * 下载chart版本
     */
    uploadChart(name, version) {
      ZoneAdminService.uploadChart(name, version).then(res => {
        console.log(res);
      })
    },
    /**
     * 删除所有chart版本
     */
    deleteChartAll(name) {
      ZoneAdminService.deleteChartAll(name).then(res => {
        console.log(res);
      })
    }
  },
};
