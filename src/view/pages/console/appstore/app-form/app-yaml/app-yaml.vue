<template>
  <div class="app-yamlform">
    <div class="layout-content-header form-header">
      <span @click="cancerForm">
        <svg class="icon" style="color: #217EF2;">
          <use :xlink:href="`#icon_close`"></use>
        </svg>
      </span>
      <span class="form-title">
        <span v-if="this.$route.query.instanceId">
          更新实例 {{this.chartName}}  {{this.$route.params.version}}
        </span>
        <span v-else>
          创建实例 {{this.chartName}}  {{this.$route.params.version}}
        </span>
      </span>
    </div>
    <div class="yaml_content_box">
      <dao-setting-layout class="basic-info">
        <div class="dao-setting-section">
          <div class="dao-setting-title title-text">基本信息</div>
        </div>
        <div class="dao-setting-item" style="height: 42px;">
          <div class="dao-setting-label dao-name">实例名称</div>
          <div class="dao-setting-content">
            <div v-if="this.$route.query.instanceId">{{this.instanceName}}</div>
            <dao-input
              v-model="instanceName"
              block
              style="width: 98%"
              placeholder="请输入内容"
              v-else
            >
            </dao-input>
          </div>
        </div>
        <div class="dao-setting-section">
          <div class="dao-setting-item">
            <div class="dao-setting-label dao-name">版本</div>
            <div class="dao-setting-content">{{this.$route.params.version}}</div>
          </div>
        </div>
        <!-- <div class="dao-setting-section">
          <div class="dao-setting-item">
            <div class="dao-setting-label dao-name">租户和项目组</div>
            <div class="dao-setting-content">
              <div class="box">
                <div class="dao-title">租户</div>
                <dao-select
                  v-model="select1"
                  class="dao-option"
                  size="sm">
                  <dao-option
                    v-for="item in tenant"
                    :key="item.value"
                    :value="item.index"
                    :label="item.value">
                  </dao-option>
                </dao-select>
              </div>
              <div class="box">
                <div class="dao-title">项目组</div>
                <dao-select
                  v-model="select2"
                  class="dao-option"
                  size="sm">
                  <dao-option
                    v-for="item in project"
                    :key="item.value"
                    :value="item.index"
                    :label="item.value">
                  </dao-option>
                </dao-select>
              </div>
            </div>
          </div>
        </div> -->
      </dao-setting-layout>
      <dao-setting-layout class="yaml">
        <div class="dao-setting-section">
          <div class="dao-setting-title yaml-text">变量文件</div>
        </div>
        <code-mirror class="code-mirror" v-model="yaml.data"></code-mirror>
      </dao-setting-layout>
    </div>
    <div class="dao-setting-layout-footer footer-lay">
      <div class="btn-layout">
        <button class="dao-btn" @click="cancerForm">取消</button>
        <button class="dao-btn blue"
          @click="updateYaml"
          v-if="this.$route.query.instanceId"
        >确认更新</button>
        <button class="dao-btn blue" @click="createYmal" v-else>确认创建</button>
      </div>
    </div>
    <!-- 对其弹窗内容及其事件进行修改 -->
    <dao-dialog
      :visible.sync="config.visible"
      header="确认是否放弃编辑"
      :footer="config.footer">
      <div class="dialog_body">确认是否放弃当前编辑，放弃后不可撤销。</div>
      <div slot="footer">
        <button class="dao-btn red" @click="giveUp">
          放弃
        </button>
        <button class="dao-btn" @click="close">
          取消
        </button>
      </div>
    </dao-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import CodeMirror from '@/view/components/config/code-mirror.vue';

import AppStoreService from '@/core/services/appstore.service';

