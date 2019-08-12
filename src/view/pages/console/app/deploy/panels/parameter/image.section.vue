<template>
  <div>
    <!-- select deploy mode -->
    <!-- <dao-setting-layout>
      <template slot="layout-title">部署方式</template>
      <dao-setting-section>
        <dao-setting-item>
          <div slot="content">
            <dao-radio-group style="display: flex;">
              <dao-radio
                style="margin-right: 40px;"
                v-model="deployMode"
                label="image">
                镜像部署
              </dao-radio>
              <dao-radio
                :disabled="true"
                v-model="deployMode"
                label="warPkg">
                war 包部署 (即将推出)
              </dao-radio>
            </dao-radio-group>
          </div>
        </dao-setting-item>
      </dao-setting-section>
    </dao-setting-layout> -->

    <!-- select image -->
    <dao-setting-layout
      class="section-image"
      v-if="deployMode === 'image'">
      <template slot="layout-title">选择镜像</template>
      <dao-setting-section>
        <dao-setting-item>
          <div slot="content">
            <div class="custom-image-box">
              <p class="custom-image-title">请输入镜像地址</p>
              <div class="custom-image-content clearfix">
                <dao-input
                  icon-inside
                  v-model.trim="imageURL"
                  name="image"
                  type="text"
                  class="image-url"
                  @blur="onImageURLChange"
                  :message="veeErrors.first('image') || errorMessage"
                  :status="imageValidStatus"
                  v-validate="'required'"
                  data-vv-as="镜像地址"
                  placeholder="registry_url/namespace/image">
                </dao-input>
                <div class="image-slash">/</div>
                <dao-select
                  :with-search="true"
                  @change="updateRepository"
                  search-placeholder="搜索版本"
                  no-data-text="暂无可以使用的版本"
                  no-match-text="无此版本"
                  placeholder="选择一个版本"
                  v-model="tag">
                  <dao-option-group>
                    <dao-option
                      v-for="item in tags"
                      :key="item"
                      :value="item"
                      :label="item">
                    </dao-option>
                  </dao-option-group>
                </dao-select>
              </div>
              <p v-if="imageStatus === 'info'">
                <a href="javascript:void 0" @click="openAuthDialog">重新验证</a>
              </p>
            </div>
          </div>
        </dao-setting-item>
      </dao-setting-section>
    </dao-setting-layout>

    <!-- select war -->
    <!-- <dao-setting-layout
      class="section-war"
      v-if="deployMode === 'warPkg'">
      <template slot="layout-title">部署 War 包</template>
      <dao-setting-section>
        <dao-setting-item>
          <div slot="content">
            <div v-if="warPkg.length" class="war-content">
              <svg class="icon">
                <use xlink:href="#icon_war-pkg"></use>
              </svg>
              <span class="file-name">{{ warPkg[0].name }}</span>
              <file-upload
                extensions="war"
                name="warPkg"
                v-model="warPkg"
                @input="uploadWarPkg">
                <a class="add-det" style="margin-left: 24px;">重新上传</a>
              </file-upload>
            </div>
            <file-upload
              v-else
              class="dao-btn blue"
              extensions="war"
              name="warPkg"
              v-model="warPkg"
              @input="uploadWarPkg">
              <svg class="icon">
                <use xlink:href="#icon_upload"></use>
              </svg>
              <span class="text">上传War包</span>
            </file-upload>
            <p style="margin-top: 10px;">支持扩展名为.war的文件</p>
          </div>
        </dao-setting-item>
      </dao-setting-section>
    </dao-setting-layout> -->

    <!-- dialog start -->
    <image-auth-dialog
      :url="imageURL"
      @authorization="onAuthorization"
      :visible="dialogConfigs.imageAuth.visible"
      @close="dialogConfigs.imageAuth.visible = false">
    </image-auth-dialog>
    <!-- dialog end -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { first } from 'lodash';
import FileUpload from 'vue-upload-component';
import UtilService from '@/core/services/util.service';
import DockerImage from '@/core/lib/docker-parse-image';
// dialog
import ImageAuthDialog from '@/view/pages/dialogs/app/image-auth';

