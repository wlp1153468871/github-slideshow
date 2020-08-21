import newApp from './detailComponents/new-app'
import ZoneAdminService from '@/core/services/zone-admin.service';
export default {
  name: 'ZoneDetail',
  components: {
    'newApp': newApp
  },
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
    };
  },
  created() {
    this.getSelectZone();
  },
  methods: {
    /**
     * 请求可用区选中应用list
     */
    getSelectZone() {
      ZoneAdminService.getSelectedZone(this.status).then(res => {
        console.log(res, 'heyanfen');
        this.tableData = res;
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
     * 展开行改变*/
    expandChange(row, is) {
      console.log(row, is)
    },
    /**
     * 新建一个应用按钮点击事件
     */
    handleNewApplication() {
      this.$router.push({ name: 'zone.newapp' });
    }
  },
};
