<template>
  <div class="org-quota-module">
    <!-- 最终配额 -->
    <quota-gallery :quotas="summaryQuota"></quota-gallery>
    <div class="dao-view-main">
      <div class="dao-view-content">
        <dao-table-view
          ref="tableView"
          :rows="rows"
          :config="tConfig"
          @refresh="loadData"
          @checked-rows-change="onCheckedRowsChange"
          @confirm-remove-quota-group="confirmRemoveQuotaDialog"
        >
          <div slot="tool" class="dao-table-view-left-bar">
            <button class="dao-btn white has-icon" @click="openAddQutoaGroupDialog">
              <svg class="icon">
                <use xlink:href="#icon_plus-circled"></use>
              </svg>
              <span class="text">添加配额组</span>
            </button>
          </div>
        </dao-table-view>
      </div>
    </div>

    <div class="fixed-bottom-panels">
      <dao-panel size="l" class="bottom-body" :visible.sync="dialogConfigs.panelConfigs.visible">
        <dao-panel-item heading="配额详情">
          <dao-info-sheet style="width: 50%;" :table="planDetail.table"> </dao-info-sheet>
        </dao-panel-item>
      </dao-panel>
    </div>

    <!-- dialog start -->
    <add-quota-group-dialog
      :all-quota-groups="allQuotaGroups"
      :org-quota-groups="quotaGroups"
      @add="addOrgQuotaGroup"
      :visible="dialogConfigs.addQuotaGroup.visible"
      @close="dialogConfigs.addQuotaGroup.visible = false"
    >
    </add-quota-group-dialog>
    <!-- dialog end -->
  </div>
</template>

<script>
import { max, get as getValue, find, cloneDeep } from 'lodash';
import { arr2map, convert } from '@/core/utils';
import { PLANKEY } from '@/core/constants/constants';
import tableView from '@/view/mixins/table-view';
import QuotaService from '@/core/services/quota.service';
// dialogs
import AddQuotaGroupDialog from '@/view/pages/dialogs/quota/add-quota-group';

