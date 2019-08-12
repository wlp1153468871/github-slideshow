<template>
  <dao-setting-layout>
    <template slot="layout-title">参数设置</template>
    <formly-form
      ref="form"
      v-if="fields.length"
      :form="form.baseForm"
      :model="model"
      :fields="fields">
    </formly-form>
    <div
      v-if="isLoading && fields.length===0"
      class="dao-setting-section">
      <loading-state></loading-state>
    </div>
    <dao-setting-section v-if="advanceFields.length" class="show-more">
      <dao-setting-item>
        <div slot="content">
          <a @click="showMore = !showMore">
            {{ showMore ? '折叠以下选项' : '展开高级环境变量' }}
          </a>
        </div>
      </dao-setting-item>
    </dao-setting-section>
    <formly-form
      style="border-top: 1px solid #e4e7ed;"
      v-if="advanceFields.length"
      v-show="showMore"
      :form="form.advanceForm"
      :model="advanceModel"
      :fields="advanceFields">
    </formly-form>
  </dao-setting-layout>
</template>

<script>
import { partition } from 'lodash';
import arr2map from '@/core/utils/arr2map';
import Parser from '@/core/lib/formly-dao-style-parser';
import isInstanceName from '@/core/utils/is-instance-name';

export default {
  name: 'ParameterPanel',
  props: {
    parameters: { type: Array, default: () => [] },
    isLoading: { type: Boolean, default: false },
  },
  data() {
    return {
      form: {
        baseForm: {},
        advanceForm: {},
      },
      params: [],
      model: {},
      fields: [],
      advanceParams: [],
      advanceModel: {},
      advanceFields: [],
      showMore: false, // 展开高级选项
    };
  },

  updated() {
    const { form } = this.$refs;
    if (this.$refs.form) {
      this.$nextTick(() => {
        form.validate();
      });
    }
  },

  watch: {
    form: {
      deep: true,
      handler(form) {
        let valid = form.baseForm.$valid;
        if (this.advanceFields.length) {
          valid = valid && form.advanceForm.$valid;
        }
        this.$emit('valid', valid);
      },
    },

    parameters(parameters) {
      // setting name default desc;
      parameters.forEach(param => {
        if (param.id === 'name') {
          this.setNameValidate(param);
        }
        if (param.pattern) {
          this.setValiationByPattern(param);
        }
      });

      // only render visible is true
      parameters = parameters.filter(x => x.visible === true);
      // split advance params by .advance === 1
      const [advanceParams, basicParmas] = partition(parameters, {
        advance: 1,
      });
      // params
      this.params = basicParmas;
      this.model = Parser.getModel(basicParmas);
      this.fields = Parser.toFormly(basicParmas);
      this.advanceParams = advanceParams;
      this.advanceModel = Parser.getModel(advanceParams);
      this.advanceFields = Parser.toFormly(advanceParams);
    },
  },

  methods: {
    next() {
      const paramsMap = arr2map(this.parameters, 'id');
      const models = { ...this.model, ...this.advanceModel };
      const paramters = [];
      paramsMap.forEach((param, key) => {
        const value = models[key] || param.default;
        paramters.push({
          id: key,
          name: param.name,
          value,
        });
      });
      return paramters;
    },

    setNameValidate(param) {
      param.desc = "实例名只允许6-20位数字，字母，'-'，不允许输入其它特殊字符";
      param.validators = {
        required: {
          expression(field, model, next) {
            next(model[field.key].trim() !== '');
          },
          message: '不能为空',
        },
        isValidName: {
          expression(field, model, next) {
            next(isInstanceName(model[field.key]));
          },
          message: "只允许数字，字母和'-',字母开头",
        },
        min: {
          expression(field, model, next) {
            next(model[field.key].trim().length >= 6);
          },
          message: '至少6位',
        },
        max: {
          expression(field, model, next) {
            next(model[field.key].trim().length <= 40);
          },
          message: '不能超过40位',
        },
      };
    },

    setValiationByPattern(param) {
      const regexp = new RegExp(param.pattern);
      param.validators = {
        validate: {
          expression(field, model, next) {
            const value = model[field.key].trim();
            if (value === '') {
              next(true); // 不进行 pattern 校验;
            } else {
              next(regexp.test(value));
            }
          },
          message: param.desc || `请输入正确的${param.name}`,
        },
      };
    },
  },
};
</script>

<style lang="scss" scoped>
fieldset {
  .dao-setting-section:first-child {
    border-top: 1px solid #e4e7ed;
  }
}

.show-more {
  border-top: 1px solid #e4e7ed;
}
</style>
