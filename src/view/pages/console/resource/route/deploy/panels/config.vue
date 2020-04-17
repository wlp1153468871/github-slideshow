<template>
  <div class="panel-config">
    <space-zone></space-zone>

    <dao-setting-layout>
      <template #layout-title>基本信息</template>

      <dao-setting-section key="name">
        <dao-setting-item>
          <template #label>
            名称
            <label-tip text="Route 名称填写后将无法修改"></label-tip>
          </template>
          <template #content>
            <dao-input
              icon-inside
              name="name"
              v-model="formModel.name"
              v-validate="{
                required: true,
                dns_1123_sub_domain: true,
                max: nameValidation.maxlength,
              }"
              :message="veeErrors.first('name')"
              :status="veeErrors.has('name') ? 'error' : ''"
              data-vv-as="名称"
            >
            </dao-input>
          </template>
        </dao-setting-item>
      </dao-setting-section>

      <dao-setting-section key="router-selector">
        <dao-setting-item>
          <template #label>
            Router 选择器
          </template>
          <template #content>
            <dao-select @change="onRouterSelectorChanged" v-model="formModel.router_label">
              <dao-option
                v-for="item in zone.router_config"
                :key="item.key"
                :value="item.label"
                :label="item.title"
              >
              </dao-option>
            </dao-select>
          </template>
        </dao-setting-item>
      </dao-setting-section>

      <dao-setting-section key="host">
        <dao-setting-item>
          <template #label>
            访问域名
          </template>
          <template #content>
            <dao-input
              class="domain-input"
              icon-inside
              name="host"
              v-model="formModel.host"
              v-validate="{
                required: true,
                dns_1123_sub_domain: true,
                max: hostnameValidation.maxlength,
              }"
              :message="veeErrors.first('host')"
              :status="veeErrors.has('host') ? 'error' : ''"
              data-vv-as="访问域名"
            >
            </dao-input>
          </template>
        </dao-setting-item>
      </dao-setting-section>

      <dao-setting-section
        key="path"
        v-if="!formModel.secureRoute || formModel.tls.termination !== 'passthrough'"
      >
        <dao-setting-item>
          <template #label>
            访问路径
          </template>
          <template #content>
            <dao-input
              icon-inside
              name="path"
              v-model="formModel.path"
              v-validate="'required|absolute_path'"
              :message="veeErrors.first('path')"
              :status="veeErrors.has('path') ? 'error' : ''"
              data-vv-as="访问路径"
            >
            </dao-input>
          </template>
        </dao-setting-item>
      </dao-setting-section>

      <dao-setting-section key="service">
        <dao-setting-item>
          <template #label>
            当前 Service
          </template>
          <template #content>
            <dao-select v-model="formModel.backend.name">
              <dao-option
                v-for="service in services"
                :key="service.metadata.name"
                :value="service.metadata.name"
                :label="service.metadata.name"
              >
              </dao-option>
            </dao-select>
          </template>
        </dao-setting-item>
      </dao-setting-section>

      <dao-setting-section :key="formModel.backend.name">
        <dao-setting-item>
          <template #label>
            服务端口
          </template>
          <template #content>
            <dao-select v-model="formModel.ports">
              <dao-option
                v-for="(portOption, index) in portOptions"
                :key="index"
                :value="portOption.port"
                :label="portOption.label"
              >
              </dao-option>
            </dao-select>
          </template>
        </dao-setting-item>
      </dao-setting-section>

      <dao-setting-section key="security">
        <dao-setting-item>
          <template #label>
            Security
          </template>
          <template #content>
            <dao-switch :option="{ on: '是', off: '否' }" v-model="formModel.secureRoute">
            </dao-switch>
          </template>
        </dao-setting-item>
      </dao-setting-section>

      <template v-if="formModel.secureRoute">
        <dao-setting-section key="termination">
          <dao-setting-item>
            <template #label>
              TLS Termination
            </template>
            <template #content>
              <dao-radio-group class="radio-group-row">
                <dao-radio label="edge" v-model="formModel.tls.termination">
                  Edge
                </dao-radio>
                <dao-radio label="passthrough" v-model="formModel.tls.termination">
                  Passthrough
                </dao-radio>
                <dao-radio label="reencrypt" v-model="formModel.tls.termination">
                  Re-encrypt
                </dao-radio>
              </dao-radio-group>
            </template>
          </dao-setting-item>
        </dao-setting-section>

        <template v-if="formModel.tls.termination !== 'passthrough'">
          <dao-setting-section key="ca">
            <dao-setting-item>
              <template #label>CA</template>
              <template #content>
                <textarea
                  class="dao-control"
                  :class="{ error: veeErrors.has('caCertificate') }"
                  v-model="formModel.tls.caCertificate"
                  name="caCertificate"
                  rows="3"
                >
                </textarea>
                <file-upload
                  class="upload-file"
                  type="file"
                  name="caCertificate"
                  @input="resolveFile($event, 'caCertificate')"
                >
                  <a class="add-det">上传文件解析</a>
                </file-upload>
              </template>
            </dao-setting-item>
          </dao-setting-section>

          <dao-setting-section key="certificate">
            <dao-setting-item>
              <template #label>公钥</template>
              <template #content>
                <textarea
                  class="dao-control"
                  :class="{ error: veeErrors.has('certificate') }"
                  v-model="formModel.tls.certificate"
                  name="certificate"
                  rows="3"
                >
                </textarea>
                <file-upload
                  class="upload-file"
                  type="file"
                  name="certificate"
                  @input="resolveFile($event, 'certificate')"
                >
                  <a class="add-det">上传文件解析</a>
                </file-upload>
              </template>
            </dao-setting-item>
          </dao-setting-section>

          <dao-setting-section key="key">
            <dao-setting-item>
              <template #label>私钥</template>
              <template #content>
                <textarea
                  class="dao-control"
                  :class="{ error: veeErrors.has('key') }"
                  v-model="formModel.tls.key"
                  name="key"
                  rows="3"
                >
                </textarea>
                <file-upload
                  class="upload-file"
                  type="file"
                  name="key"
                  @input="resolveFile($event, 'key')"
                >
                  <a class="add-det">上传文件解析</a>
                </file-upload>
              </template>
            </dao-setting-item>
          </dao-setting-section>
        </template>
      </template>
    </dao-setting-layout>

    <dao-setting-layout>
      <template slot="layout-title">流量分配</template>
      <dao-setting-section>
        <dao-setting-item>
          <template #label>
            分配方式
          </template>
          <template #content>
            <dao-radio-group class="radio-group-row">
              <dao-radio v-model="formModel.release_type" :label="DEPLOYMENT_TYPE.DEFAULT"
                >默认
              </dao-radio>
              <dao-radio v-model="formModel.release_type" :label="DEPLOYMENT_TYPE.BLUEGREEN"
                >按百分比
              </dao-radio>
            </dao-radio-group>
          </template>
        </dao-setting-item>
      </dao-setting-section>

      <dao-setting-section>
        <dao-setting-item>
          <template #label>
            流量规则
          </template>
          <template #content>
            <div class="dao-setting-patch">
              <div v-if="formModel.release_type === DEPLOYMENT_TYPE.DEFAULT">
                <p class="text-gray">
                  所有请求将被 Route 到当前 Service <b>{{ formModel.backend.name }}</b>
                </p>
              </div>

              <blue-green-deployment
                v-show="formModel.release_type === DEPLOYMENT_TYPE.BLUEGREEN"
                v-model="rule"
                :current="formModel.backend.name"
                :services="restServices"
              >
              </blue-green-deployment>
            </div>
          </template>
        </dao-setting-item>
      </dao-setting-section>
    </dao-setting-layout>
  </div>
