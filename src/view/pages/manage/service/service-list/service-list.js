import { SERVICE_STATUS } from '@/core/constants/constants';
import tableView from '@/view/mixins/table-view';
import ServiceService from '@/core/services/service.service';

export default {
  name: 'ServiceList',
  extends: tableView('id', 10, 'zoneName'),
  created() {
    this.initTableView();
    this.loadService();
  },
  data() {
    return {
      rows: [],
      loadings: {
        maps: false,
      },
    };
  },
  methods: {
    initTableView() {
      const onClick = item => {
        this.$router.push({
          name: 'manage.service.detail',
          params: { id: item.id },
        });
      };
      const getStatus = (_, item) => {
        return item.available === SERVICE_STATUS.AVAILABLE
          ? 'SUCCESS'
          : 'STOPED';
      };
      this.setTableProps([
        {
          id: 'name',
          name: '服务名',
          type: 'goto',
          other: { onClick },
        },
        {
          id: 'zone.name',
          name: '可用区',
          value: 'zone.name',
        },
        {
          id: 'available',
          name: '状态',
          filter: 'service_status',
          type: 'status',
          other: { status: getStatus },
        },
        { id: 'short_description', name: '简短描述', filter: 'otherwise' },
      ]);
    },

    loadService() {
      this.loadings.maps = true;
      return ServiceService.getServices()
        .then(list => {
          this.rows = list;
        })
        .finally(() => {
          this.loadings.maps = false;
        });
    },
  },
};
