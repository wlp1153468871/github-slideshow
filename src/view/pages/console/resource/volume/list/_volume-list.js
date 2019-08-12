import { RESOURCE } from '@/core/constants/resource';
import { chunk, nth, get as getValue } from 'lodash';
import { mapState } from 'vuex';
import convert from 'convert-units';
import { INSTANCE_STATUS } from '@/core/constants/constants';
import VolumeService from '@/core/services/volume.service';
import joinApproveStatus from '@/core/utils/joinApproveStatus.js';

export default {
  name: 'VolumeList',

  data() {
    return {
      resource: {
        ...RESOURCE.PERSISTENT_VOLUME_CLAIM,
        links: [
          {
            text: RESOURCE.PERSISTENT_VOLUME_CLAIM.name,
          },
        ],
      },
      INSTANCE_STATUS,
      volumes: [],
      loadings: {
        page: true,
        table: true,
      },
      filterKey: '',
      currentPage: 1,
      pageSize: 10,
    };
  },

  computed: {
    ...mapState(['space', 'zone', 'user']),

    pvcFilteredByKey() {
      const filterKey = this.filterKey.toLowerCase();
      return this.volumes.filter(volume =>
        volume.metadata.name.toLowerCase().includes(filterKey));
    },

    paginaPvcs() {
      return chunk(this.pvcFilteredByKey, this.pageSize);
    },

    pvcsInCurrentPage() {
      return nth(this.paginaPvcs, this.currentPage - 1);
    },

    totalPages() {
      return this.pvcFilteredByKey.length;
    },
  },

  created() {
    this.getVolumes();
  },

  methods: {
    getVolumes() {
      this.loadings.table = true;
      VolumeService.list(this.space.id, this.zone.id)
        .then(res => {
          this.volumes = joinApproveStatus(res, {
            spec: {},
            status: {},
          });
        })
        .finally(() => {
          this.loadings.page = false;
          this.loadings.table = false;
        });
    },

    createInstance() {
      this.$router.push({
        name: 'deploy.volume',
      });
    },

    gotoDetail(volume) {
      this.$router.push({
        name: 'resource.persistent-volume-claim',
        params: {
          name: volume.metadata.name,
        },
      });
    },

    // TODO: 这个排序是基于单位统一成MB的排序结果
    sortStorage(prev, next) {
      return this.unifyStorageUnit(next) - this.unifyStorageUnit(prev);
    },

    sortCreationTime(prev, next) {
      const prevTime = getValue(prev, 'metadata.creationTimestamp');
      const nextTime = getValue(next, 'metadata.creationTimestamp');
      if (prevTime === nextTime) {
        return 0;
      } else if (prevTime > nextTime) {
        return 1;
      }
      return -1;
    },

    unifyStorageUnit(storage) {
      const storageWithUnit = getValue(storage, 'status.capacity.storage');
      if (storageWithUnit) {
        const split = /(-?[0-9.]+)\s*(.*)/.exec(storageWithUnit);
        const amount = split[1];
        const unit = `${split[2]}B`;
        return convert(amount)
          .from(unit)
          .to('MB');
      }
      return 0;
    },
  },
};
