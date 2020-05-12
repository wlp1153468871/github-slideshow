<template>
  <dao-dialog
    class="route-dialog"
    size="lg"
    :header="'更新 Route ' + route.metadata.name"
    :visible.sync="isShow"
    @before-open="init"
    @closed="closed"
  >
    <dao-setting-section key="router-selector">
      <dao-setting-item>
        <template #label>
          Router 选择器
        </template>
        <template #content>
          <template v-if="isPlatformAdmin">
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
          <template v-else>
            {{ routerLabel }}
          </template>
        </template>
      </dao-setting-item>
    </dao-setting-section>

    <dao-setting-section key="hostname">
      <dao-setting-item>
        <template #label>
          访问域名
        </template>
        <template #content>
          <dao-input
            v-if="isPlatformAdmin"
            icon-inside
            name="host"
            v-model="formModel.host"
            v-validate="'required|resource_name|max:63'"
            :message="veeErrors.first('host')"
            :status="veeErrors.has('host') ? 'error' : ''"
            data-vv-as="访问域名"
          >
          </dao-input>
          <p v-else>{{ formModel.host }}</p>
        </template>
      </dao-setting-item>
    </dao-setting-section>

    <dao-setting-section key="path" v-if="formModel.tls.termination !== 'passthrough'">
      <dao-setting-item>
        <template #label>
          访问路径
        </template>
        <template #content>
          <dao-input
            icon-inside
            name="path"
            v-model="formModel.path"
            v-validate="'required'"
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
          当前服务
        </template>
        <template #content>
          <dao-select @change="onServiceChanged" v-model="formModel.backend.name">
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
          <dao-switch
            @change="onSecurityChanged"
            :option="{ on: '是', off: '否' }"
            v-model="secureRoute"
          >
          </dao-switch>
        </template>
      </dao-setting-item>
    </dao-setting-section>

    <template v-if="secureRoute">
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
                所有请求将被路由到当前 Service <b>{{ formModel.backend.name }}</b>
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
    <div slot="footer">
      <button class="dao-btn ghost" @click="onClose">
        取消
      </button>
      <save-button text="保存" :saving="isUpdating" @click="onConfirm"> </save-button>
    </div>
  </dao-dialog>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { find, first, intersection, get as getValue, keyBy, pick } from 'lodash';
import { DEPLOYMENT_TYPE } from '@/core/constants/app';
import ServiceService from '@/core/services/service.resource.service';
import RouteService from '@/core/services/route.service';
import BlueGreenDeployment from '@/view/pages/dialogs/deployment/sections/blue-green.deployment';
import FileUpload from 'vue-upload-component';

