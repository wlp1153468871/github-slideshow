<template>
  <div id="chart" style="background: #F1F3F6;">
    <div class="layout-content-header detail-header">
      <div class="header-text">可行区管理 > 上海ocp (可用区名) > chart管理</div>
    </div>
    <div class="detail-title">
      <span>
        <svg class="icon icon-size">
          <use :xlink:href="`#color-icon_microsoft`"></use>
        </svg>
      </span>
      <div class="title-name">nginx-example-1</div>
      <div class="title-desc">
        应用版本:
        <div class="title-desc-name">0.10</div>
        <div class="title1">Chart 版本:</div>
        <div class="title-desc-name">2.6.0</div>
        <div class="title1">创建时间:</div>
        <div class="title-desc-name">2020-05-26 10:23:34</div>
      </div>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="详情" name="first">
        <div class="dao-setting-layout">
          <div class="dao-setting-section">
            <div class="dao-setting-title">信息与安全</div>
            <div class="dao-setting-item">
              <div class="dao-setting-label">基本信息</div>
              <div class="dao-setting-content">
                <div class="info-title-layout">
                  <div class="info-title">主页</div>
                  <div class="info-desc">http://baidu.com</div>
                </div>
                <div class="info-title-layout">
                  <div class="info-title">维护者</div>
                  <div class="info-desc">amsndamsnd</div>
                </div>
              </div>
            </div>
          </div>
          <div class="dao-setting-section">
            <div class="dao-setting-item">
              <div class="dao-setting-label">基本信息</div>
              <div class="dao-setting-content">
                <div class="info-title-layout">
                  <div class="info-title">Prov File</div>
                  <div class="info-desc">Not Ready / Ready</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="dao-setting-layout">
          <div class="dao-setting-section">
            <div class="dao-setting-title">信息与安全</div>
            <div class="dao-setting-item">
              <div class="dao-setting-label">基本信息</div>
              <div class="dao-setting-content">
                <div class="info-title-layout">
                  <div class="info-title">主页</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="取值Yaml" name="second">
        <dao-setting-layout class="yaml">
          <div class="dao-setting-section">
            <div class="dao-setting-title">YAML</div>
          </div>
          <code-mirror class="code-mirror"></code-mirror>
        </dao-setting-layout>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import CodeMirror from '@/view/components/config/code-mirror.vue';

export default {
  name: 'Chart',
  components: {
    CodeMirror,
  },
  data() {
    return {
      activeName: 'first',
    };
  },
};
</script>

<style lang="scss" scoped>
#chart {
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
    background: #fff;
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
        margin-left: 10px;
        display: inline-block;
        font-weight: 400;
        color: #3D444F;
      }
      .title1 {
        margin-left: 10px;
        display: inline-block;
        font-weight: 400;
        color: #9BA3AF;
      }
    }
  }
  .info-title-layout{
    display: inline-block;
    overflow: hidden;
    margin-left: 20px;
    width: 380px;
    .info-title {
      font-size: 14px;
      font-family: PingFangSC-Medium,PingFang SC;
      font-weight: 500;
      color: #3D444F;
      height: 14px;
      line-height: 14px;
      margin-bottom: 10px;
    }
    .info-desc {
      font-size: 14px;
      font-family: PingFangSC-Regular,PingFang SC;
      font-weight: 400;
      color: #595F69;
      height: 14px;
      line-height: 14px;
    }
  }
  .yaml {
    font-size:14px;
    font-family: SFProText-Semibold,SFProText;
    font-weight: 600;
    color: #3D444F;
    overflow: hidden;
    .code-mirror {
      margin: 0 20px 20px 0;
    }
  }
}
</style>
