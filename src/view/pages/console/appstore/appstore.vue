<template>
  <div id="appstore">
    <div class="layout-content-header appstore-header">
      应用商店
    </div>
    <div class="dao-view-main" style="margin-bottom: 20px;">
      <div class="dao-view-content">
          <dao-select
            v-model="select"
            style="height: 32px;"
            size="sm">
            <dao-option
              v-for="item in items"
              :key="item.value"
              :value="item.value"
              :label="item.text">
            </dao-option>
          </dao-select>
      </div>
      <el-input
        style="width: 218px;"
        size="small"
        placeholder="搜索"
        clearable
      ></el-input>
      <el-button size="mini" style="margin-left: 10px">
        <span>
          <svg class="icon">
            <use :xlink:href="`#icon_cw`"></use>
          </svg>
        </span>
      </el-button>
    </div>
    <div class="store-server-type">
      <span class="type-text">
        服务类型
      </span>
      <div class="dao-checkbox-group type-layout">
          <div class="dao-checkbox">
            <label>
              <input type="checkbox" checked/>Service Broker
            </label>
          </div>
          <div class="dao-checkbox">
            <label>
              <input type="checkbox"/>Helm Chart
            </label>
          </div>
          <div class="dao-checkbox">
            <label>
              <input type="checkbox"/>Operator
            </label>
          </div>
      </div>
      <span class="type-text">
        供应商
      </span>
      <div class="dao-checkbox-group" style="margin-left: 30px">
          <div class="dao-checkbox">
            <label>
              <input type="checkbox" checked/>DaoCloud
            </label>
          </div>
          <div class="dao-checkbox">
            <label>
              <input type="checkbox"/>社区
            </label>
          </div>
          <div class="dao-checkbox">
            <label>
              <input type="checkbox"/>RedHat
            </label>
          </div>
      </div>
    </div>
    <div class="store-item-container">
      <div class="store-item" >
        <AppItem></AppItem>
        <AppItem></AppItem>
        <AppItem></AppItem>
        <AppItem></AppItem>
        <AppItem></AppItem>
      </div>
    </div>
  </div>
</template>

<script>
import AppItem from './app-item/appitem.vue';

export default {
  name: 'appstore',
  components: {
    AppItem,
  },
  data() {
    return {
      select: 1,
      items: [
        {
          text: '全部',
          value: 1,
        },
        {
          text: '数据库',
          value: 2,
        },
        {
          text: '大数据',
          value: 3,
        },
        {
          text: '网络',
          value: 3,
        },
        {
          text: '监控',
          value: 4,
        },
        {
          text: '其他',
          value: 5,
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
#appstore {
  .appstore-header {
    background:rgba(230,233,239,1);
    box-shadow:0px -1px 0px 0px rgba(213,219,227,1);
  }
  .store-server-type {
    /* display: inline-block; */
    float: left;
    overflow: hidden;
    width: 240px;
    .type-text {
      width:180px;
      height:12px;
      margin-left: 30px;
      font-size:12px;
      font-weight:400;
      color:rgba(155,163,175,1);
      line-height:12px;
    }
    .type-layout {
      margin: 0 0 20px 30px;
    }
  }
  .store-item-container {
    position: absolute;
    display: inline-block;
    .store-item {
      display: flex;
      flex-flow: row wrap;
      width: 100%;
      /* height: 646px; */
    }
  }

}
</style>