export default {
  name: 'ImagePanel',

  inject: ['$validator'],

  components: {
    ImageAuthDialog,
    FileUpload,
  },

  data() {
    return {
      deployMode: 'image',
      // simple: 'customImage',
      warPkg: [],
      imageURL: '',
      repository: '',
      tag: '',
      tags: [],
      loadings: {
        images: false,
      },
      imageStatus: '',
      dialogConfigs: {
        imageAuth: { visible: false },
      },
      errorMessage: '',
    };
  },

  computed: {
    ...mapGetters(['orgId', 'zoneId']),

    isValidForm() {
      if (this.deployMode === 'image') {
        return Boolean(!this.veeErrors.any() && this.repository);
      }
      return Boolean(!this.veeErrors.any() && this.warPkg.length !== 0);
    },

    imageValidStatus() {
      if (this.veeErrors.has('image')) {
        return 'error';
      }
      return this.imageStatus;
    },
  },

  methods: {
    onImageURLChange() {
      this.tags = [];
      this.tag = '';
      const url = this.imageURL;

      if (url && this.isValidImageURL(url) && !this.loadings.images) {
        this.loadImageTags(url);
      }
    },

    loadImageTags(url) {
      this.loadings.images = true;
      this.imageStatus = 'loading';
      return UtilService
        .getDockerImageTags(this.orgId, this.zoneId, url)
        .then(tags => {
          this.tags = tags;
          this.tag = first(tags);
          this.imageStatus = 'success';
          this.errorMessage = '';
          this.updateRepository(this.tag);
        })
        .catch(err => {
          if (err.status === 403 || err.status === 401) {
            this.openAuthDialog();
          } else {
            this.imageStatus = 'error';
            this.errorMessage = err.data.error_info || '后端出错';
          }
        })
        .finally(() => {
          this.loadings.images = false;
        });
    },

    openAuthDialog() {
      if (!this.dialogConfigs.imageAuth.visible) {
        this.dialogConfigs.imageAuth.visible = true;
        this.imageStatus = 'info';
      }
    },

    updateRepository(tag) {
      const image = DockerImage(this.imageURL);
      image.tag = tag;
      this.repository = image.fullname;
    },

    onAuthorization(authInfo) {
      const { tags = [], username = '', password = '' } = authInfo;
      this.tags = tags;
      this.tag = first(tags);
      this.registryuser = username;
      this.registrypassword = password;
      this.imageStatus = 'success';
      this.updateRepository(this.tag);
    },

    isValidImageURL(url) {
      return Boolean(url);
    },

    validate() {
      return this.$validator.validate().then(isValid => {
        return isValid && this.isValidForm;
      });
    },

    providePartialModel() {
      const {
        repository,
        registryuser,
        registrypassword,
        warPkg: deployfile,
        deployMode,
      } = this;

      if (this.deployMode === 'image') {
        return {
          deployMode,
          repository,
          registryuser,
          registrypassword,
        };
      }
      return {
        deployMode,
        deployfile: first(deployfile),
      };
    },

    // uploadWarPkg(file) {
    //   this.warPkg = file;
    // },
  },

  watch: {
    repository() {
      this.$emit('model-changed', this.providePartialModel());
    },

    $route: {
      immediate: true,
      deep: true,
      handler(route) {
        const { imgUrl: repository = '' } = route.query;
        this.imageURL = repository;
        this.onImageURLChange();
      },
    },
  },
};
</script>

<style lang="scss">
.section-image {
  margin-bottom: 20px;
}

.custom-image-box {
  .custom-image-title {
    margin-bottom: 10px;
    line-height: 14px;
  }

  .custom-image-content {
    & > div {
      float: left;
    }

    .image-slash {
      height: 32px;
      margin: 0 8px;
      font-size: 18px;
      line-height: 32px;
    }

    .image-url {
      input {
        width: 500px;
      }
    }
  }
}

.select-org {
  display: flex;
  flex-direction: row;

  & > div {
    margin-right: 20px;
  }
}
</style>
