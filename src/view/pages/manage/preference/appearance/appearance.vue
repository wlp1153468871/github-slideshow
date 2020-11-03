<template>
  <div class="appearance" v-if="$can('platform.settings.assets')">
    <dao-setting-layout>
      <div slot="layout-title">
        产品文案
      </div>
      <div slot="layout-title-helper">您可以在这里修改产品的名称以及页脚等文案的内容</div>
      <dao-setting-section>
        <div slot="label">产品名称</div>
        <div slot="content">
          <dao-input
            icon-inside
            v-model="productName"
            type="text"
            placeholder="例: 我的容器平台"
            name="name"
            :message="veeErrors.first('name')"
            :status="veeErrors.has('name') ? 'error' : ''"
            v-validate="'max:25'"
            data-vv-as="产品名称"
          >
          </dao-input>
          <button
            class="dao-btn blue"
            :disabled="!isValidForm"
            @click="updateProduceName"
            v-throttleClick
          >
            <span class="text">保存</span>
          </button>
        </div>
        <div slot="content-helper">将 "DSP" 替换成 "我的DSP"</div>
      </dao-setting-section>
    </dao-setting-layout>

    <dao-setting-layout>
      <div slot="layout-title">
        产品图标
      </div>
      <div slot="layout-title-helper">您可以通过修改 LOGO 自由定制 DSP 产品外观</div>
      <dao-setting-section>
        <div slot="label">登录页图标</div>
        <div slot="content">
          <div>
            <div
              class="service-new-logo"
              v-if="theme.appPicture.loginPicture"
              v-bg-image="theme.appPicture.loginPicture"
            ></div>
            <logo-placeholder v-if="!theme.appPicture.loginPicture"> </logo-placeholder>
          </div>
          <file-upload
            class="dao-btn blue"
            extensions="gif,jpg,jpeg,png,webp,svg"
            accept="image/*"
            name="loginPic"
            v-model="loginPicture"
            @input="handleLoginPicture"
          >
            <span class="text">选择图片，文件大小请勿超过 1M</span>
          </file-upload>
        </div>
        <div slot="content-helper">用于显示在登录页面, 建议大小 180 像素 × 60 像素</div>
      </dao-setting-section>
      <dao-setting-section>
        <div slot="label">导航栏图标</div>
        <div slot="content">
          <div>
            <div
              class="service-new-logo"
              v-if="theme.appPicture.navPicture"
              v-bg-image="theme.appPicture.navPicture"
            ></div>
            <logo-placeholder v-if="!theme.appPicture.navPicture"> </logo-placeholder>
          </div>
          <file-upload
            class="dao-btn blue"
            extensions="gif,jpg,jpeg,png,webp,svg"
            accept="image/*"
            name="navPic"
            v-model="navPicture"
            @input="handleNavPicture"
          >
            <span class="text">选择图片，文件大小请勿超过 1M</span>
          </file-upload>
        </div>
        <div slot="content-helper">用于显示在导航栏顶部, 建议大小 200 像素 × 60 像素</div>
      </dao-setting-section>
      <dao-setting-section>
        <div slot="label">浏览器图标</div>
        <div slot="content">
          <div>
            <div
              class="service-new-logo"
              v-if="theme.appPicture.favicon"
              v-bg-image="theme.appPicture.favicon"
            ></div>
            <logo-placeholder v-if="!theme.appPicture.favicon"> </logo-placeholder>
          </div>
          <file-upload
            class="dao-btn blue"
            extensions="gif,jpg,jpeg,png,webp,svg"
            accept="image/*"
            name="favicon"
            v-model="favicon"
            @input="handleFavicon"
          >
            <span class="text">选择图片，文件大小请勿超过 1M</span>
          </file-upload>
        </div>
        <div slot="content-helper">用于显示在浏览器标签页, 建议大小 16 像素 × 16 像素</div>
      </dao-setting-section>
    </dao-setting-layout>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { first } from 'lodash';
import FileUpload from 'vue-upload-component';
import UploadService from '@/core/services/upload.service';
import { AppPictureModel, ThemeModel } from '@/core/models';

const UNIT_1M = 1024 * 1024;

export default {
  name: 'Appearance',
  components: {
    FileUpload,
  },
  data() {
    return {
      productName: '',
      productInfo: '',
      loginPicture: [],
      navPicture: [],
      favicon: [],
    };
  },
  computed: {
    ...mapGetters(['theme']),
    isValidForm() {
      return !this.veeErrors.any();
    },
  },
  created() {
    if (this.$can('platform.settings.assets')) {
      this.productName = this.theme.productName;
    } else {
      this.$noty.error('您暂无外观设置权限');
    }
  },
  watch: {
    theme() {
      this.productName = this.theme.productName;
    },
  },
  methods: {
    updateProduceName() {
      const newTheme = new ThemeModel(
        this.productName,
        new AppPictureModel(
          this.theme.appPicture.navPicture,
          this.theme.appPicture.navPicture,
          this.theme.appPicture.favicon,
        ),
      );
      this.$noty.success('产品名称修改成功');
      this.$store.dispatch('updateTheme', newTheme);
    },

    handleFileInput(files) {
      const file = first(files);
      return UploadService.uploadPic(file);
    },

    handleLoginPicture(file) {
      if (file.length === 0) return;
      if (file[0].size > UNIT_1M) {
        this.$noty.error('文件大小超过 1M！');
        return;
      }
      this.handleFileInput(file).then(url => {
        const newTheme = new ThemeModel(
          this.theme.productName,
          new AppPictureModel(url, this.theme.appPicture.navPicture, this.theme.appPicture.favicon),
        );
        this.$store.dispatch('updateTheme', newTheme);
      });
    },

    handleNavPicture(file) {
      if (file.length === 0) return;
      if (file[0].size > UNIT_1M) {
        this.$noty.error('文件大小超过 1M！');
        return;
      }
      this.handleFileInput(file).then(url => {
        const newTheme = new ThemeModel(
          this.theme.productName,
          new AppPictureModel(
            this.theme.appPicture.loginPicture,
            url,
            this.theme.appPicture.favicon,
          ),
        );
        this.$store.dispatch('updateTheme', newTheme);
      });
    },

    handleFavicon(file) {
      if (file.length === 0) return;
      if (file[0].size > UNIT_1M) {
        this.$noty.error('文件大小超过 1M！');
        return;
      }
      this.handleFileInput(file).then(url => {
        const newTheme = new ThemeModel(
          this.theme.productName,
          new AppPictureModel(
            this.theme.appPicture.loginPicture,
            this.theme.appPicture.navPicture,
            url,
          ),
        );
        this.$store.dispatch('updateTheme', newTheme);
      });
    },
  },
};
</script>

<style lang="scss">
.appearance {
  .service-new-logo {
    width: 100px;
    height: 100px;
    margin-bottom: 7px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% auto;
    overflow: hidden;
  }
}
</style>
