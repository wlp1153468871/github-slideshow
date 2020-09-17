<template>
  <div class="itme-container" @click="linkToDetail">
    <div class="icon">
      <span class="icon-left">
        <img :src="`http://jizhidev.k8s01.ats${itemData.pictureUrl}`" class="icon-item" v-if="itemData.pictureId"/>
        <img src="@/assets/images/card-Default.png" class="icon-item"  v-else/>
      </span>
      <div class="icon-right">
        <div class="icon-item">
          {{ itemData.appType }}
        </div>
      </div>
    </div>
    <div class="father-style">
      <div class="item-name">
        {{ itemData.name }}
      </div>
      <dao-tooltip
        :content="`${itemData.description}`"
        placement="bottom"
        v-if="itemData.description.length > 90"
      >
        <div class="item-desc">
          {{ itemData.description }}
        </div>
      </dao-tooltip>
      <div class="item-desc" v-else>
        {{ itemData.description }}
      </div>
      <div class="item-footer">
        {{ itemData.provider }}
      </div>
      <dao-tooltip
        :content="`${itemData.provider} 认证`"
        placement="bottom"
        class="daocloud-lay"
        v-if="itemData.daoAuth"
      >
        <img src="@/assets/images/logo-auth.png" alt="daocloud" class="daocloud"/>
      </dao-tooltip>
    </div>
  </div>
</template>
<script>

export default {
  name: 'appitem',

  props: {
    itemData: Object,
  },

  methods: {
    linkToDetail() {
      this.$router.push({
        name: 'appstore.detail',
        params: {
          Id: this.itemData.id,
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
$appItemWidth: 31.2%;
.itme-container {
  position: relative;
  width: 260px;
  height: 200px;
  margin: 0 20px 20px 0;
  background:rgba(255,255,255,1);
  box-shadow: 0px 1px 2px 0px rgba(228,231,237,0.5);
  border-radius:  6px;
  border: 1px solid #CCD1D9;
  cursor: pointer;
  .icon {
    .icon-left {
      .icon-item {
        width: 40px;
        height: 40px;
        margin: 20px 0 0 15px;
        border-radius: 3px;
      }
    }
    .icon-right {
      float: right;
      margin: 20px 15px 0 0;
      width: 76px;
      height: 18px;
      background:#F1F7FE;
      border-radius:1px;
      border:1px solid #4C9BFF;
      vertical-align: top;
      .icon-item {
        font-size: 12px;
        font-family: PingFangSC-Regular,PingFang SC;
        font-weight: 400;
        color: #3890FF;
        height: 16px;
        line-height: 16px;
        text-align: center;
      }
    }
  }
  .item-name {
    margin: 0 0 10px 15px;
    height: 22px;
    line-height: 22px;
    font-size: 18px;
    font-family: PingFangSC-Semibold,PingFang SC;
    font-weight: 600;
    color: #3D444F;
  }
  .item-desc {
    margin: 0 15px 0 15px;
    color:#595F69;
    font-weight: 400;
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .item-footer {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 17px;
    line-height: 17px;
    margin: 0 0 15px 15px;
    font-size: 12px;
    font-family: PingFangSC-Regular,PingFang SC;
    font-weight: 400;
    color: #595F69;
  }
  .popper-style {
    color: #fff!important;
    background-color: #000000!important;
  }
}
.father-style {
  .el-popover {
    color: #fff;
    background-color: #000;
  }
  .popper__arrow::after {
    border-bottom-color: #000000;
  }
  .daocloud-lay {
    position: absolute;
    right: 0;
    bottom: 0;
    .daocloud {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 40px;
      height: 40px;
    }
  }

}
.itme-container:hover {
  background-color: #F5F7FA;
  box-shadow: 0px 1px 2px 0px rgba(204, 209, 217, 0.5);
}
</style>
