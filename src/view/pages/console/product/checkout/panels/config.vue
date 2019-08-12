<template>
  <div class="page-instance-config">
    <space-zone></space-zone>

    <dao-setting-layout>
      <template slot="layout-title">规格</template>

      <template v-if="plan && plan.symbol">

        <dao-setting-section v-if="plan.ha">
          <dao-setting-item>
            <div slot="label">
              部署方式
              <label-tip text="实例创建的方式包括单点部署和高可用部署"></label-tip>
            </div>
            <div class="reset-margin" slot="content">
              {{plan.ha? '高可用' : '单点'}}
            </div>
          </dao-setting-item>
        </dao-setting-section>

        <dao-setting-section
          v-for="(bullet, key, index) in standard"
          :key="'section' + index">
          <dao-setting-item>
            <div slot="label">
              {{ (quotaDict[key] && quotaDict[key].name) || DICTIONARY[key] || key }}
              <label-tip
                v-if="key === PLANKEY.CONFIG"
                text="实例的计算资源，包括CPU数量和内存数量"></label-tip>
              <label-tip
                v-if="isVolume && key === PLANKEY.STORAGE"
                text="PVC 的创建会默认消耗1核CPU和1G内存的配额"></label-tip>
            </div>
            <template slot="content">
              <dao-select
                class="reset-margin"
                @change="changePlan(key)"
                v-model="planModel[key]">
                <dao-option
                  v-for="option in bullet"
                  :key="option.label"
                  :value="option.value"
                  :label="option.label">
                </dao-option>
              </dao-select>
            </template>
          </dao-setting-item>
        </dao-setting-section>

      </template>

      <dao-setting-section v-if="plan && !plan.symbol && plan.plans.length">
        <dao-setting-item>
          <div slot="label">
            {{DICTIONARY.config}}
          </div>
          <template slot="content">
            <dao-select
              class="reset-margin"
              @change="changePlan()"
              v-model="planModel">
              <dao-option
                v-for="option in plan.plans"
                :key="option.id"
                :value="option"
                :label="option.description">
              </dao-option>
            </dao-select>
          </template>
        </dao-setting-item>
      </dao-setting-section>

    </dao-setting-layout>

    <parameter-panel
      v-show="hasParams"
      :parameters="parameters"
      ref="parameterPanel"
      @valid="$emit('valid', $event)">
    </parameter-panel>

  </div>
</template>

<script>
import { mapState } from 'vuex';
import { cloneDeep, orderBy, isEmpty, find, first } from 'lodash';
import { convert } from '@/core/utils';
import UserService from '@/core/services/user.service';
import ServiceService from '@/core/services/service.service';
import PlanService from '@/core/services/plan.service';
import { BUILDIN_SERVICE_TOKEN_NAME } from '@/core/constants/app';
import {
  PLANKEY,
  DICTIONARY,
  VOLUME_SERVICE,
  DCS,
} from '@/core/constants/constants';
import SpaceZone from '@/view/components/space-zone/space-zone';
import ParameterPanel from './parameter';

