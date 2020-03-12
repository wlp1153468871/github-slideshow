<template>
  <div class="service-detail-plans">
    <div class="dao-view-main">
      <div class="dao-view-content">
        <dao-table-view
          ref="tableView"
          :rows="rows"
          :config="tConfig"
          :loading="this.loadings.plans"
          @refresh="loadPlans"
          @edit="editPlan"
          @checked-rows-change="showPanel"
          @enable-plan="confirmEnablePlan"
          @disable-plan="confirmDisablePlan">
        </dao-table-view>
      </div>
    </div>

    <!-- detail panel start -->
    <div class="fixed-bottom-panels">
      <dao-panel
        size="l"
        class="bottom-body"
        :visible.sync="panelConfigs.planOverview.visible">
        <dao-panel-item heading="配额详情">
          <div class="row">
            <div class="col-md-6">
              <dao-info-sheet :table="planDetail.table">
              </dao-info-sheet>
            </div>
            <div class="col-md-6" v-if="chargingEnable">
              <dao-info-card
                size="md"
                :table-value="chargDetail.table">
                <div slot="title">
                  计费详情
                </div>
              </dao-info-card>
            </div>
          </div>
        </dao-panel-item>
      </dao-panel>
    </div>
    <!-- detail panel end -->

    <!--dialogs start-->
    <edit-plan-dialog
      ref="editPlanDialog"
      :plan="plan"
      @save="updatePlan"
      :visible="dialogConfigs.editPlan.visible"
      @close="dialogConfigs.editPlan.visible = false">
    </edit-plan-dialog>
    <!--dialog end -->
  </div>
</template>

<script>
import Vue from 'vue';
import { first, isNil, round } from 'lodash';
import { mapState, mapGetters } from 'vuex';
import arr2map from '@/core/utils/arr2map';
import tableView from '@/view/mixins/table-view';
import BrokerServiceService from '@/core/services/broker-service.service';
import ChargingService from '@/core/services/charging.service';
// dialog
import EditPlanDialog from '@/view/pages/dialogs/broker-service/edit-plan';
import { convert } from '@/core/utils';
import { PLANKEY, SERVICE_STATUS } from '@/core/constants/constants';

