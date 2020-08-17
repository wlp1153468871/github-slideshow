<template>
  <div class="app-yamlform">
    <div class="layout-content-header form-header">
      <span @click="cancerForm">
        <svg class="icon" style="color: #217EF2;">
          <use :xlink:href="`#icon_close`"></use>
        </svg>
      </span>
      <!-- 对其弹窗内容及其事件进行修改 -->
      <dao-dialog
        :visible.sync="config.visible"
        header="确认是否放弃编辑"
        :footer="config.footer"
      >
        <div class="body">确认是否放弃当前编辑，放弃后不可撤销。</div>
        <div slot="footer">
          <button class="dao-btn red" @click="giveUp">
            放弃
          </button>
          <button class="dao-btn" @click="close">
            取消
          </button>
        </div>
      </dao-dialog>
      <span class="form-title">
        创建服务实例 {{this.chartName}}  {{this.$route.params.version}}
      </span>
    </div>
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
      <div class="dao-setting-section" style="height: 62px;">
        <div class="dao-setting-item">
          <div class="dao-setting-label dao-name">版本</div>
          <div class="dao-setting-content">{{this.$route.params.version}}</div>
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
    </dao-setting-layout>
    <dao-setting-layout class="yaml">
      <div class="dao-setting-section">
        <div class="dao-setting-title yaml-text">变量文件</div>
      </div>
      <code-mirror class="code-mirror" v-model="yaml.data"></code-mirror>
    </dao-setting-layout>
    <div class="dao-setting-layout-footer footer-lay">
      <div class="btn-layout">
        <button class="dao-btn" @click="cancerForm">取消</button>
        <button class="dao-btn blue"
          @click="updateYaml"
          v-if="this.$route.query.instanceId"
        >确认创建</button>
        <button class="dao-btn blue" @click="createYmal" v-else>确认创建</button>
      </div>
    </div>
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
            this.instanceName = `${res.name.split('-')[1]}`;
          }
        });
    },
    // 更新yaml实例
    updateYaml() {
      AppStoreService
        .updateYaml(this.zone.id, this.space.id, this.$route.params.appid,
          this.$route.query.instanceId, this.yaml)
        .then(res => {
          console.log(res);
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
.app-yamlform {
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
    .body {
      padding: 20px;
    }
  }
  .basic-info {
    margin: 20px 160px 0 160px;
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
  .yaml {
    margin: 20px 160px 0 160px;
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
    position: relative;
    overflow: hidden;
    height: 50px;
    margin: 20px 0 0 0;
    .btn-layout {
      position: absolute;
      bottom: 10px;
      right: 20px;
    }
  }
}
</style>
