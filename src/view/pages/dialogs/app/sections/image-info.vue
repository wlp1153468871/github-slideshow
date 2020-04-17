<template>
  <dao-setting-layout>
    <dao-setting-section>
      <dao-setting-item>
        <template slot="label">
          镜像地址
        </template>
        <template slot="content">
          <dao-input disabled v-model="repository"> </dao-input>
        </template>
      </dao-setting-item>
    </dao-setting-section>
    <dao-setting-section>
      <dao-setting-item>
        <template slot="label">
          版本
        </template>
        <template slot="content">
          <dao-select
            :with-search="true"
            search-placeholder="搜索版本"
            no-data-text="暂无服务可以版本"
            no-match-text="无此版本"
            placeholder="选择一个版本"
            :loading="isLoading"
            :loading-text="loadingText"
            v-model="editTag"
          >
            <dao-option-group>
              <dao-option v-for="item in tags" :key="item" :value="item" :label="item">
              </dao-option>
            </dao-option-group>
          </dao-select>
        </template>
      </dao-setting-item>
    </dao-setting-section>
  </dao-setting-layout>
</template>

<script>
export default {
  name: 'ImageInfo',
  props: {
    repository: { type: String, default: '' },
    tag: { type: String, default: '' },
    tags: { type: Array, default: () => [] },
    isLoading: { type: Boolean, default: true },
  },
  data() {
    return {
      editTag: '',
      loadingText: '正在加载镜像列表...',
    };
  },
  watch: {
    tag: {
      immediate: true,
      handler(tag) {
        if (tag) {
          this.editTag = tag;
        }
      },
    },
  },
  methods: {
    validate() {
      return Boolean(this.editTag);
    },

    providePartialModel() {
      return {
        imagename: `${this.repository}:${this.editTag}`,
      };
    },
  },
};
</script>
