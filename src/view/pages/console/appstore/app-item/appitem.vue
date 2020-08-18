<template>
  <div class="itme-container max-screen">
    <div class="icon">
      <span class="icon-left">
        <!-- <svg class="icon  ">
          <use :xlink:href="`#color-icon_nginx`"></use>
        </svg> -->
        <!-- backUrl(itemData.pictureUrl) -->
        <img :src="`http://jizhidev.k8s01.ats${itemData.pictureUrl}`" class="icon-item" v-if="`${itemData.pictureUrl}`"/>
        <img src="../../../../../assets/images/card-Default.png" class="icon-item"  v-else/>
      </span>
      <div class="icon-right">
        <div class="icon-item">
          {{ itemData.appType }}
        </div>
      </div>
    </div>
    <div  @click="linkToDetail">
      <div class="item-name">
        {{ itemData.name }}
      </div>
      <div class="item-desc">
        {{ itemData.description }}
      </div>
      <div class="item-footer">
        {{ itemData.provider }}
      </div>
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
      this.$router.push(`appstore/detail/${this.itemData.id}`);
    },
    backUrl(url) {
      if (process.env.NODE_ENV === 'development') {
        return `${process.env.VUE_APP_API_URL}${url}`;
      }
      return url;
    },
  },
  created() {
    // this.downloadImg();
  },
};
</script>
<style lang="scss" scoped>
$appItemWidth: 31.2%;
@media screen and ( min-width: 1281px){
   .max-screen {
     position: relative;
      //解决不了宽高自适应的问题
      /* width:  $appItemWidth; */
      /* height: 192 * $appItemWidth / 260;  */
      width: $appItemWidth;
      height: 192px;
      margin: 0 20px 20px 0;
      background:rgba(255,255,255,1);
      box-shadow: 0px 1px 2px 0px rgba(228,231,237,0.5);
      border-radius:  6px;
      border: 1px solid rgba(228,231,237,1);
      .icon {
        .icon-left {
          .icon-item {
            width: 32px;
            height: 32px;
            margin: 11px 0 0 12px;
          }
        }
        .icon-right {
          float: right;
          margin-top: 15px;
          height: 30px;
        }
      }
      .item-name {
        margin: 13px 12px 10px 12px;
        height: 14px;
        line-height: 14px;
        font-size: 14px;
      }
      .item-edition {
        /* margin: 0 12px 12 12px; */
        margin-left: 12px;
        margin-right: 12px;
        margin-bottom: 12px;
        height:12px;
        line-height: 12px;
        font-size: 12px;
        font-weight:400;
        color:#3D444F;
      }
      .item-desc {
        margin: 0 12px 0 12px;
        color:#3D444F;
        font-weight: 400;
        font-size: 12px;
        word-break: break-all;
        overflow: hidden;
      }
      .item-footer {
        position: absolute;
        left: 0;
        bottom: 0;
        height: 14px;
        line-height: 14px;
        margin: 0 0 12px 12px;
        font-size: 12px;
        color: #3D444F;
      }
   }
}
.itme-container {
  position: relative;
  //解决不了宽高自适应的问题
  /* width:  $appItemWidth; */
  /* height: 192 * $appItemWidth / 260;  */
  width: 260px;
  height: 200px;
  margin: 0 20px 20px 0;
  background:rgba(255,255,255,1);
  box-shadow: 0px 1px 2px 0px rgba(228,231,237,0.5);
  border-radius:  6px;
  border: 1px solid rgba(228,231,237,1);
  .icon {
    .icon-left {
      .icon-item {
        width: 40px;
        height: 40px;
        margin: 20px 0 0 15px;
      }
    }
    .icon-right {
      float: right;
      margin: 20px 15px 0 0;
      width: 94px;
      height: 18px;
      background:#F1F7FE;
      border-radius:1px;
      border:1px solid #4C9BFF;
      .icon-item {
        font-size: 12px;
        font-family: PingFangSC-Regular,PingFang SC;
        font-weight: 400;
        color: #3890FF;
        height: 18px;
        line-height: 18px;
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
    margin: 0 12px 0 12px;
    color:#595F69;
    font-weight: 400;
    font-size: 12px;
    word-break: break-all;
    overflow: hidden;
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
}
</style>
