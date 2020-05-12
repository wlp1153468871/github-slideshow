<template>
  <dao-dialog
    :config="config"
    :visible.sync="isShow"
    @opened="onOpened"
    @dao-dialog-close="onClose"
    @dao-dialog-cancel="onClose"
  >
    <div v-loading="loading">
      <dao-setting-section>
        <dao-setting-item>
          <div slot="label">CPU</div>
          <div slot="content-helper">
            {{ helperTextPrefix }}:{{ cpu.subHard + 'Core' }}
            <br />
            当前配额: {{ cpu.hard + 'Core' }}
          </div>
          <div slot="content">
            <dao-input
              placeholder="请输入新配额"
              name="cpu"
              icon-inside
              v-validate="`required|decimal:3|min_value:${cpu.subHard}|max_value:100000000`"
              :message="veeErrors.first('cpu')"
              :status="veeErrors.has('cpu') ? 'error' : ''"
              v-model="cpu.new"
              data-vv-as="CPU"
            >
              <span slot="append">Core</span>
            </dao-input>
          </div>
        </dao-setting-item>
      </dao-setting-section>
      <dao-setting-section>
        <dao-setting-item>
          <div slot="label">内存</div>
          <div slot="content-helper">
            {{ helperTextPrefix }}：{{ memory.subHard }}G
            <br />
            当前配额： {{ memory.hard }}G
          </div>
          <div slot="content">
            <dao-input
              placeholder="请输入新配额"
              name="memory"
              icon-inside
              v-validate="`required|decimal:3|min_value:${memory.subHard}|max_value:100000000`"
              :message="veeErrors.first('memory')"
              :status="veeErrors.has('memory') ? 'error' : ''"
              v-model="memory.new"
              data-vv-as="内存"
            >
              <span slot="append">G</span>
            </dao-input>
          </div>
        </dao-setting-item>
      </dao-setting-section>
      <dao-setting-section>
        <dao-setting-item>
          <div slot="label">存储</div>
          <div slot="content-helper">
            {{ helperTextPrefix }}:{{ storage.subHard }}G
            <br />
            当前配额: {{ storage.hard }}G
          </div>
          <div slot="content">
            <dao-input
              placeholder="请输入新配额"
              name="storage"
              icon-inside
              v-validate="`required|decimal:3|min_value:${storage.subHard}|max_value:100000000`"
              :message="veeErrors.first('storage')"
              :status="veeErrors.has('storage') ? 'error' : ''"
              v-model="storage.new"
              data-vv-as="存储"
            >
              <span slot="append">G</span>
            </dao-input>
          </div>
        </dao-setting-item>
      </dao-setting-section>

      <dao-setting-section v-if="isApply">
        <dao-setting-item>
          <div slot="label">备注（可选）</div>
          <div slot="content">
            <textarea
              class="dao-control"
              type="text"
              name="remark"
              data-vv-as="备注"
              v-validate="`max:255`"
              rows="3"
              cols="50"
              :placeholder="remarkPlaceholder"
              v-model="remark"
            >
            </textarea>
            <div class="dao-input-message error">
              <span>{{ veeErrors.first('remark') }}</span>
            </div>
          </div>
        </dao-setting-item>
      </dao-setting-section>
    </div>

    <div slot="footer">
      <button class="dao-btn ghost" @click="onClose">
        取消
      </button>
      <button class="dao-btn blue" @click="onSubmit">
        {{ isApply ? '提交审批' : '更新' }}
      </button>
    </div>
  </dao-dialog>
</template>

<script>
import dialog from '@/view/mixins/dialog';
import { byte2gib } from '@/core/utils/gib2byte';

export default {
  name: 'ApplyUpdateQuotaDialog',
  extends: dialog(),

  props: {
    quota: { type: Object, default: () => ({}) },
    title: { type: String, default: '' },
    helperTextPrefix: { type: String, default: '' },
    remarkPlaceholder: { type: String, default: '' },
    isApply: { type: Boolean, default: false }, // 是否是申请，不然是更新
    loading: { type: Boolean, default: false },
  },

  watch: {
    title: {
      immediate: true,
      handler(title) {
        this.setDialogTitle(title);
      },
    },
    visible: {
      immediate: true,
      handler(newVal) {
        // 每次打开后重置数据
        if (newVal) {
          this.reset(this.quota);
        }
      },
    },
  },

  methods: {
    onClose() {
      if (this.$validator) this.$validator.pause();
      if (this.dialogWillClose) {
        this.dialogWillClose();
      }
      this.$emit('close');
    },
    onOpened() {
      if (this.$validator) this.$validator.resume();
      this.$emit('opened');
    },
    reset(quota) {
      this.cpu = {
        subHard: byte2gib(quota.subHard.cpu || 0, 'CPU'),
        hard: byte2gib(quota.hard.cpu || 0, 'CPU'),
        new: byte2gib(quota.hard.cpu || 0, 'CPU'),
      };
      this.memory = {
        subHard: byte2gib(quota.subHard.memory || 0),
        hard: byte2gib(quota.hard.memory || 0),
        new: byte2gib(quota.hard.memory || 0),
      };
      this.storage = {
        subHard: byte2gib(quota.subHard.storage || 0),
        hard: byte2gib(quota.hard.storage || 0),
        new: byte2gib(quota.hard.storage || 0),
      };
      this.remark = '';
    },
    onSubmit() {
      this.$validator.validateAll().then(valid => {
        if (valid) {
          const res = {
            cpu: this.cpu.new,
            memory: this.memory.new,
            storage: this.storage.new,
            remark: this.remark,
          };
          if (!this.isApply) {
            delete res.remark;
          }
          this.$emit('submit', res);
        }
      });
    },
  },

  data() {
    return {
      cpu: {
        subHard: 0,
        hard: 0,
        new: 0,
      },
      memory: {
        subHard: 0,
        hard: 0,
        new: 0,
      },
      storage: {
        subHard: 0,
        hard: 0,
        new: 0,
      },
      remark: '',
    };
  },
};
</script>

<style lang="scss" scope>
textarea {
  width: 100%;
  height: 250px !important;
  resize: none;
}
</style>