export default {
  name: 'ConfigPanel',

  components: {
    ParameterPanel,
    SpaceZone,
  },

  props: {
    brokerServiceId: { type: String, default: '' },
    service: { type: Object, default: () => ({}) },
    value: { type: Object, default: () => ({}) },
  },

  data() {
    return {
      configDict: {},
      DICTIONARY,
      fields: [
        {
          key: 'fname',
          type: 'input',
        },
        {
          key: 'lname',
          type: 'input',
        },
      ],
      form: {},
      loadings: {
        init: false,
      },
      model: {
        fname: '',
        lname: '',
      },
      parameters: [],
      plan: null,
      planId: null,
      PLANKEY,
      planModel: {},
      standard: {},
      VOLUME_SERVICE,
    };
  },

  created() {
    this.getPlan();
  },

  methods: {
    getPlan(data) {
      PlanService.getPlan(this.brokerServiceId, data)
        .then(res => {
          this.plan = cloneDeep(res);
          delete res[PLANKEY.HA];
          delete res[PLANKEY.SYMBOL];
          if (this.plan[PLANKEY.SYMBOL]) {
            Object.entries(res).forEach(([key, value]) => {
              const quota = this.quotaDict[key];
              const { unit } = value;
              if (key === PLANKEY.CONFIG) {
                const options = value.options.map(item => {
                  const optionValue = this.groupConfig(item, unit);
                  return {
                    label: optionValue,
                    value: item,
                  };
                });
                this.$set(this.standard, key, options);
                if (!data) {
                  this.$set(
                    this.planModel,
                    key,
                    find(value.options, value.default),
                  );
                }
              } else {
                this.$set(
                  this.standard,
                  key,
                  value.options.map(v => {
                    return {
                      label: `${v}${quota.unit}`,
                      value: v,
                    };
                  }),
                );
                if (
                  !data ||
                  (data && value.options.indexOf(this.planModel[key]) === -1)
                ) {
                  this.$set(this.planModel, key, value.default);
                }
              }
            });
          } else {
            this.planModel = first(res.plans);
          }
          this.getParameters();
        })
        .catch(e => {
          console.error(e);
        });
    },

    changePlan(key) {
      if (key) {
        const plan = {
          ...this.planModel,
          currentKey: key,
        };
        this.getPlan(plan);
      } else {
        this.getParameters();
      }
    },

    groupConfig(item, unit) {
      const { CPU, MEMORY } = PLANKEY;
      const { quotaDict } = this;
      return `${item[CPU] / 1000}${quotaDict[CPU].unit} ${convert(
        item[MEMORY],
        quotaDict[MEMORY].unit,
        unit[MEMORY],
      )}${quotaDict[MEMORY].unit}`;
    },

    async getExternalParams() {
      if (!this.planModel.id) return;
      try {
        const response = await ServiceService.getExternalParams(
          this.brokerServiceId,
          this.planModel.id,
          this.space.id,
        );
        this.planId = this.planModel.id;
        if (this.chargingEnable) this.$emit('searchChargingRules', this.planId);
        this.parameters = response.map(this.initDefaultValue);
      } catch (e) {
        this.$noty.error('加载服务的参数失败');
      }
    },

    async getPlatformParams() {
      try {
        const [response, dsp] = await Promise.all([
          ServiceService.getServiceParameters(
            this.brokerServiceId,
            this.space.id,
            this.planModel,
          ),
          this.isDCSService && this.loadKeyForDSP(),
        ]);
        if (this.isDCSService) {
          this.injectParameters(response.params, dsp);
        }
        this.planId = response.planId;
        if (this.chargingEnable) this.$emit('searchChargingRules', this.planId);
        this.parameters = response.params.map(this.initDefaultValue);
      } catch (e) {
        this.$noty.error('加载服务的参数失败');
      }
    },

    getParameters() {
      if (this.plan && this.plan.symbol) {
        this.getPlatformParams();
      } else {
        this.getExternalParams();
      }
    },

    initDefaultValue(param) {
      if (param.type === 'anyOf') {
        const selected = param.default;
        param.options.forEach(x => {
          x.model = selected.includes(x.value);
        }); // evil change!
        param.value = param.default;
        return param;
      }
      if (param.default) {
        param.value = param.default;
        return param;
      }

      if (param.type === 'oneOf') {
        if (param.options) {
          // order options
          param.options = orderBy(param.options, 'name', 'asc');
          // set default value;
          const { value } = param.options[0] || {};
          param.value = value;
        }
      } else if (param.type === 'integer') {
        param.value = 0;
      }

      return param;
    },

    /**
     * inject params named 'dsp_access_key' and 'dsp_secert_key'
     * from user/keys
     * @param {Array<Object>} parameters params list;
     */
    async injectParameters(parameters, dsp) {
      // const dsp = await this.loadKeyForDSP();
      parameters.forEach(p => {
        // dcs access key
        if (p.name === 'name') {
          p.default = this.space.short_name;
        }
        if (/dsp_access_key$/.test(p.name)) {
          p.default = dsp.access_key; // dirty change!
        } else if (/dsp_secert_key$/.test(p.name)) {
          p.default = dsp.secert_key;
        }
      });
      return parameters;
    },

    async loadKeyForDSP() {
      const { DCS_DEPLOY_TOKEN } = BUILDIN_SERVICE_TOKEN_NAME;
      return UserService.listKeys().then(keys => {
        const DCSKey = keys.find(x => x.name === DCS_DEPLOY_TOKEN);
        if (!DCSKey) {
          return UserService.createKey(DCS_DEPLOY_TOKEN);
        }
        return DCSKey;
      });
    },

    formModel() {
      return {
        plan: this.planModel,
        ha: this.plan.ha,
        symbol: this.plan.symbol,
        planId: this.planId,
        parameters: this.$refs.parameterPanel.next(),
        standard: this.plan,
        quotaDict: this.quotaDict,
      };
    },
  },

  computed: {
    ...mapState(['space', 'chargingEnable', 'quotaDict']),

    isVolume() {
      return this.service.brokerService.service_type === VOLUME_SERVICE;
    },

    hasParams() {
      return !isEmpty(this.parameters);
    },

    isDCSService() {
      return this.service.brokerService.service_type === DCS;
    },

    isValidForm() {
      return !this.loadings.init && this.orgId && this.spaceId;
    },
  },
};
</script>

<style lang="scss">
.page-instance-config {
  .daox-setting-layout {
    .dao-setting-layout {
      .dao-setting-section {
        padding: 15px 20px 15px 0;

        .dao-setting-content > :first-child {
          margin: 0;
        }

        .dao-setting-content > :not(:first-child):not(.dao-btn) {
          margin: 0;
        }

        .dao-setting-content {
          .area-group {
            margin: 0 0 -10px 1px;
          }
        }
      }
    }
  }

  .dao-setting-item {
    align-items: baseline;
  }

  .form-inline {
    display: flex;

    .form-group {
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      label {
        margin-bottom: 5px;
        color: #9ba3af;
        font-size: 13px;
        line-height: 14px;
      }

      & + .form-group {
        margin-left: 10px;
        border: none;
      }
    }
  }

  .area-group {
    display: flex;
    flex-wrap: wrap;

    label {
      display: inline-block;
      min-width: 100px;
      padding: 3px 15px;
      margin-bottom: 10px;
      margin-left: -1px;
      line-height: 24px;
      text-align: center;
      border: 1px solid #d5dbe3;

      &.active {
        z-index: 1;
        color: #1d81ff;
        background: rgba(56, 144, 255, .05);
        border-color: #5290de;
      }

      &:hover {
        z-index: 1;
        color: #1d81ff;
        background: rgba(56, 144, 255, .05);
        border-color: #5290de;
      }

      &:first-of-type {
        border-radius: 2px 0 0 2px;
      }

      &:last-of-type {
        border-radius: 0 2px 2px 0;
      }
    }

    input {
      display: none;
      line-height: 24px;
    }
  }
}
</style>
