<template>
  <div class="itme-container max-screen">
    <div class="icon">
      <span class="icon-left">
        <svg class="icon icon-item">
          <use :xlink:href="`#color-icon_nginx`"></use>
        </svg>
      </span>
      <span class="icon-right">
        <dao-dropdown
          trigger="click"
          :append-to-body="true"
          placement="left-start"
        >
          <svg class="icon icon-item">
            <use :xlink:href="`#icon_more`"></use>
          </svg>
          <dao-dropdown-menu slot="list" style="min-width: 120px;">
            <dao-dropdown-item style="margin-left: 10px">
              <span>表单创建</span>
            </dao-dropdown-item>
            <dao-dropdown-item style="margin-left: 10px">
              <span>YAML创建</span>
            </dao-dropdown-item>
          </dao-dropdown-menu>
        </dao-dropdown>
      </span>
    </div>
    <div  @click="linkToDetail">
      <div class="item-name">
        Nginx
      </div>
      <div class="item-edition">
        版本数：1
      </div>
      <div class="item-desc">
        Nginx是一个高性能的HTTP和反向代理服务器，也是一个IMAP/POP3/SMTP服务器
      </div>
      <div class="item-footer">
        DaoCloud | Service Broker
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'appitem',
  methods: {
    linkToDetail() {
      this.$router.push('appstore/new');
    },
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
          .icon-item {
            position: absolute;
            top: 0;
            right: 0;
            color: rgba(155,163,175,1);
            float: right;
            margin: 12px 12px 0 0;
          }
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
      .icon-item {
        position: absolute;
        z-index: 3;
        top: 0;
        right: 0;
        color: rgba(155,163,175,1);
        float: right;
        margin: 12px 12px 0 0;
      }
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
</style>
