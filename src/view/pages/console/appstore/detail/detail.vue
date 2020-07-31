<template>
  <div id="appdetail">
    <div class="layout-content-header detail-header">
      <div class="header-text">服务 > 服务详情(Nginx)</div>
    </div>
    <div class="detail-title">
      <span>
        <svg class="icon icon-size">
          <use :xlink:href="`#color-icon_nginx`"></use>
        </svg>
      </span>
      <div class="title-name">
        Nginx
      </div>
      <div class="title-desc">
        类型:
        <div class="title-desc-name">
          Service Broker
        </div>
      </div>
      <span class="dao-btn-group select-btn">
        <dao-dropdown
          trigger="click"
          :append-to-body="true"
          placement="bottom-start"
        >
          <button class="dao-btn has-icons" style="width: 98px">
            <span class="text">创建实例</span>
            <svg class="icon"><use xlink:href="#icon_down-arrow"></use></svg>
          </button>
          <dao-dropdown-menu slot="list" style="min-width: 120px;">
            <dao-dropdown-item style="margin-left: 10px">
              <span @click="linktoForm">表单创建</span>
            </dao-dropdown-item>
            <dao-dropdown-item style="margin-left: 10px">
              <span>YAML创建</span>
            </dao-dropdown-item>
          </dao-dropdown-menu>
        </dao-dropdown>
      </span>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick" style="position:relative;">
      <el-tab-pane label="概览" name="first">
        <div class="lay-left">
          <div class="desc">
            <div class="desc-title">
              描述
            </div>
            <div class="desc-text">
              Nginx 是一个高性能的HTTP和反向代理服务器，也是一个 IMP/POP3/SMTP 服务器，因为它的稳定性、丰富的功能集、实例配置文件和低系统资源的消耗而闻名。
            </div>
          </div>
          <div class="title1">
            nginx-ingress
          </div>
          <div class="title1-desc">
            nginx-ingress is an Ingress controller that uses Configuration.
            To use, add the kubernetes.io/ingress.class:nginx annotation to your ingress resources.
          </div>
          <div class="title1">
            nginx-ingress
          </div>
          <div class="title2-desc">
            <div class="title2-text">
              $ helm install helm-repo>/nginx-ingress
            </div>
          </div>
          <div class="title1">
            nginx-ingress
          </div>
          <div class="title1-desc">
            nginx-ingress is an Ingress controller that uses Configuration.
            To use, add the kubernetes.io/ingress.class:nginx annotation to your ingress resources.
          </div>
        </div>
        <div class="lay-right">
          <div class="right-type">
            版本:
          </div>
          <dao-select
            v-model="select"
            size="sm"
            class="right-select"
          >
            <dao-option
              v-for="item in items"
              :key="item.value"
              :value="item.value"
              :label="item.text">
            </dao-option>
          </dao-select>
          <div class="right-name">名称</div>
          <div class="right-desc">nginx-ingress</div>
          <div class="right-name">Chart 版本</div>
          <div class="right-desc">0.25.0</div>
          <div class="right-name">分类</div>
          <div class="right-desc">网络</div>
          <div class="right-name">供应商</div>
          <div class="right-desc">社区</div>
          <div class="right-name">帮助链接</div>
          <div class="right-link">http://nginx.org/en/docs/</div>
          <div class="right-name">帮官网链接</div>
          <div class="right-link">http://nginx.org/</div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="实例" name="second">实例</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'AppStoreDetail',
  data() {
    return {
      activeName: 'first',
      select: 1,
      items: [
        {
          text: '1.9.1',
          value: 1,
        },
        {
          text: '1.10.2',
          value: 2,
        },
        {
          text: '2.1.1',
          value: 3,
        },
      ],
    };
  },
  methods: {
    handleClick() {
      console.log('暂无');
    },
    linktoForm() {
      this.$router.push({ name: 'appstore.form' });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-tabs__header {
  margin: 0;
  padding: 0;
  position: relative;
}
::v-deep .el_tabs .el-tab-pane{
  margin: 0 0 20px 20px;
}
  #appdetail {
    background: #fff;
    .detail-header {
      height: 32px;
      .header-text {
        line-height: 16px;
        font-size: 14px;
        font-weight: 400;
        color: #595F69;
      }
    }
    .detail-title {
      position: relative;
      height: 80px;
      border-bottom: 1px solid rgb(228,231,237);
      .icon-size {
        width: 40px;
        height: 40px;
        margin: 20px;
      }
      .title-name {
        position: absolute;
        left: 70px;
        top: 14px;
        font-size: 18px;
        margin-bottom: 20px;
        font-weight:500;
        color: #3D444F;
      }
      .title-desc {
        position: absolute;
        left: 70px;
        bottom: 20px;
        height: 12px;
        line-height: 12px;
        font-size: 14px;
        font-weight: 400;
        color: #9BA3AF;
        .title-desc-name {
          display: inline-block;
          font-size: 14px;
          font-weight: 400;
          color: #3D444F;
        }
      }
      .select-btn {
        height: 32px;
        width: 98px;
        float: right;
        margin: 24px 40px 0 0;
      }
    }
    .lay-left {
      position: relative;
      margin-top: 30px;
      width: 800px;
      /* height: 100vh; */
      /* border-right: 1px solid rgb(228,231,237); */
      .desc {
        width:760px;
        height:87px;
        background:rgba(251,252,253,1);
        border-radius:2px;
        border:1px solid rgba(230,233,239,1);
        .desc-title {
          margin: 10px 0 0 20px;
          width: 700px;
          height: 14px;
          line-height: 14px;
          font-size: 12px;
          color: #9BA3AF;
        }
        .desc-text {
          margin: 5px 0 0 20px;
          width: 720px;
          height: 48px;
          font-size: 14px;
          color: #3D444F;
          word-break: break-all;
          overflow: hidden;
        }
      }
      .title1 {
        margin: 30px 0 0 63px;
        height: 48px;
        line-height: 48px;
        font-size: 32px;
        font-weight:500;
        color:#3D444F;
      }
      .title1-desc {
        height: 48px;
        margin: 5px 0 0 63px;
        font-size: 14px;
        font-weight: 400;
        color: #3D444F;
      }
      .title2-desc {
        height: 44px;
        line-height: 44px;
        width: 660px;
        margin: 5px 0 0 60px;
        background:rgba(251,252,253,1);
        border:1px solid rgba(230,233,239,1);
        .title2-text {
          margin: 10px 0 0 20px;
          height: 24px;
          line-height: 24px;
          color:rgba(61,68,79,1);
          font-family: Consolas;
          font-size: 14px;
        }
      }
    }
    .lay-right {
      position: absolute;
      top: 0;
      right: 0;
      width: 280px;
      height: 100%;
      border-left: 1px solid rgb(228,231,237);
      overflow: hidden;
      .right-type {
        margin: 30px 0 0 20px;
        height: 14px;
        line-height: 14px;
        font-family: PingFangSC-Medium,PingFang SC;
        font-size: 14px;
        font-weight: 500;
        color:#3D444F;
      }
      .right-select {
        height: 32px;
        width: 240px;
        margin: 10px 0 0 20px;
      }
      .right-name {
        height: 14px;
        line-height: 14px;
        margin: 20px 0 0 20px;
        font-family: PingFangSC-Medium,PingFang SC;
        font-size: 14px;
        font-weight: 500;
        color:#3D444F;
      }
      .right-desc {
        height: 14px;
        line-height: 14px;
        margin: 10px 0 0 20px;
        font-family: PingFangSC-Regular,PingFang SC;
        font-size: 14px;
        font-weight: 400;
        color: #595F69;
      }
      .right-link {
        height: 14px;
        line-height: 14px;
        margin: 10px 0 0 20px;
        font-family: SFProText-Regular,SFProText;
        color: #217EF2;
        font-weight: 400;
      }
    }
  }
</style>
