<template>
  <div>
    <p style="margin-bottom: 5px;">如果请求符合下列规则:</p>
    <div class="sub-setting-layout">
      <div class="sub-setting-section level">
        <div class="sub-setting-item">
          <p class="top-label">类型</p>
          <div style="width: 150px; margin-right: 8px;">
            <dao-select
              v-model="source"
              class="select-full-width">
              <dao-option
                v-for="type in SOURCE_TYPES"
                :key="type.value"
                :value="type.value"
                :label="type.label">
              </dao-option>
            </dao-select>
          </div>
        </div>
        <div class="sub-setting-item level-item">
          <p class="top-label">匹配名称</p>
          <div>
            <dao-input
              icon-inside
              v-model="key"
              name="key"
              v-validate="'required|chinese'"
              :message="veeErrors.first('key')"
              :status="veeErrors.has('key') ? 'error' : ''"
              data-vv-as="匹配名称"
              block
              :placeholder="SOURCE_TYPES[source].placeholder">
            </dao-input>
          </div>
        </div>
      </div>
      <div class="sub-setting-section level">
        <div class="sub-setting-item">
          <p class="top-label">匹配规则</p>
          <div style="width: 150px; margin-right: 8px;">
            <dao-select
              v-model="pattern"
              class="select-full-width">
              <dao-option
                v-for="type in PATTERN_TYPES"
                :key="type.value"
                :value="type.value"
                :label="type.label">
              </dao-option>
            </dao-select>
          </div>
        </div>
        <div class="sub-setting-item level-item">
          <p class="top-label">匹配值</p>
          <div>
            <dao-input
              icon-inside
              v-model="value"
              name="value"
              v-validate="'required|chinese'"
              :message="veeErrors.first('value')"
              :status="veeErrors.has('value') ? 'error' : ''"
              data-vv-as="匹配值"
              block
              :placeholder="PATTERN_TYPES[pattern].placeholder">
            </dao-input>
          </div>
        </div>
      </div>
    </div>
    <p style="margin: 5px 0;">请求将被路由到 <b> 新版本 Service </b> 否则到 <b> 当前 Service</b>：</p>
    <div class="sub-setting-layout">
      <div class="sub-setting-section level">
        <div class="sub-setting-item level-item" style="margin-right: 4px">
          <p class="top-label">新版本应用</p>
          <dao-select v-model="nextModel" class="select-full-width">
            <dao-option
              v-for="app in apps"
              :key="app.id"
              :value="app.name"
              :label="app.name">
            </dao-option>
          </dao-select>
        </div>
        <div class="sub-setting-item level-item" style="margin-left: 4px">
          <p class="top-label">当前 Service</p>
          <dao-select
            v-model="current"
            class="select-full-width"
            :disabled="true">
            <dao-option :value="current" :label="current"></dao-option>
          </dao-select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { first } from 'lodash';

export default {
  name: 'GrayDeployment',

  props: {
    apps: { type: Array, default: () => [] },
    deployment: { type: Object, default: () => ({}) },
    current: { type: String, default: '' },
    next: { type: String, default: '' },
  },

  data() {
    const SOURCE_TYPES = {
      header: { value: 'header', label: 'Header', placeholder: '必须, HTTP Header Fields' },
      cookie: { value: 'cookie', label: 'Cookie', placeholder: 'Cookie Name' },
      query: { value: 'query', label: 'Query', placeholder: 'URL Query String Filed Name' },
    };
    const PATTERN_TYPES = {
      exact: { value: 'exact', label: '完全匹配', placeholder: '字符串完全匹配' },
      regex: { value: 'regex', label: '正则匹配', placeholder: '输入正则' },
    };

    return {
      SOURCE_TYPES,
      PATTERN_TYPES,
      source: SOURCE_TYPES.header.value,
      key: '',
      pattern: PATTERN_TYPES.exact.value,
      value: '',
      nextModel: '',
    };
  },
  computed: {
    isValidForm() {
      return Boolean(this.key && this.value && this.nextModel && this.current) &&
        !this.veeErrors.any();
    },
  },

  watch: {
    apps: {
      immediate: true,
      handler(apps) {
        const app = first(apps);
        if (app) {
          this.nextModel = app.name;
        }
      },
    },

    deployment: {
      immediate: true,
      handler(deployment) {
        const { SOURCE_TYPES, PATTERN_TYPES } = this;
        const {
          source = SOURCE_TYPES.header.value,
          key = '',
          pattern = PATTERN_TYPES.exact.value,
          value = '',
        } = deployment.grayRelease || {};

        this.source = source;
        this.key = key;
        this.pattern = pattern;
        this.value = value;
      },
    },
  },

  methods: {
    validate() {
      return this.$validator.validate().then(isValid => {
        return isValid && this.isValidForm;
      });
    },
    providePartialModel() {
      return {
        rule: {
          source: this.source,
          key: this.key,
          pattern: this.pattern,
          value: this.value,
          toBackend: this.nextModel,
        },
        next: {
          name: this.nextModel,
        },
      };
    },
  },
};
</script>
