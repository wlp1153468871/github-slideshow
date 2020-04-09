<template>
  <dao-setting-layout>
    <!-- 配额 -->
    <dao-setting-section>
      <dao-setting-item>
        <template slot="content">
          <div class="dao-table-main quota-table">
            <table class="dao-table row" v-show="fields.length">
              <thead>
                <tr>
                  <th>唯一标识</th>
                  <th>字段名</th>
                  <th>单位</th>
                  <th>描述</th>
                  <th style="width: 80px;">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in fields" :key="index">
                  <!-- 名称 -->
                  <td>{{ item.code }}</td>
                  <!-- 单位 -->
                  <td>{{ item.name }}</td>
                  <td>{{ item.unit }}</td>
                  <td>{{ item.description }}</td>
                  <!-- 操作 -->
                  <td class="operation">
                    <svg class="icon opterator" @click="confirmDeleteQuota(item, index)">
                      <use xlink:href="#icon_trash"></use>
                    </svg>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <empty-state v-show="!fields.length" title="列表为空"></empty-state>
          <div style="margin-top: 10px;">
            <a @click="openAddQuotaDialog()">
              <svg class="icon"><use xlink:href="#icon_plus-circled"></use></svg>
              <span>添加种类</span>
            </a>
          </div>
        </template>
      </dao-setting-item>
    </dao-setting-section>
    <add-quota-field-dialog
      :fields="availableFields"
      @create="addServiceQuota"
      :visible="dialogConfigs.addQuota.visible"
      @close="dialogConfigs.addQuota.visible = false"
    >
    </add-quota-field-dialog>
  </dao-setting-layout>
</template>

<script>
import AddQuotaFieldDialog from '@/view/pages/dialogs/quota/add-quota-field';
import { differenceBy } from 'lodash';

export default {
  name: 'QuotaPanel',
  components: {
    AddQuotaFieldDialog,
  },
  props: {
    quotaFields: { type: Array, default: () => [] },
    allField: { type: Array, default: () => [] },
  },
  data() {
    return {
      dialogConfigs: {
        addQuota: { visible: false },
      },
    };
  },
  computed: {
    fields() {
      return this.quotaFields.map(x => x.quota_field);
    },
    availableFields() {
      return differenceBy(this.allField, this.fields, 'id');
    },
  },
  methods: {
    openAddQuotaDialog() {
      this.dialogConfigs.addQuota.visible = true;
    },

    addServiceQuota(field) {
      const params = {
        plan_field_name: '',
        quota_field_id: field.id,
      };
      this.$emit('add-quota', params);
    },

    confirmDeleteQuota(field, index) {
      this.$tada
        .confirm({
          title: '删除配额种类',
          text: `您确定要删除配额种类 ${field.name} 吗？`,
        })
        .then(willDel => {
          if (willDel) {
            const quotaField = this.quotaFields[index];
            this.$emit('remove-quota', quotaField);
          }
        });
    },
  },
};
</script>
