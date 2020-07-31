<template>
  <div class="app-form">
    <div class="layout-content-header form-header">
      <span @click="$router.go(-1)">
        <svg class="icon" style="color: #217EF2;">
          <use :xlink:href="`#icon_close`"></use>
        </svg>
      </span>
      <span class="form-title">
        创建服务实例 Nginx1.17
      </span>
    </div>
    <dao-setting-layout class="basic-info">
      <div class="dao-setting-section">
        <div class="dao-setting-title">基本信息</div>
      </div>
      <div class="dao-setting-item" style="height: 75px;">
        <div class="dao-setting-label dao-name">租户和项目组</div>
        <div class="dao-setting-content">
          <div>
            <div class="dao-title">租户</div>
            <div class="dao-title">项目组</div>
          </div>
          <dao-select
            v-model="select"
            class="dao-option"
            size="sm">
            <dao-option
              v-for="item in items"
              :key="item.value"
              :value="item.value"
              :label="item.text">
            </dao-option>
          </dao-select>
          <dao-select
            v-model="select"
            class="dao-option"
            size="sm">
            <dao-option
              v-for="item in items"
              :key="item.value"
              :value="item.value"
              :label="item.text">
            </dao-option>
          </dao-select>
        </div>
      </div>
      <div class="dao-setting-section" style="height: 95px;">
        <div class="dao-setting-item">
          <div class="dao-setting-label dao-name">租户和项目组</div>
          <div class="dao-setting-content">
            <div>
              <div class="dao-title">租户</div>
              <div class="dao-title">项目组</div>
            </div>
            <dao-select
              v-model="select"
              class="dao-option"
              size="sm">
              <dao-option
                v-for="item in items"
                :key="item.value"
                :value="item.value"
                :label="item.text">
              </dao-option>
            </dao-select>
            <dao-select
              v-model="select"
              class="dao-option"
              size="sm">
              <dao-option
                v-for="item in items"
                :key="item.value"
                :value="item.value"
                :label="item.text">
              </dao-option>
            </dao-select>
          </div>
        </div>
      </div>
      <div class="dao-setting-section" style="height: 62px;">
        <div class="dao-setting-item">
          <div class="dao-setting-label dao-name">版本</div>
          <div class="dao-setting-content">
            <dao-select
              v-model="select"
              class="dao-option"
              size="sm"
              style="width: 780px;"
            >
              <dao-option
                v-for="item in items"
                :key="item.value"
                :value="item.value"
                :label="item.text">
              </dao-option>
            </dao-select>
          </div>
        </div>
      </div>
      <div class="dao-setting-section" style="height: 62px;">
        <div class="dao-setting-item">
          <div class="dao-setting-label dao-name">规格</div>
          <div class="dao-setting-content">
            <dao-select
              v-model="select"
              class="dao-option"
              size="sm"
              style="width: 780px;"
            >
              <dao-option
                v-for="item in items"
                :key="item.value"
                :value="item.value"
                :label="item.text">
              </dao-option>
            </dao-select>
          </div>
        </div>
      </div>
    </dao-setting-layout>
    <dao-setting-layout class="parameter-set">
      <div class="dao-setting-section">
        <div class="dao-setting-title">参数设置</div>
      </div>
      <div class="dao-setting-item" style="height: 66px;">
        <div class="dao-setting-label dao-name">CPU</div>
        <div class="dao-setting-content">
          <dao-input
            v-model="value"
            placeholder="请输入内容"
            block
            style="width: 97%"
          >
          </dao-input>
          <div class="dao-desc">
            CPU限制(Core)
          </div>
        </div>
      </div>
      <div class="dao-setting-section" style="height: 86px;">
        <div class="dao-setting-item">
          <div class="dao-setting-label dao-name">CPU</div>
          <div class="dao-setting-content">
            <dao-input
              v-model="value"
              placeholder="请输入内容"
              block
              style="width: 97%"
            >
            </dao-input>
            <div class="dao-desc">
              CPU限制(Core)
            </div>
          </div>
        </div>
      </div>
      <div class="dao-setting-section" style="height: 86px;">
        <div class="dao-setting-item">
          <div class="dao-setting-label dao-name">CPU</div>
          <div class="dao-setting-content">
            <dao-input
              v-model="value"
              placeholder="请输入内容"
              block
              style="width: 97%"
            >
            </dao-input>
            <div class="dao-desc">
              CPU限制(Core)
            </div>
          </div>
        </div>
      </div>
      <div class="dao-setting-section" style="height: 86px;">
        <div class="dao-setting-item">
          <div class="dao-setting-label dao-name">CPU</div>
          <div class="dao-setting-content">
            <dao-input
              v-model="value"
              placeholder="请输入内容"
              block
              style="width: 97%"
            >
            </dao-input>
            <div class="dao-desc">
              CPU限制(Core)
            </div>
          </div>
        </div>
      </div>
      <div class="dao-setting-section" style="height: 86px;">
        <div class="dao-setting-item">
          <div class="dao-setting-label dao-name">CPU</div>
          <div class="dao-setting-content">
            <dao-input
              v-model="value"
              placeholder="请输入内容"
              block
              style="width: 97%"
            >
            </dao-input>
            <div class="dao-desc">
              CPU限制(Core)
            </div>
          </div>
        </div>
      </div>
      <div class="dao-setting-section" style="height: 86px;">
        <div class="dao-setting-item">
          <div class="dao-setting-label dao-name">CPU</div>
          <div class="dao-setting-content">
            <dao-input
              v-model="value"
              placeholder="请输入内容"
              block
              style="width: 97%"
            >
            </dao-input>
            <div class="dao-desc">
              CPU限制(Core)
            </div>
          </div>
        </div>
      </div>
    </dao-setting-layout>
    <div class="dao-setting-layout-footer footer-lay">
      <div class="btn-layout">
        <button class="dao-btn" @click="onClick">default</button>
        <button class="dao-btn blue">blue</button>
      </div>
    </div>
  </div>