export default {
  name: 'PlansPanel',
  extends: tableView('id', 10, 'name'),
  components: {
    EditPlanDialog,
  },
  props: {
    // plans: { type: Array, default: () => [] },
    quotaUnits: { type: Array, default: () => [] },
    serviceId: { type: String, default: '' },
    quotaDict: { type: Object },
  },
  created() {
    this.loadPlans();
    this.initDaoTable();
  },
  data() {
    return {
      rows: [],
      plans: [],
      plan: {}, // selected plan
      selectedChargingRules: [],
      loadings: {
        plans: false,
      },
      dialogConfigs: {
        editPlan: { visible: false },
      },
      panelConfigs: {
        planOverview: { visible: false },
      },
    };
  },
  watch: {
    plans: {
      immediate: true,
      handler(plans) {
        this.rows = plans;
      },
    },
  },
  computed: {
    ...mapState(['chargingEnable']),
    ...mapGetters(['isZoneSyncing']),

    planDetail() {
      const { plan, quotaDict } = this;
      const bullets = plan.bullets || [];
      const table = {
        header: ['字段名', '值', '单位'],
        body: bullets.map(x => {
          const { name = '', value = 0, unit = '' } = x;
          const dict = quotaDict[name];
          let convertedValue = value;
          if (name === PLANKEY.MEMORY) {
            convertedValue = convert(value, dict && dict.unit, unit);
          }
          if (name === PLANKEY.CPU) convertedValue = round(value / 1000, 1);
          return {
            name: dict && dict.name,
            value: convertedValue,
            unit: dict && dict.unit,
          };
        }),
      };
      const map = [
        {
          规格名称: plan.name,
          是否上架: plan.available === SERVICE_STATUS.AVAILABLE ? '是' : '否',
        },
      ];
      return {
        table,
        map,
      };
    },
    chargDetail() {
      const { selectedChargingRules } = this;
      const table = {
        header: ['计费方式', '价格'],
        body: selectedChargingRules.map(x => {
          const chargingTypeCode = x.charging_type_code;
          const fen2yuan = Vue.filter('fen_2_yuan');
          const price = `${fen2yuan(x.prices[0].price)}元`;
          return { chargingTypeCode, price };
        }),
      };
      return {
        table,
      };
    },
    unitMap() {
      return arr2map(this.quotaUnits, 'id');
    },
  },
  methods: {
    initDaoTable() {
      this.setTableProps([
        { id: 'name', name: '规格名称' },
        { id: 'description', name: '简短介绍' },
        { id: 'available', name: '是否上架', filter: 'service_status' },
      ]);
      const isEnable = item => item.available === SERVICE_STATUS.UNAVAILABLE;
      const isDisable = item => item.available === SERVICE_STATUS.AVAILABLE;

      this.setTableOperations([
        { name: '上架', event: 'enable-plan', visible: isEnable },
        { name: '下架', event: 'disable-plan', visible: isDisable },
        { name: '编辑', disabled: this.isZoneSyncing, event: 'edit' },
      ]);
    },

    loadPlans() {
      this.loadings.plans = true;
      this.panelConfigs.planOverview.visible = false;
      return BrokerServiceService.getPlans(this.serviceId)
        .then(plans => {
          this.plans = plans;
        })
        .catch(() => {
          this.$noty.error('加载服务的规格失败');
        })
        .finally(() => {
          this.loadings.plans = false;
        });
    },

    showPanel(plans) {
      const [plan] = plans;
      if (plan) {
        this.plan = this.parsePlan(plan);
        this.panelConfigs.planOverview.visible = true;
        const planId = this.plan.id;
        if (!this.chargingEnable) return;
        ChargingService.getChargingRules(planId).then(rules => {
          this.selectedChargingRules = first(rules).charging_rule_details;
        });
      }
    },

    confirmDisablePlan(plan) {
      this.$tada
        .confirm({
          title: '立即下架',
          text: '下架此规格',
          primaryText: '下架',
        })
        .then(disable => {
          if (disable) {
            this.disablePlan(plan);
          }
        });
    },

    disablePlan(plan) {
      const params = {
        available: SERVICE_STATUS.UNAVAILABLE,
      };
      BrokerServiceService.updateServicePlan(
        this.serviceId,
        plan.id,
        params,
      ).then(() => {
        plan.available = SERVICE_STATUS.UNAVAILABLE;
        this.$noty.success('规格下架成功');
      });
    },

    confirmEnablePlan(plan) {
      this.$tada
        .confirm({
          title: '立即上架',
          text: '上架此规格',
          primaryText: '上架',
        })
        .then(enable => {
          if (enable) {
            this.enablePlan(plan);
          }
        });
    },

    enablePlan(plan) {
      const params = {
        available: SERVICE_STATUS.AVAILABLE,
      };
      BrokerServiceService.updateServicePlan(
        this.serviceId,
        plan.id,
        params,
      ).then(() => {
        plan.available = SERVICE_STATUS.AVAILABLE;
        this.$noty.success('规格上架成功');
      });
    },

    editPlan(plan) {
      if (plan.id !== this.plan.id) {
        this.plan = this.parsePlan(plan);
      }
      this.dialogConfigs = {
        editPlan: { visible: true },
      };
    },

    updatePlan(editedPlan) {
      const { plan } = this;
      // update plan
      let updatePlan = null;
      if (
        plan.name !== editedPlan.name ||
        plan.description !== editedPlan.description ||
        plan.custom_description !== editedPlan.custom_description
      ) {
        const { name } = editedPlan;
        let { description, custom_description } = editedPlan;
        if (isNil(description)) description = '';
        if (isNil(custom_description)) custom_description = '';
        updatePlan = BrokerServiceService.updateServicePlan(
          this.serviceId,
          plan.id,
          {
            name,
            description,
            custom_description,
          },
        );
      }

      // update plan requires
      const requireMap = arr2map(plan.requires, 'id', 'require');
      const updatePlanRequires = editedPlan.requires
        .filter(item => {
          const require = Number(item.require);
          return require !== requireMap.get(item.id);
        })
        .map(item => {
          const params = {
            require: Number(item.require),
          };
          return BrokerServiceService.updateServicePlanQuota(
            this.serviceId,
            plan.id,
            item.quota_unit_id,
            params,
          );
        });

      return Promise.all([...updatePlanRequires, updatePlan])
        .then(() => {
          const newPlan = this.mergePlan(plan, editedPlan);
          const idx = this.plans.findIndex(x => x.id === this.plan.id);
          if (idx !== -1) {
            this.plans.splice(idx, 1, newPlan);
          }
          this.showPanel([newPlan]);
          this.$noty.success('修改规格成功');
        })
        .catch(() => {
          this.$noty.error('修改规格失败');
        });
    },

    parsePlan(plan) {
      const { quota_requires = [] } = plan;
      const requires = quota_requires.map(x => {
        let field = {};
        const unit = this.unitMap.get(x.quota_unit_id);
        if (unit) {
          field = unit.quota_field;
        }
        return {
          ...x,
          name: field.name,
          unit: field.unit,
        };
      });
      plan.requires = requires; // dirty add field
      return plan;
    },

    mergePlan(plan, editedPlan) {
      const { requires, ...rest } = editedPlan;
      const qrs = plan.quota_requires.map(qr => {
        const q = requires.find(x => x.id === qr.id);
        const { id, quota_unit_id, require = 0 } = q;
        return {
          id,
          quota_unit_id,
          require: Number(require),
        };
      });
      return {
        ...plan,
        ...rest,
        quota_requires: qrs,
      };
    },
  },
};
</script>

<style lang="scss">
.service-detail-plans {
  .dao-infocard-container.size-sm {
    float: left;
    margin-right: 22px;
    // border: none;
  }
}
.service-spec-container {
  .dao-list-toolbar {
    display: none;
  }
}
.service-spec-container {
  display: flex;
  flex-wrap: wrap;
}
.plans-item {
  cursor: pointer;
  // 隐藏dao-list右上角的按钮组
  .pull-right {
    display: none;
  }
}
</style>
