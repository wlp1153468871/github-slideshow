<template>
  <dao-setting-layout>
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">租户名称</div>
        <div slot="content">
          <dao-input
            icon-inside
            type="text"
            name="name"
            v-validate="'required|org_name'"
            data-vv-as="租户名称"
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
          <dao-input type="text" v-model="org.short_name" placeholder="shortname" :disabled="true">
          </dao-input>
        </div>
      </dao-setting-item>
    </dao-setting-section>
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">租户备注</div>
        <div slot="content">
          <textarea
            class="dao-control"
            :class="{ error: veeErrors.first('description') }"
            v-model="description"
            name="description"
            rows="3"
            v-validate="'max:80'"
          >
          </textarea>
          <p class="text-danger" v-show="veeErrors.first('description')">
            租户备注不能超过80字
          </p>
        </div>
      </dao-setting-item>
    </dao-setting-section>
    <div slot="footer">
      <button
        v-if="$can('platform.organization.update', 'platform.organization')"
        class="dao-btn blue"
        :disabled="!isValidForm"
        @click="save()"
      >
        保存
      </button>
    </div>
  </dao-setting-layout>
</template>

<script>
export default {
  name: 'OverviewBasicPanel',
  props: {
    org: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      name: '',
      description: '',
    };
  },
  computed: {
    isValidForm() {
      // 用户名必填
      return this.name !== '' && !this.veeErrors.any();
    },
  },
  watch: {
    org: {
      immediate: true,
      handler() {
        const { name = '', description = '' } = this.org;
        this.name = name;
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
