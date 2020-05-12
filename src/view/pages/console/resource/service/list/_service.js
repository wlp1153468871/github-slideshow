import { RESOURCE_TYPE } from '@/core/constants/resource';
import dayjs from 'dayjs';
import { mapState } from 'vuex';
import { chunk, nth, size } from 'lodash';
import ServiceResourceService from '@/core/services/service.resource.service';
import joinApproveStatus from '@/core/utils/joinApproveStatus.js';
import ResourceMixin from '@/view/mixins/resource';

export default {
  name: 'ServiceList',

  mixins: [ResourceMixin(RESOURCE_TYPE.SERVICE)],

  data() {
    const { create = 'false' } = this.$route.query;

    return {
      loadings: {
        page: true,
        table: true,
      },
      filterKey: '',
      services: [],
      currentPage: 1,
      pageSize: 10,
      dialogs: {
        create: JSON.parse(create),
      },
    };
  },

  created() {
    this.getServices();
    this.getTemplate();
  },

  computed: {
    ...mapState(['space']),

    servicesFilteredByKey() {
      const filterKey = this.filterKey.toLowerCase();
      return this.services.filter(service =>
        service.metadata.name.toLowerCase().includes(filterKey),
      );
    },

    paginaServices() {
      return chunk(this.servicesFilteredByKey, this.pageSize);
    },

    servicesInCurrentPage() {
      return nth(this.paginaServices, this.currentPage - 1);
    },

    totalPages() {
      return this.servicesFilteredByKey.length;
    },
  },

  methods: {
    size,

    getServices() {
      this.loadings.table = true;
      ServiceResourceService.list()
        .then((service = {}) => {
          this.services = joinApproveStatus(service, {
            status: {
              loadBalancer: {
                ingress: [],
              },
            },
            spec: {
              ports: [],
              selector: {},
            },
          });
        })
        .finally(() => {
          this.loadings.page = false;
          this.loadings.table = false;
        });
    },

    openCreateDialog() {
      this.dialogs.create = true;
    },

    createService(data) {
      ServiceResourceService.create({ data }).then(instance => {
        if (instance.is_need_approval) {
          this.$noty.success('请在审批记录页面，查看审批进度');
        } else {
          this.$noty.success(`Service ${data.metadata.name} 创建成功`);
        }
        this.dialogs.create = false;
        this.getServices();
      });
    },

    sortStartTime(a, b) {
      const prevTime = dayjs(a.metadata.creationTimestamp);
      const nextTime = dayjs(b.metadata.creationTimestamp);
      if (prevTime.isSame(nextTime)) {
        return 0;
      } else if (prevTime.isBefore(nextTime)) {
        return -1;
      }
      return 1;
    },
  },
};
