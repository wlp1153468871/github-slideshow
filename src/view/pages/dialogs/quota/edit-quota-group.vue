<template>
  <dao-dialog :visible.sync="isShow" @closed="onClosed" :header="title">
    <div class="dao-setting-warning">
      <svg class="tip-icon icon"><use xlink:href="#icon_bell"></use></svg>
      提示: 配额组下设置的"配额字段"会影响所有使用该配额组的租户或项目组，请谨慎修改。
    </div>
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">配额组名</div>
        <div slot="content">
          <dao-input
            icon-inside
            v-model="name"
            type="text"
            name="name"
            v-validate="'required|max:10'"
            data-vv-as="配额组名"
            :message="veeErrors.first('name')"
            :status="veeErrors.has('name') ? 'error' : ''"
          >
          </dao-input>
        </div>
      </dao-setting-item>
    </dao-setting-section>
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">描述</div>
        <div slot="content">
          <dao-input
            icon-inside
            block
            v-model="description"
            type="text"
            name="description"
            v-validate="'max:50'"
            data-vv-as="描述"
            :message="veeErrors.first('description')"
            :status="veeErrors.has('description') ? 'error' : ''"
          >
          </dao-input>
        </div>
      </dao-setting-item>
    </dao-setting-section>
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">配额字段</div>
        <div slot="content">
          <div class="dao-editable-table">
            <table class="dao-table flexrow">
              <thead>
                <tr>
                  <th style="width: 20%;">唯一标识</th>
                  <th style="width: 40%;">字段名</th>
                  <th style="width: 40%;">值</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in limits" :key="index">
                  <td style="width: 20%;">
                    {{ item.code }}
                  </td>
                  <td style="width: 40%;">{{ item.name }} ({{ item.unit }})</td>
                  <td style="width: 40%;">
                    <dao-input
                      block
                      no-border
                      icon-inside
                      class="det-input"
                      type="text"
                      size="sm"
                      v-model="item.limit"
                      :name="item.code"
                      placeholder="空值，表示不设限"
                      :data-vv-as="item.code"
                      :message="veeErrors.first(item.code)"
                      :status="veeErrors.has(item.code) ? 'error' : ''"
                      v-validate="'decimal:3|max:12|min_value:0|max_value:999999'"
                    >
                    </dao-input>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </dao-setting-item>
    </dao-setting-section>
    <div slot="footer">
      <button class="dao-btn ghost" @click="onClose">
        取消
      </button>
      <button class="dao-btn blue" @click="onConfirm" :disabled="!isValidForm || isCreating">
        确定
      </button>
    </div>
  </dao-dialog>
</template>

<script>
import { cloneDeep, find } from 'lodash';
import { convert } from '@/core/utils';
import { PLANKEY } from '@/core/constants/constants';
import { mapState } from 'vuex';

export default {
  name: 'CreateQuotaDialog',
  props: {
    isCreating: { type: Boolean, default: false },
    title: { type: String, default: '创建配额' },
    quotaGroup: { type: Object, default: () => [] },
    editType: { type: String, default: 'create' },
    visible: { type: Boolean, default: false },
  },
  data() {
    const { title } = this;
    return {
      name: '',
      description: '',
      limits: [],
      config: {
        title,
      },
    };
  },
  watch: {
    quotaGroup: {
      deep: true,
      handler(quotaGroup) {
        const { name, description, limits } = quotaGroup;
        this.name = name;
        this.description = description;
        this.limits = cloneDeep(limits);
        const memory = find(this.limits, { code: PLANKEY.MEMORY });
        if (memory) memory.limit = convert(memory.limit, memory.unit);
      },
    },
  },
  computed: {
    ...mapState(['quotaDict']),
    isValidForm() {
      return this.name !== '' && !this.veeErrors.any();
    },
    isShow: {
      set() {
        this.$emit('close');
      },
      get() {
        return this.visible;
      },
    },
  },
  methods: {
    onConfirm() {
      const limits = cloneDeep(this.limits);
      const convertedLimits = this.convertLimits(limits);

      this.$emit(this.editType, {
        id: this.quotaGroup.id,
        name: this.name,
        description: this.description,
        limits: convertedLimits,
      });
    },

    convertLimits(limits) {
      const { MEMORY } = PLANKEY;
      limits.forEach(limit => {
        if (limit.code === MEMORY && limit.limit !== null) {
          limit.limit = `${convert(limit.limit, 'MB', this.quotaDict[MEMORY].unit)}`;
        }
      });
      return limits;
    },

    onClose() {
      this.$emit('close');
    },

    onClosed() {
      this.name = '';
      this.description = '';
    },
  },
};
</script>
