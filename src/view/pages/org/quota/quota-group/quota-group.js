import { max, find } from 'lodash';
import { mapGetters } from 'vuex';
import { convert } from '@/core/utils';
import { PLANKEY } from '@/core/constants/constants';
import QuotaService from '@/core/services/quota.service';
import OrgService from '@/core/services/org.service';

export default {
  name: 'QuotaGroup',

  data() {
    return {
      quotaGroups: [],
      quotaFields: [],
      org: {},
      summaryQuota: [],
      loading: true,
    };
  },

  computed: {
    ...mapGetters(['orgId']),
  },

  created() {
    this.loading = true;
    Promise.all([
      this.loadOrg(),
      this.loadQuotaFields(),
      this.loadOrgUsedQuotaGroup(),
    ]).then(() => {
      this.summaryQuota = this.getSummaryQuota();
      this.loading = false;
    });
  },

  methods: {
    loadOrg() {
      return OrgService.getOrg(this.orgId).then(org => {
        this.org = org;
      });
    },

    loadQuotaFields() {
      return QuotaService.listQuotaFields().then(fields => {
        this.quotaFields = fields;
      });
    },

    loadOrgUsedQuotaGroup() {
      return QuotaService.getOrgUsedQuotaGroup(this.orgId).then(groups => {
        this.initQuotaGroups(groups);
      });
    },

    initQuotaGroups(quotaGroups) {
      this.quotaGroups = quotaGroups.map(x => x.quota_group);
    },

    getSummaryQuota() {
      const { MEMORY } = PLANKEY;
      const {
        quotaFields,
        quotaGroups,
        org: { quota_usages: quotaUsages = [] },
      } = this;
      const memory = find(quotaFields, { code: MEMORY });
      return quotaFields.map(field => {
        const {
          name, unit, id, code,
        } = field;
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
  },
};