</template>

<script>
import { INROUTER_KEY } from '@/core/constants/constants';
import { DNS1123_SUBDOMAIN_VALIDATION } from '@/core/constants/resource';
import { mapState } from 'vuex';
import { first, find, get as getValue, keyBy } from 'lodash';
import { DEPLOYMENT_TYPE } from '@/core/constants/app';
import FileUpload from 'vue-upload-component';
import SpaceZone from '@/view/components/space-zone/space-zone';
import BlueGreenDeployment from '@/view/pages/dialogs/deployment/sections/blue-green.deployment';
import ServiceService from '@/core/services/service.resource.service';

export default {
  name: 'ConfigPanel',

  components: {
    SpaceZone,
    FileUpload,
    BlueGreenDeployment,
  },

  computed: {
    ...mapState(['space', 'zone']),

    restServices() {
      const idx = this.services.findIndex(x => x.metadata.name === this.formModel.backend.name);
      const copy = this.services.slice();
      copy.splice(idx, 1);
      return copy;
    },
  },

  data() {
    return {
      nameValidation: DNS1123_SUBDOMAIN_VALIDATION,
      hostnameValidation: DNS1123_SUBDOMAIN_VALIDATION,
      services: [],
      rule: {
        backend: {
          name: '',
          weight: 100,
        },
        alternateBackends: {
          name: '',
          weight: 0,
        },
      },
      DEPLOYMENT_TYPE,
      formModel: {
        release_type: DEPLOYMENT_TYPE.DEFAULT,
        tls: {
          termination: 'edge',
        },
        backend: {
          name: '',
        },
        ports: '',
        path: '/',
        secureRoute: false,
        router_label: null,
        host: null,
      },
      servicesByName: {},
      portOptions: [],
      domainDict: {},
    };
  },

  created() {
    this.zone.router_config.forEach(routerConfig => {
      this.domainDict[routerConfig.label] = routerConfig.domain;
    });

    const inrouter = find(this.zone.router_config, { key: INROUTER_KEY });
    const inrouterDomain = getValue(inrouter, 'domain');
    const domain = inrouterDomain ? `.${inrouterDomain}` : '';

    this.formModel.router_label = getValue(inrouter, 'label');
    this.formModel.host = `appname${domain}`;
    this.getServices();
  },

  watch: {
    'formModel.backend.name': {
      handler(newValue) {
        this.updatePortOptions(this.servicesByName[newValue]);
        this.formModel.ports = getValue(first(this.portOptions), 'port');
      },
    },
  },

  methods: {
    onRouterSelectorChanged(val) {
      const domain = this.domainDict[val] ? `.${this.domainDict[val]}` : '';
      this.formModel.host = `appname${domain}`;
    },

    updatePortOptions(service) {
      if (!service) {
        return;
      }

      const ports = getValue(service, 'spec.ports', []);

      if (ports.length) {
        this.portOptions = ports.map(portMapping => {
          return {
            port: portMapping.port,
            label: `${portMapping.port} \u2192 ${portMapping.targetPort} (${portMapping.protocol})`,
          };
        });
      } else {
        this.portOptions = [];
      }
    },

    getServices() {
      ServiceService.list().then(serviceList => {
        this.services = serviceList.items;
        this.servicesByName = keyBy(this.services, 'metadata.name');
        this.formModel.backend.name = getValue(first(this.services), 'metadata.name');
      });
    },

    resolveFile(files, key) {
      const { file } = files[0];
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = event => {
        this.$set(this.formModel.tls, key, event.target.result);
      };
    },
  },
};
</script>

<style lang="scss">
.panel-config {
  .dao-control {
    width: 100%;
    resize: none;
  }
}
</style>
