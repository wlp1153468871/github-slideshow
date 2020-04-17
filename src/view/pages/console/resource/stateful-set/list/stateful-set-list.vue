<template>
  <div>
    <circle-loading v-if="loadings.page"> </circle-loading>
    <div class="page-statefulSet-list" v-else>
      <resource-header :resource="resource"></resource-header>
      <div class="dao-view-main">
        <div class="dao-view-content">
          <div class="table-toolbar">
            <div class="table-toolbar-left">
              <button
                class="dao-btn blue has-icon"
                v-if="$can('statefulSet.create', 'statefulSet')"
                @click="dialog.isOpen = true"
              >
                <svg class="icon">
                  <use xlink:href="#icon_plus-circled"></use>
                </svg>
                <span class="text">创建</span>
              </button>
            </div>
            <div class="table-toolbar-right">
              <div style="display: flex; justify-content: center; align-items: center;">
                <el-input
                  style="width: 200px;"
                  size="small"
                  v-model="actions.filterKey"
                  placeholder="请输入搜索内容"
                  clearable
                  prefix-icon="el-icon-search"
                ></el-input>
                <el-button
                  @click="onRefresh"
                  size="mini"
                  style="margin-left: 10px;"
                  :disabled="loadings.table"
                >
                  <svg class="icon">
                    <use xlink:href="#icon_update"></use>
                  </svg>
                </el-button>
              </div>
            </div>
          </div>

          <el-table
            v-loading="loadings.table"
            :data="statefulSetsInCurrentPage"
            style="width: 100%;"
          >
            <el-table-column prop="metadata.name" sortable label="名称">
              <template slot-scope="{ row: statefulSet }">
                <el-table-name-cell
                  :resource="statefulSet"
                  routerName="resource.statefulsets.detail"
                >
                </el-table-name-cell>
              </template>
            </el-table-column>
            <el-table-column prop="status.replicas" label="实例数 Replicas">
              <template slot-scope="{ row: statefulSet }">
                {{
                  statefulSet.status &&
                  statefulSet.status.replicas + '/' + statefulSet.spec.replicas + ' replicas'
                }}
              </template>
            </el-table-column>
            <el-table-column
              prop="metadata.creationTimestamp"
              sortable
              :sort-method="sortStartTime"
              label="创建时间"
            >
              <template slot-scope="{ row: statefulSet }"
                >{{ statefulSet.metadata.creationTimestamp | date }}
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            :disabled="loadings.table"
            :page-sizes="[10, 30, 50]"
            :page-size.sync="pageSize"
            :current-page.sync="currentPage"
            layout="sizes, prev, pager, next"
            :total="totalPages"
          >
          </el-pagination>
        </div>
      </div>
    </div>

    <edit-yaml-dialog
      :visible.sync="dialog.isOpen"
      :value="template"
      @update="onYAMLDialogUpdate"
      @close="dialog.isOpen = false"
    >
    </edit-yaml-dialog>
  </div>
</template>

<script>
import { RESOURCE_TYPE } from '@/core/constants/resource';
import { mapState } from 'vuex';
import dayjs from 'dayjs';
import { debounce, chunk, nth } from 'lodash';
import ResourceMixin from '@/view/mixins/resource';
import EditYamlDialog from '@/view/components/yaml-edit/edit-yaml.vue';
import StatefulSetService from '@/core/services/stateful-set.service.ts';
import joinApproveStatus from '@/core/utils/joinApproveStatus.js';

export default {
  name: 'StatefulSetList',

  mixins: [ResourceMixin(RESOURCE_TYPE.STATEFUL_SET)],

  components: { EditYamlDialog },

  data() {
    return {
      loadings: {
        page: true,
        table: true,
      },
      dialog: {
        isOpen: false,
      },
      actions: {
        filterKey: '',
      },
      statefulSets: [],
      filteredStatefulSets: [],
      currentPage: 1,
      pageSize: 10,
    };
  },

  created() {
    this.getTemplate();
    this.getStatefulSets().finally(() => {
      this.loadings.table = false;
      this.loadings.page = false;
    });
  },

  computed: {
    ...mapState(['space', 'zone']),

    viewStatefulSets() {
      return this.filteredStatefulSets;
    },

    paginaStatefulSets() {
      return chunk(this.viewStatefulSets, this.pageSize);
    },

    statefulSetsInCurrentPage() {
      return nth(this.paginaStatefulSets, this.currentPage - 1);
    },

    totalPages() {
      return this.viewStatefulSets.length;
    },
  },

  watch: {
    statefulSets() {
      this.filterDate(this.actions.filterKey);
    },

    'actions.filterKey': {
      handler(newValue) {
        this.filterDate(newValue);
      },
    },
  },

  methods: {
    filterDate: debounce(function undebounce(value = '') {
      this.filteredStatefulSets = this.statefulSets.filter(s => {
        const key = value.toLowerCase();
        const inName = s.metadata.name.toLowerCase().includes(key);
        const inLabel =
          s.metadata.labels &&
          Object.values(s.metadata.labels).some(v => v.toLowerCase().includes(key));
        return inName || inLabel;
      });
    }, 200),

    getStatefulSets() {
      return StatefulSetService.list(this.space.id, this.zone.id).then(res => {
        this.statefulSets = joinApproveStatus(res);
      });
    },

    onRefresh() {
      this.loadings.table = true;
      this.getStatefulSets().finally(() => {
        this.loadings.table = false;
      });
    },

    onYAMLDialogUpdate(yaml) {
      this.loadings.table = true;
      StatefulSetService.post(this.space.id, this.zone.id, yaml)
        .then(instance => {
          if (instance.is_need_approval) {
            this.$noty.success('请在审批记录页面，查看审批进度');
          } else {
            this.$noty.success('创建 Stateful Set 成功');
          }
          this.getStatefulSets();
        })
        .finally(() => {
          this.loadings.table = false;
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
</script>
