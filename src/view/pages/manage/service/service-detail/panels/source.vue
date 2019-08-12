<template>
  <div>
    <div class="dao-table-toolbar">
      <file-upload
        extensions="gif,jpg,jpeg,png,webp"
        accept="image/png,image/gif,image/jpeg,image/webp"
        name="avatar"
        :multiple="true"
        :maximum="1"
        v-model="fileNames"
        @input="handleFileInput"
        input-id="addPicture"
        ref="upload">
      </file-upload>
      <label
        class="dao-btn blue has-icon"
        for="addPicture"
        @click="selectedIndex = undefined">
        <svg class="icon"><use xlink:href="#icon_plus-circled"></use></svg>
        <span class="text">添加配图</span>
      </label>
      <span class="table-count">
        共 {{ pictures.length }} 张图片
      </span>
    </div>
    <dao-setting-layout>
      <dao-setting-section
        v-for="(pic, index) in pictures"
        :key="index">
        <dao-setting-item>
          <div slot="label">网站截图</div>
          <div slot="content" class="service-snapshot">
            <div class="dao-btn-group operation">
              <label
                class="dao-btn ghost"
                for="addPicture"
                @click="replacePicture(index)">
                更改
              </label>
              <dao-dropdown
                trigger="click"
                :append-to-body="true"
                placement="bottom-end">
                <div class="dao-btn has-icon dao-icon ghost">
                  <svg class="icon"><use xlink:href="#icon_down-arrow"></use></svg>
                </div>
                <dao-dropdown-menu slot="list">
                  <dao-dropdown-item @click="removePic(index)">
                    <svg class="icon"><use xlink:href="#icon_trash"></use></svg>
                    <span class="text">删除</span>
                  </dao-dropdown-item>
                </dao-dropdown-menu>
              </dao-dropdown>
            </div>
            <div
              class="img-snapshot"
              v-bg-image="pic"
              @click="showPic(pic)">
            </div>
          </div>
        </dao-setting-item>
      </dao-setting-section>
      <empty-state
        style="margin-left: -20px;"
        v-if="!pictures.length"
        title="暂无配图">
      </empty-state>
      <div slot="footer">
        <button
          class="dao-btn blue"
          :disabled="hasChanged"
          @click="onUpdate">
          保存
        </button>
      </div>
    </dao-setting-layout>

    <!-- dialog start -->
    <show-picture-dialog
      :pic="selectedPic"
      :visible="dialogConfigs.showPicture.visible"
      @close="dialogConfigs.showPicture.visible = false">
    </show-picture-dialog>
    <!-- dialog end -->
  </div>
</template>

<script>
import { first, isEqual } from 'lodash';
import FileUpload from 'vue-upload-component';
import UploadService from '@/core/services/upload.service';
import ServiceService from '@/core/services/service.service';
// dialogs
import ShowPictureDialog from '@/view/pages/dialogs/service/show-picture';

export default {
  name: 'SourcePanel',
  props: {
    value: { type: Object, default: () => ({}) },
  },
  components: {
    FileUpload,
    ShowPictureDialog,
  },
  data() {
    return {
      selectedIndex: undefined,
      fileNames: [],
      selectedPic: null,
      dialogConfigs: {
        showPicture: { visible: false },
      },
      pictures: [],
    };
  },

  methods: {
    // 选择文件上传
    handleFileInput(files) {
      if (!files.length) return;
      const file = first(files);
      UploadService.uploadPic(file).then(url => {
        if (this.selectedIndex !== undefined) {
          this.updatePicture(this.selectedIndex, url);
        } else {
          this.addPicture(url);
        }
      });
    },

    replacePicture(index) {
      this.selectedIndex = index;
    },

    addPicture(url) {
      this.pictures.push(url);
      this.$noty.success('添加配图成功！请点击保存更新配置。');
    },

    removePic(index) {
      this.pictures.splice(index, 1);
      this.$noty.success('删除配图成功！请点击保存更新配置。');
    },

    updatePicture(index, url) {
      this.pictures.splice(index, 1, url);
      this.$noty.success('更改配图成功！请点击保存更新配置。');
    },

    showPic(pic) {
      this.selectedPic = pic;
      this.dialogConfigs.showPicture.visible = true;
    },

    onUpdate() {
      const { pictures } = this;
      return ServiceService
        .updateService(this.service.id, { pictures })
        .then(service => {
          this.$noty.success('修改服务网站截图成功');
          this.$emit('input', service);
        });
    },
  },

  computed: {
    hasChanged() {
      return isEqual(this.pictures, this.service.pictures);
    },
    service() {
      return this.value;
    },
  },

  watch: {
    value(service) {
      this.pictures = service.pictures.slice() || [];
    },
  },
};
</script>
