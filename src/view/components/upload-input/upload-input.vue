<template>
  <div class="dao-input-container">
    <div class="dao-input-inner">
      <input type="text" v-model="filename" placeholder="选择文件..." readonly="readonly" />
      <span class="file-upload-btn">
        <file-upload
          class="dao-btn btn-sm blue uploadFile"
          type="file"
          ref="upload"
          :name="name"
          :extensions="extensions"
          v-model="filenames"
          @input="handleFileInput"
        >
          浏览
        </file-upload>
      </span>
    </div>
  </div>
</template>

<script>
import FileUpload from 'vue-upload-component';

export default {
  name: 'UploadInput',
  props: {
    accept: { type: String, default: '*' },
    extensions: { type: String, default: 'war' },
    description: { type: String, default: '' },
  },
  components: {
    FileUpload,
  },
  data() {
    return {
      name: 'file',
      filename: '',
      filenames: [],
    };
  },
  created() {
    this.$on('reset', () => {
      this.filename = '';
      if (this.$refs.upload) {
        this.$refs.upload.clear();
      }
    });
  },
  destroyed() {
    if (this.$refs.upload) {
      this.$refs.upload.clear();
    }
  },
  methods: {
    // 选择文件上传
    handleFileInput(files) {
      if (files.length) {
        const file = files[0];
        this.filename = file.name;
        this.$emit('on-file-change', file);
      }
    },
  },
};
</script>

<style lang="scss">
.file-upload-btn {
  position: absolute;
  top: 3px;
  right: 3px;
}
</style>