export default {
  name: 'Quota',

  extends: tableView('id', 5, 'name'),

  props: {
    org: { type: Array, default: () => [] },
    quotaUsages: { type: Array, default: () => [] },
  },

  components: {
    AddQuotaGroupDialog,
  },

  created() {
    this.orgId = this.$route.params.org;
    this.initTableView();
    this.loadQuotaFields();
    this.loadData();
  },

  data() {
    return {
      orgId: '',
      size: 'm',
      search: '',
      list: [],
      rows: [],
      allQuotaGroups: [],
      quotaGroup: {},
      quotaGroups: [],
      quotaFields: [],
      dialogConfigs: {
        addQuotaGroup: { visible: false },
        panelConfigs: { visible: false },
      },
    };
  },

  computed: {
    summaryQuota() {
      const { MEMORY } = PLANKEY;
      const { quotaFields, quotaGroups, quotaUsages } = this;
      const memory = find(quotaFields, { code: MEMORY });
      return quotaFields.map(field => {
        const { name, unit, id, code } = field;
        const usage = quotaUsages.find(x => x.quota_field_id === field.id);
        const groupFieldLimits = quotaGroups.map(group => {
          const { quota_group_limits = [] } = group;
          const fieldLimit = quota_group_limits.find(x => x.quota_field_id === id);
          return fieldLimit ? fieldLimit.limit : Infinity;
        });
        let limit = max(groupFieldLimits);
        let used;
        if (code === MEMORY) {
          used = usage && usage.in_use ? convert(usage.in_use, memory.unit) : 0;
          limit = limit === Infinity ? '' : convert(limit, memory.unit);
        } else {
          used = usage && usage.in_use ? usage.in_use : 0;
          limit = limit === Infinity ? '' : limit;
        }
        return {
          limit,
          name,
          unit,
          used,
          id,
        };
      });
    },

    planDetail() {
      const { quotaFields, quotaGroup } = this;
      const { quota_group_limits = [] } = quotaGroup;
      const quotaGroupMap = arr2map(quota_group_limits, 'quota_field_id');
      const table = {
        head: ['字段名', '值', '单位'],
        body: quotaFields.map(field => {
          const quota = quotaGroupMap.get(field.id) || {};
          const { name = '', unit = '' } = field;
          const { limit = '不设限制' } = quota;
          return [name, limit, unit];
        }),
      };
      return {
        table,
      };
    },
  },

  methods: {
    loadData() {
      this.loadOrgUsedQuotaGroup();
      this.loadOrgQuotaGroups();
    },

    initTableView() {
      this.setTableProps([
        { id: 'name', name: '配额组名' },
        { id: 'description', name: '描述' },
      ]);
      this.setTableOperations([{ name: '移除', event: 'confirm-remove-quota-group' }]);
    },

    loadQuotaFields() {
      QuotaService.listQuotaFields().then(fields => {
        this.quotaFields = fields;
      });
    },

    loadOrgUsedQuotaGroup() {
      QuotaService.getOrgUsedQuotaGroup(this.orgId).then(groups => {
        this.initQuotaGroups(groups);
      });
    },

    loadOrgQuotaGroups() {
      QuotaService.listQuotaGroups().then(groups => {
        this.allQuotaGroups = groups;
      });
    },

    initQuotaGroups(quotaGroups) {
      this.quotaGroups = quotaGroups.map(x => x.quota_group);
      this.rows = this.quotaGroups;
    },

    onCheckedRowsChange(rows = []) {
      const [row = {}] = rows;
      const data = cloneDeep(row);
      data.quota_group_limits.forEach(item => {
        if (getValue(item, 'quota_field.code') === PLANKEY.MEMORY) {
          item.limit = convert(item.limit, item.quota_field.unit);
        }
      });
      this.quotaGroup = data;
      this.dialogConfigs.panelConfigs.visible = true;
    },

    confirmRemoveQuotaDialog(quotaGroup) {
      this.$tada
        .confirm({
          title: '移除配额组',
          text: `您确定要移除配额组 ${quotaGroup.name} 吗？`,
          primaryText: '移除',
        })
        .then(willDel => {
          if (willDel) {
            this.removeOrgQuotaGroup(quotaGroup);
            this.dialogConfigs.panelConfigs.visible = false;
          }
        });
    },

    openAddQutoaGroupDialog() {
      this.dialogConfigs.addQuotaGroup.visible = true;
    },

    addOrgQuotaGroup(quotaGroup) {
      const quotaGroups = [...this.quotaGroups, quotaGroup];
      const orgUsedQuotaGroups = quotaGroups.map(x => ({
        quota_group_id: x.id,
      }));
      QuotaService.updateOrgUsedQuotaGroup(this.orgId, orgUsedQuotaGroups).then(list => {
        this.initQuotaGroups(list);
        this.$noty.success(`添加配额组${quotaGroup.name}成功`);
      });
    },

    removeOrgQuotaGroup(quotaGroup) {
      const quotaGroups = [...this.quotaGroups];
      const index = quotaGroups.findIndex(x => x.id === quotaGroup.id);
      quotaGroups.splice(index, 1);
      const orgUsedQuotaGroups = quotaGroups.map(x => ({
        quota_group_id: x.id,
      }));
      QuotaService.updateOrgUsedQuotaGroup(this.orgId, orgUsedQuotaGroups).then(list => {
        this.initQuotaGroups(list);
        this.onCheckedRowsChange();
        this.dialogConfigs.panelConfigs.visible = false;
        this.$noty.success(`移除配额组${quotaGroup.name}成功`);
      });
    },
  },
};
</script>

<style lang="scss">
.org-quota-module {
  // TODO: not perfect
  height: calc(100vh - 160px);
  margin: 0 -20px;
}
</style>
