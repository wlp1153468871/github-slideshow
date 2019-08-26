<template>
  <div class="panel-config">

    <dao-setting-layout>
      <template #layout-title>基本信息</template>
      <dao-setting-section>
        <dao-setting-item>
          <div slot="label">区域</div>
          <div slot="content">
            <dao-input
              icon-inside
              type="text"
              name="area"
              ref="areaRef"
              data-vv-as="区域"
              :message="veeErrors.first('area')"
              :status="veeErrors.has('area') ? 'error' : ''"
              v-validate="'required|max:20'"
              v-model="form.area_name">
            </dao-input>
          </div>
        </dao-setting-item>
      </dao-setting-section>
      <dao-setting-section>
        <dao-setting-item>
          <div slot="label">环境</div>
          <div slot="content">
            <dao-input
              icon-inside
              type="text"
              name="env"
              ref="envRef"
              data-vv-as="环境"
              :message="veeErrors.first('env')"
              :status="veeErrors.has('env') ? 'error' : ''"
              v-validate="'required|max:20'"
              v-model="form.env_name">
            </dao-input>
          </div>
        </dao-setting-item>
      </dao-setting-section>
    </dao-setting-layout>

    <dao-setting-layout data-vv-scope="cluster">
      <template #layout-title>集群配置</template>
      <dao-setting-section>
        <dao-setting-item>
          <div slot="label">地址</div>
          <div slot="content">
            <dao-input
              block
              icon-inside
              type="text"
              name="clusterUrl"
              ref="clusterUrlRef"
              data-vv-as="集群地址"
              :message="veeErrors.first('cluster.clusterUrl')"
              :status="veeErrors.has('cluster.clusterUrl') ? 'error' : ''"
              v-validate="'required|url'"
              data-vv-scope="cluster"
              v-model="form.clusterUrl"
              @change="resetClusterCheck">
            </dao-input>
          </div>
        </dao-setting-item>
      </dao-setting-section>
      <dao-setting-section>
        <dao-setting-item>
          <div slot="label">证书信息</div>
          <div slot="content">
            <textarea
              class="dao-control"
              type="text"
              rows="6"
              name="certificateAuthorityData"
              ref="certificateAuthorityDataRef"
              data-vv-as="集群授权信息"
              :message="veeErrors.first('cluster.certificateAuthorityData')"
              :class="{ error: veeErrors.has('cluster.certificateAuthorityData') }"
              v-validate="'required|base_64'"
              data-vv-scope="cluster"
              v-model="form.certificateAuthorityData"
              @change="resetClusterCheck">
            </textarea>
          </div>
        </dao-setting-item>
      </dao-setting-section>

      <template slot="footer">
        <div class="cluster-test">
          <div class="test-message">
            <template v-if="status===TEST_STATUS.UNTEST">
              <svg class="icon icon-warning">
                <use xlink:href="#icon_exclamation-bubble"></use>
              </svg>
              <span>集群地址暂未测试连接</span>
            </template>
            <template v-if="status===TEST_STATUS.LOADING">
              <svg class="icon loading-icon rotating">
                <use xlink:href="#icon_circle-rotate"></use>
              </svg>
              <span>正在测试集群地址...</span>
            </template>
            <template
              v-if="status===TEST_STATUS.ACCESS">
              <svg class="icon success-icon">
                <use xlink:href="#icon_checkmark"></use>
              </svg>
              <span>集群地址验证成功</span>
            </template>
            <template
              v-if="status===TEST_STATUS.ERROR">
              <svg class="icon error-icon">
                <use xlink:href="#icon_close-circled"></use>
              </svg>
              <span class="errorInfo">{{ errorInfo }}</span>
            </template>
          </div>
          <button
            class="dao-btn blue"
            @click="testCluster">
            测试
          </button>
        </div>
      </template>
    </dao-setting-layout>

    <dao-setting-layout>
      <template #layout-title>用户信息</template>
      <dao-setting-section>
        <dao-setting-item>
          <div slot="label">用户证书</div>
          <div slot="content">
            <textarea
              class="dao-control"
              type="text"
              rows="6"
              name="clientCertificateData"
              data-vv-as="集群授权信息"
              :class="{ error: veeErrors.has('clientCertificateData') }"
              :message="veeErrors.first('clientCertificateData')"
              v-validate="'required|base_64'"
              v-model="form.clientCertificateData">
            </textarea>
          </div>
        </dao-setting-item>
      </dao-setting-section>
      <dao-setting-section>
        <dao-setting-item>
          <div slot="label">用户私钥</div>
          <div slot="content">
            <textarea
              class="dao-control"
              rows="6"
              type="text"
              name="clientKeyData"
              data-vv-as="集群授权信息"
              :message="veeErrors.first('clientKeyData')"
              :class="{ error: veeErrors.has('clientKeyData') }"
              v-validate="'required|base_64'"
              v-model="form.clientKeyData">
            </textarea>
          </div>
        </dao-setting-item>
      </dao-setting-section>
    </dao-setting-layout>

    <dao-setting-layout>
      <template #layout-title>ES 配置</template>
      <dao-setting-section>
        <dao-setting-item>
          <div slot="label">地址</div>
          <div slot="content">
            <dao-input
              block
              icon-inside
              type="text"
              name="esUrl"
              data-vv-as="ES 地址"
              :message="veeErrors.first('esUrl')"
              :status="veeErrors.has('esUrl') ? 'error' : ''"
              v-validate="'url'"
              v-model="form.es.esUrl">
            </dao-input>
          </div>
        </dao-setting-item>
      </dao-setting-section>
      <dao-setting-section>
        <dao-setting-item>
          <div slot="label">Token</div>
          <div slot="content">
            <textarea
              class="dao-control"
              rows="6"
              type="text"
              name="esToken"
              data-vv-as="ES Token"
              :message="veeErrors.first('esToken')"
              :class="{ error: veeErrors.has('esToken') }"
              v-validate="{ required_if_not_empty : form.es.esUrl }"
              v-model="form.es.token">
            </textarea>
          </div>
        </dao-setting-item>
      </dao-setting-section>
    </dao-setting-layout>

    <dao-setting-layout>
      <template #layout-title>镜像仓库配置</template>
      <dao-setting-section>
        <dao-setting-item>
          <div slot="label">类型</div>
          <div slot="content">
            <dao-radio-group>
              <dao-radio
                label="harbor"
                v-model="form.registry.type">
                Harbor
              </dao-radio>
            </dao-radio-group>
          </div>
        </dao-setting-item>
      </dao-setting-section>
      <dao-setting-section>
        <dao-setting-item>
          <div slot="label">地址</div>
          <div slot="content">
            <dao-input
              block
              icon-inside
              type="text"
              name="registryUrl"
              data-vv-as="镜像仓库地址"
              :message="veeErrors.first('registry.registryUrl')"
              :status="veeErrors.has('registry.registryUrl')? 'error' : ''"
              data-vv-scope="registry"
              v-validate="'required|url'"
              v-model="form.registry.url"
              @change="resetRegistryCheck">
            </dao-input>
          </div>
        </dao-setting-item>
      </dao-setting-section>
      <dao-setting-section>
        <dao-setting-item>
          <div slot="label">账号</div>
          <div slot="content">
            <dao-input
              icon-inside
              type="text"
              name="registryUsername"
              data-vv-as="镜像仓库账号"
              :message="veeErrors.first('registry.registryUsername')"
              :status="veeErrors.has('registryUsername') ? 'error' : ''"
              data-vv-scope="registry"
              v-validate="'required|alpha_num'"
              v-model="form.registry.username"
              @change="resetRegistryCheck">
            </dao-input>
          </div>
        </dao-setting-item>
      </dao-setting-section>
      <dao-setting-section>
        <dao-setting-item>
          <div slot="label">密码</div>
          <div slot="content">
            <dao-input
              ref="password"
              icon-inside
              type="password"
              name="registryPassword"
              data-vv-as="镜像仓库密码"
              :message="veeErrors.first('registry.registryPassword')"
              :status="veeErrors.has('registryPassword') ? 'error' : ''"
              data-vv-scope="registry"
              v-validate="'exclude_spaces|required|min:5'"
              v-model="form.registry.password"
              @change="resetRegistryCheck">
            </dao-input>
          </div>
        </dao-setting-item>
      </dao-setting-section>

      <template slot="footer">
        <div class="cluster-test">
          <div class="test-message">
            <template v-if="registryStatus===REGISTRY_STATUS.UNTEST">
              <svg class="icon icon-warning">
                <use xlink:href="#icon_exclamation-bubble"></use>
              </svg>
              <span>仓库地址暂未测试连接</span>
            </template>
            <template v-if="registryStatus===REGISTRY_STATUS.TESTING">
              <svg class="icon loading-icon rotating">
                <use xlink:href="#icon_circle-rotate"></use>
              </svg>
              <span>正在测试仓库地址...</span>
            </template>
            <template
              v-if="registryStatus===REGISTRY_STATUS.SUCCESS">
              <svg class="icon success-icon">
                <use xlink:href="#icon_checkmark"></use>
              </svg>
              <span>仓库地址验证成功</span>
            </template>
            <template
              v-if="registryStatus===REGISTRY_STATUS.ERROR">
              <svg class="icon error-icon">
                <use xlink:href="#icon_close-circled"></use>
              </svg>
              <span class="errorInfo">{{ registryErrorMessage }}</span>
            </template>
          </div>
          <button
            class="dao-btn blue"
            @click="checkRegistryAccount">
            测试
          </button>
        </div>
      </template>
    </dao-setting-layout>

    <dao-setting-layout>
      <template #layout-title>集群域名配置</template>
      <dao-setting-section>
        <dao-setting-item>
          <template #content>
            <dao-editable-table
              ref="EditableTable"
              :config="config"
              v-model="form.router_config"
              @valid="validChange">
              <template v-for="th in config.header">
                <dao-tooltip
                  v-if="th === '唯一标识'"
                  :key="th"
                  :slot="th"
                  content="唯一标识必须默认包含inrouter"
                  placement="top">
                  <svg class="icon">
                    <use xlink:href="#icon_info-line"></use>
                  </svg>
                </dao-tooltip>
              </template>
            </dao-editable-table>
          </template>
        </dao-setting-item>
      </dao-setting-section>
    </dao-setting-layout>

    <dao-setting-layout>
      <template #layout-title>Grafana 配置</template>
      <dao-setting-section>
        <dao-setting-item>
          <div slot="label">地址</div>
          <div slot="content">
            <dao-input
              block
              icon-inside
              name="grafanaUrl"
              data-vv-as="Grafana 地址"
              :message="veeErrors.first('grafanaUrl')"
              :status="veeErrors.has('grafanaUrl') ? 'error' : ''"
              v-validate="'required|url'"
              v-model="form.grafana.url">
            </dao-input>
          </div>
        </dao-setting-item>
      </dao-setting-section>
    </dao-setting-layout>

  </div>