export default {
  name: 'RouteUpdateDialog',

  components: {
    FileUpload,
    BlueGreenDeployment,
  },

  props: {
    visible: Boolean,
    route: { type: Object, default: () => ({}) },
  },

  computed: {
    ...mapState(['space', 'zone']),
    ...mapGetters(['isPlatformAdmin']),

    routerLabel() {
      return getValue(
        find(this.zone.router_config, {
          label: this.formModel.router_label,
        }),
        'title',
      );
    },

    restServices() {
      const idx = this.services.findIndex(x => x.metadata.name === this.formModel.backend.name);
      const copy = this.services.slice();
      copy.splice(idx, 1);
      return copy;
    },

    isShow: {
      set(val) {
        this.$emit('close', val);
      },
      get() {
        return this.visible;
      },
    },
    isBlueGreen() {
      return this.route.spec.alternateBackends && this.route.spec.alternateBackends.length > 0;
    },
  },

  data() {
    return {
      isUpdating: false,
      DEPLOYMENT_TYPE,
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
      services: [],
      formModel: {
        name: null,
        host: null,
        path: '/',
        ports: null,
        release_type: null,
        tls: {
          termination: null,
        },
        backend: {
          name: null,
          weight: null,
        },
        alternateBackends: {
          name: null,
          weight: null,
        },
        router_label: null,
      },
      servicesByName: {},
      portOptions: [],
      secureRoute: false,
      domainDict: {},
      routerLabels: [],
    };
  },

  created() {
    this.zone.router_config.forEach(({ label, domain }) => {
      this.domainDict[label] = domain;
      this.routerLabels.push(label);
    });

    this.getServices();
  },

  methods: {
    init() {
      const { metadata, spec } = this.route;
      this.formModel.host = getValue(spec, 'host');
      this.formModel.name = getValue(metadata, 'name');
      this.formModel.path = getValue(spec, 'path');
      this.formModel.ports = getValue(spec, 'port.targetPort');
      this.formModel.tls.termination = getValue(spec, 'tls.termination');
      this.formModel.tls.caCertificate = getValue(spec, 'tls.caCertificate');
      this.formModel.tls.certificate = getValue(spec, 'tls.certificate');
      this.formModel.tls.key = getValue(spec, 'tls.key');
      this.formModel.backend.name = getValue(spec, 'to.name');
      this.formModel.backend.weight = getValue(spec, 'to.weight');
      this.formModel.release_type = this.isBlueGreen
        ? DEPLOYMENT_TYPE.BLUEGREEN
        : DEPLOYMENT_TYPE.DEFAULT;
      const firstAlternateBackend = first(this.route.spec.alternateBackends);
      this.formModel.alternateBackends.name = getValue(firstAlternateBackend, 'name');
      this.formModel.alternateBackends.weight = getValue(firstAlternateBackend, 'weight');

      const labels = Object.entries(metadata.labels).map(([key, value]) => {
        return `${key}:${value}`;
      });

      this.formModel.router_label = first(intersection(labels, this.routerLabels));

      this.rule.backend = this.formModel.backend;
      this.rule.alternateBackends = this.formModel.alternateBackends;
      this.secureRoute = !!this.formModel.tls.termination;
    },

    onSecurityChanged(value) {
      if (value) {
        this.formModel.tls.termination = 'edge';
      }
    },

    onServiceChanged(value) {
      this.updatePortOptions(this.servicesByName[value]);
      this.formModel.ports = getValue(first(this.portOptions), 'port');
    },

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

    resolveFile(files, key) {
      const { file } = files[0];
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = event => {
        this.formModel.tls[key] = event.target.result;
      };
    },

    getServices() {
      ServiceService.list().then(serviceList => {
        this.services = serviceList.items;
        this.servicesByName = keyBy(this.services, 'metadata.name');
        const { spec } = this.route;
        this.updatePortOptions(this.servicesByName[getValue(spec, 'to.name')]);
      });
    },

    onClose() {
      this.$emit('close');
      this.$validator.reset();
    },

    closed() {
      this.formModel = {
        name: null,
        host: null,
        path: null,
        ports: null,
        release_type: null,
        tls: {
          termination: null,
        },
        backend: {
          name: null,
          weight: null,
        },
        alternateBackends: {
          name: null,
          weight: null,
        },
        router_label: null,
      };
    },

    onConfirm() {
      this.$validator.validateAll().then(valid => {
        if (valid) this.updateRoute();
      });
    },

    updateRoute() {
      this.isUpdating = true;
      const formData = { ...this.formModel, ...this.rule };
      formData.alternateBackends = [formData.alternateBackends];

      if (this.formModel.release_type === DEPLOYMENT_TYPE.DEFAULT) {
        delete formData.alternateBackends;
      }

      if (!this.secureRoute) {
        delete formData.tls;
      }

      if (this.secureRoute && formData.tls.termination === 'passthrough') {
        delete formData.path;
        formData.tls = pick(formData.tls, ['termination']);
      }

      this.$validator.validateAll().then(valid => {
        if (valid) {
          RouteService.update(this.space.id, this.zone.id, this.route.metadata.name, formData)
            .then(() => {
              this.$noty.success('更新 Route 成功');
              this.$emit('update');
              this.onClose();
            })
            .finally(() => {
              this.isUpdating = false;
            });
        }
      });
    },
  },
};
</script>

<style lang="scss">
.route-dialog {
  .file-uploads.file-uploads-html4 label,
  .file-uploads.file-uploads-html5 input {
    position: static;
  }

  .upload-file {
    margin-left: 20px;
    vertical-align: top;
  }
}
</style>
