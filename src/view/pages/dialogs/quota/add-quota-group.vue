<template>
  <dao-dialog
    :config="config"
    :visible.sync="isShow"
    @dao-dialog-close="onClose"
    @dao-dialog-cancel="onClose"
    @dao-dialog-confirm="onConfirm"
  >
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">配额组</div>
        <div slot="content">
          <dao-select
            v-model="quotaGroupId"
            placeholder="选择配额组"
            no-data-text="暂无配额组可以添加"
            :with-search="true"
            search-placeholder="搜索配额组名字"
          >
            <dao-option-group>
              <dao-option
                v-for="item in availableQutoaGroups"
                :value="item.id"
                :label="item.name"
                :key="item.key"
              >
              </dao-option>
            </dao-option-group>
          </dao-select>
        </div>
      </dao-setting-item>
    </dao-setting-section>
    <div slot="footer">
      <button class="dao-btn ghost" @click="onClose">
        取消
      </button>
      <button class="dao-btn blue" @click="onConfirm" :disabled="!isValidForm">
        确定
      </button>
    </div>
  </dao-dialog>
</template>

<script>
import { first, differenceBy, orderBy } from 'lodash';
import dialog from '@/view/mixins/dialog';

export default {
  name: 'AddQuotaGroupDialog',

  extends: dialog('添加配额组'),

  props: {
    allQuotaGroups: { type: Array, default: () => [] },
    orgQuotaGroups: { type: Array, default: () => [] },
  },

  data() {
    return {
      quotaGroupId: '',
    };
  },

  computed: {
    availableQutoaGroups() {
      const availables = differenceBy(this.allQuotaGroups, this.orgQuotaGroups, 'id');
      return orderBy(availables, 'name');
    },
    isValidForm() {
      return this.quotaGroupId !== '';
    },
  },

  watch: {
    availableQutoaGroups(quotaGroups) {
      const qutoaGroup = first(quotaGroups);
      if (qutoaGroup) {
        this.quotaGroupId = qutoaGroup.id;
      }
    },
  },

  methods: {
    onConfirm() {
      const quotaGroup = this.availableQutoaGroups.find(x => x.id === this.quotaGroupId);
      this.$emit('add', quotaGroup);
      this.onClose();
    },

    dialogWillClose() {
      this.quotaGroupId = this.availableQutoaGroups.length
        ? first(this.availableQutoaGroups).id
        : '';
    },
  },
};
</script>