export default {
  name: 'AppStoreYaml',
  components: {
    CodeMirror,
  },
  data() {
    return {
      select1: 1,
      select2: 2,
      tenant: [
        {
          value: '默认租户',
          index: 1,
        },
      ],
      project: [
        {
          value: '默认项目组',
          index: 2,
        },
      ],
      config: {
        visible: false,
      },
      instanceName: '',
      chartName: '',
      yaml: {
        data: '',
      },
    };
  },

  computed: {
    ...mapState(['space', 'zone']),
  },

  created() {
    this.getApp();
  },

  methods: {
    // 获取App
    getApp() {
      AppStoreService.getApp(this.zone.id, this.space.id, this.$route.params.appid).then(res => {
        if (res) {
          res.applicationInfos.forEach(data => {
            if (data.version === this.$route.params.version) {
              this.chartName = data.chartName;
            }
          });
          // 创建还是更新
          if (this.$route.query.instanceId) {
            this.getNewYaml();
            this.getInstanceOne();
          } else {
            this.getYaml();
          }
        }
      });
    },
    // 获取yaml
    getYaml() {
      AppStoreService
        .getYaml(this.zone.id, this.space.id, this.$route.params.appid,
          this.chartName, this.$route.params.version)
        .then(res => {
          if (res) {
            this.yaml.data = res;
          }
        });
    },
    // 获取最新yaml
    getNewYaml() {
      AppStoreService
        .getNewYaml(this.zone.id, this.space.id, this.$route.params.appid,
          this.$route.query.instanceId)
        .then(res => {
          if (res) {
            this.yaml.data = res;
          }
        });
    },
    // 创建yaml实例
    createYmal() {
      AppStoreService
        .createYmal(this.zone.id, this.space.id, this.$route.params.appid,
          this.chartName, this.$route.params.version, this.instanceName, this.yaml)
        .then(res => {
          if (res) {
            this.$noty.success('实例创建成功');
            this.$router.go(-1);
          }
        });
    },
    // 获取一个实例
    getInstanceOne() {
      AppStoreService
        .getInstanceOne(this.zone.id, this.space.id, this.$route.params.appid,
          this.$route.query.instanceId)
        .then(res => {
          if (res) {
            this.instanceName = res.name;
          }
        });
    },
    // 更新yaml实例
    updateYaml() {
      AppStoreService
        .updateYaml(this.zone.id, this.space.id, this.$route.params.appid,
          this.$route.query.instanceId, this.yaml)
        .then(res => {
          if (res) {
            this.$noty.success('实例更新成功');
            this.$router.go(-1);
          }
        });
    },
    cancerForm() {
      this.config.visible = true;
    },
    close() {
      this.config.visible = false;
    },
    giveUp() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~@/view/components/daox/wizard/wizard/wizard.scss';

::v-deep .dao-setting-item:last-child .dao-setting-content>:last-child.dao-select {
  margin-bottom: 0;
}
::v-deep .dao-setting-content>:not(:first-child):not(.dao-btn) {
  margin-top: 0px;
}
.app-yamlform {
  width: 100%;
  min-height: 100%;
  .dialog_body {
      padding: 20px;
    }
  .form-header {
    width: 100%;
    height: 52px;
    position: fixed;
    top: 56px;
    left: 0;
    z-index: 9;
    .form-title {
      margin-left: 20px;
      height: 16px;
      line-height: 32px;
      font-size: 16px;
      font-weight: 500;
      color: #3D444F;
    }
  }
  .yaml_content_box{
    width: 960px;
    min-height: 100%;
    padding: 70px 0 60px;
    margin: 0 auto;
    box-sizing: border-box;
  }
  .basic-info {
    width: 100%;
    .title-text {
      font-size: 14px;
      font-family: SFProText-Semibold,SFProText;
      font-weight: 600;
      color: #3D444F;
    }
    .dao-name {
      height: 14px;
      line-height: 14px;
      font-family: SFProText-Regular,SFProText;
      font-weight: 400;
      color:#3D444F;
    }
    .dao-title {
      height: 20px;
      line-height: 20px;
      font-family: SFProText-Regular,SFProText;
      font-weight: 400;
    }
    .dao-option {
      margin: 5px 20px 0 0;
      height: 32px;
      width: 90%;
    }
    .box {
      width: 50%;
      display: inline-block;
      overflow: hidden;
    }
  }
  .yaml {
    width: 100%;
    .yaml-text{
      font-size: 14px;
      font-family: SFProText-Semibold,SFProText;
      font-weight: 600;
      color: #3D444F;
    }
    .code-mirror {
      margin: 0 20px 20px 0;
    }
  }
  .footer-lay {
    overflow: hidden;
    width: 100%;
    height: 50px;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 9;
    .btn-layout {
      position: absolute;
      bottom: 10px;
      right: 20px;
    }
  }
}
</style>
