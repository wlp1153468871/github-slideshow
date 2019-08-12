<template>
  <div class="env-editor" v-loading="loading">
    <h1>Container {{ container.name }}</h1>
    <h2>Env</h2>
    <table class="dao-table flexrow">
      <thead>
      <tr>
        <th>type</th>
        <th style="flex: 2;">name</th>
        <th style="flex: 4;">value</th>
        <th v-if="editable" class="dee-edit-col"></th>
      </tr>
      </thead>
      <tbody v-if="container.env && container.env.length > 0">
      <env-tr
        v-for="(env, index) in container.env"
        :key="index"
        :env="env"
        :index="index"
        :editable="editable"
        :formatedSecrets="formatedSecrets"
        :formatedConfigMaps="formatedConfigMaps"
        @removeEnv="removeEnvRow"
        @envChange="onEnvChange"
        @validBlur="onValidBlur"
        :ref="'env-' + index"
      ></env-tr>
      </tbody>
      <tbody v-else>
      <tr class="dee-empty-tr">无</tr>
      </tbody>
    </table>
    <div class="det-add" v-if="editable">
      <span class="det-add-span" @click="addNormal">添加</span>
      <span class="veritcal-inline-divider">|</span>
      <span class="det-add-span" @click="addConfigMap">添加Config Map</span>
      <span class="veritcal-inline-divider">|</span>
      <span class="det-add-span" @click="addSecret">添加Secret</span>
    </div>
    <h2 style="margin-top: 20px;">
      Environment From
      <dao-popover
        content="Environment From 允许你从config map或者secret中选择其全部的键值对作为环境变量"
        trigger="hover"
        placement="top"
      >
        <svg class="question" fill="#595f69">
          <use xlink:href="#icon_question-mark"></use>
        </svg>
      </dao-popover>
    </h2>
    <table class="dao-table flexrow">
      <thead>
      <tr>
        <th>type</th>
        <th style="flex-grow: 3;">Config Map/Secret</th>
        <th style="flex-grow: 3;">Prefix (optional)
          <dao-popover
            content="可以给每个环境变量添加前缀"
            trigger="hover"
            placement="top"
          >
            <svg
              class="question"
              style="width: 12px;height: 12px;"
              fill="#595f69">
              <use xlink:href="#icon_question-mark"></use>
            </svg>
          </dao-popover>
        </th>
        <th class="dee-edit-col" v-if="editable"></th>
      </tr>
      </thead>
      <tbody v-if="container.envFrom && container.envFrom.length > 0">
      <form-tr
        v-for="(form, index) in container.envFrom"
        :key="index"
        :form="form"
        :index="index"
        :editable="editable"
        :formatedSecrets="formatedSecrets"
        :formatedConfigMaps="formatedConfigMaps"
        @removeEnvForm="removeEnvFormRow"
        @envChange="onEnvChange"
        :ref="'form-' + index"
      ></form-tr>
      </tbody>
      <tbody v-else>
      <tr class="dee-empty-tr">无</tr>
      </tbody>
    </table>
    <div class="det-add" v-if="editable">
      <span class="det-add-span" @click="addEnvFromConfigMap">添加Config Map</span>
      <span class="veritcal-inline-divider">|</span>
      <span class="det-add-span" @click="addEnvFromSecret">添加Secret</span>
    </div>
  </div>
</template>

<script>
import { RESOURCE } from '@/core/constants/resource';
import ConfigMapService from '@/core/services/config-map.service';
import SecretService from '@/core/services/secret.service';
import { mapState } from 'vuex';
import envTr from './env-tr.vue';
import formTr from './form-tr.vue';

