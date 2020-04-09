<template>
  <dao-setting-layout>
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">项目组名称</div>
        <div slot="content">
          <dao-input
            icon-inside
            type="text"
            name="name"
            v-validate="'required|org_name'"
            data-vv-as="项目组名称"
            :message="veeErrors.first('name')"
            :status="veeErrors.has('name') ? 'error' : ''"
            v-model="name"
          >
          </dao-input>
        </div>
      </dao-setting-item>
    </dao-setting-section>
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">唯一标识</div>
        <div slot="content">
          <dao-input type="text" v-model="short_name" placeholder="shortname" :disabled="true">
          </dao-input>
        </div>
      </dao-setting-item>
    </dao-setting-section>
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">备注</div>
        <div slot="content">
          <textarea
            class="dao-control"
            :class="{
              error: veeErrors.first('description'),
            }"
            v-model="description"
            name="description"
            rows="3"
            v-validate="'max:80'"
          >
          </textarea>
          <p class="text-danger" v-show="veeErrors.first('description')">
            项目组备注不能超过80字
          </p>
        </div>
      </dao-setting-item>
    </dao-setting-section>
    <div slot="footer">
      <button class="dao-btn blue" :disabled="!isValidForm" @click="save()">
        保存
      </button>
    </div>
  </dao-setting-layout>
</template>

<script>
export default {
  name: 'Overview',
  props: {
    space: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      name: '',
      description: '',
      short_name: '',
    };
  },
  computed: {
    isValidForm() {
      // 用户名必填
      return this.name !== '' && !this.veeErrors.any();
    },
  },
  watch: {
    space: {
      immediate: true,
      handler(space) {
        const { name = '', description = '', short_name = '' } = space;
        this.name = name;
        this.short_name = short_name;
        this.description = description;
      },
    },
  },
  methods: {
    save() {
      const { name, description } = this;

      this.$emit('save', {
        name,
        description,
      });
    },
  },
};
</script>
