<template>
  <tr class="dee-tr">
    <td class="dee-td">{{ form | envFromType }}</td>
    <td class="dee-td" style="flex-grow: 3;">
      <span class="text-muted secret-value" v-if="!$can('secret.view')">
        <span style="width: 100%;" class="text-overflow-ellipsis">{{ form.secretRef.name }}</span>
      </span>
      <template v-else>
        <dao-select
          v-if="form.secretRef"
          size="sm"
          v-model="form.secretRef.name"
          placeholder="请选择 Secret"
          @change="onChange"
          :disabled="!editable"
        >
          <dao-option
            v-for="item in formatedSecrets"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          ></dao-option>
        </dao-select>
      </template>
      <dao-select
        v-if="form.configMapRef"
        size="sm"
        v-model="form.configMapRef.name"
        placeholder="请选择 Config Map"
        @change="onChange"
        :disabled="!editable"
      >
        <dao-option
          v-for="item in formatedConfigMaps"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        ></dao-option>
      </dao-select>
      <a
        v-if="
          ($can('secret.view') && form.secretRef && form.secretRef.name) ||
            (form.configMapRef && form.configMapRef.name)
        "
        @click="showDetail"
        style="margin-left: 5px;"
        >详情</a
      >
      <dao-dialog
        :visible.sync="dialog.open"
        :header="form.secretRef ? 'Secret 详情' : 'Config Map 详情'"
        closeOnClickOutside
        :size="{ width: 'auto', height: 'auto' }"
      >
        <form-tr-dialog
          :form="form"
          :formatedSecrets="formatedSecrets"
          :formatedConfigMaps="formatedConfigMaps"
        ></form-tr-dialog>
        <div slot="footer">
          <button class="dao-btn" @click="dialog.open = false">关闭</button>
        </div>
      </dao-dialog>
    </td>
    <td class="dee-td" style="flex-grow: 3;">
      <dao-input
        class="dee-input"
        type="text"
        v-model="form.prefix"
        size="sm"
        :block="true"
        placeholder="添加 prefix"
        @change="onChange"
        :disabled="!editable"
      ></dao-input>
    </td>
    <td class="dee-edit-col" v-if="editable">
      <!-- TODO: 添加 drag & drog -->
      <!-- <svg
              class="dee-remove-btn"
              @click="removeEnvFormRow(i)"
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
import formTrDialog from './form-tr-dialog';

export default {
  name: 'form-tr',
  props: ['form', 'index', 'formatedSecrets', 'formatedConfigMaps', 'editable'],
  components: {
    formTrDialog,
  },
  data() {
    return {
      dialog: {
        open: false,
        footer: {
          confirmText: '',
          cancelText: '关闭',
        },
      },
    };
  },
  methods: {
    onRemove(index) {
      this.$emit('removeEnvForm', index);
    },
    // 联级 option 获取，parentOptions 是 formatedSecrets 或者 formatedConfigMaps
    findRelatedOptionsByName(parentOptions, name) {
      const item = parentOptions.find(s => s.label === name);
      return item ? item.options : [];
    },
    onChange() {
      this.$emit('envChange');
    },
    showDetail() {
      this.dialog.open = true;
    },
  },
  filters: {
    envFromType(value) {
      if (value.configMapRef) {
        return 'Config Map';
      } else if (value.secretRef) {
        return 'Secret';
      }
      return 'Unknown Type';
    },
  },
};
</script>
