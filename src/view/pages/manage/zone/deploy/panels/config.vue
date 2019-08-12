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
              data-vv-as="集群地址"
              :message="veeErrors.first('cluster.clusterUrl')"
              :status="veeErrors.has('cluster.clusterUrl') ? 'error' : ''"
              v-validate="'required|url'"
              data-vv-scope="cluster"
              v-model="form.clusterUrl"
              @change="status = ''">
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
              data-vv-as="集群授权信息"
              :message="veeErrors.first('cluster.certificateAuthorityData')"
              :class="{ error: veeErrors.has('cluster.certificateAuthorityData') }"
              v-validate="'required|base_64'"
              data-vv-scope="cluster"
              v-model="form.certificateAuthorityData"
              @change="status = ''">
            </textarea>
          </div>
        </dao-setting-item>
      </dao-setting-section>

      <template slot="footer">
        <div class="cluster-test">
          <div class="test-message">
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
              :message="veeErrors.first('registryUrl')"
              :status="veeErrors.has('registryUrl') ? 'error' : ''"
              v-validate="'required|url'"
              v-model="form.registry.url">
            </dao-input>
          </div>
        </dao-setting-item>
      </dao-setting-section>
      <!--<dao-setting-section>
        <dao-setting-item>
          <div slot="label">是否校验证书</div>
          <div slot="content">
            <dao-switch
              :option="{ on: '是', off: '否' }"
              v-model="form.registry.verify_ssl">
            </dao-switch>
          </div>
        </dao-setting-item>
      </dao-setting-section>-->
      <dao-setting-section>
        <dao-setting-item>
          <div slot="label">账号</div>
          <div slot="content">
            <dao-input
              icon-inside
              type="text"
              name="registryUsername"
              data-vv-as="镜像仓库账号"
              :message="veeErrors.first('registryUsername')"
              :status="veeErrors.has('registryUsername') ? 'error' : ''"
              v-validate="'required|alpha_num'"
              v-model="form.registry.username">
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
              :message="veeErrors.first('registryPassword')"
              :status="veeErrors.has('registryPassword') ? 'error' : ''"
              v-validate="'exclude_spaces|required|min:5'"
              v-model="form.registry.password">
            </dao-input>
          </div>
        </dao-setting-item>
      </dao-setting-section>
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

export default {
  name: 'config-panel',

  props: {
    value: { type: Object, default: () => ({}) },
    operationLabel: { type: String },
  },

  data() {
    return {
      TEST_STATUS,
      status: '',
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
      this.$validator.validateAll('cluster').then(clusterValid => {
        if (clusterValid) {
          if (this.status === '') {
            this.$noty.error('请测试集群地址是否可用');
          }
          if (this.status === TEST_STATUS.ERROR) {
            this.$noty.error('集群地址不可用');
          }
        }
      });
      return new Promise(resolve => {
        return this.$validator.validateAll().then(valid => {
          this.$refs.EditableTable.validate();
          resolve(this.routeValid && valid && this.status === TEST_STATUS.ACCESS);
        });
      });
    },

    testCluster() {
      this.$validator.validateAll('cluster').then(valid => {
        if (valid) {
          ZoneService.testClustersUrl(pick(this.form, ['clusterUrl', 'certificateAuthorityData']))
            .then(() => {
              this.status = TEST_STATUS.ACCESS;
            })
            .catch(res => {
              this.status = TEST_STATUS.ERROR;
              this.errorInfo = res.status.message;
            });
        }
      });
    },

    validChange(val) {
      this.routeValid = val;
    },
  },
};
</script>

<style lang='scss'>
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
        color: #f1483f;
        text-align: left;
      }
    }

    .icon {
      flex-shrink: 0;
    }
  }

  .success-icon {
    fill: #22c36a;
  }

  .error-icon {
    fill: #f1483f;
  }
}
</style>
