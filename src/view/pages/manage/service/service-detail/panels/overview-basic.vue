<template>
  <dao-setting-layout>
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">名称</div>
        <div slot="content">
          <dao-input
            icon-inside
            v-model="serviceModel.name"
            placeholder="服务名"
            name="name"
            type="text"
            v-validate="'required|max:20'"
            :message="veeErrors.first('name')"
            :status="veeErrors.has('name') ? 'error' : ''"
            data-vv-as="服务名"
          >
          </dao-input>
        </div>
      </dao-setting-item>
    </dao-setting-section>
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">
          服务图标
          <label-tip text="服务图标我们推荐使用 100px x 100px 的 png, jpg 或者 svg"></label-tip>
        </div>
        <div slot="content">
          <div>
            <div
              class="service-new-logo"
              v-if="serviceModel.logo_url"
              v-bg-image="serviceModel.logo_url"
            ></div>
            <logo-placeholder v-if="!serviceModel.logo_url"></logo-placeholder>
          </div>
          <file-upload
            class="dao-btn blue has-icon"
            extensions="gif,jpg,jpeg,png,webp,svg"
            accept="image/*"
            name="avatar"
            :multiple="true"
            :maximum="1"
            v-model="fileNames"
            @input="handleFileInput"
          >
            <svg class="icon">
              <use xlink:href="#icon_plus-circled"></use>
            </svg>
            <span class="text">选择图片</span>
          </file-upload>
        </div>
      </dao-setting-item>
    </dao-setting-section>
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">简短介绍</div>
        <div slot="content">
          <dao-input
            block
            icon-inside
            v-model="serviceModel.short_description"
            name="short_description"
            type="text"
            v-validate="'max:225'"
            :message="veeErrors.first('short_description')"
            :status="veeErrors.has('short_description') ? 'error' : ''"
            placeholder="简短介绍"
          >
          </dao-input>
        </div>
      </dao-setting-item>
    </dao-setting-section>
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">详细介绍</div>
        <div slot="content">
          <textarea
            class="dao-control"
            :class="{ error: veeErrors.first('description') }"
            style="width: 100%;"
            type="text"
            name="description"
            v-validate="'max:255'"
            rows="3"
            placeholder="详细介绍"
            v-model="serviceModel.description"
          >
          </textarea>
          <p class="text-danger" v-show="veeErrors.first('description')">
            详细介绍不能超过255字
          </p>
        </div>
      </dao-setting-item>
    </dao-setting-section>
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">帮助链接</div>
        <div slot="content">
          <dao-input
            block
            icon-inside
            v-model="serviceModel.help_url"
            name="helpUrl"
            type="text"
            v-validate="'url'"
            :message="veeErrors.first('helpUrl')"
            :status="veeErrors.has('helpUrl') ? 'error' : ''"
            :class="{ error: veeErrors.first('helpUrl') }"
            style="width: 100%;"
          >
          </dao-input>
        </div>
      </dao-setting-item>
    </dao-setting-section>
    <div slot="footer">
      <button
        v-if="$can('platform.serviceBroker.update')"
        class="dao-btn blue"
        :disabled="!isValidForm"
        @click="onUpdate"
      >
        保存
      </button>
    </div>
  </dao-setting-layout>
</template>

<script>
import { first, cloneDeep, isEqual, pick, isNull } from 'lodash';
import FileUpload from 'vue-upload-component';
import UploadService from '@/core/services/upload.service';
import ServiceService from '@/core/services/service.service';

export default {
  name: 'BasicPanel',

  components: {
    FileUpload,
  },

  props: {
    service: { type: Object, default: () => ({}) },
  },

  data() {
    return {
      fileNames: [],
      loadings: {
        update: false,
      },
      hasChanged: false,
      serviceModel: {},
    };
  },

  methods: {
    handleFileInput(files) {
      if (files.length) {
        const file = first(files);
        UploadService.uploadPic(file).then(url => {
          this.updateAvatar(url);
        });
      }
    },

    updateAvatar(url) {
      this.serviceModel.logo_url = url;
    },

    onUpdate() {
      const formData = pick(this.serviceModel, [
        'name',
        'logo_url',
        'short_description',
        'description',
        'help_url',
      ]);
      Object.keys(formData).forEach(key => {
        if (isNull(formData[key])) {
          formData[key] = undefined;
        }
      });
      ServiceService.updateService(this.service.id, this.service.zone.id, formData).then(
        service => {
          this.$noty.success('修改服务成功');
          this.$emit('update', service);
        },
      );
    },
  },

  computed: {
    isValidForm() {
      return !this.veeErrors.any() && this.hasChanged;
    },
  },

  watch: {
    service: {
      immediate: true,
      handler(val) {
        this.serviceModel = cloneDeep(val);
      },
    },
    serviceModel: {
      deep: true,
      handler() {
        this.hasChanged = !isEqual(this.service, this.serviceModel);
      },
    },
  },
};
</script>
