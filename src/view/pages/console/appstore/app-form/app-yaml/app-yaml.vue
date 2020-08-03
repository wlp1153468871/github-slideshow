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
      </dao-dialog>
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
    <dao-setting-layout class="yaml">
      <div class="dao-setting-section">
        <div class="dao-setting-title">变量文件</div>
      </div>
      <code-mirror class="code-mirror"></code-mirror>
    </dao-setting-layout>
    <div class="dao-setting-layout-footer footer-lay">
      <div class="btn-layout">
        <button class="dao-btn">预览</button>
        <button class="dao-btn blue">确认创建</button>
      </div>
    </div>
  </div>
</template>

<script>
import EditYaml from '@/view/components/yaml-edit/edit-yaml.vue';
import CodeMirror from '@/view/components/config/code-mirror.vue';

export default {
  name: 'AppStoreYaml',
  components: {
    EditYaml,
    CodeMirror,
  },
  data() {
    return {
      select: 1,
      items: [
        {
          text: '默认租户',
          value: 1,
        },
        {
          text: '租户1',
          value: 2,
        },
      ],
      config: {
        visible: false,
        footer: {
          cancelText: '取消',
          confirmText: '放弃',
          confirmDisabled: true,
        },
      },
    };
  },
  methods: {
    cancerForm() {
      this.config.visible = true;
    },
    onConfirm() {
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
