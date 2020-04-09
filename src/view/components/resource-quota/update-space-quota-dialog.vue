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
            {{ spaceDescription }}下可用区配额总和:{{ cpu.subHard }} Core
            <br />
            当前配额: {{ cpu.hard }} Core
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
            {{ spaceDescription }}下可用区配额总和：{{ memory.subHard }}G
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
            {{ spaceDescription }}下可用区配额总和:{{ storage.subHard }}G
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
      <dao-setting-section>
        <p style="color: red;" v-if="this.warning.length > 0">
          检测到该{{ spaceDescription }}下的【{{ this.warning.join('、') }}】可用区配额总和大于{{
            spaceDescription
          }}的当前配额， 可能是底层错误修改了配额，请更新可用区或{{
            spaceDescription
          }}配额以保证可用区配额的总和小于{{ spaceDescription }}配额。
        </p>
      </dao-setting-section>
    </div>

    <div slot="footer">
      <button class="dao-btn ghost" @click="onClose">
        取消
      </button>
      <button class="dao-btn blue" @click="onSubmit">
        更新
      </button>
    </div>
  </dao-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
import dialog from '@/view/mixins/dialog';
import spaceService from '@/core/services/space.service';
import { byte2gib } from '@/core/utils/gib2byte';

export default {
  name: 'UpdateSpaceQuotaDialog',
  extends: dialog(),

  props: {
    space: { type: Object, default: () => ({}) },
  },

  watch: {
    space: {
      immediate: true,
      handler(space) {
        this.getSpaceHard(space);
      },
    },
  },

  computed: {
    ...mapGetters(['spaceDescription', 'orgDescription']),
    warning() {
      const compareHardSubhard = obj => obj && parseInt(obj.subHard, 10) > parseInt(obj.hard, 10);
      const w = [];
      if (compareHardSubhard(this.cpu)) {
        w.push('CPU');
      }
      if (compareHardSubhard(this.memory)) {
        w.push('内存');
      }
      if (compareHardSubhard(this.storage)) {
        w.push('存储');
      }
      return w;
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
    getSpaceHard(space) {
      if (!space || !space.space_name) return;

      this.loading = true;
      spaceService
        .getResourceQuota(space.space_id)
        .then(res => {
          this.setDialogTitle(space.space_name);
          this.cpu = {
            subHard: byte2gib(res.zone_hards.cpu, 'CPU'),
            hard: byte2gib(res.hard.cpu, 'CPU'),
            new: byte2gib(res.hard.cpu, 'CPU'),
          };
          this.memory = {
            subHard: byte2gib(res.zone_hards.memory),
            hard: byte2gib(res.hard.memory),
            new: byte2gib(res.hard.memory),
          };
          this.storage = {
            subHard: byte2gib(res.zone_hards.storage),
            hard: byte2gib(res.hard.storage),
            new: byte2gib(res.hard.storage),
          };
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onSubmit() {
      this.$validator.validateAll().then(valid => {
        if (valid) {
          this.loading = true;
          const quota = {
            cpu: this.cpu.new,
            memory: this.memory.new,
            storage: this.storage.new,
          };
          spaceService
            .updateResourceQuota(this.space.space_id, quota)
            .then(() => {
              this.$noty.success('更新成功');
              this.$emit('refresh');
              this.$emit('close');
            })
            .catch(err => {
              if (err.status === 400) {
                this.$noty.error(`${this.orgDescription}配额不足`);
              } else {
                this.$noty.error('更新失败');
              }
            })
            .finally(() => {
              this.loading = false;
            });
        }
      });
    },
    dialogWillClose() {
      this.cpu = {
        subHard: 0,
        hard: 0,
        new: 0,
      };
      this.memory = {
        subHard: 0,
        hard: 0,
        new: 0,
      };
      this.storage = {
        subHard: 0,
        hard: 0,
        new: 0,
      };
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
      loading: false,
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
