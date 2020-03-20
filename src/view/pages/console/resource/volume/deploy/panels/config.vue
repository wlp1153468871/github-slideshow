<template>
  <div class="route-config">
    <div class="container">
      <space-zone></space-zone>
      <dao-setting-layout>
        <template slot="layout-title">基本信息</template>
        <dao-setting-section>
          <dao-setting-item>
            <p slot="label">名称</p>
            <div slot="content">
              <dao-input
                icon-inside
                v-model="form.metadata.name"
                type="text"
                name="name"
                v-validate="{
                  required: true,
                  dns_1123_sub_domain: true,
                  max: nameValidation.maxlength
                }"
                :message="veeErrors.first('name')"
                :status="veeErrors.has('name') ? 'error' : ''"
                data-vv-as="存储名称">
              </dao-input>
            </div>
            <template slot="content-helper">
              {{ nameValidation.chinese }}
            </template>
          </dao-setting-item>
        </dao-setting-section>
      </dao-setting-layout>
      <dao-setting-layout>
        <template slot="layout-title">规格</template>
        <dao-setting-section>
          <dao-setting-item>
            <p slot="label">容量</p>
            <template #content>
              <storage-input
                name="amount"
                v-validate="{
                    storageRequired: true,
                    storageNumber: true,
                    storageMin: 0
                  }"
                :clazz="veeErrors.has('amount') ? 'error' : ''"
                :status="veeErrors.has('amount') ? 'error' : ''"
                :message="veeErrors.first('amount')"
                data-vv-as="容量"
                v-model="form.spec.resources.requests.storage"
              >
              </storage-input>
            </template>
          </dao-setting-item>
        </dao-setting-section>
        <dao-setting-section>
          <dao-setting-item>
            <p slot="label">读写模式</p>
            <template slot="content">
              <el-radio-group
                v-model="form.spec.accessMode">
                <el-radio
                  v-for="mode in ACCESS_MODE"
                  :label="mode.key"
                  :key="mode.key"
                >
                  {{ mode.description }}
                </el-radio>
              </el-radio-group>
              <!--              <dao-radio-group class="radio-group-row">-->
              <!--                <dao-radio-->
              <!--                  v-for="mode in ACCESS_MODE"-->
              <!--                  v-model="form.spec.accessMode"-->
              <!--                  :key="mode.key"-->
              <!--                  :label="mode.key">-->
              <!--                  {{ mode.description }}-->
              <!--                </dao-radio>-->
              <!--              </dao-radio-group>-->
            </template>
          </dao-setting-item>
        </dao-setting-section>
      </dao-setting-layout>
    </div>
  </div>
</template>

<script>
import { nth, first } from 'lodash';
import { mapState } from 'vuex';
import {
  ACCESS_MODE,
  DNS1123_SUBDOMAIN_VALIDATION,
  RESOURCE_TYPE,
} from '@/core/constants/resource';
import SpaceZone from '@/view/components/space-zone/space-zone';
import { Validator } from 'vee-validate';
import StorageInput from './storage-input/storage-input';

export default {
  name: 'ConfigPanel',

  components: {
    SpaceZone,
    StorageInput,
  },

  props: {
    value: { type: Object, default: () => ({}) },
  },

  computed: {
    ...mapState(['space']),
  },

  data() {
    const reg = /(-?[0-9.]*)\s*(.*)[G]$/;
    Validator.extend('storageRequired', {
      getMessage: field => `${field} 不能为空`,
      validate: value => {
        const split = reg.exec(value);
        return !!`${nth(split, 1)}${nth(split, 2)}`;
      },
    });

    Validator.extend('storageNumber', {
      getMessage: field => `${field} 必须为数字`,
      validate: value => {
        const split = reg.exec(value);
        return !nth(split, 2);
      },
    });

    Validator.extend('storageMin', {
      getMessage: field => `${field} 必须大于0`,
      validate: (value, params) => {
        const split = /(-?[0-9.]+)[G]/.exec(value);
        let amount = nth(split, 1);
        amount = Number(amount);
        return amount > first(params);
      },
    });

    return {
      kind: RESOURCE_TYPE.PERSISTENT_VOLUME_CLAIM,
      ACCESS_MODE,
      form: {
        apiVersion: 'v1',
        kind: RESOURCE_TYPE.PERSISTENT_VOLUME_CLAIM,
        metadata: {
          name: '',
          namespace: '',
        },
        spec: {
          accessMode: 'ReadWriteMany',
          resources: {
            requests: {
              storage: '1G',
            },
          },
        },
      },
      nameValidation: DNS1123_SUBDOMAIN_VALIDATION,
    };
  },

  created() {
    this.form.metadata.namespace = this.space.short_name;
  },
};
</script>

<style lang="scss">
.route-config {
  .radio-group-row {
    &.dao-radio-group:before,
    &.dao-radio-group:after {
      content: unset;
    }
  }

  .resource-size {
    display: flex;
  }
}
</style>
