<template>
  <tr class="dee-tr">
    <td class="dee-td">{{ env | valueType }}</td>
    <td class="dee-td" style="flex: 2;">
      <dao-input
        icon-inside
        class="dee-input"
        type="text"
        name='name'
        v-model="env.name"
        size="sm"
        :block="true"
        :placeholder="namePlaceholder"
        @change="onChange"
        @blur="onNameBlur"
        :disabled="!editable"
        ref="input"
        data-vv-as='name'
        :message="veeErrors.first('name')"
        :status="veeErrors.has('name') ? 'error' : ''"
        v-validate="'required|dns_1123_label'"
      ></dao-input>
    </td>
    <td class="dee-td" style="flex: 4;">
      <!-- VALUE -->
      <dao-input
        class="dee-input"
        type="text"
        v-model="env.value"
        v-if="env.value != null"
        size="sm"
        :block="true"
        placeholder="value"
        @change="onChange"
        @blur="onValueBlur"
        :disabled="!editable"
      ></dao-input>
      <!-- SECRET -->
      <div v-else-if="env.valueFrom && env.valueFrom.secretKeyRef" class="half-select">
        <span class="text-muted secret-value" v-if="!$can('secret.view')">
          <span class="text-overflow-ellipsis">{{ env.valueFrom.secretKeyRef.name }}</span>
          <span class="text-overflow-ellipsis">{{ env.valueFrom.secretKeyRef.key }}</span>
        </span>
        <template v-else>
          <dao-select
            size="sm"
            v-model="env.valueFrom.secretKeyRef.name"
            placeholder="请选择 Secret Name"
            @change="onEnvValueFormNameChange(env.valueFrom.secretKeyRef)"
            :disabled="!editable"
          >
            <dao-option
              v-for="item in formatedSecrets"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></dao-option>
          </dao-select>
          <dao-select
            size="sm"
            v-model="env.valueFrom.secretKeyRef.key"
            placeholder="请选择 Secret Key"
            @change="onChange"
            :disabled="!editable"
          >
            <dao-option
              v-for="item in findRelatedOptionsByName(
                formatedSecrets,
                env.valueFrom.secretKeyRef.name,
              )"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></dao-option>
          </dao-select>
        </template>
      </div>
      <!-- CONFIG MAP -->
      <div v-else-if="env.valueFrom && env.valueFrom.configMapKeyRef" class="half-select">
        <dao-select
          size="sm"
          v-model="env.valueFrom.configMapKeyRef.name"
          placeholder="请选择 Config Map Name"
          @blur="onValueBlur"
          @change="onEnvValueFormNameChange(env.valueFrom.configMapKeyRef)"
          :disabled="!editable"
        >
          <dao-option
            v-for="item in formatedConfigMaps"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          ></dao-option>
        </dao-select>
        <dao-select
          size="sm"
          v-model="env.valueFrom.configMapKeyRef.key"
          placeholder="请选择 Config Map Key"
          @change="onChange"
          @blur="onValueBlur"
          :disabled="!editable"
        >
          <dao-option-group>
            <dao-option
              v-for="item in findRelatedOptionsByName(
                formatedConfigMaps,
                env.valueFrom.configMapKeyRef.name,
              )"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></dao-option>
          </dao-option-group>
        </dao-select>
      </div>
    </td>
    <td class="dee-edit-col" v-if="editable">
      <!-- TODO: 添加 drag & drog -->
      <!-- <svg
        class="dee-remove-btn"
        @click="onRemove(index)"
        style="cursor: grabbing;margin-right: 10px;"
      >
        <use xlink:href="#icon_service-list"></use>
      </svg>-->
      <svg class="dee-remove-btn" @click="onRemove(index)">
        <use xlink:href="#icon_minus-circled"></use>
      </svg>
    </td>
  </tr>
</template>

<script>
export default {
  name: 'env-tr',
  props: ['env', 'index', 'formatedSecrets', 'formatedConfigMaps', 'editable'],
  data() {
    return {
      nameStatus: '',
      namePlaceholder: 'Name',
    };
  },
  methods: {
    onRemove(index) {
      this.$emit('removeEnv', index);
    },
    // 联级 option 获取，parentOptions 是 formatedSecrets 或者 formatedConfigMaps
    findRelatedOptionsByName(parentOptions, name) {
      const item = parentOptions.find(s => s.label === name);
      return item ? item.options : [];
    },
    onNameBlur() {
      if (!this.env.name) {
        this.nameStatus = 'error';
        this.namePlaceholder = '不能为空';
      } else {
        this.nameStatus = '';
        this.namePlaceholder = 'Name';
      }
      this.validValue();
    },
    onValueBlur() {
      this.validValue();
    },
    validValue() {
      if (!this.env.name) {
        this.$emit('validBlur', false);
        return;
      }
      if (this.env.valueFrom) {
        const { configMapKeyRef, secretKeyRef } = this.env.valueFrom;
        if (configMapKeyRef && configMapKeyRef.key && configMapKeyRef.name) {
          this.$emit('validBlur', true);
          return;
        } else if (secretKeyRef && secretKeyRef.key && secretKeyRef.name) {
          this.$emit('validBlur', true);
          return;
        }
        this.$emit('validBlur', false);
        return;
      } else if (!this.env.value) {
        this.$emit('validBlur', false);
        return;
      }
      this.$emit('validBlur', true);
    },
    onChange() {
      this.$emit('envChange');
    },
    onEnvValueFormNameChange(form) {
      form.key = '';
      this.onChange();
    },
    focus() {
      this.$refs.input.$refs.input.focus();
    },
  },
  filters: {
    valueType(value) {
      if (value.value != null) {
        return 'Normal';
      }
      if (value.valueFrom.configMapKeyRef) {
        return 'Config Map';
      }
      return 'Secret';
    },
  },
};
</script>

<style lang="scss">
.half-select {
  max-width: 100%;

  > div {
    max-width: 50%;
  }
}
</style>