</template>

<script>
import { pick } from 'lodash';
import { TEST_STATUS } from '@/core/constants/constants';
import ZoneService from '@/core/services/zone.service';

const REGISTRY_STATUS = {
  UNTEST: 'untest',
  TESTING: 'testing',
  SUCCESS: 'success',
  ERROR: 'error',
};

export default {
  name: 'config-panel',

  props: {
    value: { type: Object, default: () => ({}) },
    operationLabel: { type: String },
  },

  data() {
    return {
      REGISTRY_STATUS,
      TEST_STATUS,
      status: TEST_STATUS.UNTEST,
      errorInfo: '',
      config: {
        header: ['名称', '唯一标识', '标签', '域名'],
        body: [
          {
            type: 'input',
            name: 'title',
            default: '',
            validate(row, all) {
              if (row.title === '') {
                return '名称 不能为空';
              }
              if (all.filter(r => r.title === row.title).length > 1) {
                return '名称 不能重复';
              }
              return true;
            },
          },
          {
            type: 'input',
            name: 'key',
            default: '',
            validate(row, all) {
              if (row.key === '') {
                return '唯一标识 不能为空';
              }
              if (all.filter(r => r.key === row.key).length > 1) {
                return '唯一标识 不能重复';
              }
              return true;
            },
          },
          {
            type: 'input',
            name: 'label',
            default: '',
            validate(row) {
              if (row.label === '') {
                return '标签 不能为空';
              }
              return true;
            },
          },
          {
            type: 'input',
            name: 'domain',
            default: '',
            validate(row) {
              if (row.domain === '') {
                return '域名 不能为空';
              }
              return true;
            },
          },
        ],
      },
      routeValid: null,
      registryStatus: REGISTRY_STATUS.UNTEST,
      registryErrorMessage: '',
    };
  },

  computed: {
    form: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },

  methods: {
    validate() {
      if (this.status === TEST_STATUS.UNTEST) {
        this.resetClusterErrors();
      }
      if (this.registryStatus === REGISTRY_STATUS.UNTEST) {
        this.resetRegistryErrors();
      }
      return new Promise(resolve => {
        return this.$validator.validateAll().then(valid => {
          this.$refs.EditableTable.validate();
          this.handleValidationErrorBasic();
          resolve(this.routeValid &&
              valid &&
              this.status === TEST_STATUS.ACCESS &&
              this.registryStatus === REGISTRY_STATUS.SUCCESS);
        });
      });
    },

    testCluster() {
      this.$validator.validateAll('cluster').then(valid => {
        if (valid) {
          ZoneService.testClustersUrl(pick(this.form, ['clusterUrl', 'certificateAuthorityData']))
            .then(() => {
              this.veeErrors.remove({
                field: 'clusterUrl',
                scope: 'cluster',
              });
              this.status = TEST_STATUS.ACCESS;
            })
            .catch(res => {
              this.status = TEST_STATUS.ERROR;
              this.errorInfo = res.status.message;
              this.veeErrors.add({
                field: 'clusterUrl',
                msg: res.status.message,
                scope: 'cluster',
              });
            });
        }
      });
    },

    resetClusterCheck() {
      this.status = TEST_STATUS.UNTEST;
    },

    resetClusterErrors() {
      this.veeErrors.add({
        field: 'clusterUrl',
        msg: '请测试连接',
        scope: 'cluster',
      });
    },

    checkRegistryAccount() {
      this.registryStatus = REGISTRY_STATUS.TESTING;
      this.$validator.validateAll('registry').then(valid => {
        if (valid) {
          ZoneService.checkRegistryAccount(this.form.registry)
            .then(() => {
              this.registryStatus = REGISTRY_STATUS.SUCCESS;
              this.veeErrors.remove({
                field: 'registryUrl',
                scope: 'registry',
              });
            })
            .catch(({ data: { error_info } }) => {
              this.registryStatus = REGISTRY_STATUS.ERROR;
              this.registryErrorMessage = error_info;
              this.veeErrors.add({
                field: 'registryUrl',
                msg: error_info,
                scope: 'registry',
              });
            });
        }
      });
    },

    resetRegistryCheck() {
      this.registryStatus = REGISTRY_STATUS.UNTEST;
    },

    resetRegistryErrors() {
      this.veeErrors.add({
        field: 'registryUrl',
        msg: '请测试连接',
        scope: 'registry',
      });
    },

    validChange(val) {
      this.routeValid = val;
    },

    handleValidationErrorBasic() {
      this.$nextTick(() => {
        const domRect = document
          .querySelector('.error')
          .getBoundingClientRect();
        if (!domRect) return;
        const domRectDistance =
          domRect.top + document.documentElement.scrollTop;
        window.scrollTo(0, domRectDistance - 175);
      });
    },
  },
};
</script>

<style lang='scss'>
@import '~daoColor';

.panel-config {
  .cluster-test {
    display: flex;
    justify-content: space-between;
  }

  .test-message {
    display: flex;
    align-items: center;
    max-width: calc(100% - 90px);

    span {
      margin-left: 5px;

      &.errorInfo {
        display: inline-block;
        color: $red;
        text-align: left;
      }
    }

    .icon {
      flex-shrink: 0;
    }
  }

  .success-icon {
    fill: $green;
  }

  .error-icon {
    fill: $red;
  }

  .icon-warning {
    fill: $yellow;
  }
}
</style>
