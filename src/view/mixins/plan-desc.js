import { find, isEmpty } from 'lodash';
import { PLANKEY, DICTIONARY } from '@/core/constants/constants';
import { convert } from '@/core/utils';
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['quotaDict']),
  },

  data() {
    return {
      PLANKEY,
      filterRule: {
        'daocloud-app': [PLANKEY.CPU, PLANKEY.MEMORY],
        'daocloud-volume': [PLANKEY.STORAGE],
        others: [PLANKEY.CPU, PLANKEY.MEMORY, PLANKEY.STORAGE],
      },
    };
  },

  methods: {
    filterBullets(originBullets, name) {
      const rule = this.filterRule[name] ? this.filterRule[name] : this.filterRule.others;
      return originBullets.filter(bullet => rule.indexOf(bullet.name) > -1);
    },

    generatePlanDesc({ bullets, description, meta_data: { need_quota } }, name) {
      if (!need_quota) {
        return [
          {
            name: DICTIONARY.config,
            value: bullets.join(),
          },
        ];
      }
      const { CPU, MEMORY, CONFIG } = PLANKEY;
      if (isEmpty(bullets)) {
        return [
          {
            name: DICTIONARY[CONFIG],
            value: description,
          },
        ];
      }
      const { quotaDict } = this;
      if (isEmpty(quotaDict)) return [];
      const cpu = find(bullets, { name: CPU });
      const memory = find(bullets, { name: MEMORY });
      const configDetails = [];
      configDetails.push({
        name: DICTIONARY[CONFIG],
        value: `${cpu.value / 1000}${quotaDict[CPU].unit} ${convert(
          memory.value,
          quotaDict[MEMORY].unit,
          memory.unit,
        )}${quotaDict[MEMORY].unit}`,
      });
      const restDetails = this.filterBullets(bullets, name)
        .filter(item => item.name !== CPU && item.name !== MEMORY)
        .map(x => {
          const dict = quotaDict[x.name];
          return {
            name: dict ? dict.name : x.name,
            value: `${x.value} ${dict ? dict.unit : x.name}`,
          };
        });

      return [...configDetails, ...restDetails];
    },

    getPlanDetails({ bullets, description, meta_data: { need_quota } }, name) {
      if (!need_quota) {
        return bullets.join();
      }

      if (isEmpty(bullets)) return description || '无';

      const group = (accumulator, currentValue) => {
        const dict = this.quotaDict[currentValue.name];
        let { value } = currentValue;
        if (currentValue.name === PLANKEY.MEMORY) {
          value = convert(currentValue.value, dict.unit, currentValue.unit);
        }
        if (currentValue.name === PLANKEY.CPU) {
          value = currentValue.value / 1000;
        }
        return `${accumulator}${accumulator ? ', ' : ''}${dict.name}: ${value}${dict.unit}`;
      };

      return this.filterBullets(bullets, name).reduce(group, '');
    },

    getApplicationPlan(plan) {
      const { bullets } = plan;

      const planFormatter = bullet => `${bullet.name}: ${bullet.value}${bullet.unit}`;

      return this.humanizeBullets(bullets).map(planFormatter);
    },

    humanizeBullets(bullets) {
      return bullets.filter(x => !isEmpty(x.value)).map(this.humanizeBullet);
    },

    humanizeBullet(bullet) {
      let { value, unit, name } = bullet;

      const humanize = this.quotaDict[bullet.name];
      if (humanize) {
        name = humanize.name; // eslint-disable-line
        unit = humanize.unit; // eslint-disable-line
      }

      if (bullet.name === PLANKEY.MEMORY) {
        value = convert(value, unit, bullet.unit);
      }

      return {
        name,
        unit,
        value,
      };
    },
  },
};
