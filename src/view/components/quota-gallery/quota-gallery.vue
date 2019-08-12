<template>
  <div class="quota-summary">
    <div class="dao-view-main">
      <div class="dao-view-content">
        <div class="quota-summary-head">
          <p>使用情况</p>
          <div v-if="chunkQuotas.length > 1">
            <button
              class="dao-btn mini caret"
              :disabled="idx === 0"
              @click="prev()">
              <svg class="icon">
                <use xlink:href="#icon_caret-left"></use>
              </svg>
            </button>
            <button
              class="dao-btn mini caret"
              :disabled="idx === chunkQuotas.length-1"
              @click="next()">
              <svg class="icon">
                <use xlink:href="#icon_caret-right"></use>
              </svg>
            </button>
          </div>
        </div>
        <ul class="quota-summary-body">
          <quota-card
            v-for="(item, index) in chunkQuotas[idx]"
            :key="index"
            :item="item">
          </quota-card>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { chunk, orderBy } from 'lodash';
import QuotaCard from './quota-card';

export default {
  name: 'QuotaGallery',
  components: {
    QuotaCard,
  },
  props: {
    quotas: { type: Array, default: () => [] },
  },
  data() {
    return {
      idx: 0,
    };
  },
  computed: {
    chunkQuotas() {
      const quotas = orderBy(this.quotas, 'used', 'desc');
      return chunk(quotas, 5);
    },
  },
  methods: {
    prev() {
      const { idx } = this;
      if (idx > 0) {
        this.idx = idx - 1;
      }
    },
    next() {
      const { idx } = this;
      if (idx < this.chunkQuotas.length) {
        this.idx = idx + 1;
      }
    },
  },
};
</script>

<style lang="scss">
// quota-summary
.quota-summary {
  padding: 15px 0;
  background-color: #f5f7fa;
  box-shadow: 0 1px 0 0 #e4e7ed;

  .dao-view-main {
    margin-top: 0;
  }

  .quota-summary-head {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 10px;

    & > p {
      line-height: 14px;
    }

    .caret {
      width: 18px;
      height: 18px;
      padding: 0;
      margin: 0;
      &:hover {
        background-color: #e6e9ef;
        border-radius: 3px;
      }
    }
  }
  .quota-summary-body {
    display: flex;
    list-style: none;
    .quota-card {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 100% * 1/5;
      min-width: 202px;
      height: 84px;
      padding: 10px;
      margin-right: 8px;
      background-color: #fff;
      border: solid 1px #e6e9ef;
      border-radius: 3px;

      &:last-child {
        margin-right: 0;
      }
    }
    .quota-card-title {
      display: flex;
      justify-content: space-between;
      color: #9ba3af;
      font-size: 12px;
      line-height: 1.17;
    }
    .quota-card-content {
      big {
        color: #3d444f;
        font-size: 20px;
        font-weight: 600;
        line-height: 1.5;
      }
      small {
        color: #9ba3af;
        font-size: 12px;
        line-height: 1.17;
      }
    }
  }
}
</style>