export default {
  name: 'ContainerEnvEditor',

  components: {
    envTr,
    formTr,
  },

  props: {
    // the origin input container info, no need to deep clone
    // should have key name with type string
    // optional key env with type Array
    // optional key envForm with type Array
    container: {
      type: Object,
      default: () => ({ name: 'origin container', env: [] }),
      validator: container => {
        if (!container) {
          return false;
        }
        if (typeof container.name !== 'string') {
          return false;
        }
        if (container.env && !(container.env instanceof Array)) {
          return false;
        }
        if (container.envFrom && !(container.envFrom instanceof Array)) {
          return false;
        }
        return true;
      },
    },
    editable: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      configMaps: [],
      secrets: [],
      loading: true,
    };
  },

  computed: {
    ...mapState(['space', 'zone']),

    formatedSecrets() {
      return this.formatOptions(this.secrets);
    },
    formatedConfigMaps() {
      return this.formatOptions(this.configMaps);
    },
  },

  created() {
    Promise.all([
      this.$can('read', RESOURCE.SECRET.key) && this.listSecrets(),
      this.listConfigMaps(),
    ]).finally(() => {
      this.loading = false;
    });
  },

  methods: {
    listSecrets() {
      return SecretService.listSecret(this.space.id, this.zone.id).then(res => {
        this.secrets = res.items || [];
      });
    },

    listConfigMaps() {
      return ConfigMapService.listConfigMap(this.space.id, this.zone.id).then(res => {
        this.configMaps = res.items || [];
      });
    },

    formatOptions(items) {
      return items.map(i => {
        return {
          value: i.metadata.name,
          label: i.metadata.name,
          data: i.data,
          options: Object.keys(i.data || {}).map(k => {
            return {
              value: k,
              label: k,
            };
          }),
        };
      });
    },

    addENVRow(item) {
      if (!this.container.env) {
        this.$set(this.container, 'env', []);
      }
      this.container.env.push(item);
      this.$nextTick(() => {
        try {
          const lastIndex = this.container.env.length - 1;
          const comp = this.$refs[`env-${lastIndex}`][0];
          comp.focus();
        } catch (error) {
          console.error('自动聚焦新行失败', error);
        }
      });
      this.onEnvChange();
    },

    addNormal() {
      this.addENVRow({
        name: '',
        value: '',
      });
    },

    addConfigMap() {
      this.addENVRow({
        name: '',
        valueFrom: {
          configMapKeyRef: {
            key: '',
            name: '',
          },
        },
      });
    },

    addSecret() {
      this.addENVRow({
        name: '',
        valueFrom: {
          secretKeyRef: {
            key: '',
            name: '',
          },
        },
      });
    },

    removeEnvRow(index) {
      this.container.env.splice(index, 1);
      this.onEnvChange();
    },

    addEnvFromConfigMap() {
      const item = {
        configMapRef: {
          name: '',
        },
        prefix: '',
      };
      if (!this.container.envFrom) {
        this.$set(this.container, 'envFrom', []);
      }
      this.container.envFrom.push(item);
      this.onEnvChange();
    },

    addEnvFromSecret() {
      const item = {
        secretRef: {
          name: '',
        },
        prefix: '',
      };
      if (!this.container.envFrom) {
        this.$set(this.container, 'envFrom', []);
      }
      this.container.envFrom.push(item);
      this.onEnvChange();
    },

    removeEnvFormRow(index) {
      this.container.envFrom.splice(index, 1);
      this.onEnvChange();
    },

    onEnvChange() {
      this.$emit('envChange');
    },

    onValidBlur(isValid) {
      this.$emit('validBlur', isValid);
    },
  },
};
</script>

<style lang="scss">
@import '~daoColor';

.env-editor {
  h1 {
    padding: 5px 0 7px;
    color: #303133;
    font-size: 18px;
    font-weight: 400;
  }

  h2 {
    padding: 2px 0;
    color: #595f69;
    font-size: 16px;
    font-weight: normal;
  }

  .dao-table {
    border-radius: 0;

    th {
      height: 40px;

      + th {
        border-left: 1px solid $white-dark;
      }
    }
  }
}

.dao-table .dee-edit-col {
  flex: 0 0 auto;
  min-width: 56px;

  svg {
    // 其实 icon 已经垂直居中了，但是由于 td 没有上边框，只有下边框，所以看起来上面会大1px
    transform: translateY(-1px);
  }
}

.dao-table + .dee-add {
  margin-top: 12px;
}

.dee-tr {
  &.activate {
    background: #fffced;

    .dee-input input {
      background: #fffced;
    }
  }
}

.dee-empty-tr {
  margin: 10px auto;
}

.dee-td {
  overflow: visible !important;
}

.dee-add {
  // 防止高度出现大于 16px 的情况
  display: inline-flex;
  color: $blue;
  cursor: pointer;
}

.dee-add-btn {
  width: 16px;
  height: 16px;
  vertical-align: middle;

  fill: currentColor;
}

.dee-add-span {
  // 按照设计稿 link 的样式进行修改
  margin-left: 6px;
  line-height: 16px;
  vertical-align: middle;
}

.veritcal-inline-divider {
  margin: 0 10px;
  color: #303133;
  line-height: 16px;
  vertical-align: middle;
}

svg.question {
  width: 12px;
  height: 12px;
  margin-left: 3px;
  vertical-align: baseline !important;
  cursor: help;
}

svg.dee-remove-btn {
  cursor: pointer;

  fill: $grey-light;
}

.dee-input.dao-input-container {
  .icon {
    top: -2px !important;
    right: 5px;
  }

  input {
    vertical-align: baseline;
  }
}

.dee-select {
  width: 100% !important;
}
</style>