</template>

<script src="./appform.js"></script>

<style lang="scss" scoped>
@import '~@/view/components/daox/wizard/wizard/wizard.scss';

::v-deep .dao-setting-item:last-child .dao-setting-content>:last-child.dao-select {
  margin-bottom: 0;
}
.app-form {
  .form-header {
    height: 52px;
    .form-title {
      margin-left: 20px;
      height: 16px;
      line-height: 32px;
      font-size: 16px;
      font-weight: 500;
      color: #3D444F;
    }
  }
  .basic-info {
    margin: 20px 160px 0 160px;
    .dao-name {
      height: 14px;
      line-height: 14px;
      font-family: SFProText-Regular,SFProText;
      font-weight: 400;
      color:#3D444F;
    }
    .dao-title {
      display: inline-block;
      overflow: hidden;
      width: 370px;
      height: 14px;
      line-height: 14px;
      margin-right: 20px;
      font-family: SFProText-Regular,SFProText;
      font-weight: 400;
    }
    .dao-option {
      display: inline-block;
      overflow: hidden;
      margin-right: 20px;
      margin-bottom: 0;
      height: 32px;
      width: 370px;
    }
  }
  .parameter-set {
    margin: 20px 160px 0 160px;
    .dao-name {
      height: 14px;
      line-height: 14px;
      font-family: SFProText-Regular,SFProText;
      font-weight: 400;
      color:#3D444F;
    }
    .dao-desc {
      height: 14px;
      font-size: 14px;
      font-family: SFProText-Regular,SFProText;
      font-weight: 400;
      color: rgba(155,163,175,1);
      line-height: 14px;
    }
  }
  .footer-lay {
    height: 50px;
    margin: 20px 0 0 0;
    .btn-layout {
      float: right;
      /* line-height: 20px; */
    }
  }
}
</style>

