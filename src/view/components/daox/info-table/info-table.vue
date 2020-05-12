<template>
  <div class="ins-setting-card ins-setting-card-box">
    <div class="ins-card-title">
      <span>{{ title }}</span>
      <slot name="operation"></slot>
    </div>
    <table v-show="list.length">
      <tbody class="ins-card-body">
        <tr class="ins-info-item" v-for="item in list" :key="item.name">
          <td class="info-item-label">
            {{ item.name }}
          </td>
          <td class="info-item-content" v-if="!isArray(item.value)">
            {{ item.value }}
          </td>
          <td class="info-item-content" v-else>
            <slot name="self" v-bind:item="item.value"></slot>
          </td>
        </tr>
      </tbody>
    </table>
    <slot name="content"></slot>
  </div>
</template>

<script>
import { isArray } from 'lodash';

export default {
  name: 'InfoTable',
  props: {
    title: { type: String, default: '' },
    list: { type: Array, default: () => [] },
  },
  methods: {
    isArray,
  },
};
</script>

<style lang="scss">
.ins-setting-card {
  width: 100%;
  padding: 0 15px;
  margin-top: 0;
  margin-bottom: 16px;
  color: #3d444f;
  font-size: 14px;
  font-weight: 400;
  line-height: 1;

  &.ins-setting-card-box {
    background-color: #fff;
    box-shadow: 0 1px 4px rgba(204, 209, 217, 0.3);
    border: 1px solid #e4e7ed;
    border-radius: 4px;
  }

  .ins-card-title {
    display: flex;
    justify-content: space-between;
    height: 35px;
    font-size: 14px;
    line-height: 35px;
    border-bottom: 1px solid #e6e8ed;
  }

  .ins-card-body {
    padding: 6px 0;
  }

  .ins-info-item {
    display: flex;
    flex-direction: row;
    padding: 3px 5px;
    color: #3b424d;
    line-height: 24px;

    .info-item-label {
      width: 88px;
      min-width: 88px;
      margin-right: 20px;
      color: #99a1ad;
    }

    .info-item-content {
      display: inline-block;
      word-wrap: break-word;
      word-break: break-all;
    }
  }
}
</style>
