<template>
  <dao-dialog
    class="edit-replica-dialog"
    :config="config"
    :visible.sync="isShow"
    @before-open="onBeforeOpen"
    @dao-dialog-close="onClose"
    @dao-dialog-cancel="onClose"
    @dao-dialog-confirm="onConfirm"
  >
    <div class="left">
      <dao-setting-section>
        <dao-setting-item>
          <div slot="label">
            实例数
          </div>
          <div slot="content">
            <dao-numeric-input
              icon-inside
              type="int"
              :min="1"
              placeholder="输入期望的实例个数（大于等于1）"
              unit="个"
              required
              v-model="editReplica"
            >
            </dao-numeric-input>
          </div>
        </dao-setting-item>
      </dao-setting-section>
    </div>
    <div class="left replica-price" v-if="chargingEnable">
      <div class="replica-price-top">
        <p>
          <span class="replica-price-label">原价格: </span>
          <span class="replica-price-content">{{ prePrice | fen_2_yuan }}元</span>
        </p>
        <p>
          <span class="replica-price-label">当前价格: </span>
          <span class="replica-price-content">{{ newPrice | fen_2_yuan }}元</span>
        </p>
      </div>
      <div class="replica-price-bottom">
        <p>
          <span class="replica-price-label">应补差价: </span>
          <span class="replica-price-content">{{ (newPrice - prePrice) | fen_2_yuan }}元</span>
        </p>
      </div>
    </div>
    <div slot="footer">
      <button class="dao-btn ghost" @click="onClose">
        取消
      </button>
      <save-button
        class="blue"
        text="确定"
        :disabled="!isValidForm"
        :saving="loadings.updating"
        @click="onConfirm"
      >
      </save-button>
    </div>
  </dao-dialog>
</template>

<script>
import { mapState } from 'vuex';
import dialog from '@/view/mixins/dialog';
import AppService from '@/core/services/app.service';
import ChargingService from '@/core/services/charging.service';

export default {
  name: 'EditReplicaDialog',
  extends: dialog('实例扩展', {
    size: 'lg',
  }),
  props: {
    app: { type: Object, default: () => ({}) },
    instance: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      editReplica: 1,
      prePrice: 0,
      newPrice: 0,
      chargingRuleDetailId: [],
      loadings: {
        updating: false,
      },
    };
  },
  computed: {
    ...mapState(['chargingEnable']),
    isValidForm() {
      return !this.loadings.updating || !this.veeErrors.any();
    },
  },
  watch: {
    app({ clustersize }) {
      if (!clustersize) return;
      this.editReplica = clustersize;
      if (this.chargingEnable) this.getOriginalPrice();
    },
    editReplica(editReplica) {
      if (!editReplica || !this.chargingEnable) return;
      this.searchReplicaPrice(editReplica).then(r => {
        this.newPrice = r.price;
      });
    },
  },
  methods: {
    searchReplicaPrice(clusterSize) {
      const instanceId = this.instance.id;
      return ChargingService.getChargingId(instanceId).then(res => {
        const chargingRuleDetailId = res.charging_rule_detail_ids;
        const param = {
          charging_rule_detail_ids: chargingRuleDetailId,
          quantity: clusterSize,
        };
        this.chargingRuleDetailId = chargingRuleDetailId;
        return ChargingService.getReplicaPrice(param);
      });
    },

    getOriginalPrice() {
      if (!this.app.clustersize) return;
      this.searchReplicaPrice(this.app.clustersize).then(r => {
        this.prePrice = r.price;
        this.newPrice = r.price;
      });
    },

    onConfirm() {
      const params = [{ id: 'clustersize', value: parseInt(this.editReplica, 10) }];
      const updated = { params };
      if (this.chargingEnable) {
        updated.charging_rule_detail_ids = this.chargingRuleDetailId;
      }

      this.loadings.updating = true;
      AppService.updateApp(this.instance.id, updated)
        .then(() => {
          this.$noty.success('实例扩展成功');
          this.$emit('on-updated');
          this.onClose();
        })
        .finally(() => {
          this.loadings.updating = false;
        });
    },

    onBeforeOpen() {
      if (this.chargingEnable) {
        this.getOriginalPrice();
      }
    },

    dialogWillClose() {
      this.editReplica = this.app.clustersize;
    },
  },
};
</script>

<style lang="scss">
.edit-replica-dialog {
  .dao-dialog-body {
    display: flex;
    .left {
      flex: 1 1 auto;
    }
    .replica-price {
      position: relative;
      flex: none;
      width: 240px;
      min-height: 280px;
      background-color: #fbfcfd;
      border-left: 1px solid #e4e7ed;

      .replica-price-top {
        padding: 20px;
      }
      .replica-price-bottom {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px 20px;
      }
      p {
        margin-bottom: 10px;
        border-bottom: 1px solid #e4e7ed;
      }
      .replica-price-content {
        position: absolute;
        right: 20px;
      }
    }
  }
}
</style>
